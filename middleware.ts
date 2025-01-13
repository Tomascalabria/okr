import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("Session:", session) // Verifica si la sesión está disponible

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = [ '/' ,'/group']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a la página de autenticación si no hay sesión y se intenta acceder a una ruta protegida
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Redirigir a la página de dashboard si ya hay una sesión y se intenta acceder a una página de autenticación
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Si no se cumple ninguna de las condiciones anteriores, se devuelve la respuesta original
  return res
}
