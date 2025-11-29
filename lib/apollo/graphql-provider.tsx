'use client'
import { ApolloProvider } from "@apollo/client";
import { makeClient } from '@/lib/apollo/apollo-client';
import { useMemo } from 'react';

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => makeClient(), []);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
