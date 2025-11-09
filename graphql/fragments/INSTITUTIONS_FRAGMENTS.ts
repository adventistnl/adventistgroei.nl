import { gql } from "@apollo/client";

export const CONTACT_FRAGMENT = gql`
  fragment ContactFragment on Contact {
    id
    name
    phone
    mobile
    email
    country
    city
    state
    address
    full_address
    postal_code
    website
    notes
    is_primary
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
  }
`;

export const SUBSIDY_REQUEST_FRAGMENT = gql`
  fragment SubsidyRequestFragment on SubsidyRequest {
    id
    description
    total_budget
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    institution_id
    requester_id
    department_id
    church_id
    subsidy_statuses_id
    project_id
  }
`;

export const DIRECT_MESSAGE_FRAGMENT = gql`
  fragment DirectMessageFragment on DirectMessage {
    id
    institution_id
    sender_id
    title
    content
    status
    sent_at
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
  }
`;

export const PROJECT_FRAGMENT = gql`
  fragment ProjectFragment on Project {
    id
    department_id
    title
    description
    budget
    language_preference
    type
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    event_id
    institution_id
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    email
    password
    language_preference
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    contact_id
    institution_id
    gender
    church {
      id
      name
    }
    institution {
      id
      name
    }
    user_roles {
      id
      role {
        id
        name
        key_code
        description
      }
    }
  }
`;

export const ANNUAL_BUDGET_FRAGMENT = gql`
  fragment AnnualBudgetFragment on AnnualBudget {
    year
    planned_budget
    total_expenses
  }
`;

export const REGION_FRAGMENT = gql`
  fragment RegionFragment on Region {
    id
    name
    churches {
      id
    }
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
  }
`;

export const DEPARTMENT_FRAGMENT = gql`
  fragment DepartmentFragment on Department {
    id
    institution_id
    church_id
    name
    description
    contact_id
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    contact {
      ...ContactFragment
    }
    church {
      id
      name
    }
    annual_budgets {
      ...AnnualBudgetFragment
    }
    users {
      id
    }
  }
`;

export const CHURCH_FRAGMENT = gql`
  fragment ChurchFragment on Church {
    id
    institution_id
    name
    region_id
    contact_id
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    type
    contact {
      ...ContactFragment
    }
    annual_budgets {
      ...AnnualBudgetFragment
    }
    departments {
      ...DepartmentFragment
    }
    region {
      id
      name
    }
    users {
      id
    }
  }
  ${DEPARTMENT_FRAGMENT}
`;

export const INSTITUTION_FRAGMENT = gql`
  fragment InstitutionFragment on Institution {
    id
    name
    denomination
    description
    language_preference
    contact_id
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    churches_count
    departments_count
    users_count
    contact {
      ...ContactFragment
    }
    subsidy_requests {
      ...SubsidyRequestFragment
    }
    direct_messages {
      ...DirectMessageFragment
    }
    projects {
      ...ProjectFragment
    }
    users {
      ...UserFragment
    }
    churches {
      ...ChurchFragment
    }
    departments {
      ...DepartmentFragment
    }
  }
  ${CONTACT_FRAGMENT}
  ${SUBSIDY_REQUEST_FRAGMENT}
  ${DIRECT_MESSAGE_FRAGMENT}
  ${PROJECT_FRAGMENT}
  ${USER_FRAGMENT}
  ${CHURCH_FRAGMENT}
  ${DEPARTMENT_FRAGMENT}
  ${ANNUAL_BUDGET_FRAGMENT}
`;