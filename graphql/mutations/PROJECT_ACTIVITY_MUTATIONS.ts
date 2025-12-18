import { gql } from "@apollo/client";

export const CREATE_PROJECT_ACTIVITY = gql`
  mutation CreateProjectActivity($input: ProjectActivityCreateDto!) {
    createProjectActivity(input: $input) {
      id
      name
      description
      budget_amount
      deadline
      status
      priority
      tags
      is_subsidized
      created_at
      updated_at
      owner {
        id
        name
        email
      }
      activity_funding {
        id
        entity_contribution_amount
        entity_contribution_percent
        entity_type
        entity_id
      }
    }
  }
`;

export const BATCH_UPDATE_PROJECT_ACTIVITIES = gql`
  mutation BatchUpdateProjectActivities(
    $ids: [String!]!
    $status: ActivityStatus
    $priority: ActivityPriority
    $activity_tag: ActivityTags
    $is_subsidized: Boolean
  ) {
    batchUpdateProjectActivities(
      data: {
        ids: $ids
        status: $status
        priority: $priority
        activity_tag: $activity_tag
        is_subsidized: $is_subsidized
      }
    ) {
      id
      name
      description
      budget_amount
      deadline
      status
      priority
      tags
      is_subsidized
      updated_at
      owner {
        id
        name
        email
      }
    }
  }
`;
