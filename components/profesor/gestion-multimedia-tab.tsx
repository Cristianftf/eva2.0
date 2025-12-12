"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { multimediaService } from "@/lib/services/multimedia.service"
import { coursesService } from "@/lib/services/courses.service"
import { temasService } from "@/lib/services/temas.service"
import type { MultimediaItem, Tema } from "@/lib/types"
import { Upload, FileText, Image, Video, Music, Trash2, Download } from "lucide-react"

export function GestionMultimediaTab() {
  const { user } = useAuth()
  const [multimedia, setMultimedia] = useState<MultimediaItem[]>([])
  const [temas, setTemas] = useState<Tema[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    temaId: "",
    tipo: "documento",
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Cargar todos los archivos multimedia (para admin) o solo los del profesor
      const multimediaResult = await multimediaService.getAll()
      if (multimediaResult.success && multimediaResult.data) {
        // Filtrar por cursos del profesor si no es admin
        if (user.rol !== 'ADMIN') {
          const cursosResult = await coursesService.getCoursesByProfesor(user.id)
          if (cursosResult.success && cursosResult.data) {
            const cursoIds = cursosResult.data.map(c => c.id)
            const filteredMultimedia = multimediaResult.data.filter(item =>
              item.temaId && cursoIds.includes(item.temaId)
            )
            setMultimedia(filteredMultimedia)
          }
        } else {
          setMultimedia(multimediaResult.data)
        }
      }

      // Cargar temas para el formulario de subida (solo para profesores, no admin)
      if (user.rol !== 'ADMIN') {
        const cursosResult = await coursesService.getCoursesByProfesor(user.id)
        if (cursosResult.success && cursosResult.data) {
          const allTemas: Tema[] = []
          for (const curso of cursosResult.data) {
            // Usar el servicio de temas directamente para obtener temas del curso
            const temasResult = await temasService.getByCurso(curso.id.toString())
            if (temasResult.success && temasResult.data) {
              allTemas.push(...temasResult.data)
            }
          }
          setTemas(allTemas)
        }
      } else {
        // Para admin, cargar todos los temas disponibles
        const allTemasResult = await temasService.getAll()
        if (allTemasResult.success && allTemasResult.data) {
          setTemas(allTemasResult.data)
        }
      }

    } catch (err) {
      setError("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadData.file || !uploadData.temaId) return

    setUploading(true)

    try {
      const result = await multimediaService.upload(uploadData.file, uploadData.temaId, uploadData.tipo)

      if (result.success && result.data) {
        setMultimedia([...multimedia, result.data])
        setUploadData({ file: null, temaId: "", tipo: "documento" })
        alert("Archivo subido exitosamente")
      } else {
        alert(result.error || "Error al subir archivo")
      }
    } catch (error) {
      alert("Error al subir archivo")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este archivo multimedia?")) return

    try {
      const result = await multimediaService.delete(id)

      if (result.success) {
        setMultimedia(multimedia.filter(item => item.id !== id))
        alert("Archivo eliminado exitosamente")
      } else {
        alert(result.error || "Error al eliminar archivo")
      }
    } catch (error) {
      alert("Error al eliminar archivo")
    }
  }

  const getMultimediaIcon = (tipo: string) => {
    switch (tipo) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />
      case "audio":
        return <Music className="h-5 w-5 text-green-500" />
      case "imagen":
        return <Image className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Multimedia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Formulario de subida */}
      <Card>
        <CardHeader>
          <CardTitle>Subir Nuevo Archivo Multimedia</CardTitle>
          <CardDescription>
            Agrega archivos multimedia a los temas de tus cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file">Archivo</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                  required
                  disabled={uploading}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tema">Tema</Label>
                <Select
                  value={uploadData.temaId}
                  onValueChange={(value) => setUploadData({ ...uploadData, temaId: value })}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {temas.map((tema) => (
                      <SelectItem key={tema.id} value={tema.id}>
                        {tema.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Archivo</Label>
              <Select
                value={uploadData.tipo}
                onValueChange={(value) => setUploadData({ ...uploadData, tipo: value })}
                disabled={uploading}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documento">Documento</SelectItem>
                  <SelectItem value="imagen">Imagen</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={uploading || !uploadData.file || !uploadData.temaId}>
              {uploading ? "Subiendo..." : "Subir Archivo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de archivos multimedia */}
      <Card>
        <CardHeader>
          <CardTitle>Archivos Multimedia</CardTitle>
          <CardDescription>
            Gestiona todos los archivos multimedia de {user?.rol === 'ADMIN' ? 'todos los cursos' : 'tus cursos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {multimedia.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay archivos multimedia</h3>
              <p className="text-muted-foreground">
                Los archivos multimedia aparecerán aquí una vez que los subas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {multimedia.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getMultimediaIcon(item.tipo || 'documento')}
                    <div>
                      <h4 className="font-medium">{item.url || 'Archivo multimedia'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Tema ID: {item.temaId} | Tipo: {item.tipo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {item.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
