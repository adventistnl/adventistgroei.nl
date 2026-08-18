import { useMutation, useQuery } from "@apollo/client/react";
import { GET_CHURCH_FOR_SERVICE_CALENDAR_QUERY, GET_CHURCH_SERVICE_CALENDAR_QUERY } from "@/graphql/queries/CHURCH_SERVICE_CALENDAR_QUERY";
import {
  SET_CHURCH_SERVICE_CALENDAR_MUTATION,
  SET_CHURCH_SERVICE_CALENDAR_BULK_MUTATION,
} from "@/graphql/mutations/CHURCH_SERVICE_CALENDAR_MUTATIONS";
import { ChurchForServiceCalendar, ChurchForServiceCalendarVariables } from "@/types/ChurchForServiceCalendar";
import { ChurchServiceCalendar, ChurchServiceCalendarVariables } from "@/types/ChurchServiceCalendar";
import { SetChurchServiceCalendar, SetChurchServiceCalendarVariables } from "@/types/SetChurchServiceCalendar";
import { SetChurchServiceCalendarBulk, SetChurchServiceCalendarBulkVariables } from "@/types/SetChurchServiceCalendarBulk";

export function useChurchForServiceCalendarQuery(
  options?: useQuery.Options<ChurchForServiceCalendar, ChurchForServiceCalendarVariables>,
): useQuery.Result<ChurchForServiceCalendar, ChurchForServiceCalendarVariables> {
  return useQuery<ChurchForServiceCalendar, ChurchForServiceCalendarVariables>(GET_CHURCH_FOR_SERVICE_CALENDAR_QUERY, options);
}

export function useChurchServiceCalendarQuery(
  options?: useQuery.Options<ChurchServiceCalendar, ChurchServiceCalendarVariables>,
): useQuery.Result<ChurchServiceCalendar, ChurchServiceCalendarVariables> {
  return useQuery<ChurchServiceCalendar, ChurchServiceCalendarVariables>(GET_CHURCH_SERVICE_CALENDAR_QUERY, options);
}

export function useSetChurchServiceCalendarMutation(
  options?: useMutation.Options<SetChurchServiceCalendar, SetChurchServiceCalendarVariables>,
): useMutation.ResultTuple<SetChurchServiceCalendar, SetChurchServiceCalendarVariables> {
  return useMutation<SetChurchServiceCalendar, SetChurchServiceCalendarVariables>(SET_CHURCH_SERVICE_CALENDAR_MUTATION, options);
}

export function useSetChurchServiceCalendarBulkMutation(
  options?: useMutation.Options<SetChurchServiceCalendarBulk, SetChurchServiceCalendarBulkVariables>,
): useMutation.ResultTuple<SetChurchServiceCalendarBulk, SetChurchServiceCalendarBulkVariables> {
  return useMutation<SetChurchServiceCalendarBulk, SetChurchServiceCalendarBulkVariables>(SET_CHURCH_SERVICE_CALENDAR_BULK_MUTATION, options);
}
