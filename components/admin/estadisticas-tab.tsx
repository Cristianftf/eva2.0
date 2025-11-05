"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Users, BookOpen, Award } from "lucide-react"
import {
  estadisticasService,
  type EstadisticasGenerales,
  type ActividadReciente,
} from "@/lib/services/estadisticas.service"

export function EstadisticasTab() {
  const [stats, setStats] = useState<EstadisticasGenerales | null>(null)
  const [actividad, setActividad] = useState<ActividadReciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEstadisticas()
  }, [])

  const loadEstadisticas = async () => {
    setLoading(true)
    setError(null)

    const [statsResult, actividadResult] = await Promise.all([
      estadisticasService.getGenerales(),
      estadisticasService.getActividadReciente(),
    ])

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data)
    } else {
      setError(statsResult.error || "Error al cargar estadísticas")
    }

    if (actividadResult.success && actividadResult.data) {
      setActividad(actividadResult.data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Generales</CardTitle>
            <CardDescription>Resumen de actividad de la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Generales</CardTitle>
          <CardDescription>Resumen de actividad de la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nuevos Usuarios</p>
                <p className="text-2xl font-bold">+{stats?.nuevosUsuarios || 0}</p>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cursos Activos</p>
                <p className="text-2xl font-bold">{stats?.cursosActivos || 0}</p>
                <p className="text-xs text-muted-foreground">En progreso</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cuestionarios</p>
                <p className="text-2xl font-bold">{stats?.cuestionariosCompletados || 0}</p>
                <p className="text-xs text-muted-foreground">Completados</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas acciones en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {actividad.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay actividad reciente</p>
          ) : (
            <div className="space-y-4">
              {actividad.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      item.tipo === "curso"
                        ? "bg-green-500/10"
                        : item.tipo === "usuario"
                          ? "bg-blue-500/10"
                          : "bg-purple-500/10"
                    }`}
                  >
                    {item.tipo === "curso" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {item.tipo === "usuario" && <Users className="h-4 w-4 text-blue-500" />}
                    {item.tipo === "cuestionario" && <Award className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.descripcion}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.fecha).toLocaleString("es-ES")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
