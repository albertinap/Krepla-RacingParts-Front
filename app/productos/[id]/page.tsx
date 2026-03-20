"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Truck, MapPin, Store, CreditCard, Percent, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/contexts/cart-context"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

// Sample product data - in production this would come from an API
const product = {
  id: "10073",
  name: "Arandelas Anodizadas X10 Rojas M6",
  price: 9144.55,
  originalPrice: 7557.48,
  transferPrice: 7681.42,
  transferDiscount: 16,
  installments: 3,
  installmentPrice: 3048.18,
  image: "/placeholder.svg?height=600&width=600",
  category: "Accesorios",
  subcategory: "RB CNC PARTS",
  brand: "New Twister",
  description: "Las Arandelas Universales de Aluminio Rojas son el complemento ideal para quienes buscan personalizar y mejorar su moto. Generalmente utilizadas en cachas de motos, estas arandelas no solo ofrecen funcionalidad, sino que también aportan un toque de estilo único.",
  freeShippingThreshold: 150000,
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [postalCode, setPostalCode] = useState("1900")
  const [shippingMethod, setShippingMethod] = useState("delivery")
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation />
      
      <main className="flex-1">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="#" className="hover:text-foreground transition-colors">{product.category}</Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="#" className="hover:text-foreground transition-colors">{product.subcategory}</Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link href="#" className="hover:text-foreground transition-colors">{product.brand}</Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-card rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
            {/* Watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="text-6xl font-bold text-foreground transform -rotate-45" style={{ fontFamily: 'var(--font-oswald)' }}>
                KREPLA
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-oswald)' }}>
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Precio sin impuestos: <span className="line-through">{formatPrice(product.originalPrice)}</span>
              </p>
              <p className="text-lg font-semibold text-primary">
                {formatPrice(product.transferPrice)} con -{product.transferDiscount}% DESCUENTO en Transferencia
              </p>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 py-4 border-y border-border">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">GO</span>
                <span>Cuotas SIN interés con <strong>DÉBITO</strong></span>
                <button className="text-primary">i</button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-primary">{product.installments} cuotas sin interés de {formatPrice(product.installmentPrice)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-primary" />
                <span className="text-primary">{product.transferDiscount}% de descuento</span>
                <span className="text-muted-foreground">pagando con -{product.transferDiscount}% DESCUENTO en Transferencia</span>
              </div>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
                Ver más detalles
              </button>
            </div>

            {/* Free Shipping Notice */}
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span className="text-primary">Envío gratis</span>
              <span className="text-muted-foreground">superando los {formatPrice(product.freeShippingThreshold)}</span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold py-6 text-lg"
                onClick={handleAddToCart}
              >
                AGREGAR AL CARRITO
              </Button>
            </div>

            {/* Shipping Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Entregas para el CP: <strong className="text-foreground">{postalCode}</strong>
                </span>
                <Button variant="outline" size="sm">CAMBIAR CP</Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Opciones para tu compra <strong className="text-foreground">si sumás este producto</strong>.
              </p>

              {/* Delivery Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>Envío a domicilio</span>
                </div>

                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                  <div 
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === "delivery" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setShippingMethod("delivery")}
                  >
                    <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="delivery" className="font-medium cursor-pointer">
                        Envío Nube - Correo Argentino Clásico a domicilio
                      </Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Llega entre el martes 24/03 y el lunes 30/03</span>
                      </div>
                    </div>
                    <span className="font-semibold">{formatPrice(8431)}</span>
                  </div>

                  <div className="text-sm text-muted-foreground pt-2">
                    VIA CARGO - SE RETIRA Y PAGA EN SUCURSAL
                  </div>

                  <div className="flex items-center gap-2 text-sm pt-2">
                    <MapPin className="h-4 w-4" />
                    <span>Retirar por</span>
                  </div>

                  <div 
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setShippingMethod("pickup")}
                  >
                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="pickup" className="font-medium cursor-pointer">Punto de retiro</Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Retiras entre el martes 24/03 y el lunes 30/03</span>
                      </div>
                      <button className="text-xs text-primary mt-1">Ver direcciones</button>
                    </div>
                    <span className="font-semibold">{formatPrice(5523)}</span>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-oswald)' }}>
                {product.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}
