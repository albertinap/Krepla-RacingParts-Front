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

const FREE_SHIPPING_THRESHOLD = 150000

const SHIPPING_OPTIONS = [
  {
    id: "andreani",
    name: "Andreani",
    description: "Envío a domicilio",
    icon: Truck,
  },  
  {
    id: "correo-argentino",
    name: "Correo Argentino",
    description: "Envío a domicilio",
    icon: Truck,
  },
  {
    id: "retiro-local",
    name: "Retiro en local",
    description: "CUBA 1348, Bahía Blanca (CP: 8000)",
    icon: MapPin,
    cost: 0,
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
  const [shippingMethod, setShippingMethod] = useState("andreani")
  const [editingPostalCode, setEditingPostalCode] = useState(false)
  const [tempPostalCode, setTempPostalCode] = useState(postalCode)
  const router = useRouter()

  const selectedShipping = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)
  const shippingCost = shippingMethod === "retiro-local" ? 0 : null
  const discountedTotal = (total + (shippingCost ?? 0)) * 0.84

  const handleSavePostalCode = () => {
    setPostalCode(tempPostalCode)
    setEditingPostalCode(false)
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
                <span className="text-muted-foreground">Subtotal (sin envío):</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>

              {/* Código postal */}
              <div className="p-3 bg-secondary rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">
                  Calculando envío para CP:
                </p>
                {editingPostalCode ? (
                  <div className="flex gap-2">
                    <Input
                      value={tempPostalCode}
                      onChange={(e) => setTempPostalCode(e.target.value)}
                      className="h-8 text-sm"
                      maxLength={8}
                      onKeyDown={(e) => e.key === "Enter" && handleSavePostalCode()}
                      autoFocus
                    />
                    <Button size="icon" className="h-8 w-8" onClick={handleSavePostalCode}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{postalCode}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6"
                      onClick={() => { setTempPostalCode(postalCode); setEditingPostalCode(true) }}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Opciones de envío */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Método de envío:</p>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                  {SHIPPING_OPTIONS.map((option) => {
                    const Icon = option.icon
                    return (
                      <div
                        key={option.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          shippingMethod === option.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setShippingMethod(option.id)}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label htmlFor={option.id} className="font-medium cursor-pointer text-sm">
                              {option.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {option.id === "retiro-local" ? (
                            <span className="text-primary font-semibold">Gratis</span>
                          ) : (
                            "A calcular"
                          )}
                        </span>
                      </div>
                    )
                  })}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
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
                <span>
                  {shippingCost === null
                    ? `${formatPrice(total)} + envío`
                    : formatPrice(total + shippingCost)
                  }
                </span>
              </div>
              <div className="text-sm text-primary">
                O {formatPrice(discountedTotal)} con -16% DESCUENTO en Transferencia
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">GO</span>
                <span>Cuotas SIN interés con <strong className="text-foreground">DÉBITO</strong></span>
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