import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export async function POST(req: NextRequest) {
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: data.message || "Token inválido o expirado" },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}