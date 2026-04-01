"use client"
 
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
 
export function LoginModal() {
  const { isLoginOpen, closeLogin, login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
 
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
 
  // Register form state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
 
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
    if (registerPassword !== registerConfirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (registerPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    setIsLoading(true)
    try {
      await register(registerName, registerEmail, registerPassword)
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta. Intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold" style={{ fontFamily: 'var(--font-oswald)' }}>
            Mi Cuenta
          </DialogTitle>
        </DialogHeader>
 
        <Tabs defaultValue="login" className="w-full" onValueChange={() => setError(null)}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
          </TabsList>
 
          {/* Mensaje de error compartido entre tabs */}
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
                  <Input
                    type="password"
                    placeholder="Tu contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-secondary"
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
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
 
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Ingresando..." : "INGRESAR"}
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>
 
          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nombre completo</FieldLabel>
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
                  <FieldLabel>Contraseña</FieldLabel>
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="bg-secondary"
                  />
                </Field>
 
                <Field>
                  <FieldLabel>Confirmar contraseña</FieldLabel>
                  <Input
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                    className="bg-secondary"
                  />
                </Field>
 
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  disabled={isLoading}
                >
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