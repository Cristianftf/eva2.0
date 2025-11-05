"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { notificacionesService } from "@/lib/services/notificaciones.service"
import type { Notificacion } from "@/lib/types"
import { Bell, Check, Trash2, Loader2 } from "lucide-react"

export default function NotificacionesPage() {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadNotificaciones()
    }
  }, [user])

  const loadNotificaciones = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    const result = await notificacionesService.getByUsuario(user.id)

    if (result.success && result.data) {
      setNotificaciones(result.data)
    } else {
      setError(result.error || "Error al cargar notificaciones")
    }

    setLoading(false)
  }

  const handleMarcarLeida = async (id: string) => {
    const result = await notificacionesService.marcarLeida(id)

    if (result.success) {
      setNotificaciones(notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)))
    }
  }

  const handleMarcarTodasLeidas = async () => {
    if (!user) return

    const result = await notificacionesService.marcarTodasLeidas(user.id)

    if (result.success) {
      setNotificaciones(notificaciones.map((n) => ({ ...n, leida: true })))
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta notificación?")) return

    const result = await notificacionesService.delete(id)

    if (result.success) {
      setNotificaciones(notificaciones.filter((n) => n.id !== id))
    }
  }

  const noLeidas = notificaciones.filter((n) => !n.leida)
  const leidas = notificaciones.filter((n) => n.leida)

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

  const NotificationCard = ({ notificacion }: { notificacion: Notificacion }) => (
    <Card className={!notificacion.leida ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{getNotificationIcon(notificacion.tipo)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold mb-1">{notificacion.titulo}</h4>
                <p className="text-sm text-muted-foreground mb-2">{notificacion.mensaje}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {notificacion.tipo}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notificacion.fechaCreacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {!notificacion.leida && (
                <Badge variant="destructive" className="flex-shrink-0">
                  Nueva
                </Badge>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              {!notificacion.leida && (
                <Button variant="outline" size="sm" onClick={() => handleMarcarLeida(notificacion.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Marcar como leída
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleEliminar(notificacion.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
            <p className="text-muted-foreground">Mantente al día con todas tus actualizaciones</p>
          </div>
          {noLeidas.length > 0 && (
            <Button onClick={handleMarcarTodasLeidas}>
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificaciones.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
              <Bell className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{noLeidas.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leídas</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{leidas.length}</div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="todas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="todas">Todas ({notificaciones.length})</TabsTrigger>
              <TabsTrigger value="no-leidas">No Leídas ({noLeidas.length})</TabsTrigger>
              <TabsTrigger value="leidas">Leídas ({leidas.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="todas" className="space-y-4">
              {notificaciones.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tienes notificaciones</p>
                  </CardContent>
                </Card>
              ) : (
                notificaciones.map((notificacion) => (
                  <NotificationCard key={notificacion.id} notificacion={notificacion} />
                ))
              )}
            </TabsContent>

            <TabsContent value="no-leidas" className="space-y-4">
              {noLeidas.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Check className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-muted-foreground">No tienes notificaciones sin leer</p>
                  </CardContent>
                </Card>
              ) : (
                noLeidas.map((notificacion) => <NotificationCard key={notificacion.id} notificacion={notificacion} />)
              )}
            </TabsContent>

            <TabsContent value="leidas" className="space-y-4">
              {leidas.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay notificaciones leídas</p>
                  </CardContent>
                </Card>
              ) : (
                leidas.map((notificacion) => <NotificationCard key={notificacion.id} notificacion={notificacion} />)
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
