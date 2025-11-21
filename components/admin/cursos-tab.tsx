"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cursosService } from "@/lib/services/courses.service"
import type { Curso } from "@/lib/types"
import { Search, Edit, Trash2, Loader2 } from "lucide-react"

export function CursosTab() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadCursos()
  }, [])

  useEffect(() => {
    filterCursos()
  }, [searchTerm, cursos])

  const loadCursos = async () => {
    setLoading(true)
    setError(null)

    const result = await cursosService.getAllCourses()

    if (result.success && result.data) {
      setCursos(result.data)
    } else {
      setError(result.error || "Error al cargar cursos")
    }

    setLoading(false)
  }

  const filterCursos = () => {
    let filtered = cursos

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredCursos(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return

    const result = await cursosService.delete(id)

    if (result.success) {
      setCursos(cursos.filter((c) => c.id !== id))
    } else {
      alert(result.error || "Error al eliminar curso")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Cursos</CardTitle>
            <CardDescription>Administra todos los cursos de la plataforma</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCursos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron cursos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCursos.map((curso) => (
                    <TableRow key={curso.id}>
                      <TableCell className="font-medium">{curso.titulo}</TableCell>
                      <TableCell className="max-w-md truncate">{curso.descripcion}</TableCell>
                      <TableCell>
                        <Badge variant={curso.activo ? "default" : "secondary"}>
                          {curso.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(curso.fechaCreacion).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(curso.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
