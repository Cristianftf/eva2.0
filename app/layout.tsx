import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SkipLinks } from "@/components/accessibility/skip-links"
import { ClientProviders } from "@/components/providers/client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduSearch - Entorno Virtual de Aprendizaje",
  description:
    "Plataforma educativa completa para gestión de cursos, cuestionarios y comunicación entre estudiantes y profesores",
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Meta tags para accesibilidad */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        {/* Skip Links para navegación rápida */}
        <SkipLinks
          links={[
            { href: "#main-content", label: "Ir al contenido principal" },
            { href: "#navigation", label: "Ir a la navegación" },
            { href: "#search", label: "Ir a la búsqueda" },
            { href: "#footer", label: "Ir al pie de página" }
          ]}
        />
        
        {/* Providers con React Query para cache */}
        <ClientProviders>
          <div id="root" className="min-h-screen flex flex-col">
            {/* Header con navegación principal */}
            <header role="banner" className="border-b">
              <nav
                id="navigation"
                role="navigation"
                aria-label="Navegación principal"
                className="container mx-auto px-4 py-3"
              >
                {/* Aquí iría el contenido del header */}
              </nav>
            </header>

            {/* Contenido principal */}
            <main
              id="main-content"
              role="main"
              className="flex-1"
              tabIndex={-1}
            >
              {children}
            </main>

            {/* Footer */}
            <footer
              id="footer"
              role="contentinfo"
              className="border-t mt-auto"
            >
              <div className="container mx-auto px-4 py-6">
                {/* Aquí iría el contenido del footer */}
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
