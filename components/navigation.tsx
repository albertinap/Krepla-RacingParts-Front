"use client"

import { useState } from "react"
import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const navLinks = [
  { name: "Inicio", href: "/" },
  { 
    name: "Productos", 
    href: "/productos",
    dropdown: [
      { name: "Escapes", href: "/productos/escapes" },
      { name: "Cascos", href: "/productos/cascos" },
      { name: "Transmisión", href: "/productos/transmision" },
      { name: "Mantenimiento", href: "/productos/mantenimiento" },
      { name: "Accesorios", href: "/productos/accesorios" },
    ]
  },
  { name: "Contacto", href: "/contacto" },
  { name: "Quiénes Somos", href: "/quienes-somos" },
  { name: "Cómo Comprar", href: "/como-comprar" },
  { name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
]

interface NavigationProps {
  onOpenSidebar: () => void
}

export function Navigation({ onOpenSidebar }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            {navLinks.map((link) => (
              link.dropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors">
                    {link.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover border-border">
                    {link.dropdown.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="text-foreground hover:text-primary">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              )
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
              {navLinks.map((link) => (
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
