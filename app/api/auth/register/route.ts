import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Separar nombre y apellido (Medusa los pide por separado)
    const nameParts = (name as string).trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || "-"

    // Paso 1: Registrar las credenciales en Medusa (crea el auth identity)
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

    // El token JWT que devuelve Medusa tras el registro
    const { token } = await registerRes.json()

    // Paso 2: Crear el perfil del customer con nombre y email
    const customerRes = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        // El token del paso anterior autoriza la creación del customer
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
      }),
    })

    if (!customerRes.ok) {
      const error = await customerRes.json()
      return NextResponse.json(
        { error: error.message || "Error al crear perfil" },
        { status: customerRes.status }
      )
    }

    const { customer } = await customerRes.json()

    // Devolvemos el token y datos básicos del usuario al frontend
    return NextResponse.json({
      token,
      user: {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`.trim(),
        email: customer.email,
      },
    })
  } catch (err) {
    console.error("[REGISTER ERROR]", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}