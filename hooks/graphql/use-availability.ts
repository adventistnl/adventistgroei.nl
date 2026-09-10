import { useMutation, useQuery } from "@apollo/client/react";
import { GET_MY_AVAILABILITY_QUERY, GET_MY_AVAILABILITY_RECURRENCE_RULES_QUERY } from "@/graphql/queries/AVAILABILITY_QUERY";
import {
  SET_AVAILABILITY_MUTATION,
  SET_AVAILABILITY_BULK_MUTATION,
  SET_AVAILABILITY_RECURRENCE_RULE_MUTATION,
  DELETE_AVAILABILITY_RECURRENCE_RULE_MUTATION,
} from "@/graphql/mutations/AVAILABILITY_MUTATIONS";
import { MyAvailability, MyAvailabilityVariables } from "@/types/MyAvailability";
import { MyAvailabilityRecurrenceRules } from "@/types/MyAvailabilityRecurrenceRules";
import { SetAvailability, SetAvailabilityVariables } from "@/types/SetAvailability";
import { SetAvailabilityBulk, SetAvailabilityBulkVariables } from "@/types/SetAvailabilityBulk";
import { SetAvailabilityRecurrenceRule, SetAvailabilityRecurrenceRuleVariables } from "@/types/SetAvailabilityRecurrenceRule";
import { DeleteAvailabilityRecurrenceRule, DeleteAvailabilityRecurrenceRuleVariables } from "@/types/DeleteAvailabilityRecurrenceRule";

export function useMyAvailabilityQuery(options?: useQuery.Options<MyAvailability, MyAvailabilityVariables>): useQuery.Result<MyAvailability, MyAvailabilityVariables> {
  return useQuery<MyAvailability, MyAvailabilityVariables>(GET_MY_AVAILABILITY_QUERY, options);
}

export function useMyAvailabilityRecurrenceRulesQuery(options?: useQuery.Options<MyAvailabilityRecurrenceRules>): useQuery.Result<MyAvailabilityRecurrenceRules> {
  return useQuery<MyAvailabilityRecurrenceRules>(GET_MY_AVAILABILITY_RECURRENCE_RULES_QUERY, options);
}

export function useSetAvailabilityMutation(options?: useMutation.Options<SetAvailability, SetAvailabilityVariables>): useMutation.ResultTuple<SetAvailability, SetAvailabilityVariables> {
  return useMutation<SetAvailability, SetAvailabilityVariables>(SET_AVAILABILITY_MUTATION, options);
}

export function useSetAvailabilityBulkMutation(options?: useMutation.Options<SetAvailabilityBulk, SetAvailabilityBulkVariables>): useMutation.ResultTuple<SetAvailabilityBulk, SetAvailabilityBulkVariables> {
  return useMutation<SetAvailabilityBulk, SetAvailabilityBulkVariables>(SET_AVAILABILITY_BULK_MUTATION, options);
}

export function useSetAvailabilityRecurrenceRuleMutation(options?: useMutation.Options<SetAvailabilityRecurrenceRule, SetAvailabilityRecurrenceRuleVariables>): useMutation.ResultTuple<SetAvailabilityRecurrenceRule, SetAvailabilityRecurrenceRuleVariables> {
  return useMutation<SetAvailabilityRecurrenceRule, SetAvailabilityRecurrenceRuleVariables>(SET_AVAILABILITY_RECURRENCE_RULE_MUTATION, options);
}

export function useDeleteAvailabilityRecurrenceRuleMutation(options?: useMutation.Options<DeleteAvailabilityRecurrenceRule, DeleteAvailabilityRecurrenceRuleVariables>): useMutation.ResultTuple<DeleteAvailabilityRecurrenceRule, DeleteAvailabilityRecurrenceRuleVariables> {
  return useMutation<DeleteAvailabilityRecurrenceRule, DeleteAvailabilityRecurrenceRuleVariables>(DELETE_AVAILABILITY_RECURRENCE_RULE_MUTATION, options);
}
