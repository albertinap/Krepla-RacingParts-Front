"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"

export default function OrdenConfirmadaPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">¡Pedido confirmado!</h1>
          <p className="text-muted-foreground mb-2">
            Gracias por tu compra. Te enviamos un email con los detalles.
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground mb-6">
              Número de orden: <span className="font-mono text-foreground">{orderId}</span>
            </p>
          )}
          <Link href="/productos">
            <Button className="bg-primary hover:bg-primary/90">Seguir comprando</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}