import { useAuth } from '@/contexts/auth-context';
import { PermissionResolverName, RoleModel } from '@/types/graphql-global-types';

/**
 * Hook para verificar se o usuário possui as permissões ou roles necessárias.
 * @param requiredPermissions - Lista de permissões necessárias.
 * @param requiredRoles - Lista de roles necessárias.
 * @param partialPermissionCheck - Define se a verificação de permissões deve ser parcial (apenas uma das permissões) ou total (todas as permissões).
 * @param partialRoleCheck - Define se a verificação de roles deve ser parcial (apenas uma das roles) ou total (todas as roles).
 * @returns Retorna true se o usuário tiver as permissões ou roles necessárias, de acordo com o tipo de verificação.
 */
export function useHasPermission(
  requiredPermissions: PermissionResolverName[] = [],
  requiredRoles: RoleModel['key_code'][] = [],
  partialPermissionCheck: boolean = false, // Novo parâmetro para verificação parcial de permissões
  partialRoleCheck: boolean = false // Novo parâmetro para verificação parcial de roles
): boolean {
  const { permissions, roles } = useAuth();

  // Verificar permissões com base no tipo de verificação
  const hasPermissions = partialPermissionCheck
    ? requiredPermissions.some((permission) => permissions.includes(permission))
    : requiredPermissions.every((permission) => permissions.includes(permission));

  // Verificar roles com base no tipo de verificação
  const hasRoles = partialRoleCheck
    ? requiredRoles.some((role) => roles.includes(role))
    : requiredRoles.every((role) => roles.includes(role));

  return hasPermissions && hasRoles;
}
