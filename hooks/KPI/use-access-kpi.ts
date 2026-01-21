import { useMemo } from "react";
import { useRoles } from "@/hooks/use-roles";
import { usePermissions } from "@/hooks/use-permissions";


export interface IRoleDistribution {
    name: string;
    value: number;
    color: string;
}

export interface IPermissionsByGroup {
    group: string;
    permissions: number;
    color: string;
}

export interface IAccessKPIs {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  activeUsers: number;
  adminUsers: number;
  userGrowthRate: number;
  roleDistribution: IRoleDistribution[];
  permissionsByGroup: IPermissionsByGroup[];
}

const chartColors = ['#158f93', '#4c39d5'];

export function useAccessKPI() {
  // Hooks que conectam à API
  const { roles } = useRoles();
  const { permissions } = usePermissions();

  // Validar dados antes de processá-los
  const validRoles = Array.isArray(roles) ? roles : [];
  const validPermissions = Array.isArray(permissions) ? permissions : [];

  return useMemo<IAccessKPIs>(() => {
    const totalUsers = validRoles.flatMap(r => r.users).length;
    const totalRoles = validRoles.length;
    const totalPermissions = validPermissions.flatMap(pe => pe.data).length;
    const activeUsers = validRoles.flatMap(r =>
      r.users?.filter(u => u && !u.is_deleted) ?? []
    ).length;
    const adminUsers = validRoles.find(u => u.key_code === 'ADMIN')?.users?.length ?? 0;
    const userGrowthRate = 0; // TODO: Implemente userGrowthRate
    const roleDistribution = validRoles.map((role, i) => {
      const userCount = role.users?.length || 0;
      return {
        name: role.name,
        value: userCount,
        color: chartColors[i % chartColors.length],
      };
    });

    const permissionsByGroup = validPermissions.map((group, i) => {
      const permissionCount = group.data.length;
      return {
        group: group.group,
        permissions: permissionCount,
        color: chartColors[i % chartColors.length],
      };
    });

    return {
      totalUsers,
      totalRoles,
      totalPermissions,
      activeUsers,
      adminUsers,
      userGrowthRate,
      roleDistribution,
      permissionsByGroup,
    };
  }, [validRoles, validPermissions]);
}
