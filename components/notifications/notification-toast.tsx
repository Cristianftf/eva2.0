"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/auth.context"
import { notificacionesService } from "@/lib/services/notificaciones.service"
import { useToast } from "@/hooks/use-toast"

export function NotificationToast() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  useEffect(() => {
    if (!user) return

    // Verificar nuevas notificaciones cada 30 segundos
    const interval = setInterval(async () => {
      const result = await notificacionesService.getByUsuario(user.id)

      if (result.success && result.data) {
        const nuevas = result.data.filter((n) => !n.leida && new Date(n.fechaCreacion) > lastCheck)

        nuevas.forEach((notificacion) => {
          toast({
            title: notificacion.titulo,
            description: notificacion.mensaje,
          })
        })

        if (nuevas.length > 0) {
          setLastCheck(new Date())
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [user, lastCheck, toast])

  return null
}
