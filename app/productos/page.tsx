"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { CategorySidebar } from "@/components/category-sidebar"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { medusa } from "@/lib/medusa"

const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION

export interface Product {
  id: string
  name: string
  handle: string
  price: number
  image: string
  brand: string
  category: string
  createdAt: Date
  colors: string[]
  weight: number
  length: number
  height: number
  width: number
  quantity: number
  // Nuevos campos para stock
  inStock: boolean
  inventory_quantity: number
  manage_inventory: boolean
}

type SortOption = "newest" | "price-asc" | "price-desc" | "a-z" | "z-a"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(price)
}

function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const freeShipping = product.price >= 150000
  const transferPrice = product.price * 0.84
  const installmentPrice = product.price / 3

  const isOutOfStock = !product.inStock

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variantId: "", // product.variants?.[0]?.id
      weight: product.weight,
      length: product.length,
      height: product.height,
      width: product.width,
      quantity: product.quantity,
    })
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-colors relative">
      {/* Cartel AGOTADO */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="destructive" className="font-medium text-sm px-3 py-1">
            AGOTADO
          </Badge>
        </div>
      )}

      <Link href={`/productos/${product.handle}`}>
        <div className="relative aspect-square bg-white p-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-6xl font-bold text-gray-200/30 rotate-[-30deg] select-none tracking-widest">
              KREPLA
            </span>
          </div>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-2 transition-transform duration-300 ${
              isOutOfStock ? "grayscale" : "group-hover:scale-105"
            }`}
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <Link href={`/productos/${product.handle}`}>
          <h3 className="text-[15px] font-medium text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-xl font-bold text-foreground mt-2">{formatPrice(product.price)}</p>
        <p className="text-sm text-green-500 font-medium mt-1">
          {formatPrice(transferPrice)} con -16% DESCUENTO en Transferencia
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          3 cuotas sin interés de {formatPrice(installmentPrice)}
        </p>

        {product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        <Button
          className={`w-full mt-4 text-[15px] ${
            isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Sin stock disponible" : "Agregar al carrito"}
        </Button>
      </div>
    </div>
  )
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    medusa.store.product
      .list({
        limit: 100,
        region_id: DEFAULT_REGION_ID,
        // Campos necesarios para stock + precio
        fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory",
      } as any)
      .then(({ products: medusaProducts }) => {
        const mapped = medusaProducts.map((p: any) => {
          const variant = p.variants?.[0]

          const inventoryQuantity = variant?.inventory_quantity ?? 0
          const manageInventory = variant?.manage_inventory ?? false

          // Lógica estándar de Medusa:
          // - Si manage_inventory = false → siempre en stock
          // - Si manage_inventory = true → en stock si inventory_quantity > 0
          const inStock = !manageInventory || inventoryQuantity > 0

          return {
            id: p.id,
            name: p.title,
            handle: p.handle,
            price: variant
              ? variant.calculated_price?.calculated_amount ??
                variant.calculated_price?.original_amount ??
                variant.prices?.[0]?.amount ??
                0
              : 0,
            image: p.thumbnail ?? "/placeholder.svg?height=300&width=300",
            brand: p.collection?.title ?? "Sin marca",
            category: p.categories?.[0]?.name ?? "",
            createdAt: new Date(p.created_at),
            colors:
              p.options?.find((o: any) => o.title === "Color")?.values?.map((v: any) => v.value) ?? [],
            // Campos nuevos
            inStock,
            inventory_quantity: inventoryQuantity,
            manage_inventory: manageInventory,
            // Campos que ya tenías (podes dejarlos en 0 si no los usás todavía)
            weight: 0,
            length: 0,
            height: 0,
            width: 0,
            quantity: inventoryQuantity,
          }
        })

        setProducts(mapped)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const sortedProducts = useMemo(() => {
    const result = [...products]
    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price)
      case "price-desc":
        return result.sort((a, b) => b.price - a.price)
      case "a-z":
        return result.sort((a, b) => a.name.localeCompare(b.name))
      case "z-a":
        return result.sort((a, b) => b.name.localeCompare(b.name))
      case "newest":
        return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      default:
        return result
    }
  }, [products, sortBy])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* ... resto del JSX igual (navegación, título, select de orden) ... */}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-xl text-muted-foreground">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}