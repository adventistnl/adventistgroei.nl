import { useMemo, useEffect, useState } from "react";
import { useGetInstitutionsQuery } from "@/hooks/graphql/use-get-institutions-query";
import { useGetInstitutionByIdQuery } from "@/hooks/graphql/use-get-institution-by-id-query";
import { Institutions_institutions } from "@/types/Institutions";
import { InstitutionById_institution } from "@/types/InstitutionById";
import { ErrorLike } from "@apollo/client";
import { CreateInstitution } from "@/types/CreateInstitution";
import { useCreateInstitutionMutation, useDeleteInstitutionMutation, useUpdateInstitutionContactMutation, useUpdateInstitutionMutation } from "./graphql/use-institution-mutation";
import { UpdateInstitutionContact } from "@/types/UpdateInstitutionContact";
import { DeleteInstitution } from "@/types/DeleteInstitution";
import { UpdateInstitution } from "@/types/UpdateInstitution";
import { institutions as mockInstitutions, contacts } from "@/data/institutionsData";

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
  deletedInstitution?: DeleteInstitution | null | undefined;
  updateInstitution: ReturnType<typeof useUpdateInstitutionMutation>[0];
  updateLoading?: boolean;
  updateError?: ErrorLike | undefined;
  updatedInstitution?: UpdateInstitution | null | undefined;
  updateInstitutionContact: ReturnType<typeof useUpdateInstitutionContactMutation>[0]
  updatedInstitutionContact: UpdateInstitutionContact | null | undefined
  updateContactLoading: boolean
  updateContactError: ErrorLike | undefined
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
    { id: id || '' },
    {
      skip: !id, // Só buscar se tiver ID válido
      fetchPolicy: 'cache-and-network', // Usar cache enquanto busca dados atualizados
    }
  );

  const institutions = useMemo(() => {
    // Se há erro ou dados não carregaram, usa dados mock
    if (institutionsError) {
      return [];
    }
    if (!institutionsData || !institutionsData.institutions) {
      return [];
    }
    return (institutionsData.institutions as (Institutions_institutions | undefined)[]).filter(
      (institution): institution is Institutions_institutions => !!institution
    );
  }, [institutionsData, institutionsError]);

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
  }, [institutionData, institutionError]);

  const [createInstitution, { data: createdInstitution, loading: createLoading, error: createError }] = useCreateInstitutionMutation();
  const [deleteInstitution, { data: deletedInstitution, loading: deleteLoading, error: deleteError }] = useDeleteInstitutionMutation();
  const [updateInstitution, { data: updatedInstitution, loading: updateLoading, error: updateError }] = useUpdateInstitutionMutation();
  const [updateInstitutionContact, { data: updatedInstitutionContact, loading: updateContactLoading, error: updateContactError }] = useUpdateInstitutionContactMutation();

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
    updatedInstitutionContact,
    updateContactError,
    updateInstitutionContact,
    updateContactLoading,
  };
}
