import { gql } from '@apollo/client'

/**
 * Query GraphQL para buscar departamentos com seus líderes
 * Retorna informações completas sobre cada líder incluindo contato e roles
 */
export const GET_DEPARTMENTS_WITH_LEADERS = gql`
  query GetDepartmentsWithLeaders($institution_id: String!) {
    departments(institution_id: $institution_id) {
      id
      name
      description
      church_id
      leader_id
      leader {
        id
        name
        email
        language_preference
        contact_id
        contact {
          id
          phone
          mobile
          email
        }
        user_roles {
          id
          role {
            id
            name
            key_code
          }
        }
      }
      church {
        id
        name
      }
      users {
        id
        name
      }
      created_at
      updated_at
      is_deleted
    }
  }
`

/**
 * Query para buscar todos os departamentos liderados por um usuário específico
 */
export const GET_USER_LED_DEPARTMENTS = gql`
  query GetUserLedDepartments($user_id: String!) {
    user(id: $user_id) {
      id
      name
      email
      led_departments {
        id
        name
        description
        institution {
          id
          name
        }
        church {
          id
          name
        }
        users {
          id
          name
        }
      }
    }
  }
`
