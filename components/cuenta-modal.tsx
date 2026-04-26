"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-secondary pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-base font-medium border-b border-border pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function Feedback({ error, success }: { error: string | null; success: string | null }) {
  if (error) return (
    <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">
      {error}
    </div>
  )
  if (success) return (
    <div className="rounded-md bg-green-500/10 border border-green-500/30 px-4 py-2.5 text-sm text-green-600">
      {success}
    </div>
  )
  return null
}

interface CuentaModalProps {
  open: boolean
  onClose: () => void
}

export default function CuentaModal({ open, onClose }: CuentaModalProps) {
  const { user, token, setUser } = useAuth()
  const overlayRef = useRef<HTMLDivElement>(null)

  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] ?? "")
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null)

  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)
  const [passSuccess, setPassSuccess] = useState<string | null>(null)

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Sincronizar campos si cambia el usuario
  useEffect(() => {
    if (user) {
      setFirstName(user.name?.split(" ")[0] ?? "")
      setLastName(user.name?.split(" ").slice(1).join(" ") ?? "")
      setEmail(user.email ?? "")
      setPhone(user.phone ?? "")
    }
  }, [user])

  if (!open || !user) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose()
  }


  const handleProfileSave = async () => {
    setProfileError(null)
    setProfileSuccess(null)
    if (!firstName.trim()) { setProfileError("El nombre es obligatorio"); return }    
    // Teléfono opcional, pero si tiene valor debe tener al menos 8 dígitos
    if (phone.trim()) {
      const digits = phone.replace(/\D/g, "")
      if (digits.length < 8) {
        setProfileError("El teléfono debe tener al menos 8 dígitos")
        return
      }
    }
    setProfileLoading(true)
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, first_name: firstName, last_name: lastName, email, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser({ ...user, name: `${firstName} ${lastName}`.trim(), email, phone })
      toast.success("Datos actualizados correctamente.")
    } catch (err: any) {
      setProfileError(err.message || "Error al actualizar")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleAddressSave = async () => {
    setAddressError(null)
    setAddressSuccess(null)
    if (!address.trim() || !city.trim()) { setAddressError("Completá al menos la calle y la ciudad"); return }
    setAddressLoading(true)
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          shipping_addresses: [{
            address_1: address,
            city,
            province,
            country_code: "ar",
          }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAddressSuccess("Dirección guardada correctamente")
    } catch (err: any) {
      setAddressError(err.message || "Error al guardar la dirección")
    } finally {
      setAddressLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setPassError(null)
    setPassSuccess(null)

    if (!currentPass || !newPass || !confirmPass) {
      setPassError("Completá todos los campos")
      return
    }
    if (newPass.length < 8) {
      setPassError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }
    if (newPass !== confirmPass) {
      setPassError("Las contraseñas no coinciden")
      return
    }

    setPassLoading(true)
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: currentPass }),
      })

      if (!loginRes.ok) {
        setPassError("La contraseña actual es incorrecta")
        return
      }

      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPass }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setCurrentPass("")
      setNewPass("")
      setConfirmPass("")
      setPassSuccess("Contraseña actualizada correctamente")
    } catch (err: any) {
      setPassError(err.message || "Error al cambiar la contraseña")
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      style={{ animation: "fadeIn 0.15s ease" }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background border border-border shadow-2xl"
        style={{ animation: "slideUp 0.2s ease" }}
      >
        {/* Header fijo */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background border-b border-border px-6 py-4">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-oswald)" }}>
            Mi cuenta
          </h1>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="px-6 py-6 space-y-6">
          {/* Datos personales */}
          <SectionCard title="Datos personales">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre">
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-secondary" />
              </Field>
              <Field label="Apellido">
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-secondary" />
              </Field>
            </div>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                disabled
                className="bg-secondary opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El email no se puede modificar desde aquí.
              </p>
            </Field>
            <Field label="Teléfono">
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 9 291 000-0000" className="bg-secondary" />
            </Field>
            <Feedback error={profileError} success={profileSuccess} />
            <Button onClick={handleProfileSave} disabled={profileLoading} className="w-full font-semibold">
              {profileLoading ? "Guardando..." : "GUARDAR CAMBIOS"}
            </Button>
          </SectionCard>

          {/* Dirección de envío 
          <SectionCard title="Dirección de envío">
            <Field label="Calle y número">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej: Av. Colón 1234" className="bg-secondary" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ciudad">
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bahía Blanca" className="bg-secondary" />
              </Field>
              <Field label="Provincia">
                <Input value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Buenos Aires" className="bg-secondary" />
              </Field>
            </div>
            <Feedback error={addressError} success={addressSuccess} />
            <Button onClick={handleAddressSave} disabled={addressLoading} className="w-full font-semibold">
              {addressLoading ? "Guardando..." : "GUARDAR DIRECCIÓN"}
            </Button>
          </SectionCard>*/}

          {/* Cambiar contraseña 
          <SectionCard title="Cambiar contraseña">
            <Field label="Contraseña actual">
              <PasswordInput value={currentPass} onChange={setCurrentPass} placeholder="Tu contraseña actual" />
            </Field>
            <Field label="Nueva contraseña">
              <PasswordInput value={newPass} onChange={setNewPass} placeholder="Mínimo 8 caracteres" />
            </Field>
            <Field label="Confirmar nueva contraseña">
              <PasswordInput value={confirmPass} onChange={setConfirmPass} placeholder="Repetí la nueva contraseña" />
            </Field>
            <Feedback error={passError} success={passSuccess} />
            <Button onClick={handlePasswordChange} disabled={passLoading} className="w-full font-semibold">
              {passLoading ? "Cambiando..." : "CAMBIAR CONTRASEÑA"}
            </Button>
          </SectionCard>*/}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}
