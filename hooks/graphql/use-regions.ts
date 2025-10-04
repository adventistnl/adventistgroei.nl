import { useMutation, useQuery } from "@apollo/client/react";
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY";
import { CREATE_REGION, UPDATE_REGION, UPDATE_REGION_CONTACT } from "@/graphql/mutations/REGION_MUTATIONS";
import { Regions } from "@/types/Regions";
import { CreateRegion, CreateRegionVariables } from "@/types/CreateRegion";
import { UpdateRegion, UpdateRegionVariables } from "@/types/UpdateRegion";
import { UpdateRegionContact, UpdateRegionContactVariables } from "@/types/UpdateRegionContact";

export function useGetRegionsQuery(options?: useQuery.Options<Regions>): useQuery.Result<Regions> {
  return useQuery<Regions>(GET_REGIONS_QUERY, options);
}

export function useCreateRegionMutation(options?: useMutation.Options<CreateRegion, CreateRegionVariables>): useMutation.ResultTuple<CreateRegion, CreateRegionVariables> {
  return useMutation<CreateRegion, CreateRegionVariables>(CREATE_REGION, options);
}

export function useUpdateRegionMutation(options?: useMutation.Options<UpdateRegion, UpdateRegionVariables>): useMutation.ResultTuple<UpdateRegion, UpdateRegionVariables> {
  return useMutation<UpdateRegion, UpdateRegionVariables>(UPDATE_REGION, options);
}

export function useUpdateRegionContactMutation(options?: useMutation.Options<UpdateRegionContact, UpdateRegionContactVariables>): useMutation.ResultTuple<UpdateRegionContact, UpdateRegionContactVariables> {
  return useMutation<UpdateRegionContact, UpdateRegionContactVariables>(UPDATE_REGION_CONTACT, options);
}