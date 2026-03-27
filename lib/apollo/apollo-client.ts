import { config } from "@/config/global";
import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { createUploadLink } from "apollo-upload-client";

/**
 * Helper function to get cookies synchronously
 * This is used instead of the useCookies hook to avoid React hook limitations
 * and to ensure we always get fresh cookies on each GraphQL request
 */
function getCookiesSync(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  return document.cookie
    .split('; ')
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
}

// have a function to create a client for you
export function makeClient() {
  const uploadLink = createUploadLink({
    uri: config.graphqlApiUrl,
    fetchOptions: {},
  });

  const authLink = setContext((operation, prevContext) => {
    let token = "";
    if (typeof window !== "undefined") {
      // Buscar cookies dinamicamente em cada requisição GraphQL
      // Isso garante que sempre usamos o token mais recente
      const cookies = getCookiesSync();
      token = cookies["auth-token"] || "";
    }
    return {
      ...prevContext,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "apollo-require-preflight": "true",
      },
    };
  });

  // WebSocket link for subscriptions (only in browser)
  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: config.graphqlApiUrl.replace(/^http/, "ws"),
            connectionParams: () => {
              const token =
                (typeof window !== "undefined" && localStorage.getItem("auth-token")) || "";
              return {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              };
            },            retryAttempts: Infinity,
            shouldRetry: () => true,
            on: {
              connecting: () => console.log("[WS] connecting to", config.graphqlApiUrl.replace(/^http/, "ws")),
              connected: () => console.log("[WS] connected ✅"),
              reconnecting: () => console.warn("[WS] reconnecting..."),
              closed: (e) => console.warn("[WS] closed", e),
              error: (e) => console.error("[WS] error", e),
            },          })
        )
      : null;

  // Route subscriptions → WebSocket, everything else → HTTP
  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(uploadLink)
      )
    : authLink.concat(uploadLink);

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
    link: splitLink,
  });
}