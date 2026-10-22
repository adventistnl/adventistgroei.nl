import { gql } from "@apollo/client";

export const GET_CHURCH_FOR_SERVICE_CALENDAR_QUERY = gql`
  query ChurchForServiceCalendar($id: String!) {
    church(id: $id) {
      id
      name
      leader_id
    }
  }
`;

export const GET_CHURCH_SERVICE_CALENDAR_QUERY = gql`
  query ChurchServiceCalendar($church_id: String!, $month: String!) {
    churchServiceCalendar(church_id: $church_id, month: $month) {
      id
      date
      has_service
      source
    }
  }
`;
