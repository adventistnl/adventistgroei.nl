import { config } from "@/config/global";
import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useCookies } from "@/hooks/use-cookies";

// have a function to create a client for you
export function makeClient() {
  const { getCookies } = useCookies();
  const httpLink = new HttpLink({
    uri: config.graphqlApiUrl,
    fetchOptions: {},
  });

  const authLink = setContext((operation, prevContext) => {
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
    cache: new InMemoryCache({
      typePolicies: {
        RoleModel: {
          fields: {
            permissions: {
              merge(existing = [], incoming) {
                // Evitar duplicação com base no campo 'group'
                const merged = [...existing, ...incoming];
                const uniquePermissions = merged.reduce((acc: any[], item: any) => {
                  if (!acc.some((perm: any) => perm.group === item.group)) {
                    acc.push(item);
                  }
                  return acc;
                }, []);

                return uniquePermissions;
              },
            },
          },
        },
      },
    }),
    link: authLink.concat(httpLink),
  });
}