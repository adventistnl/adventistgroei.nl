import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject(
    $title: String!
    $description: String!
    $department_id: String!
    $budget: Float!
    $type: ProjectType!
    $start_at: String!
    $end_at: String!
    $language_preference: LanguagePreference!
    $is_private: Boolean!
    $required_volunteers: Boolean!
    $is_event: Boolean!
    $institution_id: String
    $owner_id: String
    $deadline: String
    $event: EventCreateDto
  ) {
    createProject(
      data: {
        title: $title
        description: $description
        department_id: $department_id
        budget: $budget
        type: $type
        start_at: $start_at
        end_at: $end_at
        language_preference: $language_preference
        is_private: $is_private
        required_volunteers: $required_volunteers
        is_event: $is_event
        institution_id: $institution_id
        owner_id: $owner_id
        deadline: $deadline
        event: $event
      }
    ) {
      id
      title
      description
      budget
      type
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      language_preference
      department_id
      owner_id
      institution_id
      event_id
      created_at
      updated_at
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject(
    $id: String!
    $title: String
    $description: String
    $department_id: String
    $budget: Float
    $type: ProjectType
    $start_at: String
    $end_at: String
    $language_preference: LanguagePreference
    $is_private: Boolean
    $required_volunteers: Boolean
    $institution_id: String
    $owner_id: String
    $deadline: String
  ) {
    updateProject(
      id: $id
      data: {
        title: $title
        description: $description
        department_id: $department_id
        budget: $budget
        type: $type
        start_at: $start_at
        end_at: $end_at
        language_preference: $language_preference
        is_private: $is_private
        required_volunteers: $required_volunteers
        institution_id: $institution_id
        owner_id: $owner_id
        deadline: $deadline
      }
    ) {
      id
      title
      description
      budget
      type
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      language_preference
      updated_at
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      id
      title
      is_deleted
      deleted_at
    }
  }
`;
