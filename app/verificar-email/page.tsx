"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function VerificarForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [estado, setEstado] = useState<"cargando" | "ok" | "error">("cargando")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    if (!token) {
      setEstado("error")
      setMensaje("El enlace es inválido.")
      return
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEstado("ok")
          setMensaje("¡Tu cuenta fue confirmada! Ahora podés iniciar sesión.")
          setTimeout(() => router.push("/"), 3000)
        } else {
          setEstado("error")
          setMensaje(data.error || "El enlace es inválido o ya expiró.")
        }
      })
      .catch(() => {
        setEstado("error")
        setMensaje("Ocurrió un error, intentá de nuevo.")
      })
  }, [token])

  return (
    <main className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      {estado === "cargando" && (
        <p className="text-muted-foreground">Verificando tu cuenta...</p>
      )}
      {estado === "ok" && (
        <>
          <div className="text-4xl">✓</div>
          <h1 className="text-xl font-medium">{mensaje}</h1>
          <p className="text-sm text-muted-foreground">Redirigiendo...</p>
        </>
      )}
      {estado === "error" && (
        <>
          <h1 className="text-xl font-medium text-destructive">{mensaje}</h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary hover:underline"
          >
            Volver al inicio
          </button>
        </>
      )}
    </main>
  )
}

export default function VerificarEmailPage() {
  return (
    <Suspense>
      <VerificarForm />
    </Suspense>
  )
}