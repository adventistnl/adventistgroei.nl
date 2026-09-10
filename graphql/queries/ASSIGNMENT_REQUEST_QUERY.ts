import { gql } from "@apollo/client";

export const GET_MY_ASSIGNMENT_REQUESTS_QUERY = gql`
  query MyAssignmentRequests {
    myAssignmentRequests {
      id
      date
      type
      status
      decided_at
      church {
        id
        name
      }
      user {
        id
        name
      }
      template {
        id
        name
      }
    }
  }
`;

export const GET_OPEN_SLOTS_FOR_PREACHER_QUERY = gql`
  query OpenSlotsForPreacher($month: String!) {
    openSlotsForPreacher(month: $month) {
      churchId
      churchName
      date
    }
  }
`;

export const GET_ELIGIBLE_PREACHERS_FOR_SLOT_QUERY = gql`
  query EligiblePreachersForSlot($church_id: String!, $date: DateTime!) {
    eligiblePreachersForSlot(church_id: $church_id, date: $date) {
      id
      name
    }
  }
`;

export const GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY = gql`
  query AssignmentInviteTemplates {
    assignmentInviteTemplates {
      id
      name
      subject
      body
    }
  }
`;
