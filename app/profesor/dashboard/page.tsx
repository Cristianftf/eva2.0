"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { cursosService } from "@/lib/services/courses.service"
import { estadisticasService } from "@/lib/services/stats.service" // Importando el servicio de estadísticas
import { MisCursosProfesorTab } from "@/components/profesor/mis-cursos-profesor-tab"
import { CrearCursoTab } from "@/components/profesor/crear-curso-tab"
import { InformesTab } from "@/components/profesor/informes-tab"
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react"

export default function ProfesorDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    misCursos: 0,
    totalEstudiantes: 0,
    cuestionariosCreados: 0,
    promedioCalificaciones: 0,
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

    const [cursosResult, statsResult] = await Promise.all([
      cursosService.getByProfesor(user.id),
      estadisticasService.getProfesor(user.id),
    ])

    if (cursosResult.success && cursosResult.data) {
      setStats({
        misCursos: cursosResult.data.length,
        totalEstudiantes: cursosResult.data.reduce((acc, c) => acc + (c.estudiantesInscritos || 0), 0),
        cuestionariosCreados: cursosResult.data.reduce((acc, c) => acc + (c.cuestionarios?.length || 0), 0),
        promedioCalificaciones: 0,
      })
    }

    if (statsResult.success && statsResult.data) {
      setStats((prev) => ({
        ...prev,
        promedioCalificaciones: statsResult.data.promedioCalificaciones || 0,
      }))
    }

    setLoading(false)
  }

  if (user?.rol !== "PROFESOR") {
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
          <h1 className="text-3xl font-bold mb-2">Panel de Profesor</h1>
          <p className="text-muted-foreground">Bienvenido, {user.nombre}. Gestiona tus cursos y estudiantes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mis Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.misCursos}</div>
              <p className="text-xs text-muted-foreground">Cursos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEstudiantes}</div>
              <p className="text-xs text-muted-foreground">Inscritos en tus cursos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cuestionarios</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cuestionariosCreados}</div>
              <p className="text-xs text-muted-foreground">Evaluaciones creadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.promedioCalificaciones}</div>
              <p className="text-xs text-muted-foreground">Calificación promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mis-cursos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mis-cursos">Mis Cursos</TabsTrigger>
            <TabsTrigger value="crear-curso">Crear Curso</TabsTrigger>
            <TabsTrigger value="informes">Informes</TabsTrigger>
          </TabsList>

          <TabsContent value="mis-cursos" className="space-y-4">
            <MisCursosProfesorTab />
          </TabsContent>

          <TabsContent value="crear-curso" className="space-y-4">
            <CrearCursoTab />
          </TabsContent>

          <TabsContent value="informes" className="space-y-4">
            <InformesTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
