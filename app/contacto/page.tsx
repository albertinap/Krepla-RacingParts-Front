"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, Instagram, MapPin, Clock } from "lucide-react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategorySidebar } from "@/components/category-sidebar"

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+54 291 513-2747",
    href: "https://wa.me/5492915132747",
    description: "Respondemos consultas por WhatsApp",
    cta: "Abrir WhatsApp",
  },
  {
    icon: Mail,
    label: "Email",
    value: "krepla.racingparts@gmail.com",
    href: "mailto:krepla.racingparts@gmail.com",
    description: "Para consultas formales o presupuestos",
    cta: "Enviar email",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@kracingparts",
    href: "https://instagram.com/kracingparts",
    description: "Seguinos para novedades y lanzamientos",
    cta: "Ver perfil",
  },
  {
    icon: MapPin,
    label: "Local",
    value: "Cuba 1348, Bahía Blanca",
    href: "https://maps.google.com/?q=Cuba+1348,+Bahia+Blanca",
    description: "Bahía Blanca, Buenos Aires",
    cta: "Ver en mapa",
  },
]

export default function ContactoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-black border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
            <div className="inline-block bg-primary px-3 py-1 mb-6">
              <span className="text-[11px] font-semibold text-white uppercase tracking-[3px]">Contacto</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Estamos para ayudarte.
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Consultanos por repuestos, disponibilidad, precios o cualquier duda que tengas. 
              Respondemos rápido.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16">

          {/* Canales de contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, description, cta }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-[2px] mb-1">{label}</p>
                    <p className="text-[15px] font-semibold text-foreground mb-1 truncate">{value}</p>
                    <p className="text-sm text-muted-foreground mb-3">{description}</p>
                    <span className="text-[13px] text-primary font-medium group-hover:underline">{cta} →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Info adicional 
          <div className="border border-border rounded-lg p-6 bg-card flex flex-col sm:flex-row gap-6 items-start">
            <div className="bg-primary/10 rounded-lg p-3 shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[2px] mb-2">Tiempo de respuesta</p>
              <p className="text-[15px] text-foreground font-medium mb-1">Respondemos en el día</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Las consultas por WhatsApp e Instagram tienen respuesta más rápida. 
                Para presupuestos o pedidos especiales, escribinos por email con el detalle del repuesto que necesitás.
              </p>
            </div>
          </div>*/}

        </div>
      </main>

      <Footer />
    </div>
  )
}