import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { User } from "@/types/User";
import { GET_USER_QUERY } from "@/graphql/queries/GET_USER_QUERY";
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

export function useUser(token?: string) {
  // Pega o token do localStorage se não for passado
  const { getCookies } = useCookies()

  const cookies = getCookies(); // Utiliza o hook useCookies para obter os cookies


  const jwt = token || cookies['auth-token'];
  const userId = useMemo(() => {
    if (!jwt) return null;
    const decoded = decodeJWT(jwt);
    return decoded?.sub || null;
  }, [jwt]);
  console.log("User ID from token:", userId);


  const { data: user } = useGetUserQuery({ id: userId });
  console.log("User data from query:", user);
  // const user = useMemo(() => { 

  //   return data || null;
  // }, [userId]);



  return {
    user,
    userId,
    // refetch,
    // loading,
    // error,
  };
}
