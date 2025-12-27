"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ContenidoEducativo } from "@/lib/types/contenido-educativo"
import { 
  Search, 
  Plus, 
  Minus, 
  ArrowRight, 
  Lightbulb,
  BookOpen,
  Target,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Play
} from "lucide-react"

interface OperadoresBooleanosViewerProps {
  contenido: ContenidoEducativo
}

interface SimulacionOperador {
  consulta: string
  resultado: string[]
  operador: 'AND' | 'OR' | 'NOT'
}

export function OperadoresBooleanosViewer({ contenido }: OperadoresBooleanosViewerProps) {
  const [consulta, setConsulta] = useState("")
  const [resultados, setResultados] = useState<SimulacionOperador[]>([])
  const [consultasEjemplo] = useState([
    { consulta: "inteligencia artificial AND machine learning", operador: "AND" as const, descripcion: "Resultados que contengan ambos términos" },
    { consulta: "inteligencia OR artificial", operador: "OR" as const, descripcion: "Resultados que contengan cualquiera de los términos" },
    { consulta: "inteligencia NOT artificial", operador: "NOT" as const, descripcion: "Resultados que contengan inteligencia pero no artificial" },
    { consulta: "(inteligencia OR artificial) AND learning", operador: "Combinado" as const, descripcion: "Uso de paréntesis para agrupar" }
  ])

  const simularOperadores = (consultaEjemplo: string) => {
    // Simulación básica de resultados
    const simulaciones: SimulacionOperador[] = [
      {
        consulta: consultaEjemplo,
        operador: 'AND',
        resultado: [
          "Introducción a la Inteligencia Artificial y Machine Learning",
          "Algoritmos de Machine Learning en IA",
          "Deep Learning: Una aproximación a la IA"
        ]
      },
      {
        consulta: consultaEjemplo.replace(/AND|OR|NOT/g, 'OR'),
        operador: 'OR',
        resultado: [
          "Historia de la Inteligencia Artificial",
          "Técnicas de Machine Learning",
          "Aplicaciones de la Inteligencia Artificial",
          "Herramientas para Machine Learning"
        ]
      },
      {
        consulta: consultaEjemplo.replace(/AND|OR/g, 'NOT'),
        operador: 'NOT',
        resultado: [
          "Conceptos básicos de Inteligencia",
          "Fundamentos de Psicología Cognitiva"
        ]
      }
    ]

    setResultados(simulaciones)
  }

  return (
    <div className="space-y-6">
      {/* Header con información del módulo */}
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Módulo: Operadores Booleanos</h3>
          <Badge variant="secondary">Básico</Badge>
        </div>
        <p className="text-blue-800 text-sm">
          Aprende a usar los operadores AND, OR y NOT para mejorar tus búsquedas y obtener resultados más precisos.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contenido.contenidoHtml }} />
      </div>

      {/* Sección interactiva de operadores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Prueba los Operadores Booleanos
          </CardTitle>
          <CardDescription>
            Experimenta con diferentes operadores para ver cómo afectan los resultados de búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {consultasEjemplo.map((ejemplo, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={ejemplo.operador === 'Combinado' ? 'default' : 'outline'}>
                    {ejemplo.operador}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => simularOperadores(ejemplo.consulta)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Simular
                  </Button>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">
                  {ejemplo.consulta}
                </code>
                <p className="text-sm text-muted-foreground">{ejemplo.descripcion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados de simulación */}
      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resultados de la Simulación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultados.map((simulacion, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{simulacion.operador}</Badge>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {simulacion.consulta}
                    </code>
                  </div>
                  <ul className="space-y-1">
                    {simulacion.resultado.map((resultado, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {resultado}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <Target className="h-5 w-5" />
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

      {/* Consejos y mejores prácticas */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Consejo:</strong> Usa paréntesis para agrupar términos complejos: 
          <code className="mx-1 bg-gray-100 px-1 rounded">(term1 AND term2) OR term3</code>
        </AlertDescription>
      </Alert>
    </div>
  )
}