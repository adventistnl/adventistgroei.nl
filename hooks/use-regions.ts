import { useMemo } from "react";
import { useGetRegionsQuery } from "@/hooks/graphql/use-get-regions-query";
import { Regions_regions } from "@/types/Regions";
import { ErrorLike } from "@apollo/client";

interface iRegions {
  regions: Regions_regions[];
  loading: boolean;
  error: ErrorLike | undefined;
}

export function useRegions(): iRegions {
  const { data, loading, error } = useGetRegionsQuery();
  const regions = useMemo(() => {
    if (!data || !data.regions) {
      return [];
    }
    return (data.regions as (Regions_regions | undefined)[]).filter(
      (region): region is Regions_regions => !!region
    );
  }, [data]);

  return {
    regions,
    loading,
    error,
  };
}
