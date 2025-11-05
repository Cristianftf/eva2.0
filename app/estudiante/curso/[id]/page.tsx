"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MediaPlayer } from "@/components/multimedia/media-player"
import { cursosService } from "@/lib/services/courses.service"
import { temasService } from "@/lib/services/temas.service"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import type { Curso, Tema, Cuestionario } from "@/lib/types"
import { ArrowLeft, FileText, Download, CheckCircle2, PlayCircle } from "lucide-react"

export default function CursoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const cursoId = params.id as string

  const [curso, setCurso] = useState<Curso | null>(null)
  const [temas, setTemas] = useState<Tema[]>([])
  const [cuestionarios, setCuestionarios] = useState<Cuestionario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progreso, setProgreso] = useState(0)
  const [multimediaSeleccionado, setMultimediaSeleccionado] = useState<{
    url: string
    tipo: "VIDEO" | "AUDIO"
    titulo: string
  } | null>(null)

  useEffect(() => {
    loadCursoData()
  }, [cursoId])

  const loadCursoData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [cursoResult, temasResult, cuestionariosResult] = await Promise.all([
        cursosService.getById(cursoId),
        temasService.getByCurso(cursoId),
        cuestionariosService.getByCurso(cursoId),
      ])

      if (cursoResult.success && cursoResult.data) {
        setCurso(cursoResult.data)
      } else {
        setError(cursoResult.error || "Error al cargar curso")
      }

      if (temasResult.success && temasResult.data) {
        setTemas(temasResult.data)
      }

      if (cuestionariosResult.success && cuestionariosResult.data) {
        setCuestionarios(cuestionariosResult.data)
      }

      // Simular progreso (en producción vendría del backend)
      setProgreso(45)
    } catch (err) {
      setError("Error al cargar datos del curso")
    }

    setLoading(false)
  }

  const reproducirMultimedia = (url: string, tipo: "VIDEO" | "AUDIO", titulo: string) => {
    setMultimediaSeleccionado({ url, tipo, titulo })
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2 text-balance">{curso.titulo}</CardTitle>
                <CardDescription className="text-base">{curso.descripcion}</CardDescription>
              </div>
              <Badge variant="default">Inscrito</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso del curso</span>
                <span className="font-medium">{progreso}%</span>
              </div>
              <Progress value={progreso} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {multimediaSeleccionado && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reproduciendo: {multimediaSeleccionado.titulo}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setMultimediaSeleccionado(null)}>
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MediaPlayer
                url={multimediaSeleccionado.url}
                tipo={multimediaSeleccionado.tipo}
                titulo={multimediaSeleccionado.titulo}
              />
            </CardContent>
          </Card>
        )}

        {/* Course Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Temas */}
            <Card>
              <CardHeader>
                <CardTitle>Contenido del Curso</CardTitle>
                <CardDescription>{temas.length} temas disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                {temas.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay temas disponibles aún</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {temas.map((tema, index) => (
                      <AccordionItem key={tema.id} value={tema.id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="text-left">{tema.titulo}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-4">
                            <p className="text-sm text-muted-foreground">{tema.descripcion}</p>

                            <div className="space-y-2">
                              <p className="text-sm font-medium">Recursos del tema:</p>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start bg-transparent"
                                  onClick={() =>
                                    reproducirMultimedia(
                                      `/api/multimedia/video-${tema.id}.mp4`,
                                      "VIDEO",
                                      `Video: ${tema.titulo}`,
                                    )
                                  }
                                >
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  Video: Introducción al tema
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start bg-transparent"
                                  onClick={() =>
                                    reproducirMultimedia(
                                      `/api/multimedia/audio-${tema.id}.mp3`,
                                      "AUDIO",
                                      `Audio: ${tema.titulo}`,
                                    )
                                  }
                                >
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  Audio: Explicación del tema
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Documento: Material de lectura
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                                  <Download className="mr-2 h-4 w-4" />
                                  Descargar recursos adicionales
                                </Button>
                              </div>
                            </div>

                            <Button className="w-full">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Marcar como completado
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cuestionarios */}
            <Card>
              <CardHeader>
                <CardTitle>Cuestionarios</CardTitle>
                <CardDescription>Evalúa tu conocimiento</CardDescription>
              </CardHeader>
              <CardContent>
                {cuestionarios.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay cuestionarios disponibles</p>
                ) : (
                  <div className="space-y-3">
                    {cuestionarios.map((cuestionario) => (
                      <Card key={cuestionario.id} className="border-2">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm">{cuestionario.titulo}</CardTitle>
                          <CardDescription className="text-xs">{cuestionario.descripcion}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/estudiante/cuestionario/${cuestionario.id}`)}
                          >
                            Iniciar Cuestionario
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Temas</span>
                  <span className="font-medium">{temas.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cuestionarios</span>
                  <span className="font-medium">{cuestionarios.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duración estimada</span>
                  <span className="font-medium">{temas.length * 2}h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
