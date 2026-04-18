import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

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

    // El email de bienvenida lo manda el subscriber de Medusa
    // automáticamente cuando se dispara el evento customer.created
    return NextResponse.json({
      message: "Cuenta creada exitosamente.",
    })
  } catch (err) {
    console.error("[REGISTER ERROR]", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}