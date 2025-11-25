"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth.context"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    console.log("Dashboard useEffect:", { loading, user: user ? { rol: user.rol, nombre: user.nombre } : null })
    if (!loading && user) {
      // Redirigir según el rol del usuario
      const rol = user.rol?.toUpperCase()
      switch (rol) {
        case "ADMIN":
          console.log("Redirigiendo a admin/dashboard")
          router.replace("/admin/dashboard")
          break
        case "PROFESOR":
          console.log("Redirigiendo a profesor/dashboard")
          router.replace("/profesor/dashboard")
          break
        case "ESTUDIANTE":
          console.log("Redirigiendo a estudiante/dashboard")
          router.replace("/estudiante/dashboard")
          break
        default:
          console.log("Rol desconocido, redirigiendo a login:", user.rol)
          router.replace("/auth/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirigiendo a tu panel...</p>
      </div>
    </div>
  )
}
