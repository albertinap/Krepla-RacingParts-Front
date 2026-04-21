import { CartItem } from "@/contexts/cart-context"

export interface ShippingOption {
  id: string
  name: string
  cost: number
  days: string
}

// ============================================================
// TARIFAS — actualizar trimestralmente
// Relevadas en abril 2026 desde calculadora Andreani
// CP origen: 8000 (Bahía Blanca)
// ============================================================

const TARIFAS = {
  andreani: {
    zona1: 18323,
    zona2: 20520,
    zona3: 22596,
  },
  correo: {
    zona1: 15600,
    zona2: 17500,
    zona3: 19200,
  },
}

// ============================================================
// ZONAS POR RANGO DE CP (4 dígitos)
// Zona 1: Centro/Cuyo/Litoral
// Zona 2: NOA/NEA
// Zona 3: Patagonia
// ============================================================

function getZona(cp: string): "zona1" | "zona2" | "zona3" {
  const n = parseInt(cp, 10)
  if (isNaN(n)) return "zona1"

  // Patagonia
  if (
    (n >= 8300 && n <= 8399) || // Neuquén
    (n >= 8300 && n <= 8500) || // Río Negro
    (n >= 9000 && n <= 9299) || // Chubut
    (n >= 9300 && n <= 9499) || // Santa Cruz
    (n >= 9400 && n <= 9499) || // Bariloche zona
    (n >= 9500 && n <= 9999)    // Tierra del Fuego
  ) return "zona3"

  // NOA / NEA
  if (
    (n >= 4600 && n <= 4799) || // Jujuy
    (n >= 4400 && n <= 4599) || // Salta
    (n >= 4000 && n <= 4399) || // Tucumán / Catamarca / La Rioja / Santiago
    (n >= 3500 && n <= 3799) || // Chaco / Formosa
    (n >= 3300 && n <= 3499) || // Misiones
    (n >= 3400 && n <= 3499)    // Corrientes
  ) return "zona2"

  // Todo lo demás: Zona 1
  return "zona1"
}

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

export async function cotizarEnvio(
  productos: CartItem[],
  codigoPostalDestino: string
): Promise<ShippingOption[]> {
  const zona = getZona(codigoPostalDestino)

  return [
    {
      id: "andreani",
      name: "Andreani",
      cost: TARIFAS.andreani[zona],
      days: "3-5 días hábiles",
    },
    {
      id: "correo-argentino",
      name: "Correo Argentino",
      cost: TARIFAS.correo[zona],
      days: "7-10 días hábiles",
    },
    {
      id: "retiro-local",
      name: "Retiro en local",
      cost: 0,
      days: "Disponible en 24hs",
    },
  ]
}