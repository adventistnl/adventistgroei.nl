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
        color
      }
    }
  }
`;

export const ANNUAL_BUDGET_FRAGMENT = gql`
  fragment AnnualBudgetFragment on AnnualBudget {
    id
    year
    planned_budget
    total_expenses
    balance
    status
    priority
    category
    requested_by
    submitted_date
    created_at
    updated_at
    created_by
    updated_by
    is_deleted
    deleted_at
    deleted_by
    institution_id
    church_id
    department_id
    allocated_amount
    approved_amount
    reviewed_by
    review_date
    approval_date
    notes
    description
    justification
    documents
    is_locked
    has_budget_record
    entity_type
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
      ...UserFragment
    }
  }
  ${ANNUAL_BUDGET_FRAGMENT}
  ${CONTACT_FRAGMENT}
  ${USER_FRAGMENT}
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
      ...UserFragment
    }
  }
  ${DEPARTMENT_FRAGMENT}
  ${USER_FRAGMENT}
  ${ANNUAL_BUDGET_FRAGMENT}
  ${CONTACT_FRAGMENT}
`;

export const CHURCH_KPI_DATA_FRAGMENT = gql`
  fragment ChurchKpiDataFragment on ChurchKPIData {
    totalChurches
    totalMembers
    totalDepartments
    totalSubsidyRequests
    totalBudget
    totalUsedBudget
    budgetUtilization
    avgMembersPerChurch
  }
`;

export const CHURCH_ACTIVITY_DATA_FRAGMENT = gql`
  fragment ChurchActivityDataFragment on ChurchActivityData {
    church_id
    church_name
    month
    year
    activity_score
    user_count
    department_count
    project_count
    has_recent_activity
    has_recent_departments
    has_recent_projects
    has_updated_church
    has_new_users
  }
`;

export const INSTITUTION_CHARTS_DATA_FRAGMENT = gql`
  fragment InstitutionChartsDataFragment on InstitutionChartsData {
    usersByRole {
      role
      count
      fill
    }
    monthlyUserGrowth
    churchesByRegion {
      region
      name
      churches
      color
      fill
    }
  }
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
    total_budget
    current_year_budget
    has_budget_record
    contact {
      ...ContactFragment
    }
    annual_budgets {
      ...AnnualBudgetFragment
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
    churchesKpiData {
     ...ChurchKpiDataFragment
    }
    churchesActivityData {
      ...ChurchActivityDataFragment
    }
    institutionChartsData {
      ...InstitutionChartsDataFragment
    }
  }
  ${CHURCH_KPI_DATA_FRAGMENT}
  ${CHURCH_ACTIVITY_DATA_FRAGMENT}
  ${INSTITUTION_CHARTS_DATA_FRAGMENT}
  ${CONTACT_FRAGMENT}
  ${ANNUAL_BUDGET_FRAGMENT}
  ${SUBSIDY_REQUEST_FRAGMENT}
  ${DIRECT_MESSAGE_FRAGMENT}
  ${PROJECT_FRAGMENT}
  ${USER_FRAGMENT}
  ${CHURCH_FRAGMENT}
  ${DEPARTMENT_FRAGMENT}
`;