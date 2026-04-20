"use client"
 
import { useState, useRef, useEffect } from "react"
import { Search, HelpCircle, User, ShoppingCart, LogOut, ChevronDown, Pencil, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import CuentaModal from "@/components/cuenta-modal" 
 
function UserDropdown() {
  const { user, logout, openLogin } = useAuth()
  const [cuentaOpen, setCuentaOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
 
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
 
  if (!user) {
    return (
      <button
        onClick={openLogin}
        className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <User className="h-5 w-5 md:h-6 md:w-6" />
        <span className="text-xs hidden md:block">Mi cuenta</span>
      </button>
    )
  }
 
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
 
  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
            {initials}
          </div>
          <span className="text-xs hidden md:flex items-center gap-0.5">
            {user.name.split(" ")[0]}
            <ChevronDown className="h-3 w-3" />
          </span>
        </button>
 
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
 
            <div className="py-1">
              <button
                onClick={() => { setCuentaOpen(true); setOpen(false) }} // abre el modal
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors w-full text-left"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Editar mis datos
              </button>
              <Link
                href="/mis-pedidos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors w-full text-left"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                Mis pedidos
              </Link>
            </div>
 
            <div className="border-t border-border py-1">
              <button
                onClick={() => { logout(); setOpen(false) }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
 
      {/* Modal fuera del div con ref para no interferir con el clickOutside */}
      <CuentaModal open={cuentaOpen} onClose={() => setCuentaOpen(false)} />
    </>
  )
}
 
export function Header() {
  const { openCart, itemCount } = useCart()
 
  return (
    <header className="bg-background border-b border-border py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Krepla Racing Parts"
            width={150}
            height={50}
            className="h-auto w-[150px] object-contain"
            priority
          />
        </Link>
 
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
 
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="#" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs hidden md:block">Ayuda</span>
          </Link>
 
          <UserDropdown />
 
          <button
            onClick={openCart}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="text-xs hidden md:block">Mi carrito</span>
          </button>
        </div>
      </div>
 
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