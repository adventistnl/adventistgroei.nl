import { NextRequest, NextResponse } from 'next/server'
import { PermissionGroup, PermissionResolverName } from './types/graphql-global-types'



// Lista de rotas que não precisam de autenticação
const whitelist = ['/users', '/login', '/register', '/forgot-password', '/forgot-password/reset', '/forgot-password/verify'];

/**
 * Mapeamento dinâmico de rotas para permissões usando listas de resolvers e grupos.
 */
const routePermissions: Record<string, { resolvers: PermissionResolverName[]; groups: PermissionGroup[] }> = {
  '/access': { resolvers: [], groups: [] },
  '/unauthorized': { resolvers: [], groups: [] },
  '/access/permissions/[roleId]': { resolvers: [], groups: [] },
  '/annual-reports': { resolvers: [], groups: [] },
  '/communications': { resolvers: [PermissionResolverName.Communications], groups: [PermissionGroup.Communication] },
  '/dashboard': { resolvers: [], groups: [] },
  '/events': { resolvers: [], groups: [] },
  '/events/[id]': { resolvers: [], groups: [] },
  '/forgot-password': { resolvers: [], groups: [] },
  '/forgot-password/reset': { resolvers: [], groups: [] },
  '/forgot-password/verify': { resolvers: [], groups: [] },
  '/login': { resolvers: [], groups: [] },
  '/mission-projects': { resolvers: [PermissionResolverName.Projects], groups: [PermissionGroup.Project] },
  '/my-subsidies': { resolvers: [], groups: [] },
  '/profile': { resolvers: [], groups: [] },
  '/projects': { resolvers: [PermissionResolverName.Projects], groups: [PermissionGroup.Project] },
  '/projects/[id]': { resolvers: [PermissionResolverName.Project], groups: [PermissionGroup.Project] },
  '/regions': { resolvers: [PermissionResolverName.Regions], groups: [PermissionGroup.Region] },
  '/register': { resolvers: [], groups: [] },
  '/reports': { resolvers: [], groups: [] },
  '/settings': { resolvers: [PermissionResolverName.Settings], groups: [PermissionGroup.Setting] },
  '/structure': { resolvers: [], groups: [] },
  '/structure/[id]': { resolvers: [], groups: [] },
  '/subsidies': { resolvers: [], groups: [] },
  '/subsidies/activities': { resolvers: [], groups: [] },
  '/subsidies/new': { resolvers: [], groups: [] },
  '/subsidies/receipts': { resolvers: [], groups: [] },
  '/users': { resolvers: [PermissionResolverName.Users], groups: [PermissionGroup.User] },
  '/users/[id]': { resolvers: [PermissionResolverName.User], groups: [PermissionGroup.User] },
  '/volunteers': { resolvers: [], groups: [] },
}

/**
 * Função para mapear rotas para permissões necessárias.
 * @param pathname - Caminho da rota.
 * @returns Lista de permissões necessárias para acessar a rota.
 */
function getRequiredPermissions(pathname: string): { resolvers: string[]; groups: string[] } {
  const route = routePermissions[pathname]
  if (!route) return { resolvers: [], groups: [] }

  const resolverPermissions = route.resolvers.map(resolver => resolver)
  const groupPermissions = route.groups.map(group => group)

  return { resolvers: resolverPermissions, groups: groupPermissions }
}



/**
 * Middleware para proteger rotas com base em permissões.
 * Verifica se o usuário possui pelo menos uma permissão necessária para acessar a rota.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir acesso às rotas na whitelist sem verificar cookies
  if (whitelist.includes(pathname)) {
    console.log(`Middleware Debug: Allowing access to whitelisted route: ${pathname}`);
    return NextResponse.next();
  }

  const token = req.cookies.get('auth-token');
  const userGroups = req.cookies.get('auth-groups');
  const userPermissions = req.cookies.get('auth-permissions');

  console.log('Middleware Debug: Token:', token);
  console.log('Middleware Debug: User Groups:', userGroups);
  console.log('Middleware Debug: User Permissions:', userPermissions);

  if (!token || !userGroups || !userPermissions) {
    console.log('Middleware Debug: Redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  let groups: string[] = [];
  let permissions: string[] = [];
  try {
    groups = JSON.parse(userGroups.value || '[]');
    permissions = JSON.parse(userPermissions.value || '[]');
  } catch (error) {
    console.error('Middleware Debug: Error parsing cookies:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { resolvers, groups: requiredGroups } = getRequiredPermissions(pathname);

  console.log('Middleware Debug: Required Resolvers:', resolvers);
  console.log('Middleware Debug: Required Groups:', requiredGroups);

  // Permitir acesso se nenhuma permissão ou grupo for necessário
  if (resolvers.length === 0 && requiredGroups.length === 0) {
    console.log('Middleware Debug: No permissions or groups required, allowing access');
    return NextResponse.next();
  }

  // Verificar se o usuário possui pelo menos uma das permissões ou grupos necessários
  const hasResolverPermission = resolvers.some(resolver => permissions.includes(resolver));
  const hasGroupPermission = requiredGroups.some(group => groups.includes(group));

  console.log('Middleware Debug: Has Resolver Permission:', hasResolverPermission);
  console.log('Middleware Debug: Has Group Permission:', hasGroupPermission);

  if (!hasResolverPermission && !hasGroupPermission) {
    console.log('Middleware Debug: Redirecting to /unauthorized');
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
    console.log('Middleware Debug: Static or internal resource, allowing access');
    return NextResponse.next();
  }

  // Redirecionar root para login apenas se necessário
  if (pathname === '/') {
    console.log('Middleware Debug: Redirecting root to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Permitir todas as outras rotas
  console.log('Middleware Debug: Allowing access to other routes');
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