"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ContenidoEducativo } from "@/lib/types/contenido-educativo"
import { 
  Scissors, 
  Search, 
  FileText, 
  Lightbulb,
  Target,
  CheckCircle2,
  Star,
  RotateCcw,
  Play,
  BookOpen
} from "lucide-react"

interface TruncamientosViewerProps {
  contenido: ContenidoEducativo
}

interface SimulacionTruncamiento {
  terminoOriginal: string
  terminoTruncado: string
  resultados: string[]
  variacion: string
}

export function TruncamientosViewer({ contenido }: TruncamientosViewerProps) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [resultados, setResultados] = useState<SimulacionTruncamiento[]>([])

  const ejemplosTruncamiento = [
    {
      simbolo: "* (asterisco)",
      nombre: "Truncamiento estándar",
      descripcion: "Reemplaza uno o más caracteres al final de la palabra",
      ejemplos: [
        { termino: "educa*", variacion: "educación, educativo, educator, educators" },
        { termino: "comput*", variacion: "computer, computing, computation, computational" },
        { termino: "psic*", variacion: "psicología, psicológico, psicólogo" }
      ]
    },
    {
      simbolo: "? (signo de interrogación)",
      nombre: "Truncamiento opcional",
      descripcion: "Reemplaza cero o un carácter específico",
      ejemplos: [
        { termino: "wom?n", variacion: "woman, women" },
        { termino: "colo?r", variacion: "color, colour" },
        { termino: "organi?ation", variacion: "organization, organisation" }
      ]
    },
    {
      simbolo: "# (numeral)",
      nombre: "Truncamiento de un carácter",
      descripcion: "Reemplaza exactamente un carácter",
      ejemplos: [
        { termino: "defi#e", variacion: "define, defile, defixe" },
        { termino: "anal#ze", variacion: "analyze, analyse" },
        { termino: "organi#e", variacion: "organize, organise" }
      ]
    }
  ]

  const simulacionesEjemplo = [
    {
      original: "educación",
      truncado: "educa*",
      resultados: [
        "Educación en la era digital",
        "Metodologías educativas innovadoras",
        "Educativo y tecnológico",
        "Los educadores del siglo XXI",
        "Educación superior y calidad"
      ],
      variacion: "educación, educativo, educadores, educación"
    },
    {
      original: "computadora",
      truncado: "comput*",
      resultados: [
        "Computación cuántica",
        "Computer science fundamentals",
        "Computing algorithms",
        "Computational linguistics",
        "Los computadora y la sociedad"
      ],
      variacion: "computadora, computación, computer, computing, computational"
    },
    {
      original: "psicología",
      truncado: "psic*",
      resultados: [
        "Psicología educativa",
        "Psicológicos efectos",
        "Psicólogo clínico",
        "Psicologías comparadas",
        "Psicoanálisis moderno"
      ],
      variacion: "psicología, psicológico, psicólogo, psicologías, psicoanálisis"
    }
  ]

  const simularTruncamiento = (termino: string) => {
    const simulaciones = simulacionesEjemplo.filter(sim => 
      sim.original.toLowerCase().includes(termino.toLowerCase()) ||
      sim.truncado.toLowerCase().includes(termino.toLowerCase())
    ).map(sim => ({
      terminoOriginal: sim.original,
      terminoTruncado: sim.truncado,
      resultados: sim.resultados,
      variacion: sim.variacion
    }))
    setResultados(simulaciones)
  }

  const consejosTruncamiento = [
    {
      titulo: "Usa truncamiento con moderación",
      descripcion: "Un truncamiento muy amplio puede retornar demasiados resultados",
      ejemplo: "✓ 'comput*' vs ✗ 'c*'"
    },
    {
      titulo: "Combina con operadores booleanos",
      descripcion: "Mejora la precisión combinando truncamientos con AND/OR",
      ejemplo: "✓ 'comput* AND educa*' vs ✗ 'comput educa'"
    },
    {
      titulo: "Considera las variaciones lingüísticas",
      descripcion: "Algunas palabras tienen diferentes terminaciones según el contexto",
      ejemplo: "✓ 'organi#e' para organization/organisation"
    },
    {
      titulo: "Usa paréntesis para agrupar",
      descripcion: "Agrupa términos truncados complejos para mejor control",
      ejemplo: "✓ '(educa* OR teach*) AND (primary OR elementary)'"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header con información del módulo */}
      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
        <div className="flex items-center gap-2 mb-2">
          <Scissors className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Módulo: Truncamientos y Comodines</h3>
          <Badge variant="secondary">Avanzado</Badge>
        </div>
        <p className="text-orange-800 text-sm">
          Aprende a usar truncamientos y comodines para expandir tus búsquedas y encontrar más variantes de palabras.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contenido.contenidoHtml }} />
      </div>

      {/* Simulador de truncamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Simulador de Truncamientos
          </CardTitle>
          <CardDescription>
            Introduce un término y observa cómo el truncamiento expande los resultados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un término (ej: educación, computadora, psicología)..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && simularTruncamiento(terminoBusqueda)}
            />
            <Button onClick={() => simularTruncamiento(terminoBusqueda)} disabled={!terminoBusqueda}>
              <Play className="h-4 w-4 mr-2" />
              Simular
            </Button>
          </div>

          {resultados.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Resultados del Truncamiento:</h4>
              {resultados.map((simulacion, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {simulacion.terminoOriginal}
                      </code>
                      <span className="mx-2">→</span>
                      <code className="text-sm bg-orange-100 px-2 py-1 rounded">
                        {simulacion.terminoTruncado}
                      </code>
                    </div>
                    <Badge variant="outline">Variaciones: {simulacion.variacion}</Badge>
                  </div>
                  <ul className="space-y-1">
                    {simulacion.resultados.map((resultado, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {resultado}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tipos de truncamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Tipos de Truncamiento y Comodines
          </CardTitle>
          <CardDescription>
            Conoce los diferentes símbolos y sus funciones específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ejemplosTruncamiento.map((tipo, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-lg">
                    {tipo.simbolo}
                  </Badge>
                  {tipo.nombre}
                </CardTitle>
                <CardDescription>{tipo.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-3">
                  {tipo.ejemplos.map((ejemplo, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="text-center">
                        <code className="text-lg font-mono text-primary block mb-2">
                          {ejemplo.termino}
                        </code>
                        <p className="text-sm text-muted-foreground">
                          {ejemplo.variacion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Consejos para usar truncamientos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Consejos para Truncamiento Efectivo
          </CardTitle>
          <CardDescription>
            Mejora tus resultados con estas estrategias comprobadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {consejosTruncamiento.map((consejo, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  {consejo.titulo}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">{consejo.descripcion}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                  {consejo.ejemplo}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación de resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Comparación: Búsqueda Normal vs Truncada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ Búsqueda Normal</h4>
              <div className="p-4 border rounded-lg bg-red-50">
                <code className="block mb-2">educación</code>
                <p className="text-sm text-muted-foreground mb-2">
                  Solo encuentra exactamente "educación"
                </p>
                <ul className="text-sm space-y-1">
                  <li>• "La educación en España"</li>
                  <li>• "Historia de la educación"</li>
                  <li>• "Políticas de educación"</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✅ Con Truncamiento</h4>
              <div className="p-4 border rounded-lg bg-green-50">
                <code className="block mb-2">educa*</code>
                <p className="text-sm text-muted-foreground mb-2">
                  Encuentra todas las variaciones
                </p>
                <ul className="text-sm space-y-1">
                  <li>• "La educación en España"</li>
                  <li>• "Metodologías educativas"</li>
                  <li>• "Los educadores del siglo XXI"</li>
                  <li>• "Educación superior"</li>
                  <li>• "Educativo y tecnológico"</li>
                </ul>
              </div>
            </div>
          </div>
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
              <RotateCcw className="h-5 w-5" />
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

      {/* Consejos finales */}
      <Alert>
        <Scissors className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> No todos los motores de búsqueda usan los mismos símbolos de truncamiento. 
          Consulta la ayuda de cada motor para conocer sus convenciones específicas.
        </AlertDescription>
      </Alert>
    </div>
  )
}