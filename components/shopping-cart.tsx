"use client"

import { X, Minus, Plus, Trash2, Truck, MapPin, Store, Edit2, Check } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { useRouter } from "next/navigation"


const SHIPPING_OPTIONS = [
  {
    id: "andreani",
    name: "Andreani",
    description: "Envío a domicilio",
    icon: Truck,
    eta: "3 a 7 días hábiles",
  },  
  {
    id: "correo-argentino",
    name: "Correo Argentino",
    description: "Envío a domicilio",
    icon: Truck,
    eta: "3 a 7 días hábiles",
  },
  {
    id: "retiro-local",
    name: "Retiro en local",
    description: "CUBA 1348, Bahía Blanca (CP: 8000)",
    icon: MapPin,
    cost: 0,
    eta: null,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

export function ShoppingCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total, postalCode, setPostalCode } = useCart()
  const [tempPostalCode, setTempPostalCode] = useState(postalCode)
  const router = useRouter()

  
  const discountedTotal = (total) * 0.90

  const handleSavePostalCode = () => {
    setPostalCode(tempPostalCode)
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <SheetTitle className="text-lg">Carrito de Compras</SheetTitle>
          
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-secondary rounded-lg">
                  <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-base text-muted-foreground">Subtotal (sin envío):</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>           

              {/* Opciones de envío */}
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">Método de envío:</p>                
                {SHIPPING_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <div key={option.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-base">{option.name}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-right">
                        {option.id === "retiro-local" ? (
                          <span className="text-primary font-semibold">Gratis</span>
                        ) : (
                          <span className="text-muted-foreground">{option.eta}</span>
                        )}
                      </span>
                    </div>
                  )
                })}
                <p className="text-sm text-muted-foreground">
                  El tiempo de entrega <strong className="text-foreground">no considera feriados</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(total)} + envío</span>
              </div>
              <div className="text-base text-primary">
                O {formatPrice(discountedTotal)} con -10% DESCUENTO en Transferencia
              </div>             
            </div>

            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold py-6"
              onClick={() => { closeCart(); router.push("/checkout") }}
            >
              INICIAR COMPRA
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver más productos
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}