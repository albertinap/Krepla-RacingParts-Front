"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import toast from "react-hot-toast"

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="bg-secondary pr-10"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

function getPasswordStrength(pass: string): { score: number; label: string; color: string } {
  if (!pass) return { score: 0, label: "", color: "" }
  let score = 0
  if (pass.length >= 6) score++
  if (pass.length >= 9) score++
  if (pass.length >= 11) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++
  score = Math.max(1, score)
  const map = [
    { score: 1, label: "Débil", color: "bg-destructive" },
    { score: 2, label: "Regular", color: "bg-yellow-500" },
    { score: 3, label: "Fuerte", color: "bg-green-500" },
  ]
  return map[score - 1]
}

export function LoginModal() {
  const { isLoginOpen, closeLogin, login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Register — cada campo tiene su propio estado, completamente aislado
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const strength = getPasswordStrength(registerPassword)
  const passwordsMatch = registerConfirmPassword.length > 0 && registerPassword !== registerConfirmPassword

  const handlePhoneChange = (value: string) => {
    // Solo permite dígitos, espacios, +, -, paréntesis
    const cleaned = value.replace(/[^\d\s\+\-\(\)]/g, "")
    setRegisterPhone(cleaned)
    const digits = cleaned.replace(/\D/g, "")
    if (cleaned.length > 0 && digits.length < 8) {
      setPhoneError("Ingresá al menos 8 dígitos")
    } else {
      setPhoneError(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(loginEmail, loginPassword)
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Revisá tus datos.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const digits = registerPhone.replace(/\D/g, "")
    if (registerPhone && digits.length < 8) {
      setError("El teléfono debe tener al menos 8 dígitos")
      return
    }
    if (registerPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (registerPassword !== registerConfirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)
    try {
      await register(registerName, registerEmail, registerPassword, registerPhone)
      toast.success("¡Cuenta creada exitosamente!")
      closeLogin()
    } catch (err: any) {
      const msg = err.message || ""
      if (msg.includes("Cuenta creada") || msg.includes("Revisá tu email") || msg.includes("email")) {
        setSuccessMessage(msg)
      } else {
        setError(msg)
      }
    } finally {
      setIsLoading(false)
      // En el JSX, debajo del error existente:
      {successMessage && (
        <div className="mt-4 rounded-md bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-600">
          {successMessage}
        </div>
      )}
    }
  }

  return (
    <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold" style={{ fontFamily: "var(--font-oswald)" }}>
            Mi Cuenta
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full" onValueChange={() => setError(null)}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
          </TabsList>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-secondary"
                  />
                </Field>
                <Field>
                  <FieldLabel>Contraseña</FieldLabel>
                  <PasswordInput
                    id="login-password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="Tu contraseña"
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Recordarme
                    </Label>
                  </div>
                  <button type="button" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <Button type="submit" className="w-full py-6 font-semibold" disabled={isLoading}>
                  {isLoading ? "Ingresando..." : "INGRESAR"}
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nombre y Apellido</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="bg-secondary"
                  />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="bg-secondary"
                  />
                </Field>
                <Field>
                  <FieldLabel>
                    Teléfono{" "}
                    <span className="text-xs text-muted-foreground font-normal">(mín. 8 dígitos - opcional)</span>
                  </FieldLabel>
                  <Input
                    type="tel"
                    placeholder="+54 9 291 000-0000"
                    value={registerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="bg-secondary"
                  />
                  {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
                </Field>
                <Field>
                  <FieldLabel>Contraseña</FieldLabel>
                  <PasswordInput
                    id="register-password"
                    value={registerPassword}
                    onChange={setRegisterPassword}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {registerPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= strength.score ? strength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{strength.label}</p>
                    </div>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Confirmar contraseña</FieldLabel>
                  <PasswordInput
                    id="register-confirm-password"
                    value={registerConfirmPassword}
                    onChange={setRegisterConfirmPassword}
                    placeholder="Repetí tu contraseña"
                  />
                  {passwordsMatch && (
                    <p className="text-xs text-destructive mt-1">Las contraseñas no coinciden</p>
                  )}
                </Field>
                <Button type="submit" className="w-full py-6 font-semibold" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "CREAR CUENTA"}
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}