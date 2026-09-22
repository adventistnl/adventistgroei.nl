import { useQuery, DocumentNode, TypedDocumentNode, QueryHookOptions, QueryResult } from "@apollo/client";
import { useHasPermission } from "@/hooks/use-has-permission";
import { PermissionResolverName } from "@/types/graphql-global-types";

/**
 * A wrapper around Apollo's useQuery that automatically skips the query
 * if the user does not have the required permissions.
 *
 * @param query The GraphQL query document
 * @param requiredPermissions List of permissions required to execute the query
 * @param options Standard useQuery options
 * @param requireAll If true, requires all permissions in the list. If false, requires at least one. Default is true (matchAll).
 */
export function useProtectedQuery<TData = any, TVariables extends Record<string, any> = Record<string, any>>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  requiredPermissions: PermissionResolverName[],
  options?: QueryHookOptions<TData, TVariables>,
  requireAll: boolean = true
): QueryResult<TData, TVariables> {
  // Verificamos se o usuário tem a permissão necessária
  const hasPermission = useHasPermission(requiredPermissions, [], requireAll);

  // Executamos a query aplicando o skip nativo do Apollo
  return useQuery<TData, TVariables>(query, {
    ...options,
    // Se a query original já dizia para pular, pulamos.
    // Se o usuário não tiver permissão, também pulamos.
    skip: options?.skip || !hasPermission,
  });
}
