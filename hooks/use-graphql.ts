'use client'

import { USER_QUERY, LOGIN_MUTATION } from '@/graphql/graphql-operations';
import { useMutation, useQuery } from "@apollo/client/react";

export function useUser() {
  return useQuery(USER_QUERY);
}

export function useLogin() {
  return useMutation(LOGIN_MUTATION);
}
