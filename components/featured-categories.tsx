"use client"

import Image from "next/image"
import Link from "next/link"

const featuredCategories = [
  {
    name: "Escapes",
    image: "/escapes.jpeg",
    href: "/productos/categoria/escapes",
    description: "Performance y sonido",
  },
  {
    name: "Competición y Potenciación",
    image: "/potenciacion.jpeg",
    href: "/productos/categoria/competicion-y-potenciacion",
    description: "Dale potencia a tu moto",
  },
  {
    name: "Transmisión",
    image: "/transmisores.jpeg",
    href: "/productos/categoria/transmision",
    description: "Dale potencia a la rueda",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-8 md:py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-card"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-oswald)' }}>
                  {category.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1">{category.description}</p>
                <span className="inline-block mt-2 text-sm text-primary font-medium group-hover:underline">
                  {'Ver Más+'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
