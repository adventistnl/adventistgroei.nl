import { gql } from "@apollo/client";
import { INSTITUTION_FRAGMENT } from "../fragments/INSTITUTIONS_FRAGMENTS";

export const GET_INSTITUTIONS_QUERY = gql`
  query Institutions {
    institutions {
      ...InstitutionFragment
    }
  }
  ${INSTITUTION_FRAGMENT}
`;

export const GET_INSTITUTION_BY_ID_FULL_DATA_QUERY = gql`
  query InstitutionById($id: String!) {
    institution(id: $id) {
      ...InstitutionFragment
    }
  }
  ${INSTITUTION_FRAGMENT}
`;