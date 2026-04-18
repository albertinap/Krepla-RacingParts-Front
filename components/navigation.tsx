"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { medusa } from "@/lib/medusa"

const staticNavLinks = [
  { name: "Inicio", href: "/" },
  { name: "Ubicación y Contacto", href: "/ubicacion-y-contacto" },
  { name: "Quiénes Somos", href: "/quienes-somos" },
  { name: "Cómo Comprar", href: "/como-comprar" },
  { name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
]

interface NavigationProps {
  onOpenSidebar: () => void
}

export function Navigation({ onOpenSidebar }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    medusa.store.category.list().then(({ product_categories }) => {
      setCategories(product_categories)
    })
  }, [])

  return (
    <nav className="bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Categories Button */}
          <Button
            onClick={onOpenSidebar}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Todas Las Categorías</span>
            <span className="sm:hidden">Categorías</span>
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Link de Inicio */}
            <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>

            {/* Dropdown de Productos con categorías reales */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors">
                Productos
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border-border">
                <DropdownMenuItem asChild>
                  <Link href="/productos" className="text-foreground hover:text-primary font-medium">
                    Ver todos
                  </Link>
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link
                      href={`/productos/categoria/${category.handle}`}
                      className="text-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Links estáticos */}
            {staticNavLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </Link>
              <Link href="/productos" className="text-sm text-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Productos
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/productos/categoria/${category.handle}`}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2 pl-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {staticNavLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}