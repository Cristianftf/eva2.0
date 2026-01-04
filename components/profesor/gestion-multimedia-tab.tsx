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
import { buildMediaUrl } from "@/lib/utils/media-urls"
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
          const cursosResult = await coursesService.getCoursesByProfesor(String(user.id))
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
        const cursosResult = await coursesService.getCoursesByProfesor(String(user.id))
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

  // Validar tamaño de archivo (2GB para archivos grandes)
  const validateFileSize = (file: File): string | null => {
    const maxSize = 2147483648 // 2GB (2^31 bytes)
    if (file.size > maxSize) {
      const currentSizeGB = (file.size / 1024 / 1024 / 1024).toFixed(2)
      const maxSizeGB = (maxSize / 1024 / 1024 / 1024).toFixed(2)
      return `El archivo es demasiado grande. Tamaño máximo: ${maxSizeGB}GB. Tamaño actual: ${currentSizeGB}GB`
    }
    return null
  }

  // Validar tipo de archivo
  const validateFileType = (file: File): string | null => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg',
      'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido: ${file.type}`
    }
    return null
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadData.file || !uploadData.temaId) return

    // Validaciones
    const sizeError = validateFileSize(uploadData.file)
    if (sizeError) {
      setError(sizeError)
      return
    }

    const typeError = validateFileType(uploadData.file)
    if (typeError) {
      setError(typeError)
      return
    }

    setUploading(true)
    setError(null)

    try {
      const result = await multimediaService.upload(uploadData.file, uploadData.temaId, uploadData.tipo)

      if (result.success && result.data) {
        setMultimedia([...multimedia, result.data])
        setUploadData({ file: null, temaId: "", tipo: "documento" })
        alert("Archivo subido exitosamente")
      } else {
        setError(result.error || "Error al subir archivo")
      }
    } catch (error) {
      setError("Error al subir archivo: " + (error instanceof Error ? error.message : "Error desconocido"))
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

  const handleViewFile = (item: MultimediaItem) => {
    // Construir URL del archivo
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    const fileUrl = `${baseUrl}/api/multimedia/file/${item.id}`
    
    // Para imágenes, mostrar en una nueva ventana
    if (item.tipo === 'imagen') {
      window.open(fileUrl, '_blank', 'width=800,height=600')
    } else {
      // Para otros tipos, descargar
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = item.nombreArchivo || 'archivo'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setUploadData({ ...uploadData, file })
                    setError(null) // Limpiar errores previos
                  }}
                  required
                  disabled={uploading}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.avi,.mov,.wmv,.flv,.mkv,.aac,.flac,.m4a,.bmp,.svg,.webp"
                />
                {uploadData.file && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>Archivo seleccionado: {uploadData.file.name}</p>
                    <p>Tamaño: {(uploadData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Tipo: {uploadData.file.type}</p>
                  </div>
                )}
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
                      <SelectItem key={String(tema.id)} value={String(tema.id)}>
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
                  <SelectItem key="tipo-documento" value="documento">Documento</SelectItem>
                  <SelectItem key="tipo-imagen" value="imagen">Imagen</SelectItem>
                  <SelectItem key="tipo-video" value="video">Video</SelectItem>
                  <SelectItem key="tipo-audio" value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              disabled={uploading || !uploadData.file || !uploadData.temaId}
              className="w-full md:w-auto"
            >
              {uploading ? "Subiendo..." : "Subir Archivo"}
            </Button>
            {uploading && (
              <div className="text-sm text-muted-foreground mt-2">
                <p>⏳ Subiendo archivo... Esto puede tomar varios minutos para archivos grandes (máximo 2GB).</p>
              </div>
            )}
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
                      <h4 className="font-medium">{item.nombreArchivo || 'Archivo multimedia'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Tema ID: {item.temaId} | Tipo: {item.tipo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {item.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewFile(item)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {item.tipo === 'imagen' ? 'Ver' : 'Descargar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(String(item.id))}
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
