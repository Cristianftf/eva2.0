import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/admin", "/estudiante", "/profesor"]

// Rutas solo para usuarios no autenticados
const authRoutes = ["/auth/login", "/auth/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value

  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Si es una ruta protegida y no hay token, redirigir a login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si es una ruta de auth y hay token, redirigir a dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Limit middleware to only run on protected and auth-related routes.
  // Esto reduce la superficie de ejecución y evita interferir con otras rutas.
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/estudiante/:path*",
    "/profesor/:path*",
    "/auth/:path*",
  ],
}
