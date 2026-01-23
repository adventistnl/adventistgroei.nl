import { gql } from '@apollo/client'

export const GET_ZIP_INFO = gql`
  query GetZipInfo($zip: String!, $houseNumber: Int!) {
    getZipInfo(zip: $zip, houseNumber: $houseNumber) {
      city
      province
    }
  }
`
