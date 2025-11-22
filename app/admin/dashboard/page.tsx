"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react"
import { UsuariosTab } from "@/components/admin/usuarios-tab"
import { CursosTab } from "@/components/admin/cursos-tab"
import { RecursosTab } from "@/components/admin/recursos-tab"
import { EstadisticasTab } from "@/components/admin/estadisticas-tab"
import { useAuth } from "@/lib/context/auth.context"
import { usuariosService } from "@/lib/services/usuarios.service"
import { coursesService } from "@/lib/services/courses.service"
import { recursosService } from "@/lib/services/recursos.service"
import { estadisticasService } from "@/lib/services/estadisticas.service"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalCursos: 0,
    totalRecursos: 0,
    usuariosActivos: 0,
    actividadMensual: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const [usuariosResult, cursosResult, recursosResult, statsResult] = await Promise.all([
        usuariosService.getAll(),
        coursesService.getAllCourses(),
        recursosService.getAll(),
        estadisticasService.getGenerales(),
      ])

      if (usuariosResult.success && usuariosResult.data) {
        setStats((prev) => ({
          ...prev,
          totalUsuarios: usuariosResult.data.length,
          usuariosActivos: usuariosResult.data.filter((u) => u.activo).length,
        }))
      }

      if (cursosResult.success && cursosResult.data) {
        setStats((prev) => ({
          ...prev,
          totalCursos: cursosResult.data.length,
        }))
      }

      if (recursosResult.success && recursosResult.data) {
        setStats((prev) => ({
          ...prev,
          totalRecursos: recursosResult.data.length,
        }))
      }

      if (statsResult.success && statsResult.data) {
        setStats((prev) => ({
          ...prev,
          actividadMensual: statsResult.data.actividadMensual,
        }))
      }
    } catch (err) {
      setError("Error al cargar estadísticas")
    }

    setLoading(false)
  }

  if (user?.rol !== "ADMIN") {
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
          <h1 className="text-3xl font-bold mb-2">Panel Administrativo</h1>
          <p className="text-muted-foreground">Gestiona usuarios, cursos y recursos de la plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
                  <p className="text-xs text-muted-foreground">{stats.usuariosActivos} activos</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalCursos}</div>
                  <p className="text-xs text-muted-foreground">Cursos publicados</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recursos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalRecursos}</div>
                  <p className="text-xs text-muted-foreground">Recursos confiables</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividad</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">+{stats.actividadMensual || 0}%</div>
                  <p className="text-xs text-muted-foreground">vs. mes anterior</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="cursos">Cursos</TabsTrigger>
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <UsuariosTab />
          </TabsContent>

          <TabsContent value="cursos" className="space-y-4">
            <CursosTab />
          </TabsContent>

          <TabsContent value="recursos" className="space-y-4">
            <RecursosTab />
          </TabsContent>

          <TabsContent value="estadisticas" className="space-y-4">
            <EstadisticasTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
