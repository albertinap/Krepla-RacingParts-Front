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

  const [andreani, correo] = await Promise.all([
    cotizarAndreani(productos, codigoPostalDestino),
    cotizarCorreo(productos, codigoPostalDestino),
  ])

  return [
    andreani,
    correo,    
    {
      id: "retiro-local",
      name: "Retiro en local",
      cost: 0,
      days: "Disponible en 24hs",
    },
  ]
}