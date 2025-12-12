"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import { Loader2, Plus } from "lucide-react"

interface CrearCuestionarioModalProps {
  cursoId: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CrearCuestionarioModal({ cursoId, onSuccess, trigger }: CrearCuestionarioModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tiempoLimite: 30,
    intentosPermitidos: 1,
    notaMinima: 60,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo.trim()) return

    setLoading(true)

    try {
      const result = await cuestionariosService.create({
        ...formData,
        cursoId,
        activo: true,
        preguntas: [],
      })

      if (result.success) {
        setOpen(false)
        setFormData({
          titulo: "",
          descripcion: "",
          tiempoLimite: 30,
          intentosPermitidos: 1,
          notaMinima: 60,
        })
        onSuccess?.()
      } else {
        alert(result.error || "Error al crear cuestionario")
      }
    } catch (error) {
      alert("Error de conexión al crear cuestionario")
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Crear Cuestionario
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cuestionario</DialogTitle>
            <DialogDescription>
              Crea un cuestionario para evaluar a tus estudiantes
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Cuestionario</Label>
              <Input
                id="titulo"
                placeholder="Ej: Evaluación Final - Competencia Informacional"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el propósito y contenido del cuestionario"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tiempoLimite">Tiempo Límite (minutos)</Label>
                <Input
                  id="tiempoLimite"
                  type="number"
                  min="1"
                  max="300"
                  value={formData.tiempoLimite}
                  onChange={(e) => setFormData({ ...formData, tiempoLimite: parseInt(e.target.value) || 30 })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intentosPermitidos">Intentos Máximos</Label>
                <Select
                  value={formData.intentosPermitidos.toString()}
                  onValueChange={(value) => setFormData({ ...formData, intentosPermitidos: parseInt(value) })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 intento</SelectItem>
                    <SelectItem value="2">2 intentos</SelectItem>
                    <SelectItem value="3">3 intentos</SelectItem>
                    <SelectItem value="5">5 intentos</SelectItem>
                    <SelectItem value="-1">Intentos ilimitados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.titulo.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Cuestionario"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
