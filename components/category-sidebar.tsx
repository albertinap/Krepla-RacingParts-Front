"use client"

import { useEffect, useState } from "react"
import { X, ChevronRight, Bike, HardHat, Cog, Wrench, Shield, Ruler, Sticker, Package, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { medusa } from "@/lib/medusa"

const categoryIcons: Record<string, any> = {
  "Escapes": Bike,
  "Transmisión": Cog,
  "Mantenimiento": Wrench,
  "Guardabarros": Shield,
  "Calcos": Sticker,
  "Manubrios y Accesorios": Sparkles,
  "Competición y Potenciación": Zap,
}

interface CategorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    medusa.store.category.list().then(({ product_categories }) => {
      setCategories(product_categories)
    })
  }, [])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-sidebar z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="bg-primary px-4 py-4 flex items-center justify-between">
          <span className="text-primary-foreground font-semibold">Todas Las Categorías</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/80">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="py-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Package
            return (
              <Link
                key={category.id}
                href={`/productos/categoria/${category.handle}`}
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
