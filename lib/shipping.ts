import { CartItem } from "@/contexts/cart-context"
// ============================================================
// CONFIGURACIÓN DE CREDENCIALES
// Cuando el cliente tenga las credenciales, completar en .env:
// ANDREANI_API_KEY=...
// CORREO_ARGENTINO_TOKEN=...
// ============================================================

const ANDREANI_API_KEY = process.env.ANDREANI_API_KEY || null
const CORREO_TOKEN = process.env.CORREO_ARGENTINO_TOKEN || null

export interface ShippingOption {
  id: string
  name: string
  cost: number
  days: string
}

// ============================================================
// TARIFAS FIJAS VÍA CARGO POR ZONA
// Estas tarifas son reales y se pueden actualizar manualmente
// cuando Vía Cargo actualice sus precios
// ============================================================

const VIA_CARGO_TARIFAS: Record<string, { cost: number; days: string }> = {
  // GBA y Buenos Aires
  "1000-1999": { cost: 8500, days: "2-3 días hábiles" },
  "2000-2999": { cost: 9200, days: "3-4 días hábiles" },
  "7000-8999": { cost: 7800, days: "1-2 días hábiles" }, // Bahía Blanca y zona
  // Córdoba
  "5000-5999": { cost: 10500, days: "3-5 días hábiles" },
  // Rosario / Santa Fe
  "2000-2399": { cost: 9800, days: "3-4 días hábiles" },
  // Mendoza
  "5500-5599": { cost: 12000, days: "4-6 días hábiles" },
  // Patagonia
  "8300-9999": { cost: 15000, days: "5-7 días hábiles" },
  // Noroeste
  "4000-4999": { cost: 13500, days: "5-7 días hábiles" },
  // Default — cualquier código postal no mapeado
  "default": { cost: 11000, days: "4-6 días hábiles" },
}

function calcularTarifaViaCargo(codigoPostal: string): { cost: number; days: string } {
  const cp = parseInt(codigoPostal)
  for (const rango of Object.keys(VIA_CARGO_TARIFAS)) {
    if (rango === "default") continue
    const [min, max] = rango.split("-").map(Number)
    if (cp >= min && cp <= max) {
      return VIA_CARGO_TARIFAS[rango]
    }
  }
  return VIA_CARGO_TARIFAS["default"]
}

// ============================================================
// ANDREANI
// Docs: https://developers.andreani.com
// ============================================================

async function cotizarAndreani(
  productos: CartItem[],
  codigoPostalDestino: string
): Promise<ShippingOption> {

  if (ANDREANI_API_KEY) {
    // TODO: descomentar cuando el cliente tenga credenciales
    // const pesoTotal = productos.reduce((acc, p) => acc + p.weight * p.quantity, 0)
    // const response = await fetch("https://apis.andreani.com/v1/tarifas", {
    //   method: "POST",
    //   headers: {
    //     "x-authorization-token": ANDREANI_API_KEY,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     contrato: process.env.ANDREANI_CONTRATO,
    //     bultos: productos.map((p) => ({
    //       kilos: p.weight * p.quantity,
    //       largoCm: p.length,
    //       altoCm: p.height,
    //       anchoCm: p.width,
    //     })),
    //     cpDestino: codigoPostalDestino,
    //   }),
    // })
    // const data = await response.json()
    // return {
    //   id: "andreani",
    //   name: "Andreani",
    //   cost: data.tarifaConIva,
    //   days: `${data.diasHabiles} días hábiles`,
    // }
  }

  // Mock
  await new Promise((r) => setTimeout(r, 600))
  return { id: "andreani", name: "Andreani", cost: 12500, days: "3-5 días hábiles" }
}

// ============================================================
// CORREO ARGENTINO
// Docs: https://www.correoargentino.com.ar/MiCorreo
// ============================================================

async function cotizarCorreo(
  productos: CartItem[],
  codigoPostalDestino: string
): Promise<ShippingOption> {

  if (CORREO_TOKEN) {
    // TODO: descomentar cuando el cliente tenga credenciales
    // const pesoTotal = productos.reduce((acc, p) => acc + p.weight * p.quantity, 0)
    // const response = await fetch("https://apis.correoargentino.com.ar/micorreo/v1/rates", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${CORREO_TOKEN}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     cpOrigen: "8000", // Bahía Blanca — código postal del local
    //     cpDestino: codigoPostalDestino,
    //     peso: pesoTotal,
    //     largo: Math.max(...productos.map((p) => p.length)),
    //     alto: Math.max(...productos.map((p) => p.height)),
    //     ancho: Math.max(...productos.map((p) => p.width)),
    //   }),
    // })
    // const data = await response.json()
    // return {
    //   id: "correo-argentino",
    //   name: "Correo Argentino",
    //   cost: data.precio,
    //   days: `${data.diasHabiles} días hábiles`,
    // }
  }

  // Mock
  await new Promise((r) => setTimeout(r, 700))
  return { id: "correo-argentino", name: "Correo Argentino", cost: 8500, days: "7-10 días hábiles" }
}

// ============================================================
// FUNCIÓN PRINCIPAL — la que llama el checkout
// ============================================================

export async function cotizarEnvio(
  productos: CartItem[],
  codigoPostalDestino: string
): Promise<ShippingOption[]> {

  const tarifaViaCargo = calcularTarifaViaCargo(codigoPostalDestino)

  const [andreani, correo] = await Promise.all([
    cotizarAndreani(productos, codigoPostalDestino),
    cotizarCorreo(productos, codigoPostalDestino),
  ])

  return [
    andreani,
    correo,
    {
      id: "via-cargo",
      name: "Vía Cargo",
      cost: tarifaViaCargo.cost,
      days: tarifaViaCargo.days,
    },
    {
      id: "retiro-local",
      name: "Retiro en local",
      cost: 0,
      days: "Disponible en 24hs",
    },
  ]
}