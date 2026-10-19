import { useMutation, useQuery } from "@apollo/client/react";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";
import {
  GET_INSTITUTION_POSITIONS_QUERY,
  GET_INSTITUTION_POSITION_QUERY,
} from "@/graphql/queries/INSTITUTION_POSITIONS_QUERY";
import {
  CREATE_INSTITUTION_POSITION_MUTATION,
  UPDATE_INSTITUTION_POSITION_MUTATION,
  DELETE_INSTITUTION_POSITION_MUTATION,
} from "@/graphql/mutations/INSTITUTION_POSITIONS_MUTATIONS";
import {
  GetInstitutionPositions,
  GetInstitutionPositionsVariables,
} from "@/types/GetInstitutionPositions";
import {
  GetInstitutionPosition,
  GetInstitutionPositionVariables,
} from "@/types/GetInstitutionPosition";
import {
  CreateInstitutionPosition,
  CreateInstitutionPositionVariables,
} from "@/types/CreateInstitutionPosition";
import {
  UpdateInstitutionPosition,
  UpdateInstitutionPositionVariables,
} from "@/types/UpdateInstitutionPosition";
import {
  DeleteInstitutionPosition,
  DeleteInstitutionPositionVariables,
} from "@/types/DeleteInstitutionPosition";

export function useGetInstitutionPositionsQuery(
  variables: GetInstitutionPositionsVariables,
  options?: Omit<
    useQuery.Options<GetInstitutionPositions, GetInstitutionPositionsVariables>,
    "variables"
  >,
) {
  return useProtectedQuery<
    GetInstitutionPositions,
    GetInstitutionPositionsVariables
  >(
    GET_INSTITUTION_POSITIONS_QUERY,
    [PermissionResolverName.InstitutionPositions],
    {
      variables,
      skip: !variables.institution_id,
      fetchPolicy: "cache-and-network",
      ...(options as any),
    },
  );
}

export function useGetInstitutionPositionQuery(
  variables: GetInstitutionPositionVariables,
  options?: Omit<
    useQuery.Options<GetInstitutionPosition, GetInstitutionPositionVariables>,
    "variables"
  >,
) {
  return useProtectedQuery<
    GetInstitutionPosition,
    GetInstitutionPositionVariables
  >(
    GET_INSTITUTION_POSITION_QUERY,
    [PermissionResolverName.InstitutionPositions],
    {
      variables,
      skip: !variables.id,
      fetchPolicy: "cache-and-network",
      ...(options as any),
    },
  );
}

export function useCreateInstitutionPositionMutation(
  options?: useMutation.Options<
    CreateInstitutionPosition,
    CreateInstitutionPositionVariables
  >,
) {
  return useMutation<
    CreateInstitutionPosition,
    CreateInstitutionPositionVariables
  >(CREATE_INSTITUTION_POSITION_MUTATION, {
    refetchQueries: ["GetInstitutionPositions"],
    ...options,
  });
}

export function useUpdateInstitutionPositionMutation(
  options?: useMutation.Options<
    UpdateInstitutionPosition,
    UpdateInstitutionPositionVariables
  >,
) {
  return useMutation<
    UpdateInstitutionPosition,
    UpdateInstitutionPositionVariables
  >(UPDATE_INSTITUTION_POSITION_MUTATION, {
    refetchQueries: ["GetInstitutionPositions"],
    ...options,
  });
}

export function useDeleteInstitutionPositionMutation(
  options?: useMutation.Options<
    DeleteInstitutionPosition,
    DeleteInstitutionPositionVariables
  >,
) {
  return useMutation<
    DeleteInstitutionPosition,
    DeleteInstitutionPositionVariables
  >(DELETE_INSTITUTION_POSITION_MUTATION, {
    refetchQueries: ["GetInstitutionPositions"],
    ...options,
  });
}
