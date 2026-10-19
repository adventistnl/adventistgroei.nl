import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { GET_AVAILABLE_YEARS_DYNAMIC } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { AvailableYearsEntity } from "@/types/globalTypes"
import { useInstitution } from "@/contexts/institution-context"

/**
 * A standardized hook for fetching the available years to populate the date selector 
 * in the UI, dynamically based on the requested entities.
 * 
 * @param entities An array of entities (AvailableYearsEntity) that should be queried to find the minimum year.
 * @returns An object containing the availableYears array, the setter for optimistic updates, and loading state.
 */
export function useAvailableYears(entities: AvailableYearsEntity[]) {
  const { currentInstitutionData } = useInstitution()
  
  // Default fallback of last 3 years to ensure fast first render
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const current = new Date().getFullYear()
    return [current, current - 1, current - 2]
  })

  const { data: dashboardYearsData, loading } = useQuery(GET_AVAILABLE_YEARS_DYNAMIC, {
    variables: { 
      institution_id: currentInstitutionData?.id,
      entities 
    },
    fetchPolicy: 'cache-and-network',
    skip: !currentInstitutionData?.id || entities.length === 0
  })

  useEffect(() => {
    if (dashboardYearsData?.availableYears) {
      setAvailableYears(dashboardYearsData.availableYears)
    }
  }, [dashboardYearsData])

  return { availableYears, setAvailableYears, loading }
}
