import { useMutation } from "@apollo/client/react";
import { TRIGGER_MONTHLY_CLOSE_MUTATION } from "@/graphql/mutations/MONTHLY_CLOSE_MUTATIONS";
import { TriggerMonthlyClose, TriggerMonthlyCloseVariables } from "@/types/TriggerMonthlyClose";

export function useTriggerMonthlyCloseMutation(
  options?: useMutation.Options<TriggerMonthlyClose, TriggerMonthlyCloseVariables>,
): useMutation.ResultTuple<TriggerMonthlyClose, TriggerMonthlyCloseVariables> {
  return useMutation<TriggerMonthlyClose, TriggerMonthlyCloseVariables>(TRIGGER_MONTHLY_CLOSE_MUTATION, options);
}
