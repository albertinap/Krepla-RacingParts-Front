import type { Metadata } from 'next'
import { Geist, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ShoppingCart } from '@/components/shopping-cart'
import { LoginModal } from '@/components/login-modal'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist'
});

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-oswald'
});

export const metadata: Metadata = {
  title: 'Krepla Racing Parts | Repuestos y Accesorios para Motos',
  description: 'Tienda online de repuestos y accesorios para motos. Envío a todo el país. Productos de calidad.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon-logo-light.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-logo-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon-logo-light.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${oswald.variable} font-sans antialiased`}>
        <CartProvider>
          <AuthProvider>
            {children}
            <ShoppingCart />
            <LoginModal />
          </AuthProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
