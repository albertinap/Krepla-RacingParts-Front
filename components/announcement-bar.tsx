"use client"

import { Truck, CreditCard, Percent } from "lucide-react"

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-sm font-medium">
        <span className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Productos nuevos todas las semanas
        </span>
        <span className="hidden md:flex items-center gap-2">
          <Percent className="h-4 w-4" />
          -10% con Transferencia
        </span>
        <span className="hidden sm:flex items-center gap-2">
          <Truck className="h-4 w-4" />
          ENVÍOS A TODO EL PAÍS
        </span>
      </div>
    </div>
  )
}
