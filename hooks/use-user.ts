import { useMemo } from "react";
import { useCookies } from "./use-cookies";
import { useGetUserQuery } from "./graphql/use-get-user-query";

function decodeJWT(token: string): any {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch (e) {
    return null;
  }
}

export function useUser({token, id}:{token?: string, id?: string}) {
  const { getCookies } = useCookies()

  const cookies = getCookies();

  const jwt = token || cookies['auth-token'];
  const loggedUserId = useMemo(() => {
    if (!jwt) return null;
    const decoded = decodeJWT(jwt);
    return decoded?.sub || null;
  }, [jwt]);

  const { data, error, loading, ...rest } = useGetUserQuery({ id: id ? id : loggedUserId },);

  return {
    user: data?.user || null,
    loggedUserId,
    loading,
    error,
    ...rest
  };
}
  