'use client'

import { useState, useEffect } from 'react'
import { MainNav } from '@/components/layout/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Brain, 
  Target, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Award,
  Lightbulb,
  ArrowRight
} from 'lucide-react'

interface SimulacionResultado {
  id: number
  titulo: string
  descripcion: string
  autores: string
  fechaPublicacion: string
  fuente: string
  relevante: boolean
  puntuacionRelevancia: number
  terminosEncontrados: string
}

interface SimulacionData {
  id: number
  titulo: string
  consultaUsuario: string
  consultaParsed: string
  retroalimentacion: string
  puntuacion: number
  tiempoSegundos: number
  fechaSimulacion: string
  nivelDificultad: string
  categoria: string
  totalResultados: number
  resultadosRelevantes: number
  operadoresDetectados: string
  resultados: SimulacionResultado[]
}

export default function SimuladorBusquedaPage() {
  const [consulta, setConsulta] = useState('')
  const [categoria, setCategoria] = useState('MEDICINA')
  const [nivel, setNivel] = useState('BASICO')
  const [simulacion, setSimulacion] = useState<SimulacionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [ejemplos, setEjemplos] = useState<string[]>([])
  const [usuarioId] = useState(1) // ID del usuario actual

  useEffect(() => {
    loadEjemplos()
    loadEstadisticas()
  }, [nivel])

  const loadEjemplos = async () => {
    try {
      // Simulación de ejemplos - en producción sería una llamada API
      const ejemplosSimulados = {
        BASICO: [
          "terapia depresión",
          "inteligencia artificial", 
          "diabetes complicaciones",
          "ansiedad estudiantes"
        ],
        INTERMEDIO: [
          "terapia AND depresión",
          "inteligencia artificial AND diagnóstico",
          "diabetes AND complicaciones NOT tipo 1",
          "ansiedad OR estrés AND estudiantes"
        ],
        AVANZADO: [
          "(terapia OR tratamiento) AND depresión AND efectividad",
          "(inteligencia artificial OR machine learning) AND diagnóstico NOT experimental",
          "diabetes AND (complicaciones OR efectos) AND tratamiento NOT pediátrico",
          "(ansiedad OR estrés) AND (estudiantes OR universitarios) AND (rendimiento OR académico)"
        ]
      }
      setEjemplos(ejemplosSimulados[nivel as keyof typeof ejemplosSimulados] || [])
    } catch (err) {
      console.error('Error cargando ejemplos:', err)
    }
  }

  const loadEstadisticas = async () => {
    try {
      // Simulación de estadísticas - en producción sería una llamada API
      setEstadisticas({
        totalSimulaciones: 12,
        puntuacionPromedio: 78.5,
        operadoresUsados: { "AND": 8, "OR": 6, "NOT": 4 },
        categoriasPracticas: { "MEDICINA": 5, "TECNOLOGIA": 4, "PSICOLOGIA": 3 }
      })
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
    }
  }

  const ejecutarSimulacion = async () => {
    if (!consulta.trim()) {
      setError('Por favor ingresa una consulta de búsqueda')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulación de resultado - en producción sería una llamada API real
      const resultadoSimulado: SimulacionData = {
        id: 1,
        titulo: `Búsqueda: ${consulta}`,
        consultaUsuario: consulta,
        consultaParsed: `Términos: ${consulta.split(' ')}, Operadores: AND`,
        retroalimentacion: `
          <div class="space-y-2">
            <p><strong>✅ Bien hecho:</strong> Estás usando operadores booleanos para refinar tu búsqueda.</p>
            <p>✅ El uso de <strong>AND</strong> ayuda a enfocar la búsqueda en términos específicos.</p>
            <br>
            <strong>Análisis de resultados:</strong><br>
            • Total de resultados: 4<br>
            • Resultados relevantes: 3 (75.0% de precisión)<br>
            <br>
            <p>🎉 <strong>Excelente:</strong> Tu estrategia de búsqueda es muy efectiva.</p>
          </div>
        `,
        puntuacion: 0.85,
        tiempoSegundos: 45,
        fechaSimulacion: new Date().toISOString(),
        nivelDificultad: nivel,
        categoria: categoria,
        totalResultados: 4,
        resultadosRelevantes: 3,
        operadoresDetectados: "AND",
        resultados: [
          {
            id: 1,
            titulo: "Efectividad de la terapia cognitiva en el tratamiento de la depresión",
            descripcion: "Estudio randomizado controlado sobre la efectividad de la terapia cognitiva conductual en pacientes con trastorno depresivo mayor.",
            autores: "García, M., López, A., Rodríguez, P.",
            fechaPublicacion: "2023",
            fuente: "Revista de Psiquiatría Clínica",
            relevante: true,
            puntuacionRelevancia: 0.95,
            terminosEncontrados: "terapia, depresión"
          },
          {
            id: 2,
            titulo: "Terapia familiar sistémica en adolescentes con trastornos alimentarios",
            descripcion: "Investigación sobre la efectividad de la terapia familiar sistémica en el tratamiento de trastornos alimentarios en adolescentes.",
            autores: "Hernández, M., Castro, P.",
            fechaPublicacion: "2023",
            fuente: "Journal of Family Therapy",
            relevante: true,
            puntuacionRelevancia: 0.70,
            terminosEncontrados: "terapia"
          },
          {
            id: 3,
            titulo: "Impacto de los antidepresivos en la función cognitiva",
            descripcion: "Investigación sobre los efectos cognitivos a largo plazo de los inhibidores selectivos de la recaptación de serotonina.",
            autores: "Martínez, L., Sánchez, R.",
            fechaPublicacion: "2022",
            fuente: "Journal of Clinical Psychiatry",
            relevante: false,
            puntuacionRelevancia: 0.30,
            terminosEncontrados: ""
          },
          {
            id: 4,
            titulo: "Epidemiología de la diabetes tipo 2 en población española",
            descripcion: "Estudio transversal sobre la prevalencia y factores de riesgo de la diabetes mellitus tipo 2 en España.",
            autores: "Fernández, C., Torres, J.",
            fechaPublicacion: "2023",
            fuente: "Medicina Clínica",
            relevante: false,
            puntuacionRelevancia: 0.20,
            terminosEncontrados: ""
          }
        ]
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSimulacion(resultadoSimulado)
    } catch (err) {
      setError('Error al ejecutar la simulación. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const usarEjemplo = (ejemplo: string) => {
    setConsulta(ejemplo)
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'BASICO': return 'bg-green-100 text-green-800'
      case 'INTERMEDIO': return 'bg-yellow-100 text-yellow-800'
      case 'AVANZADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'MEDICINA': return <Target className="h-4 w-4" />
      case 'TECNOLOGIA': return <Zap className="h-4 w-4" />
      case 'PSICOLOGIA': return <Brain className="h-4 w-4" />
      case 'EDUCACION': return <BookOpen className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Brain className="h-10 w-10 text-blue-600" />
            Simulador de Búsqueda Académica
          </h1>
          <p className="text-lg text-muted-foreground">
            Practica tus habilidades de búsqueda con operadores booleanos en un entorno simulado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulario de Búsqueda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Ejecutar Búsqueda
                </CardTitle>
                <CardDescription>
                  Ingresa tu consulta usando operadores booleanos (AND, OR, NOT)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="consulta">Consulta de Búsqueda</Label>
                    <Input
                      id="consulta"
                      placeholder='Ej: terapia AND depresión'
                      value={consulta}
                      onChange={(e) => setConsulta(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nivel">Nivel</Label>
                    <Select value={nivel} onValueChange={setNivel}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASICO">Básico</SelectItem>
                        <SelectItem value="INTERMEDIO">Intermedio</SelectItem>
                        <SelectItem value="AVANZADO">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoría Académica</Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEDICINA">Medicina</SelectItem>
                        <SelectItem value="TECNOLOGIA">Tecnología</SelectItem>
                        <SelectItem value="PSICOLOGIA">Psicología</SelectItem>
                        <SelectItem value="EDUCACION">Educación</SelectItem>
                        <SelectItem value="CIENCIAS_SOCIALES">Ciencias Sociales</SelectItem>
                        <SelectItem value="CIENCIAS_NATURALES">Ciencias Naturales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={ejecutarSimulacion} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando Simulación...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Ejecutar Búsqueda
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Ejemplos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Ejemplos de Búsqueda - Nivel {nivel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  {ejemplos.map((ejemplo, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => usarEjemplo(ejemplo)}
                      className="justify-start text-left h-auto p-3"
                    >
                      <code className="text-sm">{ejemplo}</code>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resultados de Simulación */}
            {simulacion && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Resultados de la Simulación</CardTitle>
                    <Badge className={getNivelColor(simulacion.nivelDificultad)}>
                      {simulacion.nivelDificultad}
                    </Badge>
                  </div>
                  <CardDescription>
                    {simulacion.categoria} • {simulacion.totalResultados} resultados • {simulacion.resultadosRelevantes} relevantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Puntuación y Retroalimentación */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Puntuación: {Math.round(simulacion.puntuacion * 100)}%
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {simulacion.operadoresDetectados}
                      </span>
                    </div>
                    <Progress value={simulacion.puntuacion * 100} className="mb-3" />
                    <div 
                      className="prose prose-sm max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: simulacion.retroalimentacion }}
                    />
                  </div>

                  {/* Lista de Resultados */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Resultados Encontrados</h3>
                    {simulacion.resultados.map((resultado) => (
                      <Card key={resultado.id} className={`border-l-4 ${resultado.relevante ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium">{resultado.titulo}</h4>
                            <div className="flex items-center gap-2">
                              {resultado.relevante ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              )}
                              <Badge variant={resultado.relevante ? "default" : "secondary"}>
                                {Math.round(resultado.puntuacionRelevancia * 100)}%
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{resultado.descripcion}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{resultado.autores} • {resultado.fechaPublicacion}</span>
                            <span>{resultado.fuente}</span>
                          </div>
                          {resultado.terminosEncontrados && (
                            <div className="mt-2">
                              <span className="text-xs font-medium">Términos encontrados: </span>
                              <span className="text-xs text-muted-foreground">{resultado.terminosEncontrados}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estadísticas */}
            {estadisticas && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tus Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{estadisticas.totalSimulaciones}</div>
                    <div className="text-sm text-muted-foreground">Simulaciones realizadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.puntuacionPromedio}%</div>
                    <div className="text-sm text-muted-foreground">Puntuación promedio</div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Operadores Usados</h4>
                    <div className="space-y-1">
                      {Object.entries(estadisticas.operadoresUsados).map(([operador, count]) => (
                        <div key={operador} className="flex justify-between text-sm">
                          <span>{operador}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Categorías Practicadas</h4>
                    <div className="space-y-1">
                      {Object.entries(estadisticas.categoriasPracticas).map(([categoria, count]) => (
                        <div key={categoria} className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            {getCategoriaIcon(categoria)}
                            {categoria}
                          </span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ayuda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Consejos de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Operador AND</h4>
                  <p className="text-muted-foreground">Usa AND para obtener resultados que contengan todos los términos.</p>
                  <code className="text-xs bg-gray-100 p-1 rounded">ejemplo: terapia AND depresión</code>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Operador OR</h4>
                  <p className="text-muted-foreground">Usa OR para incluir sinónimos o términos relacionados.</p>
                  <code className="text-xs bg-gray-100 p-1 rounded">ejemplo: ansiedad OR estrés</code>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Operador NOT</h4>
                  <p className="text-muted-foreground">Usa NOT para excluir términos no deseados.</p>
                  <code className="text-xs bg-gray-100 p-1 rounded">ejemplo: diabetes NOT tipo 1</code>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Paréntesis</h4>
                  <p className="text-muted-foreground">Agrupa términos para búsquedas complejas.</p>
                  <code className="text-xs bg-gray-100 p-1 rounded">ejemplo: (terapia OR tratamiento) AND depresión</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}