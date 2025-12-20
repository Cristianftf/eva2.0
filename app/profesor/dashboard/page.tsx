"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/context/auth.context"
import { useProfessorData } from "@/hooks/use-professor-data"
import { StatsCard } from "@/components/ui/stats-card"
import { LoadingState } from "@/components/ui/data-states"
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react"
import { useMemo, Suspense, lazy } from "react"

// Lazy loading de componentes pesados
const MisCursosProfesorTab = lazy(() => import("@/components/profesor/mis-cursos-profesor-tab").then(mod => ({ default: mod.MisCursosProfesorTab })))
const CrearCursoTab = lazy(() => import("@/components/profesor/crear-curso-tab").then(mod => ({ default: mod.CrearCursoTab })))
const InformesTab = lazy(() => import("@/components/profesor/informes-tab").then(mod => ({ default: mod.InformesTab })))
const SolicitudesInscripcionTab = lazy(() => import("@/components/profesor/solicitudes-inscripcion-tab").then(mod => ({ default: mod.SolicitudesInscripcionTab })))
const GestionMultimediaTab = lazy(() => import("@/components/profesor/gestion-multimedia-tab").then(mod => ({ default: mod.GestionMultimediaTab })))

export default function ProfesorDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const {
    cursos,
    estadisticas,
    loading: dataLoading
  } = useProfessorData()

  // Calcular estadísticas usando useMemo para optimización
  const stats = useMemo(() => {
    if (!cursos) return null

    return {
      misCursos: cursos.length,
      totalEstudiantes: 0, // TODO: Calcular desde estadísticas cuando estén disponibles
      cuestionariosCreados: 0, // TODO: Calcular desde estadísticas cuando estén disponibles
      promedioCalificaciones: estadisticas?.promedioCalificaciones || 0,
    }
  }, [cursos, estadisticas])

  // Mostrar loading mientras se carga la información del usuario
  if (authLoading || dataLoading) {
    return (
      <ProtectedRoute allowedRoles={["PROFESOR"]}>
        <DashboardLayout>
          <div className="space-y-8">
            <LoadingState message="Cargando dashboard del profesor..." />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // Verificar que user existe antes de mostrar el contenido
  if (!user) {
    return (
      <ProtectedRoute allowedRoles={["PROFESOR"]}>
        <DashboardLayout>
          <div className="space-y-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-muted-foreground">No se pudo cargar la información del usuario</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["PROFESOR"]}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Profesional de la Salud</h1>
            <p className="text-muted-foreground">Bienvenido, {user.nombre}. Gestiona tus programas de salud y pacientes</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Mis Programas"
              value={stats?.misCursos || 0}
              description="Programas activos"
              icon={BookOpen}
              loading={dataLoading}
            />

            <StatsCard
              title="Total Pacientes"
              value={stats?.totalEstudiantes || 0}
              description="Registrados en tus programas"
              icon={Users}
              loading={dataLoading}
            />

            <StatsCard
              title="Evaluaciones"
              value={stats?.cuestionariosCreados || 0}
              description="Seguimientos creados"
              icon={FileText}
              loading={dataLoading}
            />

            <StatsCard
              title="Mejora General"
              value={`${stats?.promedioCalificaciones || 0}%`}
              description="Progreso promedio"
              icon={TrendingUp}
              loading={dataLoading}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="mis-programas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="mis-programas">Mis Programas</TabsTrigger>
              <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
              <TabsTrigger value="recursos">Recursos</TabsTrigger>
              <TabsTrigger value="crear-programa">Crear Programa</TabsTrigger>
              <TabsTrigger value="seguimientos">Seguimientos</TabsTrigger>
            </TabsList>

            <TabsContent value="mis-programas" className="space-y-4">
              <Suspense fallback={<LoadingState message="Cargando programas..." />}>
                <MisCursosProfesorTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="solicitudes" className="space-y-4">
              <Suspense fallback={<LoadingState message="Cargando solicitudes..." />}>
                <SolicitudesInscripcionTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="recursos" className="space-y-4">
              <Suspense fallback={<LoadingState message="Cargando recursos..." />}>
                <GestionMultimediaTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="crear-programa" className="space-y-4">
              <Suspense fallback={<LoadingState message="Cargando formulario..." />}>
                <CrearCursoTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="seguimientos" className="space-y-4">
              <Suspense fallback={<LoadingState message="Cargando seguimientos..." />}>
                <InformesTab />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}