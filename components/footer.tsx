"use client"

import { Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-oswald)' }}>
                KREPLA
              </span>
              <span className="text-primary text-sm italic ml-1" style={{ fontFamily: 'var(--font-oswald)' }}>
                Racing Parts
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tu tienda online de repuestos y accesorios para motos y autos. Distribuidores oficiales de las mejores marcas.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/quienes-somos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/como-comprar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cómo Comprar
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Buenos Aires, Argentina</li>
              <li>Tel: +54 11 1234-5678</li>
              <li>ventas@krepla.com.ar</li>
              <li className="pt-2">
                <span className="text-foreground font-medium">Horario de Atención:</span>
                <br />
                Lun - Vie: 9:00 - 18:00
                <br />
                Sáb: 9:00 - 13:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2026 Krepla Racing Parts. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
