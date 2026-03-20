"use client"

import { Search, HelpCircle, User, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { openCart, itemCount } = useCart()
  const { openLogin, user } = useAuth()

  return (
    <header className="bg-background border-b border-border py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-oswald)' }}>
              KREPLA
            </span>
            <span className="text-primary text-xs md:text-sm italic -mt-1" style={{ fontFamily: 'var(--font-oswald)' }}>
              Racing Parts
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden sm:block">
          <div className="relative">
            <Input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full pl-4 pr-12 py-3 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-lg"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="#" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs hidden md:block">Ayuda</span>
          </Link>
          <button 
            onClick={openLogin}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs hidden md:block">{user ? user.name : "Mi cuenta"}</span>
          </button>
          <button 
            onClick={openCart}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {itemCount}
            </span>
            <span className="text-xs hidden md:block">Mi carrito</span>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden mt-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="w-full pl-4 pr-12 py-3 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-lg"
          />
          <Button
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
