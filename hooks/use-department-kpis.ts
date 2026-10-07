import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { GET_DEPARTMENT_KPIS_QUERY } from "@/graphql/queries/DEPARTMENT_KPI_QUERY";
import { PermissionResolverName } from "@/types/graphql-global-types";

interface DepartmentKPIs {
  totalDepartments: number;
  activeDepartments: number;
  departmentsWithBudget: number;
  totalUsers: number;
  totalAllocatedBudget: number;
  totalSpentBudget: number;
  averageBudgetPerDepartment: number;
  averageUsersPerDepartment: number;
  totalProjects: number;
  openProjects: number;
  completedProjects: number;
}

interface DepartmentActivityData {
  department_id: string;
  department_name: string;
  user_count: number;
  allocated_amount: number;
  spent_amount: number;
  project_count: number;
  open_projects: number;
  completed_projects: number;
  activity_count: number;
}

interface DepartmentBudgetTimeline {
  month: string;
  department_id: string;
  department_name: string;
  allocated: number;
  spent: number;
}

interface DepartmentKPIsQueryData {
  departmentKPIs: DepartmentKPIs;
  departmentActivityData: DepartmentActivityData[];
  departmentBudgetTimeline: DepartmentBudgetTimeline[];
}

interface UseDepartmentKPIsOptions {
  institution_id?: string;
  church_id?: string;
  selectedYear?: number;
  skip?: boolean;
}

export function useDepartmentKPIs(options: UseDepartmentKPIsOptions = {}) {
  const { institution_id, church_id, selectedYear, skip = false } = options;

  const { data, loading, error, refetch } = useProtectedQuery<DepartmentKPIsQueryData>(
    GET_DEPARTMENT_KPIS_QUERY,
    [
      PermissionResolverName.DepartmentKpIs,
      PermissionResolverName.DepartmentActivityData,
      PermissionResolverName.DepartmentBudgetTimeline
    ],
    {
      variables: {
        institution_id,
        church_id,
        selectedYear,
      },
      skip: skip || !institution_id,
      fetchPolicy: "cache-and-network",
    },
    true // requireAll = true
  );

  return {
    kpis: data?.departmentKPIs,
    activityData: data?.departmentActivityData || [],
    budgetTimeline: data?.departmentBudgetTimeline || [],
    loading,
    error,
    refetch,
  };
}
