"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/context/auth.context"
import { Search, Plus, X, BookOpen, User, FileText, Calendar, Database } from "lucide-react"

interface SearchTerm {
  term: string
  field: string
  operator: string
}

interface SearchResult {
  id: string
  title: string
  author: string
  abstract: string
  year: string
  source: string
  relevance: number
  isReliable: boolean
}

export default function SimuladorBusquedaPage() {
  const { user } = useAuth()
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([])
  const [currentTerm, setCurrentTerm] = useState("")
  const [currentField, setCurrentField] = useState("titulo")
  const [currentOperator, setCurrentOperator] = useState("AND")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const addTerm = () => {
    if (currentTerm.trim()) {
      setSearchTerms([...searchTerms, {
        term: currentTerm.trim(),
        field: currentField,
        operator: searchTerms.length > 0 ? currentOperator : ""
      }])
      setCurrentTerm("")
    }
  }

  const removeTerm = (index: number) => {
    setSearchTerms(searchTerms.filter((_, i) => i !== index))
  }

  const executeSearch = async () => {
    if (searchTerms.length === 0) return

    setIsSearching(true)

    // Simular búsqueda con resultados de ejemplo
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Métodos de búsqueda avanzada en bases de datos científicas",
          author: "María González",
          abstract: "Este artículo explora las técnicas modernas de búsqueda en repositorios académicos...",
          year: "2023",
          source: "Revista de Información Científica",
          relevance: 95,
          isReliable: true
        },
        {
          id: "2",
          title: "Operadores booleanos en investigación documental",
          author: "Carlos Rodríguez",
          abstract: "Análisis de la efectividad de operadores AND, OR y NOT en búsquedas bibliográficas...",
          year: "2022",
          source: "Journal of Information Science",
          relevance: 88,
          isReliable: true
        },
        {
          id: "3",
          title: "Guía práctica para búsquedas en PubMed",
          author: "Ana López",
          abstract: "Tutorial paso a paso para utilizar operadores booleanos en PubMed...",
          year: "2021",
          source: "Medical Library Association",
          relevance: 82,
          isReliable: true
        },
        {
          id: "4",
          title: "Técnicas de búsqueda en Google Scholar",
          author: "Juan Pérez",
          abstract: "Cómo optimizar búsquedas académicas utilizando operadores avanzados...",
          year: "2020",
          source: "Academic Search Quarterly",
          relevance: 75,
          isReliable: false
        }
      ]

      setResults(mockResults)

      // Agregar a historial
      const queryString = searchTerms.map((term, index) =>
        `${index > 0 ? term.operator + ' ' : ''}${term.field}:${term.term}`
      ).join(' ')
      setSearchHistory([queryString, ...searchHistory.slice(0, 9)]) // Mantener últimos 10

      setIsSearching(false)
    }, 1500)
  }

  const markReliability = (id: string, isReliable: boolean) => {
    setResults(results.map(result =>
      result.id === id ? { ...result, isReliable } : result
    ))
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "titulo": return <BookOpen className="h-4 w-4" />
      case "autor": return <User className="h-4 w-4" />
      case "abstract": return <FileText className="h-4 w-4" />
      case "fecha": return <Calendar className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["ESTUDIANTE"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Simulador de Búsqueda</h1>
            <p className="text-muted-foreground">
              Practica técnicas de búsqueda avanzada con operadores booleanos y campos específicos
            </p>
          </div>

          {/* Constructor de consulta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Constructor de Consulta
              </CardTitle>
              <CardDescription>
                Construye tu consulta de búsqueda utilizando términos, campos y operadores booleanos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input para nuevo término */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresa un término de búsqueda..."
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTerm()}
                  className="flex-1"
                />
                <Select value={currentField} onValueChange={setCurrentField}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="titulo">Título</SelectItem>
                    <SelectItem value="autor">Autor</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="fecha">Fecha</SelectItem>
                    <SelectItem value="fuente">Fuente</SelectItem>
                  </SelectContent>
                </Select>
                {searchTerms.length > 0 && (
                  <Select value={currentOperator} onValueChange={setCurrentOperator}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                      <SelectItem value="NOT">NOT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button onClick={addTerm} disabled={!currentTerm.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              {/* Términos agregados */}
              {searchTerms.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Consulta construida:</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchTerms.map((term, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {index > 0 && <span className="text-xs text-muted-foreground mr-1">{term.operator}</span>}
                        {getFieldIcon(term.field)}
                        <span className="capitalize">{term.field}:</span>
                        <span className="font-medium">"{term.term}"</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeTerm(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón ejecutar */}
              <div className="flex justify-center">
                <Button
                  onClick={executeSearch}
                  disabled={searchTerms.length === 0 || isSearching}
                  size="lg"
                  className="px-8"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Ejecutar Búsqueda
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Búsqueda ({results.length})</CardTitle>
                <CardDescription>
                  Evalúa la confiabilidad de cada fuente marcándola como confiable o no confiable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Por {result.author} • {result.year} • {result.source}
                          </p>
                          <p className="text-sm mb-3">{result.abstract}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Relevancia: {result.relevance}%</span>
                            <span>Confiable: {result.isReliable ? 'Sí' : 'No evaluado'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant={result.isReliable ? "default" : "outline"}
                            onClick={() => markReliability(result.id, true)}
                          >
                            ✓ Confiable
                          </Button>
                          <Button
                            size="sm"
                            variant={!result.isReliable ? "destructive" : "outline"}
                            onClick={() => markReliability(result.id, false)}
                          >
                            ✗ No Confiable
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial de búsquedas */}
          {searchHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Consultas</CardTitle>
                <CardDescription>Últimas consultas realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      <code>{query}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información educativa */}
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Consejos para búsquedas efectivas:</strong><br />
              • Usa operadores booleanos (AND, OR, NOT) para combinar términos<br />
              • Especifica campos para búsquedas más precisas<br />
              • Evalúa la confiabilidad de las fuentes antes de usar la información<br />
              • Combina términos relacionados para obtener mejores resultados
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}