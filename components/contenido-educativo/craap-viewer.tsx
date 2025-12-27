"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContenidoEducativo } from "@/lib/types/contenido-educativo"
import { 
  Shield, 
  Clock, 
  Target, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  ExternalLink
} from "lucide-react"

interface CraapViewerProps {
  contenido: ContenidoEducativo
}

interface CriterioCRAAP {
  nombre: string
  descripcion: string
  icono: React.ComponentType<any>
  color: string
  preguntas: string[]
  ejemplos: string[]
}

export function CraapViewer({ contenido }: CraapViewerProps) {
  const [fuenteEvaluar, setFuenteEvaluar] = useState("")
  const [evaluacionActual, setEvaluacionActual] = useState({
    currency: 0,
    relevance: 0,
    authority: 0,
    accuracy: 0,
    purpose: 0
  })

  const criteriosCRAAP: CriterioCRAAP[] = [
    {
      nombre: "Currency (Actualidad)",
      descripcion: "¿Qué tan actual es la información?",
      icono: Clock,
      color: "text-blue-600",
      preguntas: [
        "¿Cuándo fue publicada la información?",
        "¿Ha sido revisada recientemente?",
        "¿Es apropiada para tu tema de investigación?",
        "¿Las fechas de publicación/revisión son válidas?"
      ],
      ejemplos: [
        "Un artículo científico publicado en 2023 para un tema de tecnología",
        "Un libro de texto de medicina de 2019 para procedimientos actuales",
        "Una página web sin fecha de actualización visible"
      ]
    },
    {
      nombre: "Relevance (Relevancia)",
      descripcion: "¿La información se relaciona con tu tema?",
      icono: Target,
      color: "text-green-600",
      preguntas: [
        "¿La información responde a tu pregunta de investigación?",
        "¿Es apropiada para tu nivel académico?",
        "¿Cubre el tema en suficiente profundidad?",
        "¿Te ayuda a desarrollar ideas adicionales?"
      ],
      ejemplos: [
        "Un artículo sobre IA para una tesis sobre machine learning",
        "Un documento básico para un curso introductorio",
        "Información muy técnica para un estudiante principiante"
      ]
    },
    {
      nombre: "Authority (Autoridad)",
      descripcion: "¿Quién es el autor y cuáles son sus credenciales?",
      icono: User,
      color: "text-purple-600",
      preguntas: [
        "¿Quién es el autor? ¿Cuáles son sus credenciales?",
        "¿Está afiliado con una institución reconocida?",
        "¿Tiene experiencia en el tema?",
        "¿Es citado por otros autores?"
      ],
      ejemplos: [
        "Un artículo por un PhD en la materia de una universidad reconocida",
        "Un blog personal sin credenciales académicas",
        "Un artículo revisado por pares en una revista científica"
      ]
    },
    {
      nombre: "Accuracy (Precisión)",
      descripcion: "¿Es confiable y verificable la información?",
      icono: CheckCircle,
      color: "text-red-600",
      preguntas: [
        "¿La información está respaldada por evidencia?",
        "¿Puedes verificar la información en otras fuentes?",
        "¿Hay errores de ortografía o gramática?",
        "¿Las conclusiones están bien fundamentadas?"
      ],
      ejemplos: [
        "Un artículo con referencias a fuentes primarias",
        "Un sitio web con múltiples fuentes citadas",
        "Información contradictoria con otras fuentes confiables"
      ]
    },
    {
      nombre: "Purpose (Propósito)",
      descripcion: "¿Para qué se creó esta información?",
      icono: Lightbulb,
      color: "text-yellow-600",
      preguntas: [
        "¿Cuál es el propósito de la información?",
        "¿Está tratando de vender, informar o persuadir?",
        "¿Hay sesgo en la información?",
        "¿Los hechos y opiniones están claramente separados?"
      ],
      ejemplos: [
        "Un artículo académico para informar sobre investigación",
        "Una página comercial para vender un producto",
        "Un artículo de opinión en un periódico"
      ]
    }
  ]

  const calcularPuntuacionTotal = () => {
    const puntuaciones = Object.values(evaluacionActual)
    const total = puntuaciones.reduce((sum, score) => sum + score, 0)
    return Math.round(total / puntuaciones.length)
  }

  const obtenerNivelEvaluacion = (puntuacion: number) => {
    if (puntuacion >= 4.5) return { nivel: "Excelente", color: "text-green-600", bgColor: "bg-green-100" }
    if (puntuacion >= 3.5) return { nivel: "Buena", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (puntuacion >= 2.5) return { nivel: "Aceptable", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    if (puntuacion >= 1.5) return { nivel: "Pobre", color: "text-orange-600", bgColor: "bg-orange-100" }
    return { nivel: "No Recomendada", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const puntuacionTotal = calcularPuntuacionTotal()
  const evaluacion = obtenerNivelEvaluacion(puntuacionTotal)

  return (
    <div className="space-y-6">
      {/* Header con información del módulo */}
      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Módulo: Evaluación CRAAP</h3>
          <Badge variant="secondary">Intermedio</Badge>
        </div>
        <p className="text-green-800 text-sm">
          Aprende a evaluar la calidad y confiabilidad de las fuentes de información usando los criterios CRAAP.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contenido.contenidoHtml }} />
      </div>

      {/* Criterios CRAAP explicados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Los 5 Criterios CRAAP
          </CardTitle>
          <CardDescription>
            Comprende cada criterio para evaluar fuentes de información
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {criteriosCRAAP.map((criterio, index) => (
                <TabsTrigger key={index} value={index.toString()} className="text-xs">
                  <criterio.icono className="h-4 w-4 mr-1" />
                  {criterio.nombre.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {criteriosCRAAP.map((criterio, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <criterio.icono className={`h-5 w-5 ${criterio.color}`} />
                      {criterio.nombre}
                    </CardTitle>
                    <CardDescription>{criterio.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Preguntas Clave:</h4>
                      <ul className="space-y-1">
                        {criterio.preguntas.map((pregunta, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {pregunta}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Ejemplos:</h4>
                      <ul className="space-y-1">
                        {criterio.ejemplos.map((ejemplo, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            {ejemplo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Simulador de evaluación CRAAP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Simulador de Evaluación CRAAP
          </CardTitle>
          <CardDescription>
            Evalúa una fuente de información usando los criterios CRAAP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              URL o título de la fuente a evaluar:
            </label>
            <Input
              placeholder="Ej: https://ejemplo.com/articulo-importante"
              value={fuenteEvaluar}
              onChange={(e) => setFuenteEvaluar(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {criteriosCRAAP.map((criterio, index) => {
              const campo = criterio.nombre.toLowerCase().split(' ')[0] as keyof typeof evaluacionActual
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <criterio.icono className={`h-4 w-4 ${criterio.color}`} />
                      {criterio.nombre}
                    </label>
                    <Badge variant="outline">{evaluacionActual[campo]}/5</Badge>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={evaluacionActual[campo]}
                      onChange={(e) => setEvaluacionActual({
                        ...evaluacionActual,
                        [campo]: parseInt(e.target.value)
                      })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Muy Pobre</span>
                      <span>Excelente</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resultado de la evaluación */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Resultado de la Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${evaluacion.color} mb-2`}>
                  {puntuacionTotal}/5
                </div>
                <Badge className={`${evaluacion.bgColor} ${evaluacion.color} text-sm`}>
                  {evaluacion.nivel}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso General</span>
                  <span>{Math.round((puntuacionTotal / 5) * 100)}%</span>
                </div>
                <Progress value={(puntuacionTotal / 5) * 100} className="h-2" />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Recomendación:</h4>
                <p className="text-sm">
                  {puntuacionTotal >= 4.5 && "Esta fuente es excelente y altamente recomendada para uso académico."}
                  {puntuacionTotal >= 3.5 && puntuacionTotal < 4.5 && "Esta fuente es buena pero considera complementarla con otras fuentes."}
                  {puntuacionTotal >= 2.5 && puntuacionTotal < 3.5 && "Esta fuente es aceptable pero úsala con precaución."}
                  {puntuacionTotal >= 1.5 && puntuacionTotal < 2.5 && "Esta fuente es pobre y no se recomienda para uso académico."}
                  {puntuacionTotal < 1.5 && "Esta fuente no es recomendada. Busca fuentes más confiables."}
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Ejemplos prácticos */}
      {contenido.ejemplos && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Ejemplos Prácticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">{contenido.ejemplos}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ejercicios */}
      {contenido.ejercicios && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ejercicios de Práctica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">{contenido.ejercicios}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consejos */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Consejo:</strong> Siempre evalúa múltiples fuentes y compara las evaluaciones CRAAP. 
          Una fuente sola raramente proporciona toda la información que necesitas.
        </AlertDescription>
      </Alert>
    </div>
  )
}