"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cuestionariosService } from "@/lib/services/cuestionarios.service"
import { PreguntaFactory } from "@/components/preguntas/pregunta-factory"
import { TipoPregunta } from "@/lib/types/pregunta"
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Save, 
  X, 
  Check,
  AlertCircle,
  HelpCircle
} from "lucide-react"
import type { PreguntaData, RespuestaEstudiante } from "@/lib/types/pregunta"

interface GestionarPreguntasCuestionarioProps {
  cuestionarioId: string
  onSave?: () => void
}

interface PreguntaEditando {
  id: string | null
  texto: string
  tipo: TipoPregunta
  configuracionAdicional?: string
  opciones: Array<{
    id: string | number
    texto: string
    esCorrecta: boolean
  }>
}

export function GestionarPreguntasCuestionario({ cuestionarioId, onSave }: GestionarPreguntasCuestionarioProps) {
  const [preguntas, setPreguntas] = useState<PreguntaData[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editandoPregunta, setEditandoPregunta] = useState<PreguntaEditando | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarPreguntas()
  }, [cuestionarioId])

  const cargarPreguntas = async () => {
    setLoading(true)
    try {
      const result = await cuestionariosService.obtenerPreguntasDetalladas(Number(cuestionarioId))
      if (result.success && result.data) {
        setPreguntas(result.data)
      }
    } catch (error) {
      console.error('Error cargando preguntas:', error)
    } finally {
      setLoading(false)
    }
  }

  const iniciarNuevaPregunta = () => {
    setEditandoPregunta({
      id: null,
      texto: '',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      opciones: [
        { id: 1, texto: 'Opción A', esCorrecta: false },
        { id: 2, texto: 'Opción B', esCorrecta: false }
      ]
    })
    setDialogOpen(true)
  }

  const iniciarEdicionPregunta = (pregunta: PreguntaData) => {
    setEditandoPregunta({
      id: pregunta.id.toString(),
      texto: pregunta.texto,
      tipo: pregunta.tipo,
      configuracionAdicional: pregunta.configuracionAdicional,
      opciones: pregunta.opciones?.map(op => ({
        id: op.id,
        texto: op.texto,
        esCorrecta: op.esCorrecta
      })) || []
    })
    setDialogOpen(true)
  }

  const cancelarEdicion = () => {
    setEditandoPregunta(null)
    setDialogOpen(false)
  }

  const agregarOpcion = () => {
    if (!editandoPregunta) return
    
    const nuevoId = Math.max(...editandoPregunta.opciones.map(o => Number(o.id)), 0) + 1
    setEditandoPregunta({
      ...editandoPregunta,
      opciones: [
        ...editandoPregunta.opciones,
        { id: nuevoId, texto: '', esCorrecta: false }
      ]
    })
  }

  const eliminarOpcion = (id: number) => {
    if (!editandoPregunta) return
    
    setEditandoPregunta({
      ...editandoPregunta,
      opciones: editandoPregunta.opciones.filter(op => Number(op.id) !== id)
    })
  }

  const actualizarOpcion = (id: number, campo: string, valor: any) => {
    if (!editandoPregunta) return
    
    setEditandoPregunta({
      ...editandoPregunta,
      opciones: editandoPregunta.opciones.map(op => 
        Number(op.id) === id ? { ...op, [campo]: valor } : op
      )
    })
  }

  const marcarComoCorrecta = (id: number) => {
    if (!editandoPregunta) return
    
    // Para preguntas de opción múltiple, solo una puede ser correcta
    if (editandoPregunta.tipo === TipoPregunta.OPCION_MULTIPLE) {
      setEditandoPregunta({
        ...editandoPregunta,
        opciones: editandoPregunta.opciones.map(op => ({
          ...op,
          esCorrecta: Number(op.id) === id
        }))
      })
    } else {
      // Para otros tipos, permitir múltiples correctas
      setEditandoPregunta({
        ...editandoPregunta,
        opciones: editandoPregunta.opciones.map(op => 
          Number(op.id) === id ? { ...op, esCorrecta: !op.esCorrecta } : op
        )
      })
    }
  }

  const validarPregunta = (): string[] => {
    const errores = []
    
    if (!editandoPregunta?.texto.trim()) {
      errores.push('El texto de la pregunta es requerido')
    }
    
    if (!editandoPregunta?.opciones.length) {
      errores.push('Debe tener al menos una opción')
    }
    
    if (editandoPregunta?.opciones.some(op => !op.texto.trim())) {
      errores.push('Todas las opciones deben tener texto')
    }
    
    if (!editandoPregunta?.opciones.some(op => op.esCorrecta)) {
      errores.push('Debe marcar al menos una opción como correcta')
    }
    
    return errores
  }

  const guardarPregunta = async () => {
    if (!editandoPregunta) return
    
    const errores = validarPregunta()
    if (errores.length > 0) {
      alert('Errores en la pregunta:\n' + errores.join('\n'))
      return
    }
    
    setGuardando(true)
    try {
      // Aquí iría la lógica para guardar la pregunta
      // Por ahora simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editandoPregunta.id) {
        // Editar pregunta existente
        setPreguntas(prev => prev.map(p => 
          p.id.toString() === editandoPregunta.id 
            ? { ...p, texto: editandoPregunta.texto, tipo: editandoPregunta.tipo }
            : p
        ))
      } else {
        // Crear nueva pregunta
        const nuevaPregunta: PreguntaData = {
          id: Date.now().toString(),
          texto: editandoPregunta.texto,
          tipo: editandoPregunta.tipo,
          tipoDescripcion: editandoPregunta.tipo,
          opciones: editandoPregunta.opciones
        }
        setPreguntas(prev => [...prev, nuevaPregunta])
      }
      
      cancelarEdicion()
      onSave?.()
    } catch (error) {
      console.error('Error guardando pregunta:', error)
      alert('Error al guardar la pregunta')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarPregunta = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return
    
    try {
      // Aquí iría la lógica para eliminar del backend
      setPreguntas(prev => prev.filter(p => p.id.toString() !== id))
      onSave?.()
    } catch (error) {
      console.error('Error eliminando pregunta:', error)
      alert('Error al eliminar la pregunta')
    }
  }

  const moverPregunta = (index: number, direccion: 'up' | 'down') => {
    const newPreguntas = [...preguntas]
    const targetIndex = direccion === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newPreguntas.length) return
    
    [newPreguntas[index], newPreguntas[targetIndex]] = [newPreguntas[targetIndex], newPreguntas[index]]
    setPreguntas(newPreguntas)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando preguntas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Gestión de Preguntas
              </CardTitle>
              <CardDescription>
                Administra las preguntas de este cuestionario
              </CardDescription>
            </div>
            <Button onClick={iniciarNuevaPregunta}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Pregunta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {preguntas.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay preguntas</h3>
              <p className="text-muted-foreground mb-4">
                Agrega la primera pregunta para comenzar
              </p>
              <Button onClick={iniciarNuevaPregunta}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Pregunta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {preguntas.map((pregunta, index) => (
                <Card key={pregunta.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moverPregunta(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moverPregunta(index, 'down')}
                          disabled={index === preguntas.length - 1}
                        >
                          ↓
                        </Button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{pregunta.tipoDescripcion}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Pregunta {index + 1}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{pregunta.texto}</h4>
                        {pregunta.opciones && (
                          <div className="text-sm text-muted-foreground">
                            {pregunta.opciones.length} opciones
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => iniciarEdicionPregunta(pregunta)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminarPregunta(pregunta.id.toString())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar pregunta */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editandoPregunta?.id ? 'Editar Pregunta' : 'Nueva Pregunta'}
            </DialogTitle>
            <DialogDescription>
              Configura los detalles de la pregunta
            </DialogDescription>
          </DialogHeader>

          {editandoPregunta && (
            <div className="space-y-6">
              {/* Tipo de pregunta */}
              <div className="space-y-2">
                <Label>Tipo de Pregunta</Label>
                <Select
                  value={editandoPregunta.tipo}
                  onValueChange={(value) => setEditandoPregunta({
                    ...editandoPregunta,
                    tipo: value as TipoPregunta
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TipoPregunta.OPCION_MULTIPLE}>Opción Múltiple</SelectItem>
                    <SelectItem value={TipoPregunta.VERDADERO_FALSO}>Verdadero/Falso</SelectItem>
                    <SelectItem value={TipoPregunta.COMPLETAR_TEXTO}>Completar Texto</SelectItem>
                    <SelectItem value={TipoPregunta.ORDENAR_ELEMENTOS}>Ordenar Elementos</SelectItem>
                    <SelectItem value={TipoPregunta.ARRASTRAR_SOLTAR}>Arrastrar y Soltar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Texto de la pregunta */}
              <div className="space-y-2">
                <Label>Texto de la Pregunta</Label>
                <Textarea
                  value={editandoPregunta.texto}
                  onChange={(e) => setEditandoPregunta({
                    ...editandoPregunta,
                    texto: e.target.value
                  })}
                  placeholder="Escribe el texto de la pregunta..."
                  rows={3}
                />
              </div>

              {/* Opciones de respuesta */}
              {(editandoPregunta.tipo === TipoPregunta.OPCION_MULTIPLE || 
                editandoPregunta.tipo === TipoPregunta.VERDADERO_FALSO) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Opciones de Respuesta</Label>
                    <Button variant="outline" size="sm" onClick={agregarOpcion}>
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Opción
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {editandoPregunta.opciones.map((opcion) => (
                      <div key={opcion.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Input
                          value={opcion.texto}
                          onChange={(e) => actualizarOpcion(Number(opcion.id), 'texto', e.target.value)}
                          placeholder="Texto de la opción"
                          className="flex-1"
                        />
                        <Button
                          variant={opcion.esCorrecta ? "default" : "outline"}
                          size="sm"
                          onClick={() => marcarComoCorrecta(Number(opcion.id))}
                        >
                          {opcion.esCorrecta ? <Check className="h-4 w-4" /> : 'Marcar Correcta'}
                        </Button>
                        {editandoPregunta.opciones.length > 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => eliminarOpcion(Number(opcion.id))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validación visual */}
              {editandoPregunta && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Vista Previa</p>
                      <div className="mt-2">
                        <PreguntaFactory
                          pregunta={{
                            id: 'preview',
                            texto: editandoPregunta.texto,
                            tipo: editandoPregunta.tipo,
                            tipoDescripcion: editandoPregunta.tipo,
                            opciones: editandoPregunta.tipo === TipoPregunta.OPCION_MULTIPLE || editandoPregunta.tipo === TipoPregunta.VERDADERO_FALSO 
                              ? editandoPregunta.opciones.map(op => ({
                                  id: op.id,
                                  texto: op.texto,
                                  esCorrecta: op.esCorrecta
                                }))
                              : []
                          }}
                          onRespuestaSeleccionada={() => {}}
                          readonly={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={cancelarEdicion} disabled={guardando}>
              Cancelar
            </Button>
            <Button onClick={guardarPregunta} disabled={guardando}>
              {guardando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Pregunta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}