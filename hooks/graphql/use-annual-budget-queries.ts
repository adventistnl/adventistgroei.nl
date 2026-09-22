import { useQuery } from "@apollo/client/react";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";
import {
  GET_ANNUAL_BUDGET_BY_ID,
  GET_AVAILABLE_YEARS,
  GET_ANNUAL_BUDGET_KPIS,
  GET_BUDGET_DASHBOARD_DATA,
  GET_LEDGER_HISTORY
} from "@/graphql/queries/ANNUAL_BUDGET_QUERIES";
import {
  GetAnnualBudgetById,
  GetAnnualBudgetByIdVariables
} from "@/types/GetAnnualBudgetById";
import {
  GetAvailableYears
} from "@/types/GetAvailableYears";
import {
  GetAnnualBudgetKPIs,
  GetAnnualBudgetKPIsVariables
} from "@/types/GetAnnualBudgetKPIs";
import {
  GetBudgetDashboardData,
  GetBudgetDashboardDataVariables
} from "@/types/GetBudgetDashboardData";

export function useAnnualBudgetById(id: string, options?: useQuery.Options<GetAnnualBudgetById, GetAnnualBudgetByIdVariables>) {
  return useProtectedQuery<GetAnnualBudgetById, GetAnnualBudgetByIdVariables>(
    GET_ANNUAL_BUDGET_BY_ID,
    [PermissionResolverName.AnnualBudgets],
    {
      variables: { id },
      ...options
    }
  );
}

export function useAvailableYears(options?: useQuery.Options<GetAvailableYears>) {
  return useProtectedQuery<GetAvailableYears>(
    GET_AVAILABLE_YEARS,
    [PermissionResolverName.AnnualBudgets],
    options
  );
}

export function useAnnualBudgetKPIs(options: useQuery.Options<GetAnnualBudgetKPIs, GetAnnualBudgetKPIsVariables>) {
  return useProtectedQuery<GetAnnualBudgetKPIs, GetAnnualBudgetKPIsVariables>(
    GET_ANNUAL_BUDGET_KPIS,
    [PermissionResolverName.AnnualBudgets],
    {
      ...options
    }
  );
}

export function useBudgetDashboardData(year: number, options?: useQuery.Options<GetBudgetDashboardData, GetBudgetDashboardDataVariables>) {
  return useProtectedQuery<GetBudgetDashboardData, GetBudgetDashboardDataVariables>(
    GET_BUDGET_DASHBOARD_DATA,
    [PermissionResolverName.AnnualBudgets],
    {
      variables: { year },
      ...options
    }
  );
}

export function useLedgerHistory(filters: any, options?: any) {
  return useProtectedQuery<any, any>(
    GET_LEDGER_HISTORY,
    [PermissionResolverName.AnnualBudgets],
    {
      variables: { filters },
      ...options
    }
  );
}
