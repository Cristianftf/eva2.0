"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth.context"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      // Redirigir según el rol del usuario
      switch (user.rol) {
        case "ADMIN":
          router.replace("/admin/dashboard")
          break
        case "PROFESOR":
          router.replace("/profesor/dashboard")
          break
        case "ESTUDIANTE":
          router.replace("/estudiante/dashboard")
          break
        default:
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
