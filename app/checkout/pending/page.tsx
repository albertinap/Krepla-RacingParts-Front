"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CheckoutPendingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Pago pendiente</h1>
        <p className="text-muted-foreground mb-6">Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
        <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}