import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-5xl font-bold text-primary">404</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          <CardDescription className="text-base">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Posibles razones:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>La URL fue escrita incorrectamente</li>
              <li>El enlace está desactualizado</li>
              <li>La página fue eliminada o movida</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al Inicio
            </Link>
          </Button>
          <div className="flex gap-2 w-full">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/recursos">
                <Search className="mr-2 h-4 w-4" />
                Recursos
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
