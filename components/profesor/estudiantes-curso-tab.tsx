"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import type { Inscripcion } from "@/lib/types"
import { Users, FileText, Loader2 } from "lucide-react"

interface EstudiantesCursoTabProps {
  cursoId: string
}

export function EstudiantesCursoTab({ cursoId }: EstudiantesCursoTabProps) {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEstudiantes()
  }, [cursoId])

  const loadEstudiantes = async () => {
    setLoading(true)

    const result = await inscripcionesService.getByCurso(cursoId)

    if (result.success && result.data) {
      setInscripciones(result.data)
    }

    setLoading(false)
  }

  const promedioProgreso =
    inscripciones.length > 0
      ? Math.round(inscripciones.reduce((acc, i) => acc + i.progreso, 0) / inscripciones.length)
      : 0

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inscripciones.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promedioProgreso}%</div>
            <Progress value={promedioProgreso} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inscripciones.filter((i) => i.progreso === 100).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>Estudiantes inscritos en este curso</CardDescription>
        </CardHeader>
        <CardContent>
          {inscripciones.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay estudiantes inscritos aún</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Fecha Inscripción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inscripciones.map((inscripcion) => (
                    <TableRow key={inscripcion.id}>
                      <TableCell className="font-medium">
                        {inscripcion.estudiante?.nombre} {inscripcion.estudiante?.apellido}
                      </TableCell>
                      <TableCell>{inscripcion.estudiante?.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={inscripcion.progreso} className="w-20" />
                          <span className="text-sm">{inscripcion.progreso}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(inscripcion.fechaInscripcion).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Ver Informe
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
