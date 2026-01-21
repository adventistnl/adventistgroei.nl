import { useQuery } from "@apollo/client";
import { GET_CHURCH_ACTIVITY_TIMELINE_QUERY } from "@/graphql/queries/CHURCH_ACTIVITY_TIMELINE_QUERY";

interface UseChurchActivityTimelineOptions {
  institution_id?: string;
  selectedYear?: number;
  skip?: boolean;
}

export function useChurchActivityTimeline(options: UseChurchActivityTimelineOptions = {}) {
  const { institution_id, selectedYear, skip = false } = options;

  const { data, loading, error, refetch } = useQuery(
    GET_CHURCH_ACTIVITY_TIMELINE_QUERY,
    {
      variables: {
        institution_id,
        selectedYear,
      },
      skip: skip || !institution_id,
      fetchPolicy: "cache-and-network",
    }
  );

  return {
    activityData: data?.churchActivityTimeline || [],
    loading,
    error,
    refetch,
  };
}
