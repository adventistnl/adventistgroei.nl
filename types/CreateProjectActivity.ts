/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectActivityCreateDto, ActivityStatus, ActivityPriority, ActivityTags, EntityType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateProjectActivity
// ====================================================

export interface CreateProjectActivity_createProjectActivity_assignees_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface CreateProjectActivity_createProjectActivity_assignees {
  __typename: "ProjectActivityAssignee";
  id: string;
  user: CreateProjectActivity_createProjectActivity_assignees_user;
}

export interface CreateProjectActivity_createProjectActivity_activity_funding {
  __typename: "ActivityFunding";
  id: string;
  entity_contribution_amount: any;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface CreateProjectActivity_createProjectActivity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  tags: ActivityTags[] | null;
  custom_tags: string[] | null;
  is_subsidized: boolean;
  created_at: any;
  updated_at: any;
  assignees: CreateProjectActivity_createProjectActivity_assignees[] | null;
  activity_funding: CreateProjectActivity_createProjectActivity_activity_funding | null;
}

export interface CreateProjectActivity {
  createProjectActivity: CreateProjectActivity_createProjectActivity;
}

export interface CreateProjectActivityVariables {
  input: ProjectActivityCreateDto;
}
