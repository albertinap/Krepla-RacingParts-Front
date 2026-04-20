"use client"
 
import Link from "next/link"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategorySidebar } from "@/components/category-sidebar"
import { useState } from "react"
 
const BRANDS = [
  "BMB", "RB CNC PARTS", "FERRAZZI", "VEDAMOTORS",
  "RIFFEL", "WIRTZ", "DIRT 3D", "FMX", "PRO TORK", "MOTUL",
]
 
export default function QuienesSomosPage() {
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
          <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
            <div className="inline-block bg-primary px-3 py-1 mb-6">
              <span className="text-[11px] font-semibold text-white uppercase tracking-[3px]">Quiénes somos</span>
            </div>
            <h1 className="font-bold text-foreground leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Repuestos y accesorios<br />
              <span className="text-primary">para quienes viven las motos.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Krepla Racing Parts es una tienda especializada en repuestos, accesorios y equipamiento para motociclistas. 
              Nacimos de la pasión por las dos ruedas y trabajamos para que cada moto ande como tiene que andar.
            </p>
          </div>
        </div>
 
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
 
          {/* Historia / valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[3px] mb-4">Nuestra historia</p>
              <h2 className="text-2xl font-bold text-foreground mb-4">Empezamos como clientes, seguimos como especialistas</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Krepla Racing Parts nació de la frustración de no encontrar repuestos de calidad a buen precio. 
                Lo que empezó como una búsqueda personal se convirtió en una tienda con foco claro: 
                productos que duran, marcas que responden, y atención de alguien que realmente sabe de motos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoy ofrecemos una selección cuidada de las mejores marcas del mercado, 
                con envíos a todo el país y atención personalizada para cada consulta.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Marcas disponibles", value: "10+" },
                { label: "Envíos a todo el país", value: "✓" },
                { label: "Atención personalizada", value: "✓" },
                { label: "Repuestos originales", value: "✓" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-card border border-border rounded-lg p-5">
                  <p className="text-2xl font-bold text-primary mb-1">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
 
          {/* Marcas */}
          <div>
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[3px] mb-4">Marcas que trabajamos</p>
            <h2 className="text-2xl font-bold text-foreground mb-8">Seleccionamos lo mejor del mercado</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {BRANDS.map(brand => (
                <div key={brand} className="bg-card border border-border rounded-lg px-4 py-4 flex items-center justify-center text-center">
                  <span className="text-[13px] font-semibold text-foreground tracking-wide">{brand}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* CTA */}
          <div className="bg-primary rounded-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">¿Necesitás un repuesto?</h2>
            <p className="text-white/80 mb-6">Explorá el catálogo o contactanos directamente.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors text-[15px]">
                Ver catálogo
              </Link>
              <Link href="/contacto" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-[15px]">
                Contactanos
              </Link>
            </div>
          </div>
 
        </div>
      </main>
 
      <Footer />
    </div>
  )
}