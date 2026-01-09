import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject(
    $title: String!
    $description: String!
    $department_id: String!
    $budget: Float!
    $subsidized_budget: Float
    $balance: Float
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
    $activities: [ProjectActivityCreateWithoutProjectDto!]
    $is_special_case: Boolean
    $special_case_reason: String
    $location_church_plant: String
    $special_budget: Float
    $church_id: String
  ) {
    createProject(
      data: {
        title: $title
        description: $description
        department_id: $department_id
        budget: $budget
        subsidized_budget: $subsidized_budget
        balance: $balance
        type: $type
        start_at: $start_at
        end_at: $end_at
        language_preference: $language_preference
        is_private: $is_private
        required_volunteers: $required_volunteers
        is_event: $is_event
        institution_id: $institution_id
        church_id: $church_id
        owner_id: $owner_id
        deadline: $deadline
        event: $event
        activities: $activities
        is_special_case: $is_special_case
        special_case_reason: $special_case_reason
        location_church_plant: $location_church_plant
        special_budget: $special_budget
      }
    ) {
      id
      title
      description
      budget
      subsidized_budget
      balance
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
      activities {
        id
        name
        description
        budget_amount
        deadline
        tags
        created_at
        updated_at
      }
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
    $subsidized_budget: Float
    $balance: Float
    $type: ProjectType
    $start_at: String
    $end_at: String
    $language_preference: LanguagePreference
    $is_private: Boolean
    $required_volunteers: Boolean
    $institution_id: String
    $church_id: String
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
        subsidized_budget: $subsidized_budget
        balance: $balance
        type: $type
        start_at: $start_at
        end_at: $end_at
        language_preference: $language_preference
        is_private: $is_private
        required_volunteers: $required_volunteers
        institution_id: $institution_id
        church_id: $church_id
        owner_id: $owner_id
        deadline: $deadline
      }
    ) {
      id
      title
      description
      budget
      subsidized_budget
      balance
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
