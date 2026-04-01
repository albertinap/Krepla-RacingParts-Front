"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Truck, MapPin, Store, CreditCard, Percent, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/contexts/cart-context"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CategorySidebar } from "@/components/category-sidebar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { medusa } from "@/lib/medusa"

const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION
const FREE_SHIPPING_THRESHOLD = 150000

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [shippingMethod, setShippingMethod] = useState("delivery")
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    medusa.store.product.list
    ({ handle: id, region_id: DEFAULT_REGION_ID } as any)
      .then(({ products }) => {
        const found = products.find((p: any) => p.handle === id)
        if (found) setProduct(found)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnnouncementBar />
        <Header />
        <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnnouncementBar />
        <Header />
        <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-4">Producto no encontrado</p>
            <Link href="/productos">
              <Button>Ver todos los productos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const price = product.variants?.[0]?.calculated_price?.calculated_amount ?? 0
  const transferPrice = price * 0.84
  const installmentPrice = price / 3
  const freeShipping = price >= FREE_SHIPPING_THRESHOLD
  const category = product.categories?.[0]
  const image = product.thumbnail ?? "/placeholder.svg?height=600&width=600"

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: product.variants?.[0]?.id,
      name: product.title,
      price,
      image,      
      quantity
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <li>
                  <Link href={`/productos/categoria/${category.handle}`} className="hover:text-foreground transition-colors">
                    {category.name}
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <li className="text-foreground">{product.title}</li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Imagen */}
            <div className="relative aspect-square bg-card rounded-lg overflow-hidden">
              <Image src={image} alt={product.title} fill className="object-contain p-8" priority />              
            </div>

            {/* Detalle */}
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.title}</h1>

              {/* Precio */}
              <div className="space-y-2">
                <span className="text-3xl font-bold">{formatPrice(price)}</span>
                <p className="text-lg font-semibold text-primary">
                  {formatPrice(transferPrice)} con -16% DESCUENTO en Transferencia
                </p>
              </div>

              {/* Opciones de pago y promos */}
              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-primary">3 cuotas sin interés de {formatPrice(installmentPrice)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4 text-primary" />
                  <span className="text-primary">16% de descuento pagando con transferencia</span>
                </div>
              </div>              

              {/* Cantidad y agregar */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button variant="ghost" size="icon" className="h-12 w-12"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-12 w-12"
                    onClick={() => setQuantity(quantity + 1)}>
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

              {/* Opciones de envío */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Truck className="h-4 w-4" />
                  <span>Opciones de envío</span>
                </div>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">

                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "correo" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setShippingMethod("correo")}
                  >
                    <RadioGroupItem value="correo" id="correo" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="correo" className="font-medium cursor-pointer">Correo Argentino a domicilio</Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>7-10 días hábiles</span>
                      </div>
                    </div>
                    <span className="font-semibold text-muted-foreground text-sm">A calcular</span>
                  </div>

                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "andreani" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setShippingMethod("andreani")}
                  >
                    <RadioGroupItem value="andreani" id="andreani" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="andreani" className="font-medium cursor-pointer">Andreani a domicilio</Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>3-5 días hábiles</span>
                      </div>
                    </div>
                    <span className="font-semibold text-muted-foreground text-sm">A calcular</span>
                  </div>

                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "viacargo" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setShippingMethod("viacargo")}
                  >
                    <RadioGroupItem value="viacargo" id="viacargo" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="viacargo" className="font-medium cursor-pointer">Vía Cargo a domicilio</Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>5-7 días hábiles</span>
                      </div>
                    </div>
                    <span className="font-semibold text-muted-foreground text-sm">A calcular</span>
                  </div>

                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setShippingMethod("pickup")}
                  >
                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="pickup" className="font-medium cursor-pointer">
                        Retiro en local — Krepla Racing Parts
                      </Label>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>Cuba 1348, Bahía Blanca, Buenos Aires</span>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">Gratis</span>
                  </div>

                </RadioGroup>
              </div>

              {/* Descripción */}
              {product.description && (
                <div className="pt-6 border-t border-border">
                  <h2 className="text-lg font-bold mb-3">{product.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}