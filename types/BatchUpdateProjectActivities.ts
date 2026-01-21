/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityStatus, ActivityPriority, ActivityTags } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: BatchUpdateProjectActivities
// ====================================================

export interface BatchUpdateProjectActivities_batchUpdateProjectActivities_assignees_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface BatchUpdateProjectActivities_batchUpdateProjectActivities_assignees {
  __typename: "ProjectActivityAssignee";
  id: string;
  user: BatchUpdateProjectActivities_batchUpdateProjectActivities_assignees_user;
}

export interface BatchUpdateProjectActivities_batchUpdateProjectActivities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  tags: ActivityTags[] | null;
  is_subsidized: boolean;
  updated_at: any;
  assignees: BatchUpdateProjectActivities_batchUpdateProjectActivities_assignees[] | null;
}

export interface BatchUpdateProjectActivities {
  batchUpdateProjectActivities: BatchUpdateProjectActivities_batchUpdateProjectActivities[];
}

export interface BatchUpdateProjectActivitiesVariables {
  ids: string[];
  status?: ActivityStatus | null;
  priority?: ActivityPriority | null;
  is_subsidized?: boolean | null;
}
