"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import type { Cuestionario } from "@/lib/types"
import { Plus, Edit, Trash2, FileText } from "lucide-react"

interface CuestionariosCursoTabProps {
  cursoId: string
}

export function CuestionariosCursoTab({ cursoId }: CuestionariosCursoTabProps) {
  const [cuestionarios, setCuestionarios] = useState<Cuestionario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCuestionarios()
  }, [cursoId])

  const loadCuestionarios = async () => {
    setLoading(true)

    const result = await cuestionariosService.getByCurso(cursoId)

    if (result.success && result.data) {
      setCuestionarios(result.data)
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cuestionario?")) return

    const result = await cuestionariosService.delete(id)

    if (result.success) {
      setCuestionarios(cuestionarios.filter((c) => c.id !== id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cuestionarios del Curso</CardTitle>
            <CardDescription>Crea evaluaciones para tus estudiantes</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Cuestionario
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {cuestionarios.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No hay cuestionarios creados</p>
            <Button>Crear Primer Cuestionario</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cuestionarios.map((cuestionario) => (
              <Card key={cuestionario.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{cuestionario.titulo}</h4>
                        <Badge variant="secondary">{cuestionario.preguntas?.length || 0} preguntas</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{cuestionario.descripcion}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Ver Resultados
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cuestionario.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
