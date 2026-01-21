import { useQuery } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { GET_USER_QUERY } from "@/graphql/queries/GET_USER_QUERY";
import { User, UserVariables } from "@/types/User";

export function useGetUserQuery(variables: UserVariables, options?: any) {
  const hasLoggedSkip = useRef(false);
  
  const result = useQuery<User, UserVariables>(GET_USER_QUERY, {
    variables,
    skip: !variables.id,
    fetchPolicy: 'network-only', // Sempre busca dados frescos do servidor
    errorPolicy: 'all', // Retorna dados parciais mesmo com erros
    notifyOnNetworkStatusChange: true, // Notifica mudanças no status da rede
    ...options,
  });

  // Log apenas uma vez quando não há userId (skip mode)
  useEffect(() => {
    if (!variables.id && !hasLoggedSkip.current) {
      hasLoggedSkip.current = true;
      // Não logar quando skipado - é comportamento esperado
    } else if (variables.id) {
      hasLoggedSkip.current = false;
    }
  }, [variables.id]);

  // Usar useEffect ao invés de onCompleted (Apollo Client v3.14+)
  useEffect(() => {
    if (variables.id && result.data?.user && !result.loading) {
      console.log('✅ [useGetUserQuery] Query completed:', {
        userId: variables.id,
        hasData: !!result.data?.user,
        userName: result.data?.user?.name,
      });
    }
  }, [result.data, result.loading, variables.id]);

  // Usar useEffect ao invés de onError (Apollo Client v3.14+)
  useEffect(() => {
    if (variables.id && result.error && !result.loading) {
      console.error('❌ [useGetUserQuery] Query error:', {
        userId: variables.id,
        errorMessage: result.error.message,
        graphQLErrors: result.error.graphQLErrors,
        networkError: result.error.networkError,
      });
    }
  }, [result.error, result.loading, variables.id]);

  return result;
}
