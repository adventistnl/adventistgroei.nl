import React from 'react';
import { useHasPermission } from '@/hooks/use-has-permission';
import { PermissionGroup, PermissionResolverName } from '@/types/graphql-global-types';

interface WithPermissionProps {
  requiredPermissions?: PermissionResolverName[];
  requiredGroups?: PermissionGroup[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Componente para proteger elementos com base em permissões ou grupos.
 * @param children - Elementos a serem renderizados se o usuário tiver permissão.
 * @param requiredPermissions - Permissões necessárias para renderizar os elementos.
 * @param requiredGroups - Grupos necessários para renderizar os elementos.
 * @param fallback - Elemento a ser renderizado caso o usuário não tenha permissão.
 * @returns Elementos protegidos.
 */
export function WithPermission({
  children,
  requiredPermissions = [],
  requiredGroups = [],
  fallback = null,
}: WithPermissionProps) {
  const hasPermission = useHasPermission(requiredPermissions, requiredGroups);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
