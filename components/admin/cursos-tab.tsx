"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { coursesService } from "@/lib/services/courses.service"
import type { Curso } from "@/lib/types"
import { Search, Edit, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CursosTab() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadCursos()
  }, [])

  useEffect(() => {
    filterCursos()
  }, [searchTerm, cursos])

  const loadCursos = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await coursesService.getAllCourses()

      if (result.success && result.data) {
        setCursos(result.data)
      } else {
        setError(result.error || "Error al cargar cursos")
      }
    } catch (err) {
      setError("Error de conexión al cargar cursos")
      console.error("Error loading courses:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterCursos = () => {
    let filtered = cursos

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCursos(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return

    try {
      const result = await coursesService.deleteCourse(id)

      if (result.success) {
        setCursos(cursos.filter((c) => c.id !== id))
      } else {
        alert(result.error || "Error al eliminar curso")
      }
    } catch (err) {
      alert("Error de conexión al eliminar curso")
      console.error("Error deleting course:", err)
    }
  }

  const handleEditCurso = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCurso) return

    setSubmitting(true)

    try {
      const result = await coursesService.updateCourse(editingCurso.id, formData)

      if (result.success && result.data) {
        setCursos(cursos.map(c => c.id === editingCurso.id ? result.data! : c))
        setDialogOpen(false)
        setEditingCurso(null)
        resetForm()
      } else {
        alert(result.error || "Error al actualizar curso")
      }
    } catch (err) {
      alert("Error de conexión al actualizar curso")
      console.error("Error updating course:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
    })
  }

  const openEditDialog = (curso: Curso) => {
    setEditingCurso(curso)
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion || "",
    })
    setDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Cursos</CardTitle>
            <CardDescription>Administra todos los cursos de la plataforma</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCursos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron cursos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCursos.map((curso) => (
                    <TableRow key={curso.id}>
                      <TableCell className="font-medium">{curso.titulo}</TableCell>
                      <TableCell className="max-w-md truncate">{curso.descripcion}</TableCell>
                      <TableCell>
                        <Badge variant={curso.activo ? "default" : "secondary"}>
                          {curso.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(curso.fechaCreacion).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(curso)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(curso.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>Modifica la información del curso</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCurso}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
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
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}