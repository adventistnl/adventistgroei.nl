import { gql } from "@apollo/client";

export const CREATE_REGION = gql`
  mutation CreateRegion(
    $name: String!
    $description: String
    $territory: JSON
    $color: String
  ) {
    createRegion(
      data: {
        name: $name
        description: $description
        territory: $territory
        color: $color
      }
    ) {
      id
      name
      description
      territory
      color
    }
  }
`;

export const UPDATE_REGION = gql`
  mutation UpdateRegion(
    $id: String!
    $name: String
    $description: String
    $territory: JSON
    $color: String
  ) {
    updateRegion(
      id: $id
      data: {
        name: $name
        description: $description
        territory: $territory
        color: $color
      }
    ) {
      id
      name
      description
      territory
      color
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

export const DELETE_REGION = gql`
  mutation DeleteRegion($id: String!) {
    deleteRegion(id: $id) {
      id
    }
  }
`;