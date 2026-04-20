"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CheckoutFailurePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Pago rechazado</h1>
        <p className="text-muted-foreground mb-6">Tu pago no pudo ser procesado. Podés intentarlo de nuevo.</p>
        <Button onClick={() => router.push("/checkout")} className="bg-primary hover:bg-primary/90">
          Volver al checkout
        </Button>
      </div>
    </div>
  )
}