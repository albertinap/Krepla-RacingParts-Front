import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Paso 1: Autenticar con Medusa para obtener el JWT
    const authRes = await fetch(
      `${MEDUSA_BACKEND_URL}/auth/customer/emailpass`,
      {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
          },        
        body: JSON.stringify({ email, password }),
      }
    )

    if (!authRes.ok) {
      const error = await authRes.json()
      return NextResponse.json(
        { error: error.message || "Credenciales inválidas" },
        { status: authRes.status }
      )
    }

    const { token } = await authRes.json()

    // Paso 2: Obtener los datos del customer con el token
    const customerRes = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
      headers: {
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!customerRes.ok) {
      return NextResponse.json(
        { error: "Error al obtener datos del usuario" },
        { status: customerRes.status }
      )
    }

    const { customer } = await customerRes.json()

    return NextResponse.json({
      token,
      user: {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`.trim(),
        email: customer.email,
      },
    })
  } catch (err) {
    console.error("[LOGIN ERROR]", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}