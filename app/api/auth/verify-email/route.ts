import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret")

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    // Verificar y decodificar el token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const { email, customerId } = payload as { email: string; customerId: string }

    // Loguearse para obtener token de sesión
    // (necesitamos el token de Medusa para actualizar la metadata)
    // Usamos el admin API para actualizar la metadata sin necesitar la contraseña
    const adminRes = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/customers/${customerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Usamos la API key del admin — agregá MEDUSA_ADMIN_API_KEY al .env
          "x-medusa-access-token": process.env.MEDUSA_ADMIN_API_KEY!,
        },
        body: JSON.stringify({ metadata: { email_verified: true } }),
      }
    )

    if (!adminRes.ok) {
      return NextResponse.json({ error: "No pudimos verificar tu cuenta" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[VERIFY EMAIL ERROR]", err)
    return NextResponse.json(
      { error: "El enlace es inválido o ya expiró" },
      { status: 400 }
    )
  }
}