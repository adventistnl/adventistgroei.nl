import { useCallback, useMemo } from "react";
import {
  useChurchForServiceCalendarQuery,
  useChurchServiceCalendarQuery,
  useSetChurchServiceCalendarMutation,
  useSetChurchServiceCalendarBulkMutation,
} from "@/hooks/graphql/use-church-service-calendar";
import { GET_CHURCH_SERVICE_CALENDAR_QUERY } from "@/graphql/queries/CHURCH_SERVICE_CALENDAR_QUERY";
import { ChurchServiceCalendar_churchServiceCalendar } from "@/types/ChurchServiceCalendar";
import { ErrorLike } from "@apollo/client";

export function useChurchForServiceCalendar(churchId: string) {
  const { data, loading, error } = useChurchForServiceCalendarQuery({ variables: { id: churchId } });
  return { church: data?.church ?? null, loading, error: error as ErrorLike | undefined };
}

/** "month" is the calendar month currently shown, formatted "YYYY-MM" — see docs/graphql-contract/phase-2.graphql. */
export function useChurchServiceCalendar(churchId: string, month: string) {
  const { data, loading, error, refetch } = useChurchServiceCalendarQuery({ variables: { church_id: churchId, month } });

  const [setOneMutation, { loading: savingOne }] = useSetChurchServiceCalendarMutation({
    refetchQueries: [{ query: GET_CHURCH_SERVICE_CALENDAR_QUERY, variables: { church_id: churchId, month } }],
  });
  const [setBulkMutation, { loading: savingBulk }] = useSetChurchServiceCalendarBulkMutation();

  const entries = useMemo<ChurchServiceCalendar_churchServiceCalendar[]>(() => data?.churchServiceCalendar ?? [], [data]);

  /** A single date exception, e.g. "no service this Sunday". */
  const setSingleDate = useCallback(
    (date: string, hasService: boolean) =>
      setOneMutation({ variables: { church_id: churchId, has_service: hasService, date } }),
    [setOneMutation, churchId],
  );

  /** A weekly default for this church only (e.g. "every Sunday"), expanded server-side. */
  const setWeeklyDefault = useCallback(
    (dayOfWeek: number, hasService: boolean, effectiveFrom: string, effectiveUntil?: string) =>
      setOneMutation({
        variables: { church_id: churchId, has_service: hasService, day_of_week: dayOfWeek, effective_from: effectiveFrom, effective_until: effectiveUntil },
      }),
    [setOneMutation, churchId],
  );

  /** R8.1 — applies one weekly pattern across many churches at once (admin/department-leader only). */
  const setBulkPattern = useCallback(
    (churchIds: string[], dayOfWeek: number, hasService: boolean, effectiveFrom: string, effectiveUntil?: string) =>
      setBulkMutation({
        variables: { church_ids: churchIds, day_of_week: dayOfWeek, has_service: hasService, effective_from: effectiveFrom, effective_until: effectiveUntil },
      }),
    [setBulkMutation],
  );

  return {
    entries,
    loading,
    saving: savingOne || savingBulk,
    error: error as ErrorLike | undefined,
    refetch,
    setSingleDate,
    setWeeklyDefault,
    setBulkPattern,
  };
}
