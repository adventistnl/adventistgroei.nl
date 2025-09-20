import { config } from "@/config/global";
import { HttpLink, } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  
} from "@apollo/client-integration-nextjs";
import { useCookies } from "@/hooks/use-cookies";

// have a function to create a client for you
export function makeClient() {
  const { getCookies } = useCookies();
  const httpLink = new HttpLink({
    uri: config.graphqlApiUrl,
    fetchOptions: {},
  });

  const authLink = new SetContextLink((operation, prevContext) => {
    let token = "";
    if (typeof window !== "undefined") {
      const cookies = getCookies();
      token = cookies["auth-token"] || "";
    }
    return {
      ...prevContext,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}