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
  const { roles } = useRoles({});
  const { permissions } = usePermissions();

  return useMemo<IAccessKPIs>(() => {
    const totalUsers = Array.isArray(roles) ? roles.flatMap(r => r.users).length : 0;
    const totalRoles = Array.isArray(roles) ? roles.length : 0;
    const totalPermissions = Array.isArray(permissions) ? permissions.flatMap(pe => pe.data).length : 0;
    const activeUsers = Array.isArray(roles)
      ? roles.flatMap(r =>
          r.users?.filter(u => u && !u.is_deleted) ?? []
        ).length
      : 0;
    const adminUsers = Array.isArray(roles) ? roles.find(u => u.key_code === 'ADMIN')?.users?.length ?? 0 : 0;
    const userGrowthRate = 0; // TODO: Implemente userGrowthRate
    const roleDistribution = roles.map((role, i) => {
      const userCount = role.users?.length || 0;
      return {
        name: role.name,
        value: userCount,
        color: role.color || chartColors[i % chartColors.length],
      }
    }).filter(item => item.value > 0)
    const permissionsByGroup = permissions.map((p,i) => {
      const color = chartColors[i % chartColors.length];
      return {
        group: p.group,
        permissions: p.data.length,
        color
      }
    })

    return {
      totalUsers,
      totalRoles,
      totalPermissions,
      activeUsers,
      adminUsers,
      userGrowthRate,
      roleDistribution,
      permissionsByGroup
    };
  }, [roles, permissions]);
}
