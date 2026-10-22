/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAssignmentInviteTemplate
// ====================================================

export interface UpdateAssignmentInviteTemplate_updateAssignmentInviteTemplate {
  __typename: "AssignmentInviteTemplate";
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface UpdateAssignmentInviteTemplate {
  updateAssignmentInviteTemplate: UpdateAssignmentInviteTemplate_updateAssignmentInviteTemplate;
}

export interface UpdateAssignmentInviteTemplateVariables {
  id: string;
  name?: string | null;
  subject?: string | null;
  body?: string | null;
}
