import React from 'react';
import { useHasPermission } from '@/hooks/use-has-permission';
import { PermissionResolverName } from '@/types/graphql-global-types';

interface WithPermissionProps {
  requiredPermissions?: PermissionResolverName[];
  requiredRoles?: string[];
  fallback?: React.JSX.Element | null;
  children: React.ReactNode;
  /**
   * Define se a verificação de permissões deve ser parcial (apenas uma das permissões) ou total (todas as permissões).
   * O padrão é total.
   */
  partialPermissionCheck?: boolean;

  /**
   * Define se a verificação de roles deve ser parcial (apenas uma das roles) ou total (todas as roles).
   * O padrão é total.
   */
  partialRoleCheck?: boolean;
}

/**
 * Componente para proteger elementos com base em permissões e roles.
 * @param children - Elementos a serem renderizados se o usuário tiver permissão ou role.
 * @param requiredPermissions - Permissões necessárias para renderizar os elementos.
 * @param requiredRoles - Roles necessárias para renderizar os elementos.
 * @param fallback - Elemento a ser renderizado caso o usuário não tenha permissão ou role.
 * @returns Elementos protegidos.
 */
export function WithPermission({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null,
  partialPermissionCheck = false, // Novo parâmetro com valor padrão
  partialRoleCheck = false, // Novo parâmetro com valor padrão
}: WithPermissionProps) {
  const hasPermission = useHasPermission(
    requiredPermissions,
    requiredRoles,
    partialPermissionCheck,
    partialRoleCheck
  );

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
