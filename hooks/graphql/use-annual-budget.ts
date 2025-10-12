import { useMutation } from "@apollo/client/react";
import { CREATE_ANNUAL_BUDGET_MUTATION } from "@/graphql/mutations/ANNUAL_BUDGET_MUTATIONS";
import { CreateAnnualBudget, CreateAnnualBudgetVariables } from "@/types/CreateAnnualBudget";

export function useCreateAnnualBudgetMutation(options?: useMutation.Options<CreateAnnualBudget, CreateAnnualBudgetVariables>): useMutation.ResultTuple<CreateAnnualBudget, CreateAnnualBudgetVariables> {
  return useMutation<CreateAnnualBudget, CreateAnnualBudgetVariables>(CREATE_ANNUAL_BUDGET_MUTATION, options);
}
