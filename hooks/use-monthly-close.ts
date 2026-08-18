import { useCallback } from "react";
import moment from "moment";
import { useTriggerMonthlyCloseMutation } from "@/hooks/graphql/use-monthly-close";
import { GET_SCHEDULE_OVERVIEW_QUERY } from "@/graphql/queries/SCHEDULE_OVERVIEW_QUERY";

/** Default close day (day of the current month) matching the backend's MonthlyCloseService
 * fallback — see docs/graphql-contract/phase-5.graphql. Institutions may override it via a
 * Setting row, which this client-side indicator does not read; it always shows the default. */
const DEFAULT_CLOSE_DAY = 10;

/** R10 — the next monthly-close date and the month it will close, computed client-side from
 * "today" for the Overview grid's indicator. Closing on day D of month M locks month M+1. */
export function useNextMonthlyClose() {
  const now = moment();
  const closeDate = moment(now).date(DEFAULT_CLOSE_DAY);
  if (now.date() > DEFAULT_CLOSE_DAY) {
    closeDate.add(1, "month");
  }
  const closedMonth = moment(closeDate).add(1, "month");

  return {
    closeDate: closeDate.toDate(),
    closedMonthLabel: closedMonth.format("MMMM YYYY"),
  };
}

/** R10 — manual-trigger path for the triggerMonthlyClose mutation (admin/department-leader only). */
export function useTriggerMonthlyClose() {
  const [mutate, { loading }] = useTriggerMonthlyCloseMutation({
    refetchQueries: [GET_SCHEDULE_OVERVIEW_QUERY],
  });

  const trigger = useCallback(
    (month: string) => mutate({ variables: { month } }),
    [mutate],
  );

  return { trigger, loading };
}
