"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, TrendingUp, Users } from "lucide-react"
import { informesService, type InformeCurso } from "@/lib/services/informes.service"
import { useAuth } from "@/lib/context/auth.context"

export function InformesTab() {
  const { user } = useAuth()
  const [informes, setInformes] = useState<InformeCurso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadInformes()
    }
  }, [user])

  const loadInformes = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    const result = await informesService.getProfesor(user.id)

    if (result.success && result.data) {
      setInformes(result.data)
    } else {
      setError(result.error || "Error al cargar informes")
    }

    setLoading(false)
  }

  const handleDescargarPDF = async (cursoId: string) => {
    console.log("[v0] Descargando informe PDF para curso:", cursoId)
    // TODO: Implementar descarga de PDF desde el backend
    alert("Funcionalidad de descarga de PDF en desarrollo")
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informes de Rendimiento</CardTitle>
          <CardDescription>Genera y descarga informes detallados de tus cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informes de Rendimiento</CardTitle>
          <CardDescription>Genera y descarga informes detallados de tus cursos</CardDescription>
        </CardHeader>
        <CardContent>
          {informes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay informes disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {informes.map((informe) => (
                <Card key={informe.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{informe.cursoTitulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          Generado el {new Date(informe.fechaGeneracion).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDescargarPDF(informe.cursoId)}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estudiantes</p>
                          <p className="text-xl font-bold">{informe.totalEstudiantes}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progreso Promedio</p>
                          <p className="text-xl font-bold">{informe.promedioProgreso}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Calificación Promedio</p>
                          <p className="text-xl font-bold">{informe.promedioCalificaciones}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progreso general del curso</span>
                        <span className="font-medium">{informe.promedioProgreso}%</span>
                      </div>
                      <Progress value={informe.promedioProgreso} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
