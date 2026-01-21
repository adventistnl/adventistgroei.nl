import { gql } from "@apollo/client";
import { INSTITUTION_FRAGMENT, INSTITUTION_FRAGMENT_LIGHT } from "../fragments/INSTITUTIONS_FRAGMENTS";

export const GET_INSTITUTIONS_LIGHT_QUERY = gql`
  query InstitutionsLight {
    institutions {
      ...InstitutionFragmentLight
    }
  }
  ${INSTITUTION_FRAGMENT_LIGHT}
`;

export const GET_INSTITUTIONS_QUERY = gql`
  query Institutions {
    institutions {
      ...InstitutionFragment
    }
  }
  ${INSTITUTION_FRAGMENT}
`;

export const GET_INSTITUTION_BY_ID_LIGHT_QUERY = gql`
  query InstitutionByIdLight($id: String!) {
    institution(id: $id) {
      ...InstitutionFragmentLight
    }
  }
  ${INSTITUTION_FRAGMENT_LIGHT}
`;

export const GET_INSTITUTION_BY_ID_FULL_DATA_QUERY = gql`
  query InstitutionById($id: String!) {
    institution(id: $id) {
      ...InstitutionFragment
    }
  }
  ${INSTITUTION_FRAGMENT}
`;