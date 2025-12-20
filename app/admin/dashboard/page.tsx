"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/context/auth.context"
import { useAdminData } from "@/hooks/use-admin-data"
import { StatsCard } from "@/components/ui/stats-card"
import { LoadingState } from "@/components/ui/data-states"
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react"
import { UsuariosTab } from "@/components/admin/usuarios-tab"
import { CursosTab } from "@/components/admin/cursos-tab"
import { RecursosTab } from "@/components/admin/recursos-tab"
import { EstadisticasTab } from "@/components/admin/estadisticas-tab"
import { useMemo } from "react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const {
    usuarios,
    cursos,
    recursos,
    estadisticasGlobales,
    loading: dataLoading
  } = useAdminData()

  // Calcular estadísticas usando useMemo para optimización
  const stats = useMemo(() => {
    if (!usuarios || !cursos || !recursos) return null

    return {
      totalUsuarios: usuarios.length,
      totalCursos: cursos.length,
      totalRecursos: recursos.length,
      usuariosActivos: usuarios.filter((u) => u.activo).length,
      actividadMensual: estadisticasGlobales?.actividadMensual || 0,
    }
  }, [usuarios, cursos, recursos, estadisticasGlobales])

  // Mostrar loading mientras se carga la información del usuario
  if (dataLoading) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <DashboardLayout>
          <div className="space-y-8">
            <LoadingState message="Cargando panel administrativo..." />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  // Verificar que user existe antes de mostrar el contenido
  if (!user) {
    return (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
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
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel Administrativo</h1>
          <p className="text-muted-foreground">Gestiona usuarios, cursos y recursos de la plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Usuarios"
            value={stats?.totalUsuarios || 0}
            description={`${stats?.usuariosActivos || 0} activos`}
            icon={Users}
            loading={dataLoading}
          />

          <StatsCard
            title="Total Cursos"
            value={stats?.totalCursos || 0}
            description="Cursos publicados"
            icon={BookOpen}
            loading={dataLoading}
          />

          <StatsCard
            title="Recursos"
            value={stats?.totalRecursos || 0}
            description="Recursos confiables"
            icon={FileText}
            loading={dataLoading}
          />

          <StatsCard
            title="Actividad"
            value={`+${stats?.actividadMensual || 0}%`}
            description="vs. mes anterior"
            icon={TrendingUp}
            loading={dataLoading}
          />
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
    </ProtectedRoute>
  )
}
