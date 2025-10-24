import { gql } from "@apollo/client";

export const CREATE_REGION = gql`
  mutation CreateRegion(
    $name: String!
    $description: String
  ) {
    createRegion(
      data: {
        name: $name
        description: $description
      }
    ) {
      id
    }
  }
`;

// Ajustando a mutation `UPDATE_REGION` para seguir o padrão de `CREATE_REGION`
export const UPDATE_REGION = gql`
  mutation UpdateRegion(
    $id: ID!
    $name: String!
    $description: String
  ) {
    updateRegion(
      id: $id
      data: {
        name: $name
        description: $description
      }
    ) {
      id
    }
  }
`;


export const UPDATE_REGION_CONTACT = gql`
  mutation UpdateRegionContact(
    $id: String!
    $name: String
    $description: String
  ) {
    updateRegion(
      data: {
        name: $name
        description: $description
      }
      id: $id
    ) {
      id
    }
  }
`;
