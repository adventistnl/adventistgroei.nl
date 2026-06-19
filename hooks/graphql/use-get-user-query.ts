import { useQuery } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { GET_USER_QUERY } from "@/graphql/queries/GET_USER_QUERY";
import { User, UserVariables } from "@/types/User";

export function useGetUserQuery(variables: UserVariables, options?: any) {
  const hasLoggedSkip = useRef(false);
  
  const result = useQuery<User, UserVariables>(GET_USER_QUERY, {
    variables,
    skip: !variables.id,
    fetchPolicy: 'cache-and-network', // Mostra cache instantaneamente, atualiza em background
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


  return result;
}
