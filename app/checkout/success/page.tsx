"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cartId = params.get("cart_id") || sessionStorage.getItem("pending_cart_id")
    if (!cartId) {
      router.push("/")
      return
    }

    const completeOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/carts/${cartId}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_KEY!,
          },
        })
        const data = await res.json()

        if (!res.ok) throw new Error(JSON.stringify(data))

        sessionStorage.removeItem("pending_cart_id")
        router.push(`/orden-confirmada?id=${data.order.id}`)
      } catch (err) {
        console.error("Error completando orden MP:", err)
        setError(true)
      }
    }

    completeOrder()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Hubo un problema</h1>
          <p className="text-muted-foreground mb-6">No pudimos confirmar tu pedido. Contactanos para verificar el estado.</p>
          <button onClick={() => router.push("/")} className="text-primary underline">Volver al inicio</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Confirmando tu pedido...</p>
      </div>
    </div>
  )
}