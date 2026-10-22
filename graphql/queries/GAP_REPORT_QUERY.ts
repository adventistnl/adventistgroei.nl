import { gql } from "@apollo/client";

export const GET_GAP_REPORT_QUERY = gql`
  query GapReport($month: String!) {
    gapReport(month: $month) {
      month
      computedAt
      churchesWithoutPreacher {
        churchId
        churchName
        date
      }
      preachersWithoutAssignment {
        userId
        userName
        date
      }
    }
  }
`;
