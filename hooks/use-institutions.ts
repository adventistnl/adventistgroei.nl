import { useMemo } from "react";
import { useGetInstitutionsQuery } from "@/hooks/graphql/use-get-institutions-query";
import { useGetInstitutionByIdQuery } from "@/hooks/graphql/use-get-institution-by-id-query";
import { Institutions_institutions } from "@/types/Institutions";
import { InstitutionById_institution } from "@/types/InstitutionById";
import { ApolloCache, ErrorLike } from "@apollo/client";
import { CreateInstitution, CreateInstitutionVariables } from "@/types/CreateInstitution";
import { useCreateInstitutionMutation, useDeleteInstitutionMutation, useUpdateInstitutionMutation } from "./graphql/use-institution-mutation";

export interface iInstitutions {
  institutions: Institutions_institutions[];
  currentInstitutionData: InstitutionById_institution | null;
  loading: boolean;
  error: ErrorLike | undefined;
  institutionLoading?: boolean;
  institutionError?: ErrorLike | undefined;
  createLoading?: boolean;
  createError?: ErrorLike | undefined;
  createInstitution: ReturnType<typeof useCreateInstitutionMutation>[0];
  createdInstitution?: CreateInstitution | null;
  deleteInstitution: ReturnType<typeof useDeleteInstitutionMutation>[0];
  deleteLoading?: boolean;
  deleteError?: ErrorLike | undefined;
  deletedInstitution?: any;
  updateInstitution: ReturnType<typeof useUpdateInstitutionMutation>[0];
  updateLoading?: boolean;
  updateError?: ErrorLike | undefined;
  updatedInstitution?: any;
}

export function useInstitutions(id?: string): iInstitutions & {
  refetchInstitutions: () => void;
  refetchInstitutionById: () => void;
} {
  const {
    data: institutionsData,
    loading: institutionsLoading,
    error: institutionsError,
    refetch: refetchInstitutionsRaw
  } = useGetInstitutionsQuery();
  const {
    data: institutionData,
    loading: institutionLoading,
    error: institutionError,
    refetch: refetchInstitutionByIdRaw
  } = useGetInstitutionByIdQuery(
    { id },
  );
  const [createInstitution, { data: createdInstitution, loading: createLoading, error: createError }] = useCreateInstitutionMutation();
  const [deleteInstitution, { data: deletedInstitution, loading: deleteLoading, error: deleteError }] = useDeleteInstitutionMutation();
  const [updateInstitution, { data: updatedInstitution, loading: updateLoading, error: updateError }] = useUpdateInstitutionMutation();

  const institutions = useMemo(() => {
    if (!institutionsData || !institutionsData.institutions) {
      return [];
    }
    return (institutionsData.institutions as (Institutions_institutions | undefined)[]).filter(
      (institution): institution is Institutions_institutions => !!institution
    );
  }, [institutionsData]);

  const currentInstitutionData = useMemo(() => {
    const institution = institutionData?.institution;
    if (
      institution &&
      typeof institution.__typename === "string" &&
      institution.__typename === "Institution"
    ) {
      return institution as InstitutionById_institution;
    }
    return null;
  }, [institutionData]);

  return {
    institutions,
    currentInstitutionData,
    loading: institutionsLoading || institutionLoading,
    error: institutionsError || institutionError,
    createInstitution,
    institutionLoading,
    institutionError,
    createLoading,
    createError,
    createdInstitution,
    deleteInstitution,
    deleteLoading,
    deleteError,
    deletedInstitution,
    updateInstitution,
    updateLoading,
    updateError,
    updatedInstitution,
    refetchInstitutions: () => { refetchInstitutionsRaw(); },
    refetchInstitutionById: () => { refetchInstitutionByIdRaw(); },
  };
}
