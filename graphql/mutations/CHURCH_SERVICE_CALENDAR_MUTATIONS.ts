import { gql } from "@apollo/client";

export const SET_CHURCH_SERVICE_CALENDAR_MUTATION = gql`
  mutation SetChurchServiceCalendar(
    $church_id: String!
    $has_service: Boolean!
    $date: DateTime
    $day_of_week: Int
    $effective_from: DateTime
    $effective_until: DateTime
  ) {
    setChurchServiceCalendar(
      input: {
        church_id: $church_id
        has_service: $has_service
        date: $date
        day_of_week: $day_of_week
        effective_from: $effective_from
        effective_until: $effective_until
      }
    ) {
      id
      date
      has_service
      source
    }
  }
`;

export const SET_CHURCH_SERVICE_CALENDAR_BULK_MUTATION = gql`
  mutation SetChurchServiceCalendarBulk(
    $church_ids: [String!]!
    $day_of_week: Int!
    $has_service: Boolean!
    $effective_from: DateTime!
    $effective_until: DateTime
  ) {
    setChurchServiceCalendarBulk(
      input: {
        church_ids: $church_ids
        day_of_week: $day_of_week
        has_service: $has_service
        effective_from: $effective_from
        effective_until: $effective_until
      }
    ) {
      id
      church_id
      date
      has_service
      source
    }
  }
`;
