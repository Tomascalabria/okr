import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const protectedRoutes = ['/', '/group']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a '/auth/login' si no hay sesión y se intenta acceder a una ruta protegida
  if (!session && isProtectedRoute && req.nextUrl.pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Redirigir a '/' si ya hay sesión y se intenta acceder a una página de autenticación
  if (session && req.nextUrl.pathname.startsWith('/auth') && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}
