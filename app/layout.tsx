import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ShoppingCart } from '@/components/shopping-cart'
import { LoginModal } from '@/components/login-modal'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-oswald'
});

export const metadata: Metadata = {
  title: 'Krepla Racing Parts | Repuestos de Motos y Autos',
  description: 'Tienda online de repuestos y accesorios para motos y autos. Envío a todo el país. 3 cuotas sin interés.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
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
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased`}>
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
