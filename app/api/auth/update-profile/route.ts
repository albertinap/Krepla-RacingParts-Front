import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

function traducirError(msg: string): string {
  const errores: Record<string, string> = {
    "Unauthorized": "Tu sesión expiró, volvé a iniciar sesión",
    "Not found": "No encontramos tu cuenta",
    "Customer with email already exists": "Ya existe una cuenta con ese email",
    "Email already exists": "Ya existe una cuenta con ese email",
    "invalid_type": "Hay un dato con formato incorrecto",
    "Invalid request": "Los datos enviados no son válidos",
  }
  for (const [key, value] of Object.entries(errores)) {
    if (msg.includes(key)) return value
  }
  return "Ocurrió un error al guardar los cambios, intentá de nuevo"
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, first_name, last_name, email, phone, shipping_addresses } = body

  if (!token) {
    return NextResponse.json({ error: "Tu sesión expiró, volvé a iniciar sesión" }, { status: 401 })
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ first_name, last_name, phone, shipping_addresses }),
  })

  const text = await res.text()

  if (!res.ok) {
    let msg = ""
    try { msg = JSON.parse(text).message || "" } catch {}
    console.error("[UPDATE PROFILE ERROR]", text)
    return NextResponse.json({ error: traducirError(msg) }, { status: 400 })
  }

  const data = JSON.parse(text)
  return NextResponse.json({ customer: data.customer })
}