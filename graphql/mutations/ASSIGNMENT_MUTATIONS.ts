import { gql } from "@apollo/client";

export const SET_ASSIGNMENT_MUTATION = gql`
  mutation SetAssignment($church_id: String!, $date: DateTime!, $user_id: String, $status: AssignmentStatus) {
    setAssignment(input: { church_id: $church_id, date: $date, user_id: $user_id, status: $status }) {
      id
      church_id
      date
      user_id
      origin
      status
    }
  }
`;

export const SET_ASSIGNMENT_ANY_MUTATION = gql`
  mutation SetAssignmentAny($church_id: String!, $date: DateTime!, $user_id: String, $status: AssignmentStatus) {
    setAssignmentAny(input: { church_id: $church_id, date: $date, user_id: $user_id, status: $status }) {
      id
      church_id
      date
      user_id
      origin
      status
    }
  }
`;
