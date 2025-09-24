import React from 'react';
import { useHasPermission } from '@/hooks/use-has-permission';
import { PermissionResolverName } from '@/types/graphql-global-types';

interface WithPermissionProps {
  requiredPermissions?: PermissionResolverName[];
  fallback?: React.JSX.Element | null;
  children: React.ReactNode;
}

/**
 * Componente para proteger elementos com base em permissões.
 * @param children - Elementos a serem renderizados se o usuário tiver permissão.
 * @param requiredPermissions - Permissões necessárias para renderizar os elementos.
 * @param fallback - Elemento a ser renderizado caso o usuário não tenha permissão.
 * @returns Elementos protegidos.
 */
export function WithPermission({
  children,
  requiredPermissions = [],
  fallback = null,
}: WithPermissionProps) {
  const hasPermission = useHasPermission(requiredPermissions);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
