import { useCallback, useMemo } from "react";
import {
  useMyAvailabilityQuery,
  useMyAvailabilityRecurrenceRulesQuery,
  useSetAvailabilityMutation,
  useSetAvailabilityBulkMutation,
  useSetAvailabilityRecurrenceRuleMutation,
  useDeleteAvailabilityRecurrenceRuleMutation,
} from "@/hooks/graphql/use-availability";
import { GET_MY_AVAILABILITY_QUERY, GET_MY_AVAILABILITY_RECURRENCE_RULES_QUERY } from "@/graphql/queries/AVAILABILITY_QUERY";
import { MyAvailability_myAvailability } from "@/types/MyAvailability";
import { MyAvailabilityRecurrenceRules_myAvailabilityRecurrenceRules } from "@/types/MyAvailabilityRecurrenceRules";
import { AvailabilityStatus, RecurrenceType } from "@/types/globalTypes";
import { ErrorLike } from "@apollo/client";

/**
 * "month" is the calendar month currently shown on the availability screen, formatted
 * "YYYY-MM" — see docs/graphql-contract/phase-1.graphql. Mutations refetch this exact query
 * so the calendar reflects the change immediately without a manual page reload.
 */
export function useMyAvailability(month: string) {
  const { data, loading, error, refetch } = useMyAvailabilityQuery({ variables: { month } });

  const [setAvailabilityMutation, { loading: savingOne }] = useSetAvailabilityMutation({
    refetchQueries: [{ query: GET_MY_AVAILABILITY_QUERY, variables: { month } }],
  });
  const [setAvailabilityBulkMutation, { loading: savingBulk }] = useSetAvailabilityBulkMutation({
    refetchQueries: [{ query: GET_MY_AVAILABILITY_QUERY, variables: { month } }],
  });

  const availability = useMemo<MyAvailability_myAvailability[]>(() => data?.myAvailability ?? [], [data]);

  const setAvailability = useCallback(
    (date: string, status: AvailabilityStatus, note?: string) =>
      setAvailabilityMutation({ variables: { date, status, note } }),
    [setAvailabilityMutation],
  );

  const setAvailabilityBulk = useCallback(
    (startDate: string, endDate: string, status: AvailabilityStatus, note?: string) =>
      setAvailabilityBulkMutation({ variables: { start_date: startDate, end_date: endDate, status, note } }),
    [setAvailabilityBulkMutation],
  );

  return {
    availability,
    loading,
    saving: savingOne || savingBulk,
    error: error as ErrorLike | undefined,
    refetch,
    setAvailability,
    setAvailabilityBulk,
  };
}

export function useMyAvailabilityRecurrenceRules() {
  const { data, loading, error } = useMyAvailabilityRecurrenceRulesQuery();

  const [setRuleMutation, { loading: savingRule }] = useSetAvailabilityRecurrenceRuleMutation({
    refetchQueries: [{ query: GET_MY_AVAILABILITY_RECURRENCE_RULES_QUERY }],
  });
  const [deleteRuleMutation, { loading: deletingRule }] = useDeleteAvailabilityRecurrenceRuleMutation({
    refetchQueries: [{ query: GET_MY_AVAILABILITY_RECURRENCE_RULES_QUERY }],
  });

  const rules = useMemo<MyAvailabilityRecurrenceRules_myAvailabilityRecurrenceRules[]>(
    () => data?.myAvailabilityRecurrenceRules ?? [],
    [data],
  );

  const setWeeklyRule = useCallback(
    (params: { id?: string; dayOfWeek: number; status: AvailabilityStatus; effectiveFrom: string; effectiveUntil?: string; note?: string }) =>
      setRuleMutation({
        variables: {
          id: params.id,
          type: RecurrenceType.WEEKLY,
          status: params.status,
          day_of_week: params.dayOfWeek,
          effective_from: params.effectiveFrom,
          effective_until: params.effectiveUntil,
          note: params.note,
        },
      }),
    [setRuleMutation],
  );

  const setDateRangeRule = useCallback(
    (params: { id?: string; startDate: string; endDate: string; status: AvailabilityStatus; note?: string }) =>
      setRuleMutation({
        variables: {
          id: params.id,
          type: RecurrenceType.DATE_RANGE,
          status: params.status,
          start_date: params.startDate,
          end_date: params.endDate,
          note: params.note,
        },
      }),
    [setRuleMutation],
  );

  const deleteRule = useCallback((id: string) => deleteRuleMutation({ variables: { id } }), [deleteRuleMutation]);

  return {
    rules,
    loading,
    saving: savingRule || deletingRule,
    error: error as ErrorLike | undefined,
    setWeeklyRule,
    setDateRangeRule,
    deleteRule,
  };
}
