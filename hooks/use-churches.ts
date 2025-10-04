import { useMemo } from "react";
import { useCreateChurchMutation, useGetChurchesQuery } from "@/hooks/graphql/use-churches";
import { Churches_churches } from "@/types/Churches";
import { ApolloCache, ErrorLike } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CreateChurch, CreateChurchVariables } from "@/types/CreateChurch";

interface iChurches {
  churches: Churches_churches[];
  loading: boolean;
  error: ErrorLike | undefined;
  createChurch: useMutation.MutationFunction<CreateChurch, CreateChurchVariables, ApolloCache>
}

export function useChurches(): iChurches {
  const { data, loading, error } = useGetChurchesQuery();
  const [ createChurch ] = useCreateChurchMutation();

  const churches = useMemo(() => {
    if (!data || !data.churches) {
      return [];
    }
    return (data.churches as (Churches_churches | undefined)[]).filter(
      (church): church is Churches_churches => !!church
    );
  }, [data]);

  return {
    churches,
    loading,
    error,
    createChurch
  };
}
