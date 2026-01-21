import { gql } from '@apollo/client';

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment(
    $name: String!,
    $description: String!,
    $institution: String!,
    $leader_id: String!,
    $church: String,
    $contactName: String,
    $email: String,
    $phone: String,
  ) {
    createDepartment(
      data: {
        name: $name,
        description: $description,
        institution: $institution,
        leader_id: $leader_id,
        church: $church,
        contact: {
          name: $contactName,
          email: $email,
          phone: $phone,
        }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment(
    $id: String!,
    $name: String!,
    $description: String!,
    $leader_id: String!,
    $church: String,
    $contactName: String,
    $email: String,
    $phone: String
  ) {
    updateDepartment(
      id: $id,
      data: {
        name: $name,
        description: $description,
        leader_id: $leader_id,
        church_id: $church,
        contact: {
          name: $contactName,
          email: $email,
          phone: $phone
        }
      }
    ) {
      id
      name
      description
      church_id
      leader_id
      contact {
        id
        name
        phone
        email
      }
    }
  }
`;

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: String!) {
    deleteDepartment(id: $id) {
      id
      name
      is_deleted
      deleted_at
    }
  }
`;