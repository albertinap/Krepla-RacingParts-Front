import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

type Zone = "zona_1" | "zona_2" | "zona_3" | "zona_4"

interface ZoneRate {
  precio_base: number
  kg_base: number
  precio_por_kg_extra: number
  precio_por_100cc_extra: number
}

// ─── Cache ───────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

let zonesCache: { data: Map<string, Zone>; fetchedAt: number } | null = null
let ratesCache: {
  data: Map<string, Map<Zone, ZoneRate>>
  fetchedAt: number
} | null = null

// ─── Google Sheets client ────────────────────────────────────────────────────
function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "secrets", "google-service-account.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })
  return google.sheets({ version: "v4", auth })
}

// ─── Fetch zones ─────────────────────────────────────────────────────────────

async function getZones(): Promise<Map<string, Zone>> {
  const now = Date.now()
  if (zonesCache && now - zonesCache.fetchedAt < CACHE_TTL_MS) {
    return zonesCache.data
  }

  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "zonas!A3:B100",
  })

  const map = new Map<string, Zone>()
  for (const row of res.data.values ?? []) {
    const provincia = row[0]?.trim().toLowerCase()
    const zona = row[1]?.trim() as Zone
    if (provincia && zona) map.set(provincia, zona)
  }

  zonesCache = { data: map, fetchedAt: now }
  return map
}

// ─── Fetch rates ─────────────────────────────────────────────────────────────

async function getRates(): Promise<Map<string, Map<Zone, ZoneRate>>> {
  const now = Date.now()
  if (ratesCache && now - ratesCache.fetchedAt < CACHE_TTL_MS) {
    return ratesCache.data
  }

  const sheets = getSheetsClient()
  const carriers = ["andreani", "correo_argentino"]
  const result = new Map<string, Map<Zone, ZoneRate>>()

  for (const carrier of carriers) {
    const sheetName = carrier // nombres de hoja: "andreani", "correo_argentino"
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `${sheetName}!A4:E7`,
    })

    const map = new Map<Zone, ZoneRate>()
    for (const row of res.data.values ?? []) {
      const zona = row[0]?.trim() as Zone
      if (!zona) continue
      const parseNum = (val: string) => Number(val?.replace(/,/g, "")) || 0
      map.set(zona, {
        precio_base: parseNum(row[1]),
        kg_base: parseNum(row[2]) || 1,
        precio_por_kg_extra: parseNum(row[3]),
        precio_por_100cc_extra: parseNum(row[4]),
      })
    }
    result.set(carrier, map)
  }

  ratesCache = { data: result, fetchedAt: now }
  return result
}

// ─── Zone lookup ─────────────────────────────────────────────────────────────

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

async function getZoneByProvincia(provincia: string): Promise<Zone | null> {
  const zones = await getZones()
  const normalized = normalize(provincia)

  for (const [key, zone] of zones) {
    if (normalize(key) === normalized) return zone
  }
  return null
}

// ─── Price calculation ───────────────────────────────────────────────────────

function calcPrice(
  rate: ZoneRate,
  weightKg: number,
  volumeCC: number
): number {
  const kgExtra = Math.max(0, weightKg - rate.kg_base)
  const ccBase = rate.kg_base * 5000
  const ccExtra = Math.max(0, volumeCC - ccBase)

  const precio =
    rate.precio_base +
    kgExtra * rate.precio_por_kg_extra +
    Math.floor(ccExtra / 100) * rate.precio_por_100cc_extra

  return Math.ceil(precio)
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const provincia = searchParams.get("provincia")
  const peso_gramos = searchParams.get("peso_gramos")
  const volumen_cc = searchParams.get("volumen_cc")

  if (!provincia || !peso_gramos || !volumen_cc) {
    return NextResponse.json(
      { error: "Parámetros requeridos: provincia, peso_gramos, volumen_cc" },
      { status: 400 }
    )
  }

  const pesoNum = Number(peso_gramos)
  const volumenNum = Number(volumen_cc)

  if (isNaN(pesoNum) || isNaN(volumenNum) || pesoNum < 0 || volumenNum < 0) {
    return NextResponse.json(
      { error: "peso_gramos y volumen_cc deben ser números positivos" },
      { status: 400 }
    )
  }

  const zona = await getZoneByProvincia(provincia)
  if (!zona) {
    return NextResponse.json(
      { error: `Provincia no reconocida: "${provincia}"` },
      { status: 422 }
    )
  }

  const rates = await getRates()
  const weightKg = pesoNum / 1000
  const volumetricWeightKg = volumenNum / 5000
  const chargeableWeightKg = Math.max(weightKg, volumetricWeightKg)

  const estimates = []
  for (const [carrier, zoneMap] of rates) {
    const rate = zoneMap.get(zona)
    if (!rate) continue
    estimates.push({
      carrier,
      zona,
      precio_estimado: calcPrice(rate, chargeableWeightKg, volumenNum),
    })
  }

  return NextResponse.json({ zona, estimates })
}