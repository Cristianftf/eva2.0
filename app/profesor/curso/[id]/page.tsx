"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { cursosService } from "@/lib/services/courses.service"
import { temasService } from "@/lib/services/temas.service"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import { ContenidoCursoTab } from "@/components/profesor/contenido-curso-tab"
import { EstudiantesCursoTab } from "@/components/profesor/estudiantes-curso-tab"
import { CuestionariosCursoTab } from "@/components/profesor/cuestionarios-curso-tab"
import type { Curso } from "@/lib/types"
import { ArrowLeft, Users, BookOpen, FileText } from "lucide-react"

export default function ProfesorCursoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const cursoId = params.id as string

  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    temas: 0,
    estudiantes: 0,
    cuestionarios: 0,
  })

  useEffect(() => {
    loadCursoData()
  }, [cursoId])

  const loadCursoData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [cursoResult, temasResult, inscripcionesResult] = await Promise.all([
        cursosService.getById(cursoId),
        temasService.getByCurso(cursoId),
        inscripcionesService.getByCurso(cursoId),
      ])

      if (cursoResult.success && cursoResult.data) {
        setCurso(cursoResult.data)
      } else {
        setError(cursoResult.error || "Error al cargar curso")
      }

      setStats({
        temas: temasResult.success && temasResult.data ? temasResult.data.length : 0,
        estudiantes: inscripcionesResult.success && inscripcionesResult.data ? inscripcionesResult.data.length : 0,
        cuestionarios: 0, // Se cargará en el tab correspondiente
      })
    } catch (err) {
      setError("Error al cargar datos del curso")
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !curso) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error || "Curso no encontrado"}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Mis Cursos
        </Button>

        {/* Course Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{curso.titulo}</CardTitle>
            <CardDescription className="text-base">{curso.descripcion}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temas</p>
                  <p className="text-xl font-bold">{stats.temas}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estudiantes</p>
                  <p className="text-xl font-bold">{stats.estudiantes}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cuestionarios</p>
                  <p className="text-xl font-bold">{stats.cuestionarios}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="contenido" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
            <TabsTrigger value="cuestionarios">Cuestionarios</TabsTrigger>
          </TabsList>

          <TabsContent value="contenido" className="space-y-4">
            <ContenidoCursoTab cursoId={cursoId} />
          </TabsContent>

          <TabsContent value="estudiantes" className="space-y-4">
            <EstudiantesCursoTab cursoId={cursoId} />
          </TabsContent>

          <TabsContent value="cuestionarios" className="space-y-4">
            <CuestionariosCursoTab cursoId={cursoId} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
