"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/context/auth.context"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import { estadisticasService } from "@/lib/services/estadisticas.service"
import { MisCursosTab } from "@/components/estudiante/mis-cursos-tab"
import { CursosDisponiblesTab } from "@/components/estudiante/cursos-disponibles-tab"
import { MisCalificacionesTab } from "@/components/estudiante/mis-calificaciones-tab"
import { BookOpen, Award, TrendingUp, Clock } from "lucide-react"

export default function EstudianteDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    cursosInscritos: 0,
    cursosCompletados: 0,
    progresoPromedio: 0,
    horasEstudio: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    if (!user) return

    setLoading(true)

    const [inscripcionesResult, statsResult] = await Promise.all([
      inscripcionesService.getByEstudiante(user.id),
      estadisticasService.getEstudiante(user.id),
    ])

    if (inscripcionesResult.success && inscripcionesResult.data) {
      const inscripciones = inscripcionesResult.data
      const completados = inscripciones.filter((i) => i.progreso === 100).length
      const promedioProgreso = inscripciones.reduce((acc, i) => acc + i.progreso, 0) / inscripciones.length || 0

      setStats({
        cursosInscritos: inscripciones.length,
        cursosCompletados: completados,
        progresoPromedio: Math.round(promedioProgreso),
        horasEstudio: 0,
      })
    }

    if (statsResult.success && statsResult.data) {
      setStats((prev) => ({
        ...prev,
        horasEstudio: statsResult.data.horasEstudio || 0,
      }))
    }

    setLoading(false)
  }

  if (user?.rol !== "ESTUDIANTE") {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>No tienes permisos para acceder a esta página</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Panel de Estudiante</h1>
          <p className="text-muted-foreground">Bienvenido, {user.nombre}. Aquí puedes ver tus cursos y progreso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cursosInscritos}</div>
              <p className="text-xs text-muted-foreground">Cursos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cursosCompletados}</div>
              <p className="text-xs text-muted-foreground">Cursos finalizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.progresoPromedio}%</div>
              <Progress value={stats.progresoPromedio} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas de Estudio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.horasEstudio}h</div>
              <p className="text-xs text-muted-foreground">Tiempo estimado</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mis-cursos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mis-cursos">Mis Cursos</TabsTrigger>
            <TabsTrigger value="disponibles">Cursos Disponibles</TabsTrigger>
            <TabsTrigger value="calificaciones">Mis Calificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="mis-cursos" className="space-y-4">
            <MisCursosTab />
          </TabsContent>

          <TabsContent value="disponibles" className="space-y-4">
            <CursosDisponiblesTab />
          </TabsContent>

          <TabsContent value="calificaciones" className="space-y-4">
            <MisCalificacionesTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
