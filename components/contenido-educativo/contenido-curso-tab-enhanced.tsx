"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { temasService, type CreateTemaDto } from "@/lib/services/temas.service"
import { multimediaService } from "@/lib/services/multimedia.service"
import { buildMediaUrl } from "@/lib/utils/media-urls"
import { contenidoEducativoService } from "@/lib/services/contenido-educativo.service"
import type { Tema, MultimediaItem } from "@/lib/types"
import type { ContenidoEducativo, TipoContenido } from "@/lib/types/contenido-educativo"
import { ContenidoEducativoViewer } from "./contenido-educativo-viewer"
import { Plus, Edit, Trash2, GripVertical, Upload, FileText, Image, Video, Music, BookOpen, Search, Shield, Database, Scissors } from "lucide-react"

interface ContenidoCursoTabEnhancedProps {
  cursoId: string
}

export function ContenidoCursoTabEnhanced({ cursoId }: ContenidoCursoTabEnhancedProps) {
  const [temas, setTemas] = useState<Tema[]>([])
  const [multimedia, setMultimedia] = useState<Record<string, MultimediaItem[]>>({})
  const [contenidoEducativo, setContenidoEducativo] = useState<ContenidoEducativo[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedTema, setSelectedTema] = useState<Tema | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  })
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
  })

  useEffect(() => {
    loadContenido()
  }, [cursoId])

  const loadContenido = async () => {
    setLoading(true)

    try {
      // Cargar temas
      const temasResult = await temasService.getByCurso(cursoId)
      if (temasResult.success && temasResult.data) {
        setTemas(temasResult.data)

        // Cargar multimedia para cada tema
        const multimediaData: Record<string, MultimediaItem[]> = {}
        for (const tema of temasResult.data) {
          const multimediaResult = await multimediaService.getByTema(tema.id.toString())
          if (multimediaResult.success && multimediaResult.data) {
            multimediaData[tema.id] = multimediaResult.data
          }
        }
        setMultimedia(multimediaData)
      }

      // Cargar contenido educativo de CI
      const contenidoResult = await contenidoEducativoService.obtenerContenidoPorCurso(Number(cursoId))
      if (contenidoResult.success && contenidoResult.data) {
        setContenidoEducativo(contenidoResult.data)
      }
    } catch (error) {
      console.error("Error loading contenido:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const temaData: CreateTemaDto = {
        ...formData,
        cursoId,
        orden: temas.length + 1,
      }

      const result = await temasService.create(temaData)

      if (result.success && result.data) {
        setTemas([...temas, result.data])
        setDialogOpen(false)
        setFormData({ titulo: "", descripcion: "" })
      } else {
        alert(result.error || "Error al crear tema")
      }
    } catch (error) {
      console.error("Error creating tema:", error)
      alert("Error de conexión al crear tema")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este tema?")) return

    try {
      const result = await temasService.delete(id)

      if (result.success) {
        setTemas(temas.filter((t) => t.id !== id))
      } else {
        alert(result.error || "Error al eliminar tema")
      }
    } catch (error) {
      console.error("Error deleting tema:", error)
      alert("Error de conexión al eliminar tema")
    }
  }

  const handleEditTema = (tema: Tema) => {
    setSelectedTema(tema)
    setFormData({
      titulo: tema.titulo,
      descripcion: tema.descripcion,
    })
    setEditDialogOpen(true)
  }

  const handleUpdateTema = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTema) return

    setSubmitting(true)

    try {
      const result = await temasService.update(selectedTema.id.toString(), {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        orden: selectedTema.orden,
        cursoId,
      })

      if (result.success && result.data) {
        setTemas(temas.map((t) => (t.id === selectedTema.id ? result.data! : t)))
        setEditDialogOpen(false)
        setSelectedTema(null)
        setFormData({ titulo: "", descripcion: "" })
      } else {
        alert(result.error || "Error al actualizar tema")
      }
    } catch (error) {
      console.error("Error updating tema:", error)
      alert("Error de conexión al actualizar tema")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUploadMultimedia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTema || !uploadData.file) return

    // Validar tipo de archivo
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const fileName = uploadData.file!.name.toLowerCase()
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt']
    const isAllowedType = allowedTypes.some(type => uploadData.file!.type.startsWith(type)) ||
                         allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isAllowedType) {
      alert("Tipo de archivo no permitido. Solo se permiten imágenes, videos, audio, PDFs, documentos Word y archivos de texto.")
      return
    }

    // Validar tamaño del archivo (máximo 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (uploadData.file.size > maxSize) {
      alert("El archivo es demasiado grande. El tamaño máximo permitido es 50MB.")
      return
    }

    setSubmitting(true)

    try {
      const result = await multimediaService.upload(uploadData.file, selectedTema.id.toString(), "documento")

      if (result.success && result.data) {
        setMultimedia({
          ...multimedia,
          [selectedTema.id]: [...(multimedia[selectedTema.id] || []), result.data],
        })
        setUploadDialogOpen(false)
        setSelectedTema(null)
        setUploadData({ file: null })
        alert("Archivo subido exitosamente")
      } else {
        alert(result.error || "Error al subir archivo")
      }
    } catch (error) {
      console.error("Error uploading multimedia:", error)
      alert("Error de conexión al subir archivo. Por favor, inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenUpload = (tema: Tema) => {
    setSelectedTema(tema)
    setUploadDialogOpen(true)
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

  const getIconForTipo = (tipoContenido: TipoContenido) => {
    switch (tipoContenido) {
      case 'OPERADORES_BOOLEANOS':
        return Search
      case 'CRAAP':
        return Shield
      case 'MOTORES_BUSQUEDA':
        return Database
      case 'TRUNCAMIENTOS':
        return Scissors
      case 'BASES_DATOS_CIENTIFICAS':
        return BookOpen
      default:
        return BookOpen
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="temas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="temas">Temas y Multimedia</TabsTrigger>
          <TabsTrigger value="contenido-educativo">Contenido de CI</TabsTrigger>
        </TabsList>

        <TabsContent value="temas" className="space-y-6">
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
                            disabled={submitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descripcion">Descripción</Label>
                          <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={3}
                            disabled={submitting}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? "Creando..." : "Crear Tema"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Dialog para editar tema */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogContent>
                    <form onSubmit={handleUpdateTema}>
                      <DialogHeader>
                        <DialogTitle>Editar Tema</DialogTitle>
                        <DialogDescription>Modifica la información del tema</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-titulo">Título del Tema</Label>
                          <Input
                            id="edit-titulo"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                            disabled={submitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-descripcion">Descripción</Label>
                          <Textarea
                            id="edit-descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={3}
                            disabled={submitting}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? "Actualizando..." : "Actualizar Tema"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Dialog para subir multimedia */}
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogContent>
                    <form onSubmit={handleUploadMultimedia}>
                      <DialogHeader>
                        <DialogTitle>Agregar Multimedia</DialogTitle>
                        <DialogDescription>Sube un archivo multimedia al tema</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="file">Archivo</Label>
                          <Input
                            id="file"
                            type="file"
                            onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                            required
                            disabled={submitting}
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                          />
                          <p className="text-xs text-muted-foreground">
                            Tipos soportados: imágenes, videos, audio, documentos (PDF, DOC, TXT)
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={submitting || !uploadData.file}
                        >
                          {submitting ? "Subiendo..." : "Subir Archivo"}
                        </Button>
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
                              <Button variant="outline" size="sm" onClick={() => handleOpenUpload(tema)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Agregar Multimedia
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditTema(tema)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(tema.id.toString())}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            {/* Mostrar multimedia del tema */}
                            {multimedia[tema.id] && multimedia[tema.id].length > 0 && (
                              <div className="mt-3 space-y-2">
                                <h5 className="text-sm font-medium">Archivos multimedia:</h5>
                                <div className="space-y-1">
                                  {multimedia[tema.id].map((item) => (
                                    <div key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                      {getMultimediaIcon(item.tipo || 'documento')}
                                      <span>{item.nombreArchivo || 'Archivo multimedia'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contenido-educativo" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contenido de Competencia Informacional</CardTitle>
                  <CardDescription>Módulos educativos especializados en CI</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Operadores Booleanos
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Evaluación CRAAP
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Motores de Búsqueda
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Scissors className="h-3 w-3" />
                    Truncamientos
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ContenidoEducativoViewer 
                cursoId={Number(cursoId)} 
                mostrarSoloActivos={true}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}