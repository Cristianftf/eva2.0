"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { recursosService } from "@/lib/services/recursos.service"
import type { RecursoConfiable } from "@/lib/types"
import { Plus, Edit, Trash2, Loader2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function RecursosTab() {
  const [recursos, setRecursos] = useState<RecursoConfiable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recursoToDelete, setRecursoToDelete] = useState<RecursoConfiable | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url: "",
    categoria: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingRecurso, setEditingRecurso] = useState<RecursoConfiable | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadRecursos()
  }, [])

  const loadRecursos = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await recursosService.getAll()

      if (result.success && result.data) {
        setRecursos(result.data)
      } else {
        setError(result.error || "Error al cargar recursos")
      }
    } catch (err) {
      setError("Error de conexión al cargar recursos")
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const result = editingRecurso
        ? await recursosService.update(editingRecurso.id, formData)
        : await recursosService.create(formData)

      if (result.success && result.data) {
        if (editingRecurso) {
          setRecursos(recursos.map(r => r.id === editingRecurso.id ? result.data! : r))
          toast({
            title: "Recurso actualizado",
            description: "El recurso ha sido actualizado correctamente.",
            variant: "default",
          })
        } else {
          setRecursos([...recursos, result.data])
          toast({
            title: "Recurso creado",
            description: "El nuevo recurso ha sido creado correctamente.",
            variant: "default",
          })
        }
        setDialogOpen(false)
        resetForm()
        setEditingRecurso(null)
      } else {
        toast({
          title: "Error",
          description: result.error || `Error al ${editingRecurso ? 'actualizar' : 'crear'} recurso`,
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    }

    setSubmitting(false)
  }

  const resetForm = () => {
    setFormData({ titulo: "", descripcion: "", url: "", categoria: "" })
  }

  const openEditDialog = (recurso: RecursoConfiable) => {
    setEditingRecurso(recurso)
    setFormData({
      titulo: recurso.titulo,
      descripcion: recurso.descripcion || "",
      url: recurso.url,
      categoria: recurso.categoria || "",
    })
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingRecurso(null)
    resetForm()
    setDialogOpen(true)
  }

  const handleDeleteClick = (recurso: RecursoConfiable) => {
    setRecursoToDelete(recurso)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!recursoToDelete) return

    setDeleting(true)
    try {
      const result = await recursosService.delete(recursoToDelete.id)

      if (result.success) {
        setRecursos(recursos.filter((r) => r.id !== recursoToDelete.id))
        toast({
          title: "Recurso eliminado",
          description: "El recurso ha sido eliminado correctamente.",
          variant: "default",
        })
        setDeleteDialogOpen(false)
        setRecursoToDelete(null)
      } else {
        toast({
          title: "Error al eliminar",
          description: result.error || "Error al eliminar recurso",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    }
    setDeleting(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Recursos Confiables</CardTitle>
            <CardDescription>Administra los recursos educativos de la plataforma</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Recurso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingRecurso ? "Editar Recurso" : "Crear Nuevo Recurso"}</DialogTitle>
                  <DialogDescription>
                    {editingRecurso ? "Modifica la información del recurso" : "Agrega un nuevo recurso educativo confiable"}
                  </DialogDescription>
                </DialogHeader>
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
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Input
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      placeholder="Ej: Documentación, Videos, Tutoriales"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingRecurso ? "Actualizando..." : "Creando..."}
                      </>
                    ) : (
                      editingRecurso ? "Actualizar Recurso" : "Crear Recurso"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                  <TableHead>Categoría</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recursos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay recursos disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  recursos.map((recurso) => (
                    <TableRow key={recurso.id}>
                      <TableCell className="font-medium">{recurso.titulo}</TableCell>
                      <TableCell>{recurso.categoria || "Sin categoría"}</TableCell>
                      <TableCell>
                        <a
                          href={recurso.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="max-w-xs truncate">{recurso.url}</span>
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(recurso)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(recurso)}>
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

        {/* Diálogo de confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar recurso?</AlertDialogTitle>
              <AlertDialogDescription>
                {recursoToDelete && (
                  <>
                    Estás a punto de eliminar el recurso <strong>"{recursoToDelete.titulo}"</strong>.
                    Esta acción no se puede deshacer.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setDeleteDialogOpen(false)
                setRecursoToDelete(null)
              }}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
