"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/contexts/cart-context"
import { medusa } from "@/lib/medusa"
import { useState, useEffect } from "react"

const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('ARS', '$')
}

function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full mt-3" />
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    medusa.store.product.list({
      limit: 8,
      region_id: DEFAULT_REGION_ID,
    } as any)
      .then(({ products: medusaProducts }) => {
        setProducts(medusaProducts)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <section className="py-8 md:py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
          Productos Destacados
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => {
                const price = product.variants?.[0]?.calculated_price?.calculated_amount
                  ?? product.variants?.[0]?.prices?.[0]?.amount
                  ?? 0
                const transferPrice = price * 0.84
                const installmentPrice = price / 3
                const freeShipping = price >= 150000
                const image = product.thumbnail ?? "/placeholder.svg?height=300&width=300"

                return (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-colors"
                  >
                    <Link href={`/productos/${product.handle}`}>
                      <div className="relative aspect-square bg-white p-4">
                        
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-6xl font-bold text-gray-200/30 rotate-[-30deg] select-none tracking-widest">
                            KREPLA
                          </span>
                        </div>
                        <Image
                          src={image}
                          alt={product.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                        {product.title}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-lg md:text-xl font-bold text-foreground">
                          {formatPrice(price)}
                        </p>
                        <p className="text-xs text-green-500">
                          {formatPrice(transferPrice)} con -16% DESCUENTO en Transferencia
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 cuotas sin interés de{" "}
                          <span className="font-semibold text-foreground">
                            {formatPrice(installmentPrice)}
                          </span>
                        </p>
                      </div>
                      <Button
                        className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                        onClick={() => addItem({
                          id: product.id,
                          name: product.title,
                          price,
                          image,                          
                          variantId: product.variants?.[0]?.id                       
                        })}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
