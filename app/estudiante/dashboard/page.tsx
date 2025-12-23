"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/context/auth.context"
import { useStudentData } from "@/hooks/use-student-data"
import { StatsCard } from "@/components/ui/stats-card"
import { LoadingState } from "@/components/ui/data-states"
import { MisCursosTab } from "@/components/estudiante/mis-cursos-tab"
import { CursosDisponiblesTab } from "@/components/estudiante/cursos-disponibles-tab"
import { MisCalificacionesTab } from "@/components/estudiante/mis-calificaciones-tab"
import { BookOpen, Award, TrendingUp, Clock } from "lucide-react"
import { useMemo } from "react"

export default function EstudianteDashboardPage() {
  const { user } = useAuth()
  const {
    cursosInscritos,
    estadisticas,
    loading: dataLoading
  } = useStudentData()

  // Calcular estadísticas usando useMemo para optimización
  const stats = useMemo(() => {
    if (!cursosInscritos) return null

    const completados = cursosInscritos.filter((i) => i.completado).length
    const promedioProgreso = cursosInscritos.reduce((acc, i) => acc + i.progreso, 0) / cursosInscritos.length || 0

    return {
      cursosInscritos: cursosInscritos.length,
      cursosCompletados: completados,
      progresoPromedio: Math.round(promedioProgreso),
      horasEstudio: estadisticas?.horasEstudio || 0,
    }
  }, [cursosInscritos, estadisticas])

  // Mostrar loading mientras se carga la información del usuario
  if (dataLoading) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
        <DashboardLayout>
          <div className="space-y-8">
            <LoadingState message="Cargando dashboard del estudiante..." />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // Verificar que user existe antes de mostrar el contenido
  if (!user) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
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
    <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
      <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Panel de Estudiante</h1>
          <p className="text-muted-foreground">Bienvenido, {user.nombre}. Aquí puedes ver tus cursos y progreso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Cursos Inscritos"
            value={stats?.cursosInscritos || 0}
            description="Cursos activos"
            icon={BookOpen}
            loading={dataLoading}
          />

          <StatsCard
            title="Completados"
            value={stats?.cursosCompletados || 0}
            description="Cursos finalizados"
            icon={Award}
            loading={dataLoading}
          />

          <StatsCard
            title="Progreso Promedio"
            value={`${stats?.progresoPromedio || 0}%`}
            description="Avance general"
            icon={TrendingUp}
            loading={dataLoading}
          />

          <StatsCard
            title="Horas de Estudio"
            value={`${stats?.horasEstudio || 0}h`}
            description="Tiempo estimado"
            icon={Clock}
            loading={dataLoading}
          />
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
    </ProtectedRoute>
  )
}
