import { gql } from "@apollo/client";

export const REQUEST_ASSIGNMENT_MUTATION = gql`
  mutation RequestAssignment($church_id: String!, $date: DateTime!) {
    requestAssignment(church_id: $church_id, date: $date) {
      id
      status
      type
    }
  }
`;

export const INVITE_TO_ASSIGNMENT_MUTATION = gql`
  mutation InviteToAssignment($church_id: String!, $date: DateTime!, $user_id: String!, $template_id: String) {
    inviteToAssignment(church_id: $church_id, date: $date, user_id: $user_id, template_id: $template_id) {
      id
      status
      type
    }
  }
`;

export const INVITE_TO_ASSIGNMENT_ANY_MUTATION = gql`
  mutation InviteToAssignmentAny($church_id: String!, $date: DateTime!, $user_id: String!, $template_id: String) {
    inviteToAssignmentAny(church_id: $church_id, date: $date, user_id: $user_id, template_id: $template_id) {
      id
      status
      type
    }
  }
`;

export const RESPOND_TO_ASSIGNMENT_REQUEST_MUTATION = gql`
  mutation RespondToAssignmentRequest($id: String!, $accept: Boolean!) {
    respondToAssignmentRequest(id: $id, accept: $accept) {
      id
      status
    }
  }
`;

export const RESPOND_TO_ASSIGNMENT_REQUEST_ANY_MUTATION = gql`
  mutation RespondToAssignmentRequestAny($id: String!, $accept: Boolean!) {
    respondToAssignmentRequestAny(id: $id, accept: $accept) {
      id
      status
    }
  }
`;

export const CREATE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION = gql`
  mutation CreateAssignmentInviteTemplate($name: String!, $subject: String!, $body: String!) {
    createAssignmentInviteTemplate(input: { name: $name, subject: $subject, body: $body }) {
      id
      name
      subject
      body
    }
  }
`;

export const UPDATE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION = gql`
  mutation UpdateAssignmentInviteTemplate($id: String!, $name: String, $subject: String, $body: String) {
    updateAssignmentInviteTemplate(id: $id, input: { name: $name, subject: $subject, body: $body }) {
      id
      name
      subject
      body
    }
  }
`;

export const DELETE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION = gql`
  mutation DeleteAssignmentInviteTemplate($id: String!) {
    deleteAssignmentInviteTemplate(id: $id)
  }
`;
