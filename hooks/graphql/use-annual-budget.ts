import { useMutation } from "@apollo/client/react";
import {
  CREATE_INSTITUTION_BUDGET_MUTATION,
  UPDATE_INSTITUTION_BUDGET_MUTATION,
  CREATE_DEPARTMENT_BUDGET_MUTATION,
  UPDATE_DEPARTMENT_BUDGET_MUTATION,
  DELETE_ANNUAL_BUDGET_MUTATION,
  APPROVE_ANNUAL_BUDGET_MUTATION,
  REJECT_ANNUAL_BUDGET_MUTATION,
  REQUEST_REVISION_ANNUAL_BUDGET_MUTATION,
  TOGGLE_BUDGET_LOCK_MUTATION
} from "@/graphql/mutations/ANNUAL_BUDGET_MUTATIONS";
import { DeleteAnnualBudget, DeleteAnnualBudgetVariables } from "@/types/DeleteAnnualBudget";
import { ApproveAnnualBudget, ApproveAnnualBudgetVariables } from "@/types/ApproveAnnualBudget";
import { RejectAnnualBudget, RejectAnnualBudgetVariables } from "@/types/RejectAnnualBudget";
import { RequestRevisionAnnualBudget, RequestRevisionAnnualBudgetVariables } from "@/types/RequestRevisionAnnualBudget";
import { ToggleBudgetLock, ToggleBudgetLockVariables } from "@/types/ToggleBudgetLock";

// INSTITUTION BUDGET HOOKS
export function useCreateInstitutionBudgetMutation(options?: any) {
  return useMutation(CREATE_INSTITUTION_BUDGET_MUTATION, options);
}

export function useUpdateInstitutionBudgetMutation(options?: any) {
  return useMutation(UPDATE_INSTITUTION_BUDGET_MUTATION, options);
}

// DEPARTMENT BUDGET HOOKS
export function useCreateDepartmentBudgetMutation(options?: any) {
  return useMutation(CREATE_DEPARTMENT_BUDGET_MUTATION, options);
}

export function useUpdateDepartmentBudgetMutation(options?: any) {
  return useMutation(UPDATE_DEPARTMENT_BUDGET_MUTATION, options);
}

export function useDeleteAnnualBudgetMutation(options?: any) {
  return useMutation<DeleteAnnualBudget, DeleteAnnualBudgetVariables>(DELETE_ANNUAL_BUDGET_MUTATION, options);
}

export function useApproveAnnualBudgetMutation(options?: any) {
  return useMutation<ApproveAnnualBudget, ApproveAnnualBudgetVariables>(APPROVE_ANNUAL_BUDGET_MUTATION, options);
}

export function useRejectAnnualBudgetMutation(options?: any) {
  return useMutation<RejectAnnualBudget, RejectAnnualBudgetVariables>(REJECT_ANNUAL_BUDGET_MUTATION, options);
}

export function useRequestRevisionAnnualBudgetMutation(options?: any) {
  return useMutation<RequestRevisionAnnualBudget, RequestRevisionAnnualBudgetVariables>(REQUEST_REVISION_ANNUAL_BUDGET_MUTATION, options);
}

export function useToggleBudgetLockMutation(options?: any) {
  return useMutation<ToggleBudgetLock, ToggleBudgetLockVariables>(TOGGLE_BUDGET_LOCK_MUTATION, options);
}
