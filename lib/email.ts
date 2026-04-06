import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordReset(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Recuperá tu contraseña",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Recuperar contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Restablecer contraseña</a>
        <p style="color: #666; font-size: 13px;">
          Si no solicitaste esto, podés ignorar este email.<br/>
          El enlace expira en 15 minutos.
        </p>
      </div>
    `,
  })
}

export async function sendEmailVerification(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verificar-email?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Confirmá tu cuenta",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Bienvenido a Krepla Racing Parts</h2>
        <p>Hacé click en el botón para confirmar tu cuenta.</p>
        <a href="${verifyUrl}" style="
          display: inline-block;
          background: #000;
          color: #fff;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Confirmar cuenta</a>
        <p style="color: #666; font-size: 13px;">
          Si no creaste una cuenta, podés ignorar este email.
        </p>
      </div>
    `,
  })
}