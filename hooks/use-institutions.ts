import { useMemo } from "react";
import { useGetInstitutionsQuery } from "@/hooks/graphql/use-get-institutions-query";
import { useGetInstitutionByIdQuery } from "@/hooks/graphql/use-get-institution-by-id-query";
import { Institutions_institutions } from "@/types/Institutions";
import { InstitutionById_institution } from "@/types/InstitutionById";
import { ErrorLike } from "@apollo/client";

interface iInstitutions {
  institutions: Institutions_institutions[];
  currentInstitutionData: InstitutionById_institution | null;
  loading: boolean;
  error: ErrorLike | undefined;
}

export function useInstitutions(id?: string): iInstitutions {
  const { data: institutionsData, loading: institutionsLoading, error: institutionsError } = useGetInstitutionsQuery();
  const { data: institutionData, loading: institutionLoading, error: institutionError } = useGetInstitutionByIdQuery(
    { id: id || "" },
  );

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
  };
}
