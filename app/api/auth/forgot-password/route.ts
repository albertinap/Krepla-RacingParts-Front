import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY!

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 })
  }

  try {
    const medusaRes = await fetch(
      `${MEDUSA_BACKEND_URL}/auth/customer/emailpass/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ identifier: email }),
      }
    )

    // Siempre respondemos lo mismo por seguridad
    // (no revelar si el email existe o no)
    return NextResponse.json({
      message: "Si el email existe, te llegará un enlace en breve.",
    })
  } catch (err) {
    console.error("[FORGOT PASSWORD ERROR]", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}