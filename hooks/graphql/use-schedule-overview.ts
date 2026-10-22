import { useMutation, useQuery } from "@apollo/client/react";
import { GET_SCHEDULE_OVERVIEW_QUERY } from "@/graphql/queries/SCHEDULE_OVERVIEW_QUERY";
import { GET_GAP_REPORT_QUERY } from "@/graphql/queries/GAP_REPORT_QUERY";
import { SET_ASSIGNMENT_MUTATION, SET_ASSIGNMENT_ANY_MUTATION } from "@/graphql/mutations/ASSIGNMENT_MUTATIONS";
import { ScheduleOverview, ScheduleOverviewVariables } from "@/types/ScheduleOverview";
import { GapReport, GapReportVariables } from "@/types/GapReport";
import { SetAssignment, SetAssignmentVariables } from "@/types/SetAssignment";
import { SetAssignmentAny, SetAssignmentAnyVariables } from "@/types/SetAssignmentAny";

export function useScheduleOverviewQuery(
  options?: useQuery.Options<ScheduleOverview, ScheduleOverviewVariables>,
): useQuery.Result<ScheduleOverview, ScheduleOverviewVariables> {
  return useQuery<ScheduleOverview, ScheduleOverviewVariables>(GET_SCHEDULE_OVERVIEW_QUERY, options);
}

export function useGapReportQuery(
  options?: useQuery.Options<GapReport, GapReportVariables>,
): useQuery.Result<GapReport, GapReportVariables> {
  return useQuery<GapReport, GapReportVariables>(GET_GAP_REPORT_QUERY, options);
}

export function useSetAssignmentMutation(
  options?: useMutation.Options<SetAssignment, SetAssignmentVariables>,
): useMutation.ResultTuple<SetAssignment, SetAssignmentVariables> {
  return useMutation<SetAssignment, SetAssignmentVariables>(SET_ASSIGNMENT_MUTATION, options);
}

export function useSetAssignmentAnyMutation(
  options?: useMutation.Options<SetAssignmentAny, SetAssignmentAnyVariables>,
): useMutation.ResultTuple<SetAssignmentAny, SetAssignmentAnyVariables> {
  return useMutation<SetAssignmentAny, SetAssignmentAnyVariables>(SET_ASSIGNMENT_ANY_MUTATION, options);
}
