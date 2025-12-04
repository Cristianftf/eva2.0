"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { informesService } from "@/lib/services/informes.service"
import { useAuth } from "@/lib/context/auth.context"
import { Award, Target, BookOpen, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

interface InformeData {
  estudianteId: number
  cursoId: number
  progreso: number
  calificacion: number
  competencias: Record<string, number>
  preguntasFalladas: Array<{
    pregunta: string
    respuestaUsuario: string
    respuestaCorrecta: string
    retroalimentacion: string
    enlaceLeccion: string
  }>
  recomendaciones: string[]
  fechaGeneracion: string
}

export default function InformeDetallePage() {
  const { estudianteId, cursoId } = useParams()
  const { user } = useAuth()
  const [informe, setInforme] = useState<InformeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (estudianteId && cursoId) {
      loadInforme()
    }
  }, [estudianteId, cursoId])

  const loadInforme = async () => {
    if (!estudianteId || !cursoId) return

    setLoading(true)
    setError(null)

    try {
      const result = await informesService.getInformeEstudiante(
        parseInt(estudianteId as string),
        parseInt(cursoId as string)
      )

      if (result.success && result.data) {
        setInforme(result.data)
      } else {
        setError("No se pudo cargar el informe")
      }
    } catch (err) {
      setError("Error al cargar el informe")
    } finally {
      setLoading(false)
    }
  }

  const getCompetenciaColor = (nivel: number) => {
    if (nivel >= 80) return "#22c55e" // verde
    if (nivel >= 60) return "#eab308" // amarillo
    return "#ef4444" // rojo
  }

  const getRadarData = () => {
    if (!informe?.competencias) return []
    return Object.entries(informe.competencias).map(([competencia, valor]) => ({
      competencia,
      valor,
      fullMark: 100
    }))
  }

  if (!user) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE", "PROFESOR", "ADMIN"]}>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE", "PROFESOR", "ADMIN"]}>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error || !informe) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE", "PROFESOR", "ADMIN"]}>
        <DashboardLayout>
          <Alert variant="destructive">
            <AlertDescription>{error || "Informe no encontrado"}</AlertDescription>
          </Alert>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["ESTUDIANTE", "PROFESOR", "ADMIN"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Informe de Competencia</h1>
            <p className="text-muted-foreground">
              Evaluación detallada de tus habilidades en Competencia Informacional
            </p>
          </div>

          {/* Métricas principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calificación General</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{informe.calificacion}%</div>
                <Badge variant={informe.calificacion >= 70 ? "default" : "destructive"}>
                  {informe.calificacion >= 70 ? "Aprobado" : "Necesita mejora"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso del Curso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{informe.progreso}%</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${informe.progreso}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Competencias Evaluadas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(informe.competencias).length}</div>
                <p className="text-xs text-muted-foreground">Subcompetencias CI</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Áreas de Mejora</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{informe.preguntasFalladas.length}</div>
                <p className="text-xs text-muted-foreground">Preguntas falladas</p>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart de Competencias */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Competencias</CardTitle>
              <CardDescription>
                Evaluación por subcompetencias de la Competencia Informacional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="competencia" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Nivel de Competencia"
                      dataKey="valor"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Preguntas Falladas */}
          {informe.preguntasFalladas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Preguntas que Necesitan Revisión
                </CardTitle>
                <CardDescription>
                  Analiza estas preguntas para mejorar tu comprensión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {informe.preguntasFalladas.map((pregunta, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">{pregunta.pregunta}</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Tu respuesta: </span>
                            <span className="text-red-600">{pregunta.respuestaUsuario}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Respuesta correcta: </span>
                            <span className="text-green-600">{pregunta.respuestaCorrecta}</span>
                          </div>
                        </div>
                      </div>
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>{pregunta.retroalimentacion}</AlertDescription>
                      </Alert>
                      <Button variant="outline" size="sm" asChild>
                        <a href={pregunta.enlaceLeccion}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Revisar Lección
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recomendaciones */}
          {informe.recomendaciones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendaciones Personalizadas
                </CardTitle>
                <CardDescription>
                  Plan de estudio sugerido basado en tu rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {informe.recomendaciones.map((recomendacion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{recomendacion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Informe generado el {new Date(informe.fechaGeneracion).toLocaleDateString('es-ES')}</p>
            <p className="mt-2">
              La Competencia Informacional es fundamental para el aprendizaje autónomo y la investigación efectiva.
              ¡Sigue practicando para mejorar tus habilidades!
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}