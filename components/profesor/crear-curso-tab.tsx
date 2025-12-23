"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { coursesService } from "@/lib/services/courses.service"
import { Loader2, BookOpen } from "lucide-react"

export function CrearCursoTab() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    objetivos: "",
    duracionEstimada: "",
    nivel: "principiante" as "principiante" | "intermedio" | "avanzado",
    categoria: "",
    prerrequisitos: "",
    resultadosAprendizaje: "",
    habilidades: "",
    idioma: "español",
    precio: "",
    imagenPortada: "",
    etiquetas: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await coursesService.createCourse({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        objetivos: formData.objetivos,
        duracionEstimada: formData.duracionEstimada ? parseInt(formData.duracionEstimada) : undefined,
        nivel: formData.nivel,
        categoria: formData.categoria,
        profesorId: user.id,
        activo: true,
        prerrequisitos: formData.prerrequisitos,
        resultadosAprendizaje: formData.resultadosAprendizaje,
        habilidades: formData.habilidades,
        idioma: formData.idioma,
        precio: formData.precio ? parseFloat(formData.precio) : undefined,
        imagenPortada: formData.imagenPortada,
        etiquetas: formData.etiquetas,
      })

      if (result.success && result.data) {
        setSuccess(true)
        setFormData({
          titulo: "",
          descripcion: "",
          objetivos: "",
          duracionEstimada: "",
          nivel: "principiante",
          categoria: "",
          prerrequisitos: "",
          resultadosAprendizaje: "",
          habilidades: "",
          idioma: "español",
          precio: "",
          imagenPortada: "",
          etiquetas: "",
        })

        // Redirigir al curso creado después de 2 segundos
        setTimeout(() => {
          if (result.data?.id) {
            router.push(`/profesor/curso/${result.data.id}`)
          }
        }, 2000)
      } else {
        setError(result.error || "Error al crear curso")
      }
    } catch (err) {
      setError("Error de conexión al crear curso")
      console.error("Error creating course:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Crear Nuevo Curso</CardTitle>
            <CardDescription>Completa la información básica de tu curso</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>Curso creado exitosamente. Redirigiendo para agregar contenido...</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Curso *</Label>
            <Input
              id="titulo"
              placeholder="Ej: Introducción a la Programación"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Curso *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe de qué trata tu curso, qué aprenderán los estudiantes..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={6}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Una buena descripción ayuda a los estudiantes a entender el valor de tu curso
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos del Curso</Label>
            <Textarea
              id="objetivos"
              placeholder="¿Qué lograrán los estudiantes al completar este curso?"
              value={formData.objetivos}
              onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración Estimada (horas)</Label>
              <Input
                id="duracion"
                type="number"
                placeholder="ej: 20"
                value={formData.duracionEstimada}
                onChange={(e) => setFormData({ ...formData, duracionEstimada: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivel">Nivel</Label>
              <select
                id="nivel"
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value as "principiante" | "intermedio" | "avanzado" })}
                className="w-full p-2 border rounded"
                disabled={loading}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              placeholder="ej: Programación, Matemáticas, Idiomas..."
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerrequisitos">Prerrequisitos</Label>
            <Textarea
              id="prerrequisitos"
              placeholder="¿Qué conocimientos previos necesitan los estudiantes?"
              value={formData.prerrequisitos}
              onChange={(e) => setFormData({ ...formData, prerrequisitos: e.target.value })}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultadosAprendizaje">Resultados de Aprendizaje</Label>
            <Textarea
              id="resultadosAprendizaje"
              placeholder="¿Qué serán capaces de hacer los estudiantes al finalizar?"
              value={formData.resultadosAprendizaje}
              onChange={(e) => setFormData({ ...formData, resultadosAprendizaje: e.target.value })}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="habilidades">Habilidades que se Desarrollarán</Label>
            <Textarea
              id="habilidades"
              placeholder="Lista las habilidades técnicas y blandas que aprenderán"
              value={formData.habilidades}
              onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma del Curso</Label>
              <select
                id="idioma"
                value={formData.idioma}
                onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                className="w-full p-2 border rounded"
                disabled={loading}
              >
                <option value="español">Español</option>
                <option value="ingles">Inglés</option>
                <option value="portugues">Portugués</option>
                <option value="frances">Francés</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio (opcional)</Label>
              <Input
                id="precio"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagenPortada">URL de Imagen de Portada</Label>
            <Input
              id="imagenPortada"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.imagenPortada}
              onChange={(e) => setFormData({ ...formData, imagenPortada: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="etiquetas">Etiquetas (separadas por comas)</Label>
            <Input
              id="etiquetas"
              placeholder="programación, javascript, web development..."
              value={formData.etiquetas}
              onChange={(e) => setFormData({ ...formData, etiquetas: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando curso...
                </>
              ) : (
                "Crear Curso"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                titulo: "",
                descripcion: "",
                objetivos: "",
                duracionEstimada: "",
                nivel: "principiante",
                categoria: "",
                prerrequisitos: "",
                resultadosAprendizaje: "",
                habilidades: "",
                idioma: "español",
                precio: "",
                imagenPortada: "",
                etiquetas: "",
              })}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Próximos pasos después de crear el curso:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Agregar temas y organizar el contenido</li>
              <li>Subir material multimedia (videos, documentos, etc.)</li>
              <li>Crear cuestionarios para evaluar a los estudiantes</li>
              <li>Publicar el curso para que los estudiantes puedan inscribirse</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}