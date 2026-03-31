/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyProjects
// ====================================================

export interface MyProjects_myProjects {
  __typename: "Project";
  id: string;
  title: string;
  status: ProjectStatus;
  is_private: boolean;
  start_at: any;
  end_at: any;
}

export interface MyProjects {
  myProjects: MyProjects_myProjects[];
}
