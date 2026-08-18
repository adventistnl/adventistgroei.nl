import { NextRequest, NextResponse } from 'next/server'
import { PermissionResolverName } from './types/graphql-global-types'
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { validateToken } from './utils/validateToken';



// Lista de rotas que não precisam de autenticação
const whitelist = ['/login', '/register', '/forgot-password', '/forgot-password/reset', '/forgot-password/verify', '/unauthorized'];

/**
 * Mapeamento dinâmico de rotas para permissões usando listas de resolvers.
 */
const routePermissions: Record<string, { resolvers: PermissionResolverName[] }> = {
  '/access': { resolvers: [] },
  '/access/roles/[roleId]': { resolvers: [] },
  '/annual-reports': { resolvers: [] },
  '/communications': { resolvers: [] },
  '/dashboard': { resolvers: [] },
  '/events': { resolvers: [] },
  '/events/[id]': { resolvers: [] },
  '/mission-projects': { resolvers: [] },
  '/my-subsidies': { resolvers: [] },
  '/profile': { resolvers: [] },
  '/projects': { resolvers: [] },
  '/projects/[id]': { resolvers: [] },
  '/regions-example': { resolvers: [] },
  '/reports': { resolvers: [] },
  '/churches/[id]/service-calendar': { resolvers: [] },
  '/schedule/availability': { resolvers: [] },
  '/settings': { resolvers: [] },
  '/structure': { resolvers: [] },
  '/structure/[id]': { resolvers: [] },
  '/subsidies': { resolvers: [] },
  '/subsidies/activities': { resolvers: [] },
  '/subsidies/new': { resolvers: [] },
  '/subsidies/receipts': { resolvers: [] },
  '/users': { resolvers: [] },
  '/users/[id]': { resolvers: [] },
  '/volunteers': { resolvers: [] },
  '/institutions': { resolvers: [] },
}

/**
 * Função para mapear rotas para permissões necessárias.
 * @param pathname - Caminho da rota.
 * @returns Lista de permissões necessárias para acessar a rota.
 */
function getRequiredPermissions(pathname: string): { resolvers: string[] } {
  const route = routePermissions[pathname]
  if (!route) return { resolvers: [] }

  const resolverPermissions = route.resolvers.map(resolver => resolver)

  return { resolvers: resolverPermissions }
}



/**
 * Middleware para proteger rotas com base em permissões.
 * Verifica se o usuário possui pelo menos uma permissão necessária para acessar a rota.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle Chrome DevTools specific requests to avoid 404 logs
  if (pathname.startsWith('/.well-known/')) {
    return new NextResponse('{}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Redirecionar root baseado no token — feito aqui no middleware para evitar
  // o ciclo de loading extra que app/page.tsx causava no cliente
  if (pathname === '/') {
    const rootToken = req.cookies.get('auth-token');
    if (rootToken) {
      try {
        const isTokenValid = validateToken(rootToken.value);
        if (isTokenValid) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch {
        // Token inválido — cai no redirect para login abaixo
      }
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Rotas de autenticação — se o usuário já tiver token válido, redirecionar para /dashboard
  // (evita que usuário logado veja a tela de login)
  if (whitelist.includes(pathname)) {
    const authToken = req.cookies.get('auth-token');
    if (authToken) {
      try {
        const isTokenValid = validateToken(authToken.value);
        if (isTokenValid) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch {
        // Token inválido — deixar o usuário na página de auth normalmente
      }
    }
    return NextResponse.next();
  }

  // Verificação rápida de token básico
  const token = req.cookies.get('auth-token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validação rápida do token (apenas expiração)
  try {
    const isTokenValid = validateToken(token.value);
    if (!isTokenValid) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Para rotas que requerem permissões específicas, fazer validação completa
  const { resolvers } = getRequiredPermissions(pathname);
  if (resolvers.length > 0) {
    const userPermissions = req.cookies.get('auth-permissions');
    if (!userPermissions) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    let permissions: string[] = [];
    try {
      permissions = JSON.parse(userPermissions.value || '[]');
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const hasResolverPermission = resolvers.some(resolver => permissions.includes(resolver));
    if (!hasResolverPermission) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

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
    return NextResponse.next();
  }

  // Permitir todas as outras rotas
  return NextResponse.next();
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