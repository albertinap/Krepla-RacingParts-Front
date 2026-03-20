"use client"

import { useState } from "react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { CategorySidebar } from "@/components/category-sidebar"
import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturedCategories } from "@/components/featured-categories"
import { PopularCategories } from "@/components/popular-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { FeatureBar } from "@/components/feature-bar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <HeroCarousel />
      <FeaturedCategories />
      <PopularCategories />
      <FeaturedProducts />
      <FeatureBar />
      <Footer />
    </main>
  )
}
