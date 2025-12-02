import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $language_preference: String!
    $institution_id: String!
    $institution_department_id: String
    $church_department_id: String
    $church_id: String
    $roles: [String!]!
    $gender: GenderType!
    $invite_token: String!
  ) {
    createUser(
      data: {
        name: $name
        email: $email
        password: $password
        language_preference: $language_preference
        institution_id: $institution_id
        church_department_id: $church_department_id
        institution_department_id: $institution_department_id
        church_id: $church_id
        roles: $roles
        gender: $gender
        invite_token: $invite_token
      }
    ) {
      id
      institution_id
      password
      church_id
      name
      email
      language_preference
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String!
    $name: String
    $contact_id: String
    $email: String
    $language_preference: String
    $institution_id: String
    $church_id: String
    $department_id: String
    $is_deleted: Boolean
    $phone: String
    $address: String
    $gender: GenderType
  ) {
    updateUser(
      data: {
        name: $name
        contact_id: $contact_id
        email: $email
        language_preference: $language_preference
        institution_id: $institution_id
        church_id: $church_id
        department_id: $department_id
        is_deleted: $is_deleted
        phone: $phone
        address: $address
        gender: $gender
      }
      id: $id
    ) {
      id
    }
  }
`;

export const ADD_ROLE_TO_USER = gql`
  mutation AddRoleToUser($userId: String!, $roleId: String!) {
    addRoleToUser(userId: $userId, roleId: $roleId) {
      id
    }
  }
`;

export const REMOVE_ROLE_FROM_USER = gql`
  mutation RemoveRoleFromUser($userId: String!, $roleId: String!) {
    removeRoleFromUser(userId: $userId, roleId: $roleId) {
      id
    }
  }
`;
