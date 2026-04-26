import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/auth/customer/emailpass/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      }
    )
    
    const text = await res.text()
    console.log("[UPDATE PASSWORD] status:", res.status)
    console.log("[UPDATE PASSWORD] response:", text)
    
    let data: any = {}
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: `Respuesta inesperada del servidor: ${text.substring(0, 100)}` }, { status: 500 })
    }
    
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Token inválido o expirado" },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[UPDATE PASSWORD ERROR]", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}