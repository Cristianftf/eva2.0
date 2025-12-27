"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, FileText, Database, Microscope } from "lucide-react"

export function RecursosSaludTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competencias Informacionales en Salud</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Aquí encontrarás recursos y herramientas para mejorar tus habilidades en búsqueda y evaluación de información médica.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Búsqueda Avanzada en Salud</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Aprende a utilizar operadores booleanos y filtros avanzados para buscar información médica.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluación de Fuentes Médicas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Guías para evaluar la calidad de artículos médicos y estudios clínicos utilizando el método CRAAP.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bases de Datos Médicas</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acceso a bases de datos especializadas como PubMed, Cochrane, y otras.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Simulador de Búsqueda Médica</CardTitle>
                <Microscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practica tus habilidades de búsqueda en un entorno simulado con retroalimentación inmediata.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Acceder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guías de Investigación</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tutoriales sobre cómo interpretar estudios clínicos y artículos científicos.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recursos Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Tutoriales</h3>
              <p className="text-sm text-muted-foreground">
                Videos y guías paso a paso sobre cómo utilizar herramientas de búsqueda médica.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Evaluaciones</h3>
              <p className="text-sm text-muted-foreground">
                Tests para evaluar tus competencias en búsqueda y evaluación de información médica.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Comunidad</h3>
              <p className="text-sm text-muted-foreground">
                Foros y grupos de discusión para compartir experiencias y aprender de otros estudiantes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}