"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { temasService } from "@/lib/services/temas.service"
import type { Tema } from "@/lib/types"
import { Plus, Edit, Trash2, GripVertical, Upload } from "lucide-react"

interface ContenidoCursoTabProps {
  cursoId: string
}

export function ContenidoCursoTab({ cursoId }: ContenidoCursoTabProps) {
  const [temas, setTemas] = useState<Tema[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  })

  useEffect(() => {
    loadTemas()
  }, [cursoId])

  const loadTemas = async () => {
    setLoading(true)

    const result = await temasService.getByCurso(cursoId)

    if (result.success && result.data) {
      setTemas(result.data)
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await temasService.create({
      ...formData,
      cursoId,
      orden: temas.length + 1,
    })

    if (result.success && result.data) {
      setTemas([...temas, result.data])
      setDialogOpen(false)
      setFormData({ titulo: "", descripcion: "" })
    } else {
      alert(result.error || "Error al crear tema")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este tema?")) return

    const result = await temasService.delete(id)

    if (result.success) {
      setTemas(temas.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Temas del Curso</CardTitle>
              <CardDescription>Organiza el contenido en temas y lecciones</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Tema
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Nuevo Tema</DialogTitle>
                    <DialogDescription>Agrega un nuevo tema a tu curso</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título del Tema</Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Crear Tema</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {temas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No hay temas creados aún</p>
              <Button onClick={() => setDialogOpen(true)}>Crear Primer Tema</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {temas.map((tema, index) => (
                <Card key={tema.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{tema.titulo}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{tema.descripcion}</p>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Agregar Multimedia
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(tema.id)}>
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
    </div>
  )
}
