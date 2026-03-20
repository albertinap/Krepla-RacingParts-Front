"use client"

import { Bike, HardHat, Cog, Wrench, Shield, Grip, Package, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

const popularCategories = [
  { name: "Escapes", icon: Bike, href: "/productos/escapes" },
  { name: "Cascos", icon: HardHat, href: "/productos/cascos" },
  { name: "Transmisión", icon: Cog, href: "/productos/transmision" },
  { name: "Mantenimiento", icon: Wrench, href: "/productos/mantenimiento" },
  { name: "Guardabarros", icon: Shield, href: "/productos/guardabarros" },
  { name: "Manubrios", icon: Grip, href: "/productos/manubrios" },
  { name: "Kit Plásticos", icon: Package, href: "/productos/kit-plasticos" },
  { name: "Accesorios", icon: Sparkles, href: "/productos/accesorios" },
  { name: "Eléctricos", icon: Zap, href: "/productos/electricos" },
]

export function PopularCategories() {
  return (
    <section className="py-8 md:py-12 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8" style={{ fontFamily: 'var(--font-oswald)' }}>
          Categorías Populares
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {popularCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="flex-shrink-0 flex flex-col items-center gap-3 p-4 md:p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors group min-w-[120px]"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm text-foreground text-center font-medium">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
