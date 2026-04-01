"use client"

import { Truck, CreditCard, Percent, Camera } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Envíos",
    description: "A todo el País",
  },
  {
    icon: CreditCard,
    title: "Tarjeta de Credito",
    description: "3 Cuotas SIN INTERÉS!",
  },
  {
    icon: Percent,
    title: "-16% Descuento",
    description: "con Transferencias",
  },
  {
    icon: Camera,
    title: "Instagram",
    description: "Seguinos para estar al tanto de todos los ingresos!",
  },
]

export function FeatureBar() {
  return (
    <section className="py-8 md:py-12 px-4 bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
