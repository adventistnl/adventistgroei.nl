import { config } from "@/config/global";
import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

// have a function to create a client for you
export function makeClient() {
  console.log("Creating Apollo Client", config.graphqlApiUrl);
  const httpLink = new HttpLink({
    uri: config.graphqlApiUrl,
    fetchOptions: {
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}