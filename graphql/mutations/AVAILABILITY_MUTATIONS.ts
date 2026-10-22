import { gql } from "@apollo/client";

export const SET_AVAILABILITY_MUTATION = gql`
  mutation SetAvailability($date: DateTime!, $status: AvailabilityStatus!, $note: String) {
    setAvailability(input: { date: $date, status: $status, note: $note }) {
      id
      date
      status
      source
      note
    }
  }
`;

export const SET_AVAILABILITY_BULK_MUTATION = gql`
  mutation SetAvailabilityBulk($start_date: DateTime!, $end_date: DateTime!, $status: AvailabilityStatus!, $note: String) {
    setAvailabilityBulk(input: { start_date: $start_date, end_date: $end_date, status: $status, note: $note }) {
      id
      date
      status
      source
      note
    }
  }
`;

export const SET_AVAILABILITY_RECURRENCE_RULE_MUTATION = gql`
  mutation SetAvailabilityRecurrenceRule(
    $id: String
    $type: RecurrenceType!
    $status: AvailabilityStatus!
    $day_of_week: Int
    $start_date: DateTime
    $end_date: DateTime
    $effective_from: DateTime
    $effective_until: DateTime
    $note: String
  ) {
    setAvailabilityRecurrenceRule(
      input: {
        id: $id
        type: $type
        status: $status
        day_of_week: $day_of_week
        start_date: $start_date
        end_date: $end_date
        effective_from: $effective_from
        effective_until: $effective_until
        note: $note
      }
    ) {
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

export const DELETE_AVAILABILITY_RECURRENCE_RULE_MUTATION = gql`
  mutation DeleteAvailabilityRecurrenceRule($id: String!) {
    deleteAvailabilityRecurrenceRule(id: $id)
  }
`;
