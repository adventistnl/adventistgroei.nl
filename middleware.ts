import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso total a recursos estáticos e internos do Next.js
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.map') ||
    pathname.endsWith('.json')
  ) {
    return NextResponse.next()
  }

  // Redirecionar root para login apenas se necessário
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Permitir todas as outras rotas
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and API routes
     * Simplified to avoid blocking Next.js internals
     */
    '/((?!_next|api|favicon.ico|public|static).*)',
  ],
}