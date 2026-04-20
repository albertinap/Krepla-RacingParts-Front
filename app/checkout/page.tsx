"use client"

import { medusa } from "@/lib/medusa"
import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check, Truck, MapPin, CreditCard, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { CategorySidebar } from "@/components/category-sidebar"
import { cotizarEnvio, ShippingOption } from "@/lib/shipping"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION
const SHIPPING_OPTION_IDS: Record<string, string> = {
  "correo-argentino": "so_01KNHKYJPG3YZCGA7D7CPSQR7T",
  "andreani": "so_01KNHKZ37N0CF0MVY2VHP9XB4A",
  "retiro-local": "so_01KNHM0A26AVXXVA4CDAXJJGNS",
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 8
}

function onlyNumbers(value: string): string {
  return value.replace(/\D/g, "")
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

function StepIndicator({ step, currentStep, label }: { step: number; currentStep: number; label: string }) {
  const isActive = currentStep === step
  const isComplete = currentStep > step

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
          isComplete
            ? "bg-green-600 text-white"
            : isActive
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {isComplete ? <Check className="h-4 w-4" /> : step}
      </div>
      <span className={`text-[15px] ${isActive || isComplete ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}

function OrderSummary({
  subtotal,
  shippingCost,
  discount,
  total,
  paymentMethod,
}: {
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  paymentMethod: string
}) {
  const { items } = useCart()

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold text-foreground mb-6">Resumen del pedido</h2>
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2">{item.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Cant: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between text-[15px]">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[15px]">
          <span className="text-muted-foreground">Envío</span>
          <span className="text-foreground">
            {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[15px]">
            <span className="text-green-500">Descuento (-10%)</span>
            <span className="text-green-500">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">{formatPrice(total)}</span>
        </div>
        {paymentMethod === "transfer" && (
          <p className="text-sm text-green-500">Pagando con transferencia bancaria</p>
        )}
        {paymentMethod === "credit" && (
          <p className="text-sm text-muted-foreground">
            3 cuotas sin interés de {formatPrice(total / 3)}
          </p>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const { items, total: cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { user } = useAuth()

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  })

  const [personalInfoErrors, setPersonalInfoErrors] = useState({
    email: "",
    phone: "",
  })

  const [shippingMethod, setShippingMethod] = useState("")
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [shippingQuoted, setShippingQuoted] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    number: "",
    floor: "",
    city: "",
    province: "",
    postalCode: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("transfer")
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  // Cotizar envío cuando el código postal está completo (5 dígitos)
  const handlePostalCodeChange = async (value: string) => {
    setShippingAddress({ ...shippingAddress, postalCode: value })
    setShippingQuoted(false)
    setShippingMethod("")
  
    if (value.length === 4) {
      setLoadingShipping(true)
      try {
        const opciones = await cotizarEnvio(items, value)  // ← pasar items directo
        setShippingOptions(opciones)
        setShippingQuoted(true)
      } catch (error) {
        console.error("Error cotizando envío:", error)
      } finally {
        setLoadingShipping(false)
      }
    }
  }

  const selectedShipping = shippingOptions.find((m) => m.id === shippingMethod)
  const shippingCost = selectedShipping?.cost || 0
  const subtotal = cartTotal
  const discount = paymentMethod === "transfer" ? subtotal * 0.10 : 0
  const total = subtotal + shippingCost - discount
  const isRetiroLocal = shippingMethod === "retiro-local"

  const isStep1Valid = 
  personalInfo.firstName.trim() !== "" &&
  personalInfo.lastName.trim() !== "" &&
  isValidEmail(personalInfo.email) &&
  isValidPhone(personalInfo.phone)
  const isStep2Valid = isRetiroLocal || (shippingQuoted && shippingMethod && shippingAddress.street && shippingAddress.number && shippingAddress.city && shippingAddress.province && shippingAddress.postalCode)
  const isStep3Valid = paymentMethod === "transfer" || paymentMethod === "debit" || (cardInfo.number && cardInfo.name && cardInfo.expiry && cardInfo.cvv)

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }
  
  const handleConfirmOrder = async () => {
    setIsConfirming(true)
    try {
      // 1. Crear cart con región Y sales channel
      const { cart } = await medusa.store.cart.create({
        region_id: DEFAULT_REGION_ID,
        sales_channel_id: process.env.NEXT_PUBLIC_SALES_CHANNEL_ID,
        email: personalInfo.email,
      })
  
      console.log("[ITEMS]", JSON.stringify(items.map(i => ({ 
        id: i.id, 
        name: i.name,
        variantId: i.variantId 
      }))))
      
      // 2. Agregar items uno por uno — versión debug
      for (const item of items) {
        const res = await fetch(`http://localhost:9000/store/carts/${cart.id}/line-items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_KEY!,
          },
          body: JSON.stringify({
            variant_id: item.variantId,
            quantity: item.quantity,
          }),
        })
        const data = await res.json()      
        if (!res.ok) throw new Error(JSON.stringify(data))
      }
  
      // 3. Actualizar dirección
      await medusa.store.cart.update(cart.id, {
        shipping_address: {
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          address_1: `${shippingAddress.street} ${shippingAddress.number}`,
          address_2: shippingAddress.floor || "",
          city: shippingAddress.city,
          province: shippingAddress.province,
          postal_code: shippingAddress.postalCode,
          country_code: "ar",
          phone: personalInfo.phone,
        },
        email: personalInfo.email,
      })

      // 4. Agregar shipping method
      const shippingOptionId = SHIPPING_OPTION_IDS[shippingMethod]
      if (!shippingOptionId) {
        throw new Error("Método de envío no válido")
      }

      await medusa.store.cart.addShippingMethod(cart.id, {
        option_id: shippingOptionId,
      })

      // 5. Obtener cart actualizado y crear payment session
      const { cart: updatedCart } = await medusa.store.cart.retrieve(cart.id)

      await medusa.store.payment.initiatePaymentSession(updatedCart, {
        provider_id: paymentMethod === "transfer"
          ? "pp_transfer_transfer"
          : "pp_mercadopago_mercadopago",
      })

      // 6. Completar la orden — sin authorize, el provider de transferencia
      // acepta status "pending" directamente
      const completeRes = await fetch(`http://localhost:9000/store/carts/${cart.id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_KEY!,
        },
      })
      const completeData = await completeRes.json()
      console.log("[COMPLETE]", completeRes.status, JSON.stringify(completeData))

      if (!completeRes.ok) throw new Error(JSON.stringify(completeData))

      const order = completeData.order
      clearCart()
      router.push(`/orden-confirmada?id=${order.id}`)
    } catch (error) {
      console.error("Error al confirmar pedido:", error)
      alert("Hubo un error al procesar tu pedido. Intentá de nuevo.")
    } finally {
      setIsConfirming(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnnouncementBar />
        <Header />
        <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
        <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">Agregá productos para continuar con la compra</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">Ir a la tienda</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          <div className="flex flex-wrap gap-6 mb-8">
            <StepIndicator step={1} currentStep={currentStep} label="Datos personales" />
            <StepIndicator step={2} currentStep={currentStep} label="Envío" />
            <StepIndicator step={3} currentStep={currentStep} label="Pago" />
            <StepIndicator step={4} currentStep={currentStep} label="Confirmación" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">

              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    Datos personales
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkout-firstName" className="text-[15px]">Nombre</Label>
                      <Input 
                        id="checkout-firstName" 
                        value={personalInfo.firstName} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} 
                        className="mt-2 bg-secondary border-border text-[15px]" 
                        placeholder="Juan" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout-lastName" className="text-[15px]">Apellido</Label>
                      <Input 
                        id="checkout-lastName" 
                        value={personalInfo.lastName} 
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} 
                        className="mt-2 bg-secondary border-border text-[15px]" 
                        placeholder="Pérez" 
                      />
                      </div>
                      <div>
                        <Label htmlFor="checkout-email" className="text-[15px]">Email</Label>
                        <Input
                          id="checkout-email"
                          type="email"
                          value={personalInfo.email}
                          disabled
                          className="mt-2 bg-secondary border-border text-[15px] opacity-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Email asociado a tu cuenta
                        </p>
                        {personalInfoErrors.email && (
                          <p className="text-xs text-destructive mt-1">{personalInfoErrors.email}</p>
                        )}
                    </div>
                    <div>
                      <Label htmlFor="checkout-phone" className="text-[15px]">Teléfono</Label>
                      <Input
                        id="checkout-phone"
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^\d\s\+\-\(\)]/g, "")
                          setPersonalInfo({ ...personalInfo, phone: cleaned })
                          setPersonalInfoErrors({
                            ...personalInfoErrors,
                            phone: isValidPhone(cleaned) ? "" : "Ingresá al menos 8 dígitos",
                          })
                        }}
                        className="mt-2 bg-secondary border-border text-[15px]"
                        placeholder="11 1234-5678"
                      />
                      {personalInfoErrors.phone && (
                        <p className="text-xs text-destructive mt-1">{personalInfoErrors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleNextStep} disabled={!isStep1Valid} className="bg-primary hover:bg-primary/90 text-[15px]">Continuar</Button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    Método de envío
                  </h2>

                  {/* Dirección primero para obtener el código postal */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Dirección de envío
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="street" className="text-[15px]">Calle</Label>
                        <Input id="street" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} className="mt-2 bg-secondary border-border text-[15px]" placeholder="Av. Corrientes" />
                      </div>
                      <div>
                        <Label htmlFor="checkout-number" className="text-[15px]">Número</Label>
                        <Input
                          id="checkout-number"
                          value={shippingAddress.number}
                          onChange={(e) => setShippingAddress({ 
                            ...shippingAddress, 
                            number: onlyNumbers(e.target.value) 
                          })}
                          className="mt-2 bg-secondary border-border text-[15px]"
                          placeholder="1234"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <Label htmlFor="floor" className="text-[15px]">Piso/Depto (opcional)</Label>
                        <Input id="floor" value={shippingAddress.floor} onChange={(e) => setShippingAddress({ ...shippingAddress, floor: e.target.value })} className="mt-2 bg-secondary border-border text-[15px]" placeholder="3ro A" />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-[15px]">Ciudad</Label>
                        <Input id="city" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="mt-2 bg-secondary border-border text-[15px]" placeholder="Buenos Aires" />
                      </div>
                      <div>
                        <Label htmlFor="province" className="text-[15px]">Provincia</Label>
                        <Input id="province" value={shippingAddress.province} onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })} className="mt-2 bg-secondary border-border text-[15px]" placeholder="CABA" />
                      </div>
                      <div>
                        <Label htmlFor="postalCode" className="text-[15px]">
                          Código Postal
                          {loadingShipping && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
                        </Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => handlePostalCodeChange(e.target.value)}
                          className="mt-2 bg-secondary border-border text-[15px]"
                          placeholder="8000"
                          maxLength={4}
                        />
                        {!shippingQuoted && shippingAddress.postalCode.length < 4 && (
                          <p className="text-xs text-muted-foreground mt-1">Ingresá tu código postal para ver las opciones de envío</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Opciones de envío — aparecen después de cotizar */}
                  {shippingQuoted && (
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Opciones de envío disponibles</h3>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                        {shippingOptions.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                              shippingMethod === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={method.id} />
                              <div>
                                <p className="text-[15px] font-medium text-foreground">{method.name}</p>
                                <p className="text-sm text-muted-foreground">{method.days}</p>
                              </div>
                            </div>
                            <span className="text-[15px] font-medium text-foreground">
                              {method.cost === 0 ? "Gratis" : formatPrice(method.cost)}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Retiro en local info */}
                  {isRetiroLocal && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg">
                      <h3 className="text-[15px] font-semibold text-foreground mb-2">Dirección del local</h3>
                      <p className="text-[15px] text-muted-foreground">
                        Krepla Racing Parts<br />
                        Cuba 1348<br />
                        Bahía Blanca, Buenos Aires<br />
                        Lunes a Viernes de 9:00 a 18:00
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep} className="text-[15px]">Volver</Button>
                    <Button onClick={handleNextStep} disabled={!isStep2Valid} className="bg-primary hover:bg-primary/90 text-[15px]">Continuar</Button>
                  </div>
                </div>
              )}

              {/* Step 3 — Pago */}
              {currentStep === 3 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Medio de pago
                  </h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    
                    {/* Transferencia */}
                    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === "transfer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="transfer" />
                        <div>
                          <p className="text-[15px] font-medium text-foreground">Transferencia bancaria</p>
                          <p className="text-sm text-muted-foreground">CBU / Alias — te enviamos los datos por email</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-600 text-white">-10% descuento</Badge>
                    </label>

                    {/* MercadoPago */}
                    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === "mercadopago" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="mercadopago" />
                        <div>
                          <p className="text-[15px] font-medium text-foreground">MercadoPago</p>
                          <p className="text-sm text-muted-foreground">Débito, crédito, cuotas y wallet MP</p>
                        </div>
                      </div>
                      <Image src="/mp-logo.png" alt="MercadoPago" width={120} height={24} className="object-contain" />
                    </label>

                  </RadioGroup>

                  {/* Info transferencia */}
                  {paymentMethod === "transfer" && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg space-y-1">
                      <p className="text-sm font-semibold text-foreground">Datos para transferir:</p>
                      <p className="text-sm text-muted-foreground">CBU: <span className="text-foreground font-mono">0000003100068646403979</span></p>
                      <p className="text-sm text-muted-foreground">Alias: <span className="text-foreground font-mono">nicolas.krepla</span></p>
                      <p className="text-sm text-muted-foreground">Titular: <span className="text-foreground">Nicolás Kreplansky</span></p>
                      <p className="text-xs text-muted-foreground mt-2">Realiza tu pago directamente vía transferencia bancaria. Tu pedido no se procesará hasta que se haya recibido el importe en nuestra cuenta.</p>
                    </div>
                  )}

                  {/* Info MercadoPago */}
                  {paymentMethod === "mercadopago" && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Al confirmar el pedido serás redirigido al sitio seguro de MercadoPago para completar el pago.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep} className="text-[15px]">Volver</Button>
                    <Button onClick={handleNextStep} disabled={!paymentMethod} className="bg-primary hover:bg-primary/90 text-[15px]">Continuar</Button>
                  </div>
                </div>
              )}

              {/* Step 4 — sin cambios */}
              {currentStep === 4 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Confirmación del pedido
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="text-[15px] font-semibold text-foreground mb-2">Datos personales</h3>
                      <p className="text-[15px] text-muted-foreground">
                        {personalInfo.firstName} {personalInfo.lastName}<br />
                        {personalInfo.email}<br />
                        {personalInfo.phone}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="text-[15px] font-semibold text-foreground mb-2">Envío</h3>
                      <p className="text-[15px] text-muted-foreground">
                        {selectedShipping?.name} - {selectedShipping?.days}<br />
                        {isRetiroLocal ? (
                          <>Retiro en: Cuba 1348, Bahía Blanca</>
                        ) : (
                          <>
                            {shippingAddress.street} {shippingAddress.number}
                            {shippingAddress.floor && `, ${shippingAddress.floor}`}<br />
                            {shippingAddress.city}, {shippingAddress.province} ({shippingAddress.postalCode})
                          </>
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="text-[15px] font-semibold text-foreground mb-2">Medio de pago</h3>
                      <p className="text-[15px] text-muted-foreground">
                        {paymentMethod === "transfer" && "Transferencia bancaria (-10% descuento)"}
                        {paymentMethod === "debit" && "Tarjeta de débito"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep} className="text-[15px]">Volver</Button>
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={isConfirming}
                      className="bg-primary hover:bg-primary/90 text-[15px] px-8"
                    >
                      {isConfirming ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Procesando pedido...
                        </span>
                      ) : (
                        "Confirmar pedido"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-96">
              <OrderSummary subtotal={subtotal} shippingCost={shippingCost} discount={discount} total={total} paymentMethod={paymentMethod} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}