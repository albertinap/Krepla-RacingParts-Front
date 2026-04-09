import { NextRequest, NextResponse } from "next/server"
import { sendEmailVerification } from "@/lib/email"
import { SignJWT } from "jose"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret")

export async function POST(req: NextRequest) {  
  try {
    const { name, email, password, phone } = await req.json()

    const nameParts = (name as string).trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || "-"

    // Paso 1: Registrar credenciales en Medusa
    const registerRes = await fetch(
      `${MEDUSA_BACKEND_URL}/auth/customer/emailpass/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ email, password }),
      }
    )

    if (!registerRes.ok) {
      const error = await registerRes.json()
      return NextResponse.json(
        { error: error.message || "Error al registrar" },
        { status: registerRes.status }
      )
    }

    const { token } = await registerRes.json()

    // Paso 2: Crear perfil del customer
    const customerRes = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone }),
    })

    if (!customerRes.ok) {
      const error = await customerRes.json()
      return NextResponse.json(
        { error: error.message || "Error al crear perfil" },
        { status: customerRes.status }
      )
    }

    const { customer } = await customerRes.json()

    // Paso 3: Guardar email_verified: false en metadata
    await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ metadata: { email_verified: false } }),
    })
    /*// Paso 4: Generar token de verificación (expira en 24hs)
    const verifyToken = await new SignJWT({ email, customerId: customer.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    // Paso 5: Enviar email de verificación
    await sendEmailVerification(email, verifyToken)*/

    // No devolvemos token de sesión — el usuario debe verificar primero
    return NextResponse.json({
      message: "Cuenta creada. Revisá tu email para confirmarla.",
    })
  } catch (err) {
    console.error("[REGISTER ERROR]", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}