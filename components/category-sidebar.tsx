"use client"

import { X, ChevronRight, Bike, HardHat, Cog, Wrench, Shield, Ruler, Sticker, Grip, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = [
  { name: "Escapes", icon: Bike, href: "/productos/escapes" },
  { name: "Cascos", icon: HardHat, href: "/productos/cascos" },
  { name: "Transmisión", icon: Cog, href: "/productos/transmision" },
  { name: "Mantenimiento", icon: Wrench, href: "/productos/mantenimiento" },
  { name: "Guardabarros", icon: Shield, href: "/productos/guardabarros" },
  { name: "Rampas y Zunchos", icon: Ruler, href: "/productos/rampas-zunchos" },
  { name: "Calcos", icon: Sticker, href: "/productos/calcos" },
  { name: "Manubrios y Accesorios", icon: Grip, href: "/productos/manubrios" },
  { name: "Kit Plásticos", icon: Package, href: "/productos/kit-plasticos" },
]

interface CategorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-primary px-4 py-4 flex items-center justify-between">
          <span className="text-primary-foreground font-semibold">Todas Las Categorías</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Categories List */}
        <div className="py-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center justify-between px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{category.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
