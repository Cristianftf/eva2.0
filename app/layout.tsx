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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
