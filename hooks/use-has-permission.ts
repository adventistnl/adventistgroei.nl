import { useAuth } from '@/contexts/auth-context';
import { PermissionResolverName } from '@/types/graphql-global-types';

/**
 * Hook para verificar se o usuário possui as permissões necessárias.
 * @param requiredPermissions - Lista de permissões necessárias.
 * @returns Retorna true se o usuário tiver pelo menos uma das permissões necessárias.
 */
export function useHasPermission(
  requiredPermissions: PermissionResolverName[] = []
): boolean {
  const { permissions } = useAuth();

  // Verificar se o usuário possui pelo menos uma das permissões necessárias
  return requiredPermissions.every((permission) => permissions.includes(permission));
}
