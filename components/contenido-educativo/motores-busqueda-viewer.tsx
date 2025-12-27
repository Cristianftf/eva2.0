"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContenidoEducativo } from "@/lib/types/contenido-educativo"
import { 
  Database, 
  Search, 
  Globe, 
  BookOpen, 
  FileText, 
  GraduationCap,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  Star,
  Users,
  Zap
} from "lucide-react"

interface MotoresBusquedaViewerProps {
  contenido: ContenidoEducativo
}

interface MotorBusqueda {
  nombre: string
  tipo: "General" | "Académico" | "Especializado"
  descripcion: string
  url: string
  caracteristicas: string[]
  icon: React.ComponentType<any>
  color: string
  ejemplos: { termino: string; resultado: string }[]
}

export function MotoresBusquedaViewer({ contenido }: MotoresBusquedaViewerProps) {
  const [consultaActiva, setConsultaActiva] = useState("")
  const [resultadosSimulados, setResultadosSimulados] = useState<any[]>([])

  const motoresBusqueda: MotorBusqueda[] = [
    {
      nombre: "Google Scholar",
      tipo: "Académico",
      descripcion: "Buscador especializado en literatura académica y científica",
      url: "https://scholar.google.com",
      caracteristicas: [
        "Solo contenido académico revisado por pares",
        "Citations y métricas de impacto",
        "Filtros por fecha, autor, revista",
        "Alertas personalizadas"
      ],
      icon: GraduationCap,
      color: "text-blue-600",
      ejemplos: [
        { termino: "machine learning education", resultado: "2,450,000 artículos académicos" },
        { termino: "inteligencia artificial", resultado: "1,890,000 artículos en español" }
      ]
    },
    {
      nombre: "PubMed",
      tipo: "Especializado",
      descripcion: "Base de datos biomédica de la National Library of Medicine",
      url: "https://pubmed.ncbi.nlm.nih.gov",
      caracteristicas: [
        "Literatura biomédica y de ciencias de la vida",
        "MeSH terms para búsqueda controlada",
        "Enlaces a texto completo",
        "Herramientas de gestión de referencias"
      ],
      icon: FileText,
      color: "text-green-600",
      ejemplos: [
        { termino: "artificial intelligence medicine", resultado: "45,000 artículos revisados por pares" },
        { termino: "machine learning diagnosis", resultado: "12,300 estudios clínicos" }
      ]
    },
    {
      nombre: "IEEE Xplore",
      tipo: "Especializado",
      descripcion: "Biblioteca digital de ingeniería y tecnología",
      url: "https://ieeexplore.ieee.org",
      caracteristicas: [
        "Literatura de ingeniería y tecnología",
        "Estándares IEEE",
        "Conferencias internacionales",
        "Contenido técnico avanzado"
      ],
      icon: Zap,
      color: "text-purple-600",
      ejemplos: [
        { termino: "neural networks", resultado: "78,000 publicaciones técnicas" },
        { termino: "artificial intelligence", resultado: "34,000 artículos de conferencias" }
      ]
    },
    {
      nombre: "ERIC",
      tipo: "Especializado",
      descripcion: "Education Resources Information Center",
      url: "https://eric.ed.gov",
      caracteristicas: [
        "Literatura educativa",
        "Tesis y disertaciones",
        "Informes de investigación educativa",
        "Recursos para educadores"
      ],
      icon: Users,
      color: "text-orange-600",
      ejemplos: [
        { termino: "informational literacy", resultado: "15,000 recursos educativos" },
        { termino: "digital literacy", resultado: "8,500 artículos de investigación" }
      ]
    },
    {
      nombre: "Google",
      tipo: "General",
      descripcion: "Buscador web general más utilizado mundialmente",
      url: "https://google.com",
      caracteristicas: [
        "Índice web más grande",
        "Búsqueda de imágenes, videos, noticias",
        "Búsqueda avanzada con operadores",
        "Resultados personalizados"
      ],
      icon: Globe,
      color: "text-red-600",
      ejemplos: [
        { termino: "competencia informacional", resultado: "890,000 páginas web" },
        { termino: "búsqueda académica", resultado: "1,200,000 resultados" }
      ]
    }
  ]

  const simularBusqueda = (termino: string) => {
    const resultados = motoresBusqueda.map(motor => ({
      motor: motor.nombre,
      tipo: motor.tipo,
      resultado: motor.ejemplos.find(e => e.termino.toLowerCase().includes(termino.toLowerCase()))?.resultado || "0 resultados",
      url: motor.url
    }))
    setResultadosSimulados(resultados)
  }

  const consejosBusqueda = [
    {
      titulo: "Usa términos específicos",
      descripcion: "En lugar de 'educación', usa 'competencia informacional en educación superior'",
      ejemplo: "✓ 'evaluación de fuentes digitales' vs ✗ 'fuentes'"
    },
    {
      titulo: "Combina términos clave",
      descripcion: "Usa operadores booleanos para refinar tu búsqueda",
      ejemplo: "✓ 'inteligencia artificial AND educación' vs ✗ 'inteligencia artificial educación'"
    },
    {
      titulo: "Filtra por fecha",
      descripcion: "Para temas actuales, limita los resultados a los últimos 5 años",
      ejemplo: "✓ 'machine learning' (2019-2024) vs ✗ 'machine learning' (sin límite)"
    },
    {
      titulo: "Usa sinónimos",
      descripcion: "Los términos pueden variar entre disciplinas y idiomas",
      ejemplo: "✓ 'informational literacy' OR 'information literacy'"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header con información del módulo */}
      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Módulo: Motores de Búsqueda</h3>
          <Badge variant="secondary">Intermedio</Badge>
        </div>
        <p className="text-purple-800 text-sm">
          Descubre diferentes motores de búsqueda y aprende a elegir el más adecuado para cada tipo de información.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contenido.contenidoHtml }} />
      </div>

      {/* Simulador de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Simulador de Búsqueda
          </CardTitle>
          <CardDescription>
            Introduce un término y observa cómo varía la búsqueda en diferentes motores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu término de búsqueda..."
              value={consultaActiva}
              onChange={(e) => setConsultaActiva(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && simularBusqueda(consultaActiva)}
            />
            <Button onClick={() => simularBusqueda(consultaActiva)} disabled={!consultaActiva}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {resultadosSimulados.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Resultados por Motor de Búsqueda:</h4>
              {resultadosSimulados.map((resultado, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{resultado.tipo}</Badge>
                    <span className="font-medium">{resultado.motor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{resultado.resultado}</span>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={resultado.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motores de búsqueda especializados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Motores de Búsqueda Especializados
          </CardTitle>
          <CardDescription>
            Conoce las mejores herramientas para cada tipo de información
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${motoresBusqueda.length}, 1fr)` }}>
              {motoresBusqueda.map((motor, index) => (
                <TabsTrigger key={index} value={index.toString()} className="text-xs">
                  <motor.icon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{motor.nombre.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {motoresBusqueda.map((motor, index) => (
              <TabsContent key={index} value={index.toString()}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <motor.icon className={`h-6 w-6 ${motor.color}`} />
                        {motor.nombre}
                        <Badge variant="outline">{motor.tipo}</Badge>
                      </CardTitle>
                      <Button size="sm" variant="outline" asChild>
                        <a href={motor.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visitar
                        </a>
                      </Button>
                    </div>
                    <CardDescription>{motor.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Características principales:</h4>
                      <ul className="space-y-1">
                        {motor.caracteristicas.map((caracteristica, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {caracteristica}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Ejemplos de búsqueda:</h4>
                      <div className="space-y-2">
                        {motor.ejemplos.map((ejemplo, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="font-mono text-sm">{ejemplo.termino}</span>
                            <span className="text-sm text-muted-foreground">{ejemplo.resultado}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Consejos de búsqueda avanzada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Consejos para Búsqueda Efectiva
          </CardTitle>
          <CardDescription>
            Mejora tus resultados con estas estrategias comprobadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {consejosBusqueda.map((consejo, index) => (
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
              <Search className="h-5 w-5" />
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
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Recuerda:</strong> No existe un único motor de búsqueda perfecto. 
          La clave está en conocer las fortalezas de cada uno y elegir el más apropiado para tu necesidad específica.
        </AlertDescription>
      </Alert>
    </div>
  )
}