"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail, Phone } from "lucide-react"

function SocialIconInstagram({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="mb-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Krepla Racing Parts"
                width={200}
                height={50}
                className="h-auto w-[200px] object-contain"
                priority
              />
            </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tu tienda online de repuestos y accesorios para motos. Distribuidores oficiales de las mejores marcas.
            </p>            
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
              
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/preguntas-frecuentes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li> 
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>             
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Bahía Blanca, Buenos Aires, Argentina</li>
              <li>Tel: 2915132747</li>
              <li>Email: krepla.racingparts@gmail.com</li>              
            </ul>
                      
            <div className="flex items-left gap-3 mt-3">            
              {/* Instagram */}
              <a href="https://instagram.com/tuusuario" target="_blank">
                <Instagram className="w-5 h-5" />
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/5492915132747" target="_blank">
                <Phone className="w-5 h-5" />
              </a>
              {/* Gmail */}
              <a href="mailto:krepla.racingparts@gmail.com">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2026 Krepla Racing Parts. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
