"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push("/"), 2000)
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña")
    } finally {
      setLoading(false)
    }
  }

  if (!token) return <p className="text-center text-destructive">Token inválido o expirado.</p>

  if (success) return (
    <p className="text-center text-green-600">
      ¡Contraseña actualizada! Redirigiendo...
    </p>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-24 px-4">
      <h1 className="text-2xl font-bold text-center">Nueva contraseña</h1>
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Guardando..." : "GUARDAR CONTRASEÑA"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}