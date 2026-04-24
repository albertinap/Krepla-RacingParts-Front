"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { CategorySidebar } from "@/components/category-sidebar"
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { medusa } from "@/lib/medusa"
import { mapProduct, PRODUCT_FIELDS, MappedProduct } from "@/lib/products"

const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION

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

function ProductCard({ product, rawVariants }: { product: MappedProduct; rawVariants: any[] }) {
  const { addItem } = useCart()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  const hasVariants = rawVariants.length > 1
  const selectedVariant = rawVariants[selectedVariantIndex]

  const price = selectedVariant?.calculated_price?.calculated_amount
    ?? selectedVariant?.prices?.[0]?.amount
    ?? product.price
  const transferPrice = price * 0.90

  const manageInventory = selectedVariant?.manage_inventory ?? false
  const inventoryQty = selectedVariant?.inventory_quantity ?? 0
  const isOutOfStock = manageInventory ? inventoryQty <= 0 : !product.inStock
  const isLowStock = manageInventory && inventoryQty > 0 && inventoryQty <= 3

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-colors relative">
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="destructive" className="font-medium text-sm px-3 py-1">AGOTADO</Badge>
        </div>
      )}
      {isLowStock && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-medium text-sm px-3 py-1">
            ¡Últimas {inventoryQty} unidades!
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

        {hasVariants && (
          <div className="flex flex-wrap gap-1 mt-1">
            {rawVariants.map((v: any, i: number) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(i)}
                className={`text-xs border rounded px-2 py-0.5 transition-colors ${
                  i === selectedVariantIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        <p className="text-xl font-bold text-foreground mt-2">{formatPrice(price)}</p>
        <p className="text-sm text-green-500 font-medium mt-1">
          {formatPrice(transferPrice)} con -10% DESCUENTO en Transferencia
        </p>
        <Button
          className={`w-full mt-4 text-[15px] ${
            isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          onClick={() => !isOutOfStock && addItem({
            id: product.id,
            name: product.name,
            price,
            image: product.image,
            variantId: selectedVariant?.id ?? product.variantId,
          })}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Sin stock disponible" : "Agregar al carrito"}
        </Button>
      </div>
    </div>
  )
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const [allProducts, setAllProducts] = useState<MappedProduct[]>([])
  const [rawVariantsMap, setRawVariantsMap] = useState<Record<string, any[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    medusa.store.product
      .list({
        limit: 100,
        region_id: DEFAULT_REGION_ID,
        fields: `${PRODUCT_FIELDS},*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory`,
      } as any)
      .then(({ products: medusaProducts }) => {
        const mapped = medusaProducts.map(mapProduct)
        setAllProducts(mapped)
        setRawVariantsMap(
          Object.fromEntries(medusaProducts.map((p: any) => [p.id, p.variants ?? []]))
        )
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }, [allProducts, query])

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
            <span className="text-foreground font-medium">Resultados para "{query}"</span>
          </nav>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <Search className="h-12 w-12 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                No encontramos productos para "<strong className="text-foreground">{query}</strong>"
              </p>
              <Link href="/productos">
                <Button variant="outline">Ver todos los productos</Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[15px] text-muted-foreground mb-6">{results.length} resultados para "{query}"</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    rawVariants={rawVariantsMap[product.id] ?? []}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  )
}