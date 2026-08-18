import { gql } from "@apollo/client";

export const GET_MY_AVAILABILITY_QUERY = gql`
  query MyAvailability($month: String!) {
    myAvailability(month: $month) {
      id
      date
      status
      source
      note
      recurrence_rule_id
    }
  }
`;

export const GET_MY_AVAILABILITY_RECURRENCE_RULES_QUERY = gql`
  query MyAvailabilityRecurrenceRules {
    myAvailabilityRecurrenceRules {
      id
      type
      status
      day_of_week
      start_date
      end_date
      effective_from
      effective_until
      note
    }
  }
`;
