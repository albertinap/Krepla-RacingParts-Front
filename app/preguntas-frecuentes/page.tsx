"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategorySidebar } from "@/components/category-sidebar"

const FAQS = [
  {
    category: "Envíos",
    items: [
      {
        q: "¿A qué lugares hacen envíos?",
        a: "Enviamos a todo el país a través de Correo Argentino y Andreani. También podés retirar en nuestro local en Cuba 1348, Bahía Blanca.",
      },
      {
        q: "¿Cuánto tarda en llegar mi pedido?",
        a: "Los tiempos dependen del destino y la empresa de correo elegida. En general, los envíos al interior del país tardan entre 3 y 7 días hábiles. Te enviamos el número de seguimiento en cuanto despachamos tu paquete.",
      },
      {
        q: "¿Cuánto cuesta el envío?",
        a: "El costo de envío se calcula automáticamente al ingresar tu código postal durante el checkout, según la empresa de correo y el peso del pedido.",
      },
      {
        q: "¿Cómo puedo hacer el retiro en local?",
        a: "Seleccioná 'Retiro en local' al momento del checkout. Te avisamos por email cuando tu pedido esté listo para retirar en Cuba 1348, Bahía Blanca.",
      },
    ],
  },
  {
    category: "Pagos",
    items: [
      {
        q: "¿Qué medios de pago aceptan?",
        a: "Aceptamos transferencia bancaria (con 10% de descuento) y MercadoPago (débito y saldo MP).",
      },
      {
        q: "¿Cómo funciona el descuento por transferencia?",
        a: "Si elegís pagar por transferencia bancaria, aplicamos un 10% de descuento automático sobre el total de tu pedido. Una vez que transferís, nos enviás el comprobante por WhatsApp o email para confirmar el pedido.",
      },
      {
        q: "¿En cuánto tiempo se confirma mi pago?",
        a: "Los pagos por MercadoPago se confirman de forma inmediata. Las transferencias se confirman una vez que acreditamos el comprobante, generalmente en el mismo día.",
      },
    ],
  },
  {
    category: "Productos",
    items: [
      {
        q: "¿Los repuestos son originales?",
        a: "Trabajamos con marcas reconocidas del mercado como BMB, Motul, Riffel, Pro Tork y más. Todos nuestros productos son nuevos y provienen de distribuidores oficiales.",
      },
      {
        q: "¿Puedo consultar si un repuesto es compatible con mi moto?",
        a: "Sí. Escribinos por WhatsApp o Instagram con el modelo y año de tu moto y te asesoramos antes de comprar.",
      },
      /*{
        q: "¿Qué hago si recibo un producto con defecto?",
        a: "Contactanos dentro de las 48 horas de recibido el pedido. Evaluamos cada caso y coordinamos el cambio o devolución según corresponda.",
      },*/
      {
        q: "¿Tienen stock de todos los productos del catálogo?",
        a: "Todos los productos del catálogo están en stock, a menos que tengan la etiqueta de AGOTADO.",
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-[15px] font-medium text-foreground">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-[15px] text-muted-foreground leading-relaxed pb-5">{a}</p>
      )}
    </div>
  )
}

export default function PreguntasFrecuentesPage() {
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
              <span className="text-[11px] font-semibold text-white uppercase tracking-[3px]">FAQ</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Preguntas frecuentes
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Encontrá respuestas a las consultas más comunes. Si no encontrás lo que buscás, escribinos directamente.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
          {FAQS.map(({ category, items }) => (
            <div key={category}>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-[3px] mb-4">{category}</p>
              <div className="bg-card border border-border rounded-lg px-6 divide-y divide-border">
                {items.map(({ q, a }) => (
                  <FAQItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center pt-4">
            <p className="text-muted-foreground mb-4">¿No encontraste lo que buscabas?</p>
            <Link
              href="/contacto"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-[15px]"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}