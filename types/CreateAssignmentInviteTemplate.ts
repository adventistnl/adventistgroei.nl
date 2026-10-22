/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAssignmentInviteTemplate
// ====================================================

export interface CreateAssignmentInviteTemplate_createAssignmentInviteTemplate {
  __typename: "AssignmentInviteTemplate";
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface CreateAssignmentInviteTemplate {
  createAssignmentInviteTemplate: CreateAssignmentInviteTemplate_createAssignmentInviteTemplate;
}

export interface CreateAssignmentInviteTemplateVariables {
  name: string;
  subject: string;
  body: string;
}
