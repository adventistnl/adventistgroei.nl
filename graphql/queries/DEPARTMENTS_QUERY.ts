import { gql } from "@apollo/client";

export const GET_DEPARTMENTS_QUERY = gql`
  query Departments($institution_id: String) {
    departments(institution_id: $institution_id) {
      id
      institution_id
      church_id
      name
      description
      contact_id
      leader_id
      created_at
      updated_at
      created_by
      updated_by
      is_deleted
      deleted_at
      deleted_by
      annual_budgets {
        id
        year
        is_locked
        allocated_amount
        total_expenses
      }
      users {
        id
        name
        email
      }
    }
  }
`;

export const GET_CHURCH_DEPARTMENTS_QUERY = gql`
  query GetChurchDepartments($church_id: String!) {
    departments(
      institution_id: null
      where: {
        church_id: { equals: $church_id }
        is_deleted: { equals: false }
      }
    ) {
      id
      name
      description
      church_id
      church {
        id
        name
      }
    }
  }
`;
