import { gql } from "@apollo/client";

export const CREATE_ANNUAL_BUDGET_MUTATION = gql`
  mutation CreateAnnualBudget(
      $year: Int!
      $planned_budget: Float!
      $entity_type: String!
      $entity_id: String!
      $description: String!
      $justification: String
  ) {
      createAnnualBudget(
          data: {
              year: $year
              planned_budget: $planned_budget
              entity_type: $entity_type
              entity_id: $entity_id
              description: $description
              justification: $justification
          }
      ) {
          id
      }
  }
`