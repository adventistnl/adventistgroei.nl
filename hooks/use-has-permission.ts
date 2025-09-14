import { useAuth } from '@/contexts/auth-context';
import { PermissionGroup, PermissionResolverName } from '@/types/graphql-global-types';

/**
 * Hook para verificar se o usuário possui as permissões ou grupos necessários.
 * @param requiredPermissions - Lista de permissões necessárias.
 * @param requiredGroups - Lista de grupos necessários.
 * @returns Retorna true se o usuário tiver pelo menos uma das permissões ou grupos necessários.
 */
export function useHasPermission(
  requiredPermissions: PermissionResolverName[] = [],
  requiredGroups: PermissionGroup[] = []
): boolean {
  const { permissions, groups } = useAuth();

  // Verificar se o usuário possui pelo menos uma das permissões necessárias
  const hasPermission = requiredPermissions.some(permission =>
    permissions.includes(permission)
  );

  // Verificar se o usuário pertence a pelo menos um dos grupos necessários
  const hasGroup = requiredGroups.some(group =>
    groups.includes(group)
  );

  return hasPermission || hasGroup;
}
