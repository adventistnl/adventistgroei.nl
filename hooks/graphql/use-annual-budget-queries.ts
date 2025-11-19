import { useQuery } from "@apollo/client/react";
import {
  GET_ANNUAL_BUDGET_BY_ID,
  GET_AVAILABLE_YEARS,
  GET_ANNUAL_BUDGET_KPIS,
  GET_BUDGET_DASHBOARD_DATA
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
  return useQuery<GetAnnualBudgetById, GetAnnualBudgetByIdVariables>(
    GET_ANNUAL_BUDGET_BY_ID,
    {
      variables: { id },
      ...options
    }
  );
}

export function useAvailableYears(options?: useQuery.Options<GetAvailableYears>) {
  return useQuery<GetAvailableYears>(
    GET_AVAILABLE_YEARS,
    options
  );
}

export function useAnnualBudgetKPIs(options: useQuery.Options<GetAnnualBudgetKPIs, GetAnnualBudgetKPIsVariables>) {
  return useQuery<GetAnnualBudgetKPIs, GetAnnualBudgetKPIsVariables>(
    GET_ANNUAL_BUDGET_KPIS,
    {
      ...options
    }
  );
}

export function useBudgetDashboardData(year: number, options?: useQuery.Options<GetBudgetDashboardData, GetBudgetDashboardDataVariables>) {
  return useQuery<GetBudgetDashboardData, GetBudgetDashboardDataVariables>(
    GET_BUDGET_DASHBOARD_DATA,
    {
      variables: { year },
      ...options
    }
  );
}