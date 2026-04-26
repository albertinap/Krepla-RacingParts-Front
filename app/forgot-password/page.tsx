"use client"

import { useState } from "react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          {sent ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-3">Revisá tu email</h1>
              <p className="text-muted-foreground">Si existe una cuenta con ese email, te enviamos un link para restablecer tu contraseña.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Olvidé mi contraseña</h1>
              <p className="text-muted-foreground text-sm mb-6">Ingresá tu email y te mandamos un link para crear una nueva contraseña.</p>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-2 bg-secondary border-border"
                    placeholder="tu@email.com"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!email || loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? "Enviando..." : "Enviar link"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}