"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSubmit = async () => {
    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "El link es inválido o expiró")
      setLoading(false)
      return
    }
    router.push("/?reset=ok")
  }

  if (!token) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Link inválido.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-card border border-border rounded-lg p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Nueva contraseña</h1>
        <p className="text-muted-foreground text-sm mb-6">Ingresá tu nueva contraseña.</p>
        <div className="space-y-4">
          <div>
            <Label>Nueva contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-2 bg-secondary border-border"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <Label>Confirmar contraseña</Label>
            <Input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="mt-2 bg-secondary border-border"
              placeholder="Repetí tu contraseña"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={!password || !confirm || loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  function setSidebarOpen(arg0: boolean): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div>Cargando...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}