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
  '/access/permissions/[roleId]': { resolvers: [] },
  '/annual-reports': { resolvers: [] },
  '/communications': { resolvers: [PermissionResolverName.Communications] },
  '/dashboard': { resolvers: [] },
  '/events': { resolvers: [] },
  '/events/[id]': { resolvers: [] },
  '/mission-projects': { resolvers: [PermissionResolverName.Projects] },
  '/my-subsidies': { resolvers: [] },
  '/profile': { resolvers: [] },
  '/projects': { resolvers: [PermissionResolverName.Projects] },
  '/projects/[id]': { resolvers: [PermissionResolverName.Project] },
  '/regions': { resolvers: [PermissionResolverName.Regions] },
  '/reports': { resolvers: [] },
  '/settings': { resolvers: [PermissionResolverName.Settings] },
  '/structure': { resolvers: [] },
  '/structure/[id]': { resolvers: [] },
  '/subsidies': { resolvers: [] },
  '/subsidies/activities': { resolvers: [] },
  '/subsidies/new': { resolvers: [] },
  '/subsidies/receipts': { resolvers: [] },
  '/users': { resolvers: [PermissionResolverName.Users] },
  '/users/[id]': { resolvers: [PermissionResolverName.User] },
  '/volunteers': { resolvers: [] },
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

  // Permitir acesso às rotas na whitelist sem verificar cookies
  if (whitelist.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth-token');
  const userPermissions = req.cookies.get('auth-permissions');

  if (!token || !userPermissions) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    const isTokenValid = validateToken(token.value);
    if (!isTokenValid) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  let permissions: string[] = [];
  try {
    permissions = JSON.parse(userPermissions.value || '[]');
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { resolvers } = getRequiredPermissions(pathname);


  // Permitir acesso se nenhuma permissão for necessária
  if (resolvers.length === 0) {
    return NextResponse.next();
  }

  // Verificar se o usuário possui pelo menos uma das permissões necessárias
  const hasResolverPermission = resolvers.some(resolver => permissions.includes(resolver));


  if (!hasResolverPermission) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
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

  // Redirecionar root para login apenas se necessário
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
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