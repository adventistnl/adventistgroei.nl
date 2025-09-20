import { useMemo } from "react";
import { useGetChurchesQuery } from "@/hooks/graphql/use-get-churches-query";
import { Churches_churches } from "@/types/Churches";
import { ErrorLike } from "@apollo/client";

interface iChurches {
  churches: Churches_churches[];
  loading: boolean;
  error: ErrorLike | undefined;
}

export function useChurches(): iChurches {
  const { data, loading, error } = useGetChurchesQuery();
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
  };
}
