"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoginOpen: boolean
  openLogin: () => void
  closeLogin: () => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Clave para persistir el token en localStorage
const TOKEN_KEY = "medusa_token"
const USER_KEY = "medusa_user"



function traducirError(msg: string): string {
  console.log("traducirError recibió:", JSON.stringify(msg)) // ← agregá esto
  const errores: Record<string, string> = {
    "Invalid credentials": "Email o contraseña incorrectos",
    "Identity with email already exists": "Ya existe una cuenta con ese email",
    "Customer with email already exists": "Ya existe una cuenta con ese email",
    "Email already exists": "Ya existe una cuenta con ese email",
    "Invalid token": "El enlace es inválido o ya expiró",
    "Token expired": "El enlace expiró, solicitá uno nuevo",
    "identifier is required": "El email es obligatorio",
    "password is required": "La contraseña es obligatoria",
    "Not found": "No encontramos una cuenta con ese email",
    "Unauthorized": "No autorizado",
    "Network Error": "Error de conexión, revisá tu internet",
  }

  for (const [key, value] of Object.entries(errores)) {
    if (msg.includes(key)) return value
  }

  return "Ocurrió un error inesperado, intentá de nuevo"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  // Al montar, restaurar sesión desde localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const openLogin = () => setIsLoginOpen(true)
  const closeLogin = () => setIsLoginOpen(false)

  const saveSession = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(traducirError(data.error) || "Error al iniciar sesión")
    }    

    saveSession(data.token, data.user)
    closeLogin()
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    })
  
    const data = await res.json()
    console.log("Error recibido:", data.error) // ← agregá esto
  
    if (!res.ok) {
      throw new Error(traducirError(data.error) || "Error al crear la cuenta")
    }
  
    // Ya no guardamos sesión ni cerramos el modal
    // El usuario debe verificar el email primero
    // Lanzamos el mensaje como señal para que el modal lo muestre en verde
    //throw new Error(data.message)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
  
  const updateUser = (newUser: User) => {
    setUser(newUser)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoginOpen,
        openLogin,
        closeLogin,
        login,
        register,
        logout,
        setUser: updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
