import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { User } from "@/types/User";
import { GET_USER_QUERY } from "@/graphql/queries/GET_USER_QUERY";

function decodeJWT(token: string): any {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch (e) {
    return null;
  }
}

export function useUser(token?: string) {
  // Pega o token do localStorage se não for passado
  const jwt = token || (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "");
  const userId = useMemo(() => {
    if (!jwt) return null;
    const decoded = decodeJWT(jwt);
    return decoded?.sub || null;
  }, [jwt]);

  interface GetUserQueryResult {
    user: User;
  }

  const { data, loading, error } = useQuery<GetUserQueryResult>(GET_USER_QUERY, {
    skip: !userId,
    variables: { id: userId },
    context: { headers: { Authorization: jwt ? `Bearer ${jwt}` : "" } },
  });

  useEffect(() => {
    if (data && data.user && typeof window !== "undefined") {
      localStorage.setItem("auth-user", JSON.stringify(data.user));
    }
  }, [data]);

  return {
    user: data?.user || null,
    loading,
    error,
  };
}
