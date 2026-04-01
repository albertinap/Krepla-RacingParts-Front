"use client"

import { medusa } from "@/lib/medusa"
import { useState, useMemo, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
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
import { Footer } from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { CategorySidebar } from "@/components/category-sidebar"

interface CategoryPageProps {
  params: Promise<{ categoria: string }>
}

const categoryNames: Record<string, string> = {
  escapes: "Escapes",
  transmision: "Transmisión",
  mantenimiento: "Mantenimiento",
  guardabarros: "Guardabarros",
  calcos: "Calcos",
  "manubrios-y-accesorios": "Manubrios y Accesorios",
  "competicion-y-potenciacion": "Competición y Potenciación",
}

type SortOption = "price-asc" | "price-desc" | "a-z" | "z-a" | "newest"

function formatPrice(price: number): string {
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
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}

function ProductCard({ product, categoria }: { product: any; categoria: string }) {
  const { addItem } = useCart()
  const freeShipping = product.price >= 150000
  const transferPrice = product.price * 0.84
  const installmentPrice = product.price / 3

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-colors">
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
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
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
            {product.colors?.map((color: string) => (
              <span key={color} className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
                {color}
              </span>
            ))}
          </div>
        )}
        <Button
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[15px]"
          onClick={() => addItem({
            id: product.id, 
            name: product.name, 
            price: product.price, 
            image: product.image,            
            variantId: product.variants?.[0]?.id,
          })}
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  )
}

function FiltersSidebar({
  categoryName, brands, selectedBrands, onBrandChange,
  priceRange, onPriceRangeChange, minPrice, maxPrice, onClearFilters,
}: {
  categoryName: string
  brands: string[]
  selectedBrands: string[]
  onBrandChange: (brand: string, checked: boolean) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  minPrice: number
  maxPrice: number
  onClearFilters: () => void
}) {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-card border border-border rounded-lg p-5 sticky top-4">
        <h2 className="text-xl font-bold text-foreground mb-6">{categoryName}</h2>
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Precio</h3>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Desde</label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                className="bg-secondary border-border text-[15px]"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Hasta</label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                className="bg-secondary border-border text-[15px]"
              />
            </div>
          </div>
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            min={minPrice}
            max={maxPrice}
            step={1000}
            className="mt-2"
          />
        </div>
        <div className="mb-6">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Marcas</h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => onBrandChange(brand, checked as boolean)}
                />
                <span className="text-[15px] text-foreground">{brand}</span>
              </label>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full text-[15px]" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </div>
    </aside>
  )
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params)
  const categoria = resolvedParams.categoria
  const categoryName = categoryNames[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1)

  // ── Todo el estado va acá adentro ──
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500000)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Paso 1: buscar el ID de la categoría por su handle
    medusa.store.category.list({ handle: categoria })
      .then(({ product_categories }) => {
        if (!product_categories.length) {
          setIsLoading(false)
          return
        }
        const categoryId = product_categories[0].id
  
        // Paso 2: buscar productos por el ID de la categoría
        return medusa.store.product.list({
          category_id: [categoryId], 
          region_id: "reg_01KMGSX0FJ4G6Z9HMAAT2K4GMR",                   
        }) as any;
      })
      .then((result: any) => {
        if (!result) return
        const { products: medusaProducts } = result
        console.log("Primer producto:", JSON.stringify(medusaProducts[0], null, 2))
        const mapped = medusaProducts.map((p: any) => ({
          id: p.id,
          name: p.title,
          handle: p.handle,
          price: p.variants?.[0]?.calculated_price?.calculated_amount ?? 0,
          image: p.thumbnail ?? "/placeholder.svg?height=300&width=300",
          brand: p.collection?.title ?? "Sin marca",
          createdAt: new Date(p.created_at),
          colors: p.options
            ?.find((o: any) => o.title === "Color")
            ?.values?.map((v: any) => v.value) ?? [],
        }))
        setProducts(mapped)
        const uniqueBrands = [...new Set(mapped.map((p: any) => p.brand).filter((b: string) => b !== "Sin marca"))]
        setBrands(uniqueBrands as string[])
        if (mapped.length > 0) {
          const prices = mapped.map((p: any) => p.price)
          setMinPrice(Math.min(...prices))
          setMaxPrice(Math.max(...prices))
          setPriceRange([Math.min(...prices), Math.max(...prices)])
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [categoria])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand))
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {      
      case "price-asc":    result.sort((a, b) => a.price - b.price); break
      case "price-desc":   result.sort((a, b) => b.price - a.price); break
      case "a-z":          result.sort((a, b) => a.name.localeCompare(b.name)); break
      case "z-a":          result.sort((a, b) => b.name.localeCompare(a.name)); break
      case "newest":       result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); break
    }
    return result
  }, [products, selectedBrands, priceRange, sortBy])

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands((prev) => checked ? [...prev, brand] : prev.filter((b) => b !== brand))
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setPriceRange([minPrice, maxPrice])
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
            <span className="text-foreground font-medium">{categoryName}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            <FiltersSidebar
              categoryName={categoryName}
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onClearFilters={handleClearFilters}
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[15px] text-muted-foreground">{filteredProducts.length} productos</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:block">Ordenar por:</span>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[200px] bg-secondary border-border text-[15px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Precio menor a mayor</SelectItem>
                      <SelectItem value="price-desc">Precio mayor a menor</SelectItem>
                      <SelectItem value="a-z">A-Z</SelectItem>
                      <SelectItem value="z-a">Z-A</SelectItem>
                      <SelectItem value="newest">Más nuevo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-xl text-muted-foreground mb-4">No hay productos en esta categoría</p>
                  <Button variant="outline" onClick={handleClearFilters}>Limpiar filtros</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} categoria={categoria} />
                  ))}
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