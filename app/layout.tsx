import type { Metadata } from 'next'
import { Geist, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ShoppingCart } from '@/components/shopping-cart'
import { LoginModal } from '@/components/login-modal'
import { Toaster } from "react-hot-toast"

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
        url: '/logo-simple.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-simple.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon-logo-light.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo-simple.png',
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
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
            },
          }} />
      </body>
    </html>
  )
}