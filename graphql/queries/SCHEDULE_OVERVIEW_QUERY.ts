import { gql } from "@apollo/client";

export const GET_SCHEDULE_OVERVIEW_QUERY = gql`
  query ScheduleOverview($month: String!) {
    scheduleOverview(month: $month) {
      id
      church_id
      date
      user_id
      origin
      status
      church {
        id
        name
        region_id
      }
      user {
        id
        name
      }
    }
  }
`;
