import { useCallback, useMemo } from "react";
import {
  useScheduleOverviewQuery,
  useGapReportQuery,
  useSetAssignmentMutation,
  useSetAssignmentAnyMutation,
} from "@/hooks/graphql/use-schedule-overview";
import { GET_SCHEDULE_OVERVIEW_QUERY } from "@/graphql/queries/SCHEDULE_OVERVIEW_QUERY";
import { ScheduleOverview_scheduleOverview } from "@/types/ScheduleOverview";
import { AssignmentStatus } from "@/types/globalTypes";
import { ErrorLike } from "@apollo/client";

/** "month" formatted "YYYY-MM" — see docs/graphql-contract/phase-3.graphql. */
export function useScheduleOverview(month: string) {
  const { data, loading, error } = useScheduleOverviewQuery({ variables: { month } });

  const [setAssignmentMutation, { loading: savingOwn }] = useSetAssignmentMutation({
    refetchQueries: [{ query: GET_SCHEDULE_OVERVIEW_QUERY, variables: { month } }],
  });
  const [setAssignmentAnyMutation, { loading: savingAny }] = useSetAssignmentAnyMutation({
    refetchQueries: [{ query: GET_SCHEDULE_OVERVIEW_QUERY, variables: { month } }],
  });

  const assignments = useMemo<ScheduleOverview_scheduleOverview[]>(() => data?.scheduleOverview ?? [], [data]);

  /** R8 — a church leader directly registers who's preaching at their own church. */
  const setAssignment = useCallback(
    (churchId: string, date: string, userId?: string, status?: AssignmentStatus) =>
      setAssignmentMutation({ variables: { church_id: churchId, date, user_id: userId, status } }),
    [setAssignmentMutation],
  );

  /** Admin/department-leader path — any church in the caller's institution. */
  const setAssignmentAny = useCallback(
    (churchId: string, date: string, userId?: string, status?: AssignmentStatus) =>
      setAssignmentAnyMutation({ variables: { church_id: churchId, date, user_id: userId, status } }),
    [setAssignmentAnyMutation],
  );

  return {
    assignments,
    loading,
    saving: savingOwn || savingAny,
    error: error as ErrorLike | undefined,
    setAssignment,
    setAssignmentAny,
  };
}

export function useGapReport(month: string) {
  const { data, loading, error } = useGapReportQuery({ variables: { month } });
  return {
    gapReport: data?.gapReport ?? null,
    loading,
    error: error as ErrorLike | undefined,
  };
}
