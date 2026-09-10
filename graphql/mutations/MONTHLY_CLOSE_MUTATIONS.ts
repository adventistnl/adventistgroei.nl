import { gql } from "@apollo/client";

export const TRIGGER_MONTHLY_CLOSE_MUTATION = gql`
  mutation TriggerMonthlyClose($month: String!) {
    triggerMonthlyClose(month: $month) {
      autoAccepted
      locked
    }
  }
`;
