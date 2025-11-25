"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Algo salió mal</CardTitle>
          <CardDescription className="text-base">
            Ha ocurrido un error inesperado en la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {process.env.NODE_ENV === "development" && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Detalles del error (solo en desarrollo)
                </summary>
                <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono break-all">
                  <p className="font-semibold">Error: {error.message}</p>
                  {error.digest && (
                    <p className="mt-1">
                      <span className="font-semibold">Digest:</span> {error.digest}
                    </p>
                  )}
                </div>
              </details>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Puedes intentar:</p>
              <ul className="list-disc list-inside text-left space-y-1 mt-2">
                <li>Recargar la página</li>
                <li>Volver a la página anterior</li>
                <li>Ir a la página principal</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={handleReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar de nuevo
          </Button>
          <div className="flex gap-2 w-full">
            <Button variant="outline" asChild className="flex-1 bg-transparent" onClick={() => window.history.back()}>
              <span role="button" aria-label="Volver a la página anterior">
                ← Volver
              </span>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/" aria-label="Ir a la página principal">
                <Home className="mr-2 h-4 w-4" />
                Inicio
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}