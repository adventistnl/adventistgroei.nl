import { ApolloCache } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCreateAnnualBudgetMutation } from "./graphql/use-annual-budget";
import { CreateAnnualBudget, CreateAnnualBudgetVariables } from "@/types/CreateAnnualBudget";

interface iAnnualBudget {
  createAnnualBudget: useMutation.MutationFunction<CreateAnnualBudget, CreateAnnualBudgetVariables, ApolloCache>
}

export function useAnnualBudget(): iAnnualBudget {
  const [ createAnnualBudget ] = useCreateAnnualBudgetMutation();

  return {
    createAnnualBudget
  };
}
