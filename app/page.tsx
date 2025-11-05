import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, MessageSquare, Bell, BarChart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-balance">Entorno Virtual de Aprendizaje</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 text-balance">Aprende sin límites, enseña con pasión</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Plataforma educativa completa para estudiantes, profesores y administradores. Gestiona cursos, evalúa
          conocimientos y conecta con tu comunidad educativa.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              Comenzar Ahora
            </Button>
          </Link>
          <Link href="/recursos">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Explorar Recursos
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Características Principales</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Cursos Completos</CardTitle>
              <CardDescription>
                Accede a cursos estructurados con temas, multimedia y recursos descargables
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Cuestionarios Interactivos</CardTitle>
              <CardDescription>
                Evalúa tu conocimiento con cuestionarios y obtén retroalimentación inmediata
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Chat en Tiempo Real</CardTitle>
              <CardDescription>Comunícate con profesores y compañeros para resolver dudas al instante</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Mantente informado sobre nuevos cursos, tareas y mensajes importantes</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Informes Detallados</CardTitle>
              <CardDescription>
                Profesores pueden generar informes de progreso y rendimiento de estudiantes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Gestión Completa</CardTitle>
              <CardDescription>Panel administrativo para gestionar usuarios, cursos y contenido</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-lg my-16">
        <h3 className="text-3xl font-bold text-center mb-12">Para Todos los Roles</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Estudiantes</h4>
            <p className="text-muted-foreground text-pretty">
              Accede a cursos, completa cuestionarios, chatea con profesores y sigue tu progreso
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Profesores</h4>
            <p className="text-muted-foreground text-pretty">
              Crea cursos, agrega multimedia, evalúa estudiantes y genera informes de rendimiento
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Administradores</h4>
            <p className="text-muted-foreground text-pretty">
              Gestiona usuarios, cursos, recursos y supervisa toda la plataforma educativa
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h3 className="text-4xl font-bold mb-6 text-balance">¿Listo para transformar tu experiencia educativa?</h3>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Únete a nuestra plataforma y descubre una nueva forma de aprender y enseñar
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="text-lg px-12">
            Crear Cuenta Gratis
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Entorno Virtual de Aprendizaje. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
