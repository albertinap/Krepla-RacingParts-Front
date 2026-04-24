import { CartItem } from "@/contexts/cart-context"

export interface ShippingOption {
  id: string
  name: string
  cost: number
  days: string
}

export async function cotizarEnvio(
  productos: CartItem[],
  provincia: string
): Promise<ShippingOption[]> {
  const pesoGramos = productos.reduce(
    (acc, item) => acc + (item.weight ?? 500) * item.quantity, 0
  )
  const volumenCC = productos.reduce(
    (acc, item) =>
      acc + ((item.length ?? 10) * (item.width ?? 10) * (item.height ?? 10)) * item.quantity,
    0
  )

  const params = new URLSearchParams({
    provincia,
    peso_gramos: String(pesoGramos),
    volumen_cc: String(volumenCC),
  })
  console.log("URL:", `${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/shipping-quote?${params}`)

  const res = await fetch(
    `/api/shipping-quote?${params}`
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? "Error al cotizar envío")
  }

  const { estimates } = await res.json()

  return [
    {
      id: "andreani",
      name: "Andreani",
      cost: estimates.find((e: any) => e.carrier === "andreani")?.precio_estimado ?? 0,
      days: "3-7 días hábiles",
    },
    {
      id: "correo-argentino",
      name: "Correo Argentino",
      cost: estimates.find((e: any) => e.carrier === "correo_argentino")?.precio_estimado ?? 0,
      days: "3-7 días hábiles",
    },
  ]
}