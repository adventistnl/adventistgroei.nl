import { useMemo } from "react";
import { useCreateRegionMutation, useGetRegionsQuery, useUpdateRegionContactMutation, useUpdateRegionMutation } from "@/hooks/graphql/use-regions";
import { Regions, Regions_regions } from "@/types/Regions";
import { ErrorLike } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CreateRegion, CreateRegionVariables } from "@/types/CreateRegion";
import { ApolloCache } from "@apollo/client";
import { OperationVariables } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { UpdateRegion, UpdateRegionVariables } from "@/types/UpdateRegion";
import { UpdateRegionContact, UpdateRegionContactVariables } from "@/types/UpdateRegionContact";

interface iRegions {
  regions: Regions_regions[];
  regionsLoading: boolean;
  regionsError: ErrorLike | undefined;
  refetchRegions: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloClient.QueryResult<Regions>>
  createRegion: useMutation.MutationFunction<CreateRegion, CreateRegionVariables, ApolloCache>
  updateRegion: useMutation.MutationFunction<UpdateRegion, UpdateRegionVariables, ApolloCache>
  updateRegionContact: useMutation.MutationFunction<UpdateRegionContact, UpdateRegionContactVariables, ApolloCache>
}

export function useRegions(): iRegions {
  const { data, loading: regionsLoading, error: regionsError, refetch: refetchRegions } = useGetRegionsQuery();
  const [ createRegion ] = useCreateRegionMutation();
  const [ updateRegion ] = useUpdateRegionMutation();
  const [ updateRegionContact ] = useUpdateRegionContactMutation();

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
    regionsError,
    regionsLoading,
    refetchRegions,
    createRegion,
    updateRegion,
    updateRegionContact
  };
}
