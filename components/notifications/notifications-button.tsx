"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/context/auth.context"
import { notificacionesService } from "@/lib/services/notificaciones.service"
import type { Notificacion } from "@/lib/types"
import { Bell, Check, X, Loader2 } from "lucide-react"

interface NotificationsButtonProps {
  unreadCount?: number
}

export function NotificationsButton({ unreadCount: initialCount = 0 }: NotificationsButtonProps) {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [unreadCount, setUnreadCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open && user) {
      loadNotificaciones()
    }
  }, [open, user])

  const loadNotificaciones = async () => {
    if (!user) return

    setLoading(true)

    const result = await notificacionesService.getByUsuario(user.id)

    if (result.success && result.data) {
      setNotificaciones(result.data)
      setUnreadCount(result.data.filter((n) => !n.leida).length)
    }

    setLoading(false)
  }

  const handleMarcarLeida = async (id: string) => {
    const result = await notificacionesService.marcarLeida(id)

    if (result.success) {
      setNotificaciones(notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)))
      setUnreadCount(Math.max(0, unreadCount - 1))
    }
  }

  const handleMarcarTodasLeidas = async () => {
    if (!user) return

    const result = await notificacionesService.marcarTodasLeidas(user.id)

    if (result.success) {
      setNotificaciones(notificaciones.map((n) => ({ ...n, leida: true })))
      setUnreadCount(0)
    }
  }

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "CURSO":
        return "📚"
      case "MENSAJE":
        return "💬"
      case "EVALUACION":
        return "📝"
      case "SISTEMA":
        return "⚙️"
      default:
        return "🔔"
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarcarTodasLeidas}>
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${!notificacion.leida ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{getNotificationIcon(notificacion.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{notificacion.titulo}</p>
                        {!notificacion.leida && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => handleMarcarLeida(notificacion.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notificacion.mensaje}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notificacion.fechaCreacion).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
