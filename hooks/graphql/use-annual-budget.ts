import { useMutation } from "@apollo/client/react";
import {
  CREATE_ANNUAL_BUDGET_MUTATION,
  UPDATE_ANNUAL_BUDGET_MUTATION,
  // DELETE_ANNUAL_BUDGET_MUTATION,
  // APPROVE_ANNUAL_BUDGET_MUTATION,
  // REJECT_ANNUAL_BUDGET_MUTATION,
  // REQUEST_REVISION_ANNUAL_BUDGET_MUTATION,
  // TOGGLE_BUDGET_LOCK_MUTATION
} from "@/graphql/mutations/ANNUAL_BUDGET_MUTATIONS";
import { CreateAnnualBudget, CreateAnnualBudgetVariables } from "@/types/CreateAnnualBudget";
import { UpdateAnnualBudget, UpdateAnnualBudgetVariables } from "@/types/UpdateAnnualBudget";
// import { DeleteAnnualBudget, DeleteAnnualBudgetVariables } from "@/types/DeleteAnnualBudget";
// import { ApproveAnnualBudget, ApproveAnnualBudgetVariables } from "@/types/ApproveAnnualBudget";
// import { RejectAnnualBudget, RejectAnnualBudgetVariables } from "@/types/RejectAnnualBudget";
// import { RequestRevision, RequestRevisionVariables } from "@/types/RequestRevision";
// import { ToggleBudgetLock, ToggleBudgetLockVariables } from "@/types/ToggleBudgetLock";

export function useCreateAnnualBudgetMutation(options?: useMutation.Options<CreateAnnualBudget, CreateAnnualBudgetVariables>): useMutation.ResultTuple<CreateAnnualBudget, CreateAnnualBudgetVariables> {
  return useMutation<CreateAnnualBudget, CreateAnnualBudgetVariables>(CREATE_ANNUAL_BUDGET_MUTATION, options);
}

export function useUpdateAnnualBudgetMutation(options?: useMutation.Options<UpdateAnnualBudget, UpdateAnnualBudgetVariables>): useMutation.ResultTuple<UpdateAnnualBudget, UpdateAnnualBudgetVariables> {
  return useMutation<UpdateAnnualBudget, UpdateAnnualBudgetVariables>(UPDATE_ANNUAL_BUDGET_MUTATION, options);
}

// TODO: Implement these mutations in the backend
// export function useDeleteAnnualBudgetMutation(options?: useMutation.Options<DeleteAnnualBudget, DeleteAnnualBudgetVariables>): useMutation.ResultTuple<DeleteAnnualBudget, DeleteAnnualBudgetVariables> {
//   return useMutation<DeleteAnnualBudget, DeleteAnnualBudgetVariables>(DELETE_ANNUAL_BUDGET_MUTATION, options);
// }

// export function useApproveAnnualBudgetMutation(options?: useMutation.Options<ApproveAnnualBudget, ApproveAnnualBudgetVariables>): useMutation.ResultTuple<ApproveAnnualBudget, ApproveAnnualBudgetVariables> {
//   return useMutation<ApproveAnnualBudget, ApproveAnnualBudgetVariables>(APPROVE_ANNUAL_BUDGET_MUTATION, options);
// }

// export function useRejectAnnualBudgetMutation(options?: useMutation.Options<RejectAnnualBudget, RejectAnnualBudgetVariables>): useMutation.ResultTuple<RejectAnnualBudget, RejectAnnualBudgetVariables> {
//   return useMutation<RejectAnnualBudget, RejectAnnualBudgetVariables>(REJECT_ANNUAL_BUDGET_MUTATION, options);
// }

// export function useRequestRevisionAnnualBudgetMutation(options?: useMutation.Options<RequestRevision, RequestRevisionVariables>): useMutation.ResultTuple<RequestRevision, RequestRevisionVariables> {
//   return useMutation<RequestRevision, RequestRevisionVariables>(REQUEST_REVISION_ANNUAL_BUDGET_MUTATION, options);
// }

// export function useToggleBudgetLockMutation(options?: useMutation.Options<ToggleBudgetLock, ToggleBudgetLockVariables>): useMutation.ResultTuple<ToggleBudgetLock, ToggleBudgetLockVariables> {
//   return useMutation<ToggleBudgetLock, ToggleBudgetLockVariables>(TOGGLE_BUDGET_LOCK_MUTATION, options);
// }
