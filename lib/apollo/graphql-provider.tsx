'use client'
import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import { makeClient } from '@/lib/apollo/apollo-client';

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
