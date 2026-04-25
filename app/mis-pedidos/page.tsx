"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ChevronRight, Loader2, ShoppingBag } from "lucide-react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategorySidebar } from "@/components/category-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

type OrderItem = {
  id: string
  title: string
  quantity: number
  unit_price: number
  thumbnail: string | null
}

type Order = {
  id: string
  display_id: number
  status: string
  created_at: string
  items: OrderItem[]
  total: number
  currency_code: string
  payment_status: string
  fulfillment_status: string
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pendiente",   color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  completed:  { label: "Completado",  color: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled:  { label: "Cancelado",   color: "bg-red-500/10 text-red-500 border-red-500/20" },
  requires_action: { label: "Acción requerida", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
}

const FULFILLMENT_LABELS: Record<string, { label: string; color: string }> = {
  not_fulfilled:      { label: "En preparación", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  partially_fulfilled: { label: "Parcialmente enviado", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  fulfilled:          { label: "Enviado",        color: "bg-green-500/10 text-green-500 border-green-500/20" },
  partially_shipped:  { label: "En camino",      color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  shipped:            { label: "Entregado",       color: "bg-green-500/10 text-green-500 border-green-500/20" },
  delivered:          { label: "Entregado",       color: "bg-green-500/10 text-green-500 border-green-500/20" },
}

function StatusBadge({ status, type }: { status: string; type: "order" | "fulfillment" }) {
  const map = type === "order" ? STATUS_LABELS : FULFILLMENT_LABELS
  const info = map[status] ?? { label: status, color: "bg-secondary text-muted-foreground border-border" }
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${info.color}`}>
      {info.label}
    </span>
  )
}

function OrderCard({ order }: { order: Order }) {
  const orderTotal = order.items.reduce(
    (sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0
  )

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header del pedido */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">Pedido</p>
            <p className="text-[15px] font-bold text-foreground">#{order.display_id}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">Fecha</p>
            <p className="text-[13px] text-foreground">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3 py-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Envío</span>
            <span className="text-muted-foreground">·</span>
            <StatusBadge status={order.fulfillment_status} type="fulfillment" />
        </div>
        <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3 py-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Pago</span>
            <span className="text-muted-foreground">·</span>
            <StatusBadge status={order.status} type="order" />
        </div>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        {order.items.map(item => (
          <div key={item.id} className="px-5 py-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
              ) : (
                <Package className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-foreground font-medium line-clamp-1">{item.title}</p>
              <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
            </div>
            <p className="text-[15px] font-semibold text-foreground shrink-0">
              {formatPrice(Number(item.unit_price) * Number(item.quantity))}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-secondary/30 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total del pedido</p>
        <p className="text-[17px] font-bold text-foreground">{formatPrice(orderTotal)}</p>
      </div>
    </div>
  )
}

export default function MisPedidosPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      router.push("/")
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${MEDUSA_URL}/store/orders?fields=*items,*items.thumbnail`, {
          headers: {
            "x-publishable-api-key": MEDUSA_KEY,
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Error al obtener pedidos")
        const data = await res.json()
        setOrders(data.orders ?? [])
      } catch (e) {
        console.error(e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, token, router])

  const pedidosActivos = orders
  .filter(o => o.status !== "cancelled" && o.fulfillment_status !== "delivered")
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const pedidosHistorial = orders.filter(o => o.status === "cancelled" || o.fulfillment_status === "delivered")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Mis pedidos</span>
          </nav>

          <h1 className="text-2xl font-bold text-foreground mb-8">Mis pedidos</h1>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No pudimos cargar tus pedidos. Intentá de nuevo más tarde.</p>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Todavía no hiciste ningún pedido</h2>
              <p className="text-muted-foreground mb-6">Explorá el catálogo y encontrá lo que necesitás.</p>
              <Link href="/" className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-[15px]">
                Ver productos
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-10">
              {pedidosActivos.length > 0 && (
                <section>
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-[3px] mb-4">En curso</p>
                  <div className="space-y-4">
                    {pedidosActivos.map(order => <OrderCard key={order.id} order={order} />)}
                  </div>
                </section>
              )}

              {pedidosHistorial.length > 0 && (
                <section>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[3px] mb-4">Historial</p>
                  <div className="space-y-4">
                    {pedidosHistorial.map(order => <OrderCard key={order.id} order={order} />)}
                  </div>
                </section>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}