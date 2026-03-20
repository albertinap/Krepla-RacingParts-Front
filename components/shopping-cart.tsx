"use client"

import { X, Minus, Plus, Trash2, Truck, MapPin, Store } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useState } from "react"

const FREE_SHIPPING_THRESHOLD = 150000

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

export function ShoppingCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCart()
  const [shippingMethod, setShippingMethod] = useState("delivery")
  const [deliveryOption, setDeliveryOption] = useState("nube")

  const shippingCost = shippingMethod === "pickup-store" ? 0 : 
    shippingMethod === "pickup-point" ? 5523 : 8431
  const progressToFreeShipping = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - total, 0)
  const discountedTotal = (total + shippingCost) * 0.84

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Carrito de Compras</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
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
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <>
              {/* Free Shipping Progress */}
              <div className="mt-6 p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-2 text-sm text-primary mb-2">
                  <Truck className="h-4 w-4" />
                  {progressToFreeShipping >= 100 ? (
                    <span className="font-medium">Envío gratis superando los {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                  ) : (
                    <span>Agregá {formatPrice(amountForFreeShipping)} más para envío gratis</span>
                  )}
                </div>
                <Progress value={progressToFreeShipping} className="h-2" />
              </div>

              {/* Shipping Options */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (sin envío):</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Entregas para el CP: <strong className="text-foreground">1900</strong></div>
                  <Button variant="outline" size="sm">CAMBIAR CP</Button>
                </div>

                {/* Delivery Options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>Envío a domicilio</span>
                  </div>
                  
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-2">
                    <div 
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        deliveryOption === "nube" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => { setShippingMethod("delivery"); setDeliveryOption("nube") }}
                    >
                      <RadioGroupItem value="nube" id="nube" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="nube" className="font-medium cursor-pointer">
                          Envío Nube - Correo Argentino Clásico a domicilio
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Llega entre el martes 24/03 y el lunes 30/03
                        </p>
                      </div>
                      <span className="font-semibold">{formatPrice(8431)}</span>
                    </div>
                  </RadioGroup>

                  <div className="flex items-center gap-2 text-sm mt-4">
                    <Store className="h-4 w-4" />
                    <span>VIA CARGO - SE RETIRA Y PAGA EN SUCURSAL</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm mt-4">
                    <MapPin className="h-4 w-4" />
                    <span>Retirar por</span>
                  </div>

                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                    <div 
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "pickup-point" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setShippingMethod("pickup-point")}
                    >
                      <RadioGroupItem value="pickup-point" id="pickup-point" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="pickup-point" className="font-medium cursor-pointer">Punto de retiro</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Retiras entre el martes 24/03 y el lunes 30/03
                        </p>
                        <button className="text-xs text-primary mt-1">Ver direcciones</button>
                      </div>
                      <span className="font-semibold">{formatPrice(5523)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm mt-4">
                      <Store className="h-4 w-4" />
                      <span>Nuestro local</span>
                    </div>

                    <div 
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "pickup-store" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setShippingMethod("pickup-store")}
                    >
                      <RadioGroupItem value="pickup-store" id="pickup-store" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="pickup-store" className="font-medium cursor-pointer">
                          Krepla Racing Parts - MITRE 755, BASAVILBASO, ENTRE RIOS (CP:3170)
                        </Label>
                      </div>
                      <span className="font-semibold text-primary">Gratis</span>
                    </div>
                  </RadioGroup>
                </div>

                <p className="text-xs text-muted-foreground">
                  El tiempo de entrega <strong className="text-foreground">no considera feriados</strong>.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(total + shippingCost)}</span>
              </div>
              <div className="text-sm text-primary">
                O {formatPrice(discountedTotal)} con -16% DESCUENTO en Transferencia
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">GO</span>
                <span>Cuotas SIN interés con <strong className="text-foreground">DÉBITO</strong></span>
              </div>
            </div>

            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold py-6">
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
