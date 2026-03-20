"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

const products = [
  {
    id: 1,
    name: "Escape Eac 110cc - 3 Pulgadas",
    price: 113640,
    originalPrice: 130700,
    discount: 13,
    installments: { count: 3, amount: 37880 },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    freeShipping: false,
    transferDiscount: true,
  },
  {
    id: 2,
    name: "Escape Wave 110S Rojo (Grs)",
    price: 517735,
    originalPrice: null,
    discount: null,
    installments: { count: 3, amount: 172578 },
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&h=300&fit=crop",
    freeShipping: true,
    transferDiscount: true,
  },
  {
    id: 3,
    name: "Casco LS2 FF800 Storm II Negro",
    price: 285000,
    originalPrice: 320000,
    discount: 11,
    installments: { count: 3, amount: 95000 },
    image: "https://images.unsplash.com/photo-1617727553252-65863c156eb0?w=300&h=300&fit=crop",
    freeShipping: true,
    transferDiscount: true,
  },
  {
    id: 4,
    name: "Kit Transmisión Honda CG 150",
    price: 89500,
    originalPrice: 105000,
    discount: 15,
    installments: { count: 3, amount: 29833 },
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=300&h=300&fit=crop",
    freeShipping: false,
    transferDiscount: true,
  },
  {
    id: 5,
    name: "Escape Twister CBX 250 Drag",
    price: 625585,
    originalPrice: null,
    discount: null,
    installments: { count: 3, amount: 208528 },
    image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=300&h=300&fit=crop",
    freeShipping: true,
    transferDiscount: true,
  },
  {
    id: 6,
    name: "Manubrio Wirtz Racing Aluminio",
    price: 145000,
    originalPrice: 165000,
    discount: 12,
    installments: { count: 3, amount: 48333 },
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop",
    freeShipping: false,
    transferDiscount: true,
  },
  {
    id: 7,
    name: "Filtro de Aire BMB Alto Flujo",
    price: 42500,
    originalPrice: 48000,
    discount: 11,
    installments: { count: 3, amount: 14166 },
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop",
    freeShipping: false,
    transferDiscount: true,
  },
  {
    id: 8,
    name: "Guardabarro Delantero YBR 125",
    price: 35800,
    originalPrice: null,
    discount: null,
    installments: { count: 3, amount: 11933 },
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=300&h=300&fit=crop",
    freeShipping: false,
    transferDiscount: false,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('ARS', '$')
}

export function FeaturedProducts() {
  const { addItem } = useCart()

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      image: product.image,
    })
  }

  return (
    <section className="py-8 md:py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8" style={{ fontFamily: 'var(--font-oswald)' }}>
          Productos Destacados
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <Link href={`/productos/${product.id}`}>
              {/* Image Container */}
              <div className="relative aspect-square bg-white p-4">
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.discount && (
                    <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">
                      {product.discount}% OFF
                    </Badge>
                  )}
                  {product.freeShipping && (
                    <Badge className="bg-primary hover:bg-primary text-primary-foreground text-xs flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      ENVÍO GRATIS
                    </Badge>
                  )}
                </div>
                
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              </Link>

              {/* Product Info */}
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                  {product.name}
                </h3>

                <div className="mt-2 space-y-1">
                  {/* Original Price */}
                  {product.originalPrice && (
                    <p className="text-xs md:text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                  
                  {/* Current Price */}
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </p>

                  {/* Transfer Discount */}
                  {product.transferDiscount && (
                    <p className="text-xs text-green-500">
                      {formatPrice(product.price * 0.84)} con -16% DESCUENTO en Transferencia
                    </p>
                  )}

                  {/* Installments */}
                  <p className="text-xs text-muted-foreground">
                    {product.installments.count} cuotas sin interés de{' '}
                    <span className="font-semibold text-foreground">
                      {formatPrice(product.installments.amount)}
                    </span>
                  </p>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
