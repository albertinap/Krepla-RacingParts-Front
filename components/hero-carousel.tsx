"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "DISTRIBUIDORES",
    subtitle: "OFICIALES",
    description: "VENTA POR MAYOR O MENOR",
    brand: "BMB & WIRTZ RACING",
    bgGradient: "from-black/80 via-black/50 to-transparent",
  },
  {
    id: 2,
    title: "NUEVOS",
    subtitle: "ESCAPES",
    description: "PERFORMANCE DE ALTA CALIDAD",
    brand: "HASTA 30% OFF",
    bgGradient: "from-primary/20 via-black/50 to-transparent",
  },
  {
    id: 3,
    title: "CASCOS",
    subtitle: "LS2 & PRO TORK",
    description: "SEGURIDAD Y ESTILO",
    brand: "ENVÍO GRATIS",
    bgGradient: "from-black/80 via-black/50 to-transparent",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-secondary overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-secondary to-black opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-5" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-muted-foreground text-sm md:text-base mb-2">
                {slide.description}
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-oswald)' }}>
                {slide.title}
              </h2>
              <h3 className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary" style={{ fontFamily: 'var(--font-oswald)' }}>
                {slide.subtitle}
              </h3>
              <p className="mt-4 text-lg md:text-xl text-foreground font-medium">
                {slide.brand}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-background/50 hover:bg-background text-foreground"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border bg-background/50 hover:bg-background text-foreground"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-foreground" : "bg-muted-foreground"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
