"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { coursesService } from "@/lib/services/courses.service"
import { multimediaService } from "@/lib/services/multimedia.service"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import { MediaPlayer } from "@/components/multimedia/media-player"
import type { Tema, MultimediaItem, Cuestionario } from "@/lib/types"
import { Play, FileText, Image, Video, Music, CheckCircle, Clock, BookOpen, X } from "lucide-react"

export default function CursoDetallePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [curso, setCurso] = useState<any>(null)
  const [temas, setTemas] = useState<Tema[]>([])
  const [multimedia, setMultimedia] = useState<Record<string, MultimediaItem[]>>({})
  const [cuestionarios, setCuestionarios] = useState<Cuestionario[]>([])
  const [inscripcion, setInscripcion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTema, setSelectedTema] = useState<Tema | null>(null)
  const [selectedMultimedia, setSelectedMultimedia] = useState<MultimediaItem | null>(null)
  const [showMediaPlayer, setShowMediaPlayer] = useState(false)
  const [showCuestionario, setShowCuestionario] = useState(false)
  const [selectedCuestionario, setSelectedCuestionario] = useState<any>(null)

  useEffect(() => {
    if (id && user) {
      loadCursoData()
    }
  }, [id, user])

  const loadCursoData = async () => {
    if (!id || !user) return

    setLoading(true)
    setError(null)

    try {
      // Cargar información del curso
      const cursoResult = await coursesService.getCourseById(id as string)
      if (!cursoResult.success || !cursoResult.data) {
        setError("Curso no encontrado")
        return
      }
      setCurso(cursoResult.data)

      // Verificar si el estudiante está inscrito y aprobado
      const inscripcionesResult = await coursesService.getInscripcionesByEstudiante(user.id)
      if (inscripcionesResult.success && inscripcionesResult.data) {
        const estudianteInscripcion = inscripcionesResult.data.find((i: any) => i.cursoId === parseInt(id as string))
        if (!estudianteInscripcion || estudianteInscripcion.estado !== 'APROBADA') {
          setError("No tienes acceso a este curso")
          return
        }
        setInscripcion(estudianteInscripcion)
      }

      // Cargar temas
      const temasResult = await coursesService.getCourseTopics(id as string)
      if (temasResult.success && temasResult.data) {
        setTemas(temasResult.data)

        // Cargar multimedia para cada tema
        const multimediaData: Record<string, MultimediaItem[]> = {}
        for (const tema of temasResult.data) {
          const multimediaResult = await multimediaService.getByTema(tema.id)
          if (multimediaResult.success && multimediaResult.data) {
            multimediaData[tema.id] = multimediaResult.data
          }
        }
        setMultimedia(multimediaData)
      }

      // Cargar cuestionarios del curso
      const cuestionariosResult = await cuestionariosService.getByCurso(id as string)
      if (cuestionariosResult.success && cuestionariosResult.data) {
        setCuestionarios(cuestionariosResult.data)
      }

    } catch (err) {
      setError("Error al cargar el curso")
    } finally {
      setLoading(false)
    }
  }

  const getMultimediaIcon = (tipo: string) => {
    switch (tipo) {
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "imagen":
        return <Image className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleVerMultimedia = (item: MultimediaItem) => {
    setSelectedMultimedia(item)
    setShowMediaPlayer(true)
  }

  const handleCloseMediaPlayer = () => {
    setShowMediaPlayer(false)
    setSelectedMultimedia(null)
  }

  const handleRealizarCuestionario = (cuestionario: any) => {
    setSelectedCuestionario(cuestionario)
    setShowCuestionario(true)
  }

  const handleCloseCuestionario = () => {
    setShowCuestionario(false)
    setSelectedCuestionario(null)
  }

  const handleMultimediaComplete = async () => {
    if (!selectedMultimedia || !user || !curso) return

    try {
      // Actualizar progreso del estudiante en este tema
      const nuevoProgreso = Math.min(100, (inscripcion?.progreso || 0) + 10) // Incrementar 10% por multimedia completado

      // Aquí podríamos llamar a un endpoint para actualizar el progreso
      // await coursesService.actualizarProgreso(curso.id, nuevoProgreso)

      console.log("Multimedia completado:", selectedMultimedia.nombreArchivo, "Nuevo progreso:", nuevoProgreso)

      // Mostrar notificación de completado
      alert(`¡Has completado "${selectedMultimedia.nombreArchivo}"!`)
    } catch (error) {
      console.error("Error al actualizar progreso:", error)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
        <DashboardLayout>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
        <DashboardLayout>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header del curso */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{curso?.titulo}</CardTitle>
                  <CardDescription className="text-lg mt-2">{curso?.descripcion}</CardDescription>
                </div>
                <Badge variant="secondary">En progreso</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso del curso</span>
                    <span>{inscripcion?.progreso || 0}%</span>
                  </div>
                  <Progress value={inscripcion?.progreso || 0} className="h-2" />
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{temas.length} temas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{cuestionarios.length} cuestionarios</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de temas */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Temas del curso</h3>
              {temas.map((tema, index) => {
                const temaCompletado = false; // TODO: Implementar lógica de completado
                return (
                  <Card
                    key={tema.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTema?.id === tema.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedTema(tema)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          temaCompletado ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{tema.titulo}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{tema.descripcion}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {multimedia[tema.id] && multimedia[tema.id].length > 0 && (
                              <span>📎 {multimedia[tema.id].length} multimedia</span>
                            )}
                            {cuestionarios.filter(q => q.temaId === tema.id).length > 0 && (
                              <span>📝 {cuestionarios.filter(q => q.temaId === tema.id).length} cuestionarios</span>
                            )}
                          </div>
                        </div>
                        {temaCompletado ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contenido del tema seleccionado */}
            <div className="space-y-6">
              {selectedTema ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{selectedTema.titulo}</h3>
                    <p className="text-muted-foreground">{selectedTema.descripcion}</p>
                  </div>

                  {/* Multimedia del tema */}
                  {multimedia[selectedTema.id] && multimedia[selectedTema.id].length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Contenido Multimedia
                        </CardTitle>
                        <CardDescription>
                          Material de aprendizaje para este tema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {multimedia[selectedTema.id].map((item, index) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                {getMultimediaIcon(item.tipo)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.nombreArchivo}</p>
                                <p className="text-sm text-muted-foreground capitalize">{item.tipo}</p>
                              </div>
                              <Button size="sm" onClick={() => handleVerMultimedia(item)}>
                                <Play className="h-4 w-4 mr-2" />
                                {item.tipo === 'video' ? 'Ver Video' : item.tipo === 'audio' ? 'Escuchar' : item.tipo === 'imagen' ? 'Ver Imagen' : 'Ver Archivo'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Cuestionarios relacionados */}
                  {cuestionarios.filter(q => q.temaId === selectedTema.id).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Evaluaciones
                        </CardTitle>
                        <CardDescription>
                          Cuestionarios para evaluar tu aprendizaje
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {cuestionarios.filter(q => q.temaId === selectedTema.id).map((cuestionario) => (
                            <div key={cuestionario.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{cuestionario.titulo}</h4>
                                <p className="text-sm text-muted-foreground">{cuestionario.descripcion}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>📝 {cuestionario.preguntas?.length || 0} preguntas</span>
                                  <span>⏱️ {cuestionario.duracionEstimada || 15} min</span>
                                </div>
                              </div>
                              <Button size="sm" className="ml-4" onClick={() => handleRealizarCuestionario(cuestionario)}>
                                <Play className="h-4 w-4 mr-2" />
                                Realizar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Si no hay contenido */}
                  {(!multimedia[selectedTema.id] || multimedia[selectedTema.id].length === 0) &&
                   cuestionarios.filter(q => q.temaId === selectedTema.id).length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Contenido en preparación</h3>
                        <p className="text-muted-foreground text-center">
                          El profesor está preparando el material para este tema
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Selecciona un tema</h3>
                    <p className="text-muted-foreground text-center">
                      Haz clic en un tema de la lista para ver su contenido y comenzar tu aprendizaje
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Modal del Cuestionario */}
        {showCuestionario && selectedCuestionario && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedCuestionario.titulo}</h3>
                <Button variant="ghost" size="icon" onClick={handleCloseCuestionario}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground">{selectedCuestionario.descripcion}</p>

                  {selectedCuestionario.preguntas && selectedCuestionario.preguntas.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCuestionario.preguntas.map((pregunta: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">{index + 1}. {pregunta.texto}</h4>
                          <div className="space-y-2">
                            {pregunta.opciones?.map((opcion: string, opcionIndex: number) => (
                              <label key={opcionIndex} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`pregunta-${index}`}
                                  value={opcion}
                                  className="text-primary"
                                />
                                <span className="text-sm">{opcion}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Este cuestionario aún no tiene preguntas configuradas.</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={handleCloseCuestionario}>
                      Cancelar
                    </Button>
                    <Button onClick={() => {
                      alert("Cuestionario enviado correctamente. ¡Buen trabajo!")
                      handleCloseCuestionario()
                    }}>
                      Enviar Respuestas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal del Media Player */}
        {showMediaPlayer && selectedMultimedia && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedMultimedia.nombreArchivo}</h3>
                <Button variant="ghost" size="icon" onClick={handleCloseMediaPlayer}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <MediaPlayer
                  url={`http://localhost:8080${selectedMultimedia.urlArchivo}`}
                  tipo={selectedMultimedia.tipo.toLowerCase() as "video" | "audio" | "imagen" | "documento"}
                  titulo={selectedMultimedia.nombreArchivo}
                  nombreArchivo={selectedMultimedia.nombreArchivo}
                  onComplete={handleMultimediaComplete}
                />
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}