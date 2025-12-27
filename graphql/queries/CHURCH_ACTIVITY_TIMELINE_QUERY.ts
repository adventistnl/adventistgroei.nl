import { gql } from "@apollo/client";

export const GET_CHURCH_ACTIVITY_TIMELINE_QUERY = gql`
  query GetChurchActivityTimeline($institution_id: String, $selectedYear: Float) {
    churchActivityTimeline(institution_id: $institution_id, selectedYear: $selectedYear)
  }
`;
