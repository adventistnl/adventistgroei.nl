/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectActivityUpdateDto, ActivityStatus, ActivityPriority, ActivityTags, EntityType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProjectActivity
// ====================================================

export interface UpdateProjectActivity_updateProjectActivity_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface UpdateProjectActivity_updateProjectActivity_activity_funding {
  __typename: "ActivityFunding";
  id: string;
  entity_contribution_amount: any;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface UpdateProjectActivity_updateProjectActivity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  owner_id: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  tags: ActivityTags[] | null;
  custom_tags: string[] | null;
  activity_tag: ActivityTags | null;
  is_subsidized: boolean;
  created_at: any;
  updated_at: any;
  owner: UpdateProjectActivity_updateProjectActivity_owner;
  activity_funding: UpdateProjectActivity_updateProjectActivity_activity_funding | null;
}

export interface UpdateProjectActivity {
  updateProjectActivity: UpdateProjectActivity_updateProjectActivity;
}

export interface UpdateProjectActivityVariables {
  input: ProjectActivityUpdateDto;
}
