import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/context/auth.context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EVA - Entorno Virtual de Aprendizaje",
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
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}