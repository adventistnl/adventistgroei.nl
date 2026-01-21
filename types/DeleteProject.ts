/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProject
// ====================================================

export interface DeleteProject_deleteProject {
  __typename: "Project";
  id: string;
  title: string;
  is_deleted: boolean;
  deleted_at: any | null;
}

export interface DeleteProject {
  deleteProject: DeleteProject_deleteProject;
}

export interface DeleteProjectVariables {
  id: string;
}
