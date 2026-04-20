"use client"
 
import { medusa } from "@/lib/medusa"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check, Truck, MapPin, CreditCard, Package, Loader2, Building2, Copy, CheckCheck } from "lucide-react"
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
 
const TRANSFER_DATA = {
  cbu: "0000003100068646403979",
  alias: "nicolas.krepla",
  titular: "Nicolás Kreplansky",
  banco: "Mercado Pago",
}
 
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
 
function isValidPhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 8
}
 
function onlyNumbers(value: string) {
  return value.replace(/\D/g, "")
}
 
function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}
 
function StepIndicator({ step, currentStep, label }: { step: number; currentStep: number; label: string }) {
  const isComplete = currentStep > step
  const isActive = currentStep === step
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
        isComplete ? "bg-green-600 text-white" : isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
      }`}>
        {isComplete ? <Check className="h-4 w-4" /> : step}
      </div>
      <span className={`text-[15px] ${isActive || isComplete ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}
 
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
 
function TransferInfo() {
  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden">
      <div className="bg-secondary px-5 py-3 border-b border-border flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <span className="text-[20px] font-semibold text-foreground uppercase tracking-wider">Datos bancarios</span>
      </div>
      <div className="divide-y divide-border">
        {[
          { label: "CBU", value: TRANSFER_DATA.cbu, mono: false },
          { label: "Alias", value: TRANSFER_DATA.alias, mono: false },
          { label: "Titular", value: TRANSFER_DATA.titular, mono: false },
          { label: "Banco", value: TRANSFER_DATA.banco, mono: false },
        ].map(({ label, value, mono }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3">
            <span className="text-[18px] text-muted-foreground w-16 shrink-0">{label}</span>
            <div className="flex items-center gap-1 ml-4">
              <span className={`text-[18px] text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
              {mono && <CopyButton value={value} />}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-secondary/50 px-5 py-3 border-t border-border">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Realizá la transferencia y envianos el comprobante por WhatsApp o email. Tu pedido se confirmará una vez acreditado el pago.
        </p>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
        Teléfono: 2915132747
        </p>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
        Email: krepla.racingparts@gmail.com
        </p>
      </div>
    </div>
  )
}
 
function OrderSummary({ subtotal, shippingCost, discount, total, paymentMethod }: {
  subtotal: number; shippingCost: number; discount: number; total: number; paymentMethod: string
}) {
  const { items } = useCart()
  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold text-foreground mb-6">Resumen del pedido</h2>
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain" />
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
          <span className="text-foreground">{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[15px]">
            <span className="text-green-500">Descuento transferencia (-10%)</span>
            <span className="text-green-500">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
 
export default function CheckoutPage() {
  const { items, total: cartTotal, clearCart } = useCart()
  const router = useRouter()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isConfirming, setIsConfirming] = useState(false)
 
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  })
  const [phoneError, setPhoneError] = useState("")
 
  // Step 2: envío
  const [deliveryType, setDeliveryType] = useState<"domicilio" | "retiro" | "">("")
  const [shippingAddress, setShippingAddress] = useState({ street: "", number: "", floor: "", city: "", province: "", postalCode: "" })
  const [shippingMethod, setShippingMethod] = useState("")
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [shippingQuoted, setShippingQuoted] = useState(false)
 
  // Step 3: pago
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "mercadopago">("transfer")
 
  const handlePostalCodeChange = async (value: string) => {
    setShippingAddress(prev => ({ ...prev, postalCode: value }))
    setShippingQuoted(false)
    setShippingMethod("")
    if (value.length === 4) {
      setLoadingShipping(true)
      try {
        const opciones = await cotizarEnvio(items, value)
        setShippingOptions(opciones)
        setShippingQuoted(true)
      } catch (e) {
        console.error("Error cotizando envío:", e)
      } finally {
        setLoadingShipping(false)
      }
    }
  }
 
  const selectedShipping = shippingOptions.find(m => m.id === shippingMethod)
  const shippingCost = selectedShipping?.cost ?? 0
  const subtotal = cartTotal
  const discount = paymentMethod === "transfer" ? subtotal * 0.10 : 0
  const total = subtotal + shippingCost - discount
  const isRetiroLocal = deliveryType === "retiro"
 
  const isStep1Valid =
    personalInfo.firstName.trim() !== "" &&
    personalInfo.lastName.trim() !== "" &&
    isValidEmail(personalInfo.email) &&
    isValidPhone(personalInfo.phone)
 
  const isStep2Valid = deliveryType === "retiro" ||
    (deliveryType === "domicilio" && shippingQuoted && shippingMethod &&
      shippingAddress.street && shippingAddress.number &&
      shippingAddress.city && shippingAddress.province && shippingAddress.postalCode)
 
  const handleConfirmOrder = async () => {
    setIsConfirming(true)
    try {
      const { cart } = await medusa.store.cart.create({
        region_id: DEFAULT_REGION_ID,
        sales_channel_id: process.env.NEXT_PUBLIC_SALES_CHANNEL_ID,
        email: personalInfo.email,
      })
 
      for (const item of items) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/carts/${cart.id}/line-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_KEY! },
          body: JSON.stringify({ variant_id: item.variantId, quantity: item.quantity }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(JSON.stringify(data))
      }
 
      await medusa.store.cart.update(cart.id, {
        shipping_address: {
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          address_1: isRetiroLocal ? "Cuba 1348" : `${shippingAddress.street} ${shippingAddress.number}`,
          address_2: isRetiroLocal ? "" : shippingAddress.floor || "",
          city: isRetiroLocal ? "Bahía Blanca" : shippingAddress.city,
          province: isRetiroLocal ? "Buenos Aires" : shippingAddress.province,
          postal_code: isRetiroLocal ? "8000" : shippingAddress.postalCode,
          country_code: "ar",
          phone: personalInfo.phone,
        },
        email: personalInfo.email,
      })
 
      const shippingOptionId = isRetiroLocal ? SHIPPING_OPTION_IDS["retiro-local"] : SHIPPING_OPTION_IDS[shippingMethod]
      if (!shippingOptionId) throw new Error("Método de envío no válido")
 
      await medusa.store.cart.addShippingMethod(cart.id, { option_id: shippingOptionId })
 
      const { cart: updatedCart } = await medusa.store.cart.retrieve(cart.id)
      await medusa.store.payment.initiatePaymentSession(updatedCart, {
        provider_id: paymentMethod === "transfer" ? "pp_transfer_transfer" : "pp_mercadopago_mercadopago",
      })
 
      if (paymentMethod === "transfer") {
        const completeRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/carts/${cart.id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_KEY! },
        })
        const completeData = await completeRes.json()
        if (!completeRes.ok) throw new Error(JSON.stringify(completeData))
        clearCart()
        router.push(`/orden-confirmada?id=${completeData.order.id}`)
      } else {
        const { cart: cartWithPayment } = await medusa.store.cart.retrieve(cart.id, {
          fields: "+payment_collection.payment_sessions.*"
        })
        const session = cartWithPayment.payment_collection?.payment_sessions?.[0]
        const checkoutUrl = session?.data?.checkoutUrl as string | undefined
        if (!checkoutUrl) throw new Error("No se pudo obtener la URL de MercadoPago")
        sessionStorage.setItem("pending_cart_id", cart.id)
        clearCart()
        window.location.href = checkoutUrl
      }
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
        <AnnouncementBar /><Header /><Navigation onOpenSidebar={() => setSidebarOpen(true)} />
        <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">Agregá productos para continuar con la compra</p>
            <Link href="/"><Button className="bg-primary hover:bg-primary/90">Ir a la tienda</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
 
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar /><Header /><Navigation onOpenSidebar={() => setSidebarOpen(true)} />
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
 
              {/* STEP 1 — Datos personales */}
              {currentStep === 1 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    Datos personales
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[15px]">Nombre</Label>
                      <Input value={personalInfo.firstName} onChange={e => setPersonalInfo(p => ({ ...p, firstName: e.target.value }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="Juan" />
                    </div>
                    <div>
                      <Label className="text-[15px]">Apellido</Label>
                      <Input value={personalInfo.lastName} onChange={e => setPersonalInfo(p => ({ ...p, lastName: e.target.value }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="Pérez" />
                    </div>
                    <div>
                      <Label className="text-[15px]">Email</Label>
                      <Input value={personalInfo.email} disabled className="mt-2 bg-secondary border-border text-[15px] opacity-50 cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground mt-1">Email asociado a tu cuenta</p>
                    </div>
                    <div>
                      <Label className="text-[15px]">Teléfono</Label>
                      <Input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={e => {
                          const cleaned = e.target.value.replace(/[^\d\s\+\-\(\)]/g, "")
                          setPersonalInfo(p => ({ ...p, phone: cleaned }))
                          setPhoneError(isValidPhone(cleaned) ? "" : "Ingresá al menos 8 dígitos")
                        }}
                        className="mt-2 bg-secondary border-border text-[15px]"
                        placeholder="11 1234-5678"
                      />
                      {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setCurrentStep(2)} disabled={!isStep1Valid} className="bg-primary hover:bg-primary/90 text-[15px]">Continuar</Button>
                  </div>
                </div>
              )}
 
              {/* STEP 2 — Envío */}
              {currentStep === 2 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    Método de envío
                  </h2>
 
                  {/* Elegir tipo de entrega */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => { setDeliveryType("domicilio"); setShippingMethod(""); setShippingQuoted(false) }}
                      className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${deliveryType === "domicilio" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <Truck className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-[15px] font-medium text-foreground">Envío a domicilio</p>
                        <p className="text-sm text-muted-foreground">Correo Argentino o Andreani</p>
                      </div>
                    </button>
                    <button
                      onClick={() => { setDeliveryType("retiro"); setShippingMethod("retiro-local") }}
                      className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${deliveryType === "retiro" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-[15px] font-medium text-foreground">Retiro en local</p>
                        <p className="text-sm text-muted-foreground">Cuba 1348, Bahía Blanca</p>
                      </div>
                    </button>
                  </div>
 
                  {/* Info retiro en local */}
                  {deliveryType === "retiro" && (
                    <div className="p-4 bg-secondary rounded-lg mb-4">
                      <p className="text-[15px] font-semibold text-foreground mb-1">Krepla Racing Parts</p>
                      <p className="text-[15px] text-muted-foreground">Cuba 1348, Bahía Blanca, Buenos Aires</p>
                    </div>
                  )}
 
                  {/* Formulario domicilio */}
                  {deliveryType === "domicilio" && (
                    <div className="space-y-4">
                      <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> Dirección de envío
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label className="text-[15px]">Calle</Label>
                          <Input value={shippingAddress.street} onChange={e => setShippingAddress(p => ({ ...p, street: e.target.value }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="Av. Corrientes" />
                        </div>
                        <div>
                          <Label className="text-[15px]">Número</Label>
                          <Input value={shippingAddress.number} onChange={e => setShippingAddress(p => ({ ...p, number: onlyNumbers(e.target.value) }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="1234" inputMode="numeric" />
                        </div>
                        <div>
                          <Label className="text-[15px]">Piso/Depto (opcional)</Label>
                          <Input value={shippingAddress.floor} onChange={e => setShippingAddress(p => ({ ...p, floor: e.target.value }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="3ro A" />
                        </div>
                        <div>
                          <Label className="text-[15px]">Ciudad</Label>
                          <Input value={shippingAddress.city} onChange={e => setShippingAddress(p => ({ ...p, city: e.target.value }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="Buenos Aires" />
                        </div>
                        <div>
                          <Label className="text-[15px]">Provincia</Label>
                          <Input value={shippingAddress.province} onChange={e => setShippingAddress(p => ({ ...p, province: e.target.value }))} className="mt-2 bg-secondary border-border text-[15px]" placeholder="CABA" />
                        </div>
                        <div>
                          <Label className="text-[15px]">
                            Código Postal {loadingShipping && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
                          </Label>
                          <Input value={shippingAddress.postalCode} onChange={e => handlePostalCodeChange(e.target.value)} className="mt-2 bg-secondary border-border text-[15px]" placeholder="8000" maxLength={4} />
                          {!shippingQuoted && shippingAddress.postalCode.length < 4 && (
                            <p className="text-xs text-muted-foreground mt-1">Ingresá tu código postal para ver las opciones de envío</p>
                          )}
                        </div>
                      </div>
 
                      {shippingQuoted && (
                        <div className="border-t border-border pt-4">
                          <p className="text-[15px] font-semibold text-foreground mb-3">Opciones disponibles</p>
                          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                            {shippingOptions.map(method => (
                              <label key={method.id} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem value={method.id} />
                                  <div>
                                    <p className="text-[15px] font-medium text-foreground">{method.name}</p>
                                    <p className="text-sm text-muted-foreground">{method.days}</p>
                                  </div>
                                </div>
                                <span className="text-[15px] font-medium text-foreground">{method.cost === 0 ? "Gratis" : formatPrice(method.cost)}</span>
                              </label>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  )}
 
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="text-[15px]">Volver</Button>
                    <Button onClick={() => setCurrentStep(3)} disabled={!isStep2Valid} className="bg-primary hover:bg-primary/90 text-[15px]">Continuar</Button>
                  </div>
                </div>
              )}
 
              {/* STEP 3 — Pago */}
              {currentStep === 3 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Medio de pago
                  </h2>
 
                  <RadioGroup value={paymentMethod} onValueChange={v => setPaymentMethod(v as "transfer" | "mercadopago")} className="space-y-3">
                    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "transfer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="transfer" />
                        <div>
                          <p className="text-[15px] font-medium text-foreground">Transferencia bancaria</p>
                          <p className="text-sm text-muted-foreground">CBU / Alias — confirmación manual</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-600 text-white">-10% descuento</Badge>
                    </label>
 
                    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "mercadopago" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="mercadopago" />
                        <div>
                          <p className="text-[15px] font-medium text-foreground">MercadoPago</p>
                          <p className="text-sm text-muted-foreground">Débito y billetera MercadoPago</p>
                        </div>
                      </div>
                      <Image src="/mp-logo.png" alt="MercadoPago" width={120} height={24} className="object-contain" />
                    </label>
                  </RadioGroup>
 
                  {paymentMethod === "transfer" && <TransferInfo />}
 
                  {paymentMethod === "mercadopago" && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Al confirmar el pedido serás redirigido al sitio seguro de MercadoPago para completar el pago.</p>
                    </div>
                  )}
 
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="text-[15px]">Volver</Button>
                    <Button onClick={() => setCurrentStep(4)} className="bg-primary hover:bg-primary/90 text-[15px]">Continuar</Button>
                  </div>
                </div>
              )}
 
              {/* STEP 4 — Confirmación */}
              {currentStep === 4 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    Confirmación del pedido
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-[13px] font-semibold text-primary uppercase tracking-wider mb-2">Datos personales</p>
                      <p className="text-[15px] text-muted-foreground">
                        {personalInfo.firstName} {personalInfo.lastName}<br />
                        {personalInfo.email}<br />
                        {personalInfo.phone}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-[13px] font-semibold text-primary uppercase tracking-wider mb-2">Envío</p>
                      <p className="text-[15px] text-muted-foreground">
                        {isRetiroLocal ? (
                          <>Retiro en local · Cuba 1348, Bahía Blanca</>
                        ) : (
                          <>
                            {selectedShipping?.name} · {selectedShipping?.days}<br />
                            {shippingAddress.street} {shippingAddress.number}{shippingAddress.floor && `, ${shippingAddress.floor}`}<br />
                            {shippingAddress.city}, {shippingAddress.province} ({shippingAddress.postalCode})
                          </>
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-[13px] font-semibold text-primary uppercase tracking-wider mb-2">Pago</p>
                      <p className="text-[15px] text-muted-foreground">
                        {paymentMethod === "transfer" ? "Transferencia bancaria (−10% de descuento)" : "MercadoPago"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(3)} className="text-[15px]">Volver</Button>
                    <Button onClick={handleConfirmOrder} disabled={isConfirming} className="bg-primary hover:bg-primary/90 text-[15px] px-8">
                      {isConfirming ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Procesando...
                        </span>
                      ) : "Confirmar pedido"}
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
 