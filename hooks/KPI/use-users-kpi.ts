import { useMemo } from "react";
import { useInstitution } from "@/contexts/institution-context";

export interface IUserKPIs {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  usersByLanguage: { language: string; count: number }[];
  usersByRole: { role: string; users: number }[];
  usersByInstitution: { institution: string; users: number }[];
  usersByRegion: { region: string; users: number }[];
  userGrowthOverTime: { month: string; total: number; active: number }[];
}

export function useUserKPI() {
  const { currentInstitutionData } = useInstitution();

  return useMemo<IUserKPIs>(() => {
    const users = currentInstitutionData?.users || [];

    // Total de usuários
    const totalUsers = users.length;

    // Usuários ativos e inativos
    const activeUsers = users.filter((user) => !user.is_deleted).length;
    const inactiveUsers = users.filter((user) => user.is_deleted).length;

    // Usuários criados no último mês
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = users.filter(
      (user) => new Date(user.created_at) >= thirtyDaysAgo
    ).length;

    // Distribuição por idioma
    const usersByLanguage = users.reduce((acc, user) => {
      const language = user.language_preference.toUpperCase();
      const existing = acc.find((item) => item.language === language);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ language, count: 1 });
      }
      return acc;
    }, [] as { language: string; count: number }[]);

    // Distribuição por papel
    const usersByRole = users.reduce((acc, user) => {
      user.user_roles?.forEach((role) => {
        const existing = acc.find((item) => item.role === role.role.name);
        if (existing) {
          existing.users += 1;
        } else {
          acc.push({ role: role.role.name, users: 1 });
        }
      });
      return acc;
    }, [] as { role: string; users: number }[]);

    // Distribuição por instituição
    const usersByInstitution = users.reduce((acc, user) => {
      const institutionName = user.institution?.name || "N/A";
      const existing = acc.find((item) => item.institution === institutionName);
      if (existing) {
        existing.users += 1;
      } else {
        acc.push({ institution: institutionName, users: 1 });
      }
      return acc;
    }, [] as { institution: string; users: number }[]);

    // Distribuição por região
    const usersByRegion = users.reduce((acc, user) => {
      const regionId = currentInstitutionData?.churches?.find(
        (church) => church.id === user.church?.id
      )?.region_id;

      const regionName =
        currentInstitutionData?.regions?.find(
          (region) => region.id === regionId
        )?.name || "N/A";

      const existing = acc.find((item) => item.region === regionName);
      if (existing) {
        existing.users += 1;
      } else {
        acc.push({ region: regionName, users: 1 });
      }
      return acc;
    }, [] as { region: string; users: number }[]);

    // Crescimento de usuários ao longo do tempo
    const userGrowthOverTime = users.reduce((acc, user) => {
      const createdAt = new Date(user.created_at);
      const month = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.total += 1;
        if (!user.is_deleted) {
          existing.active += 1;
        }
      } else {
        acc.push({
          month,
          total: 1,
          active: user.is_deleted ? 0 : 1,
        });
      }
      return acc;
    }, [] as { month: string; total: number; active: number }[]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
      usersByLanguage,
      usersByRole,
      usersByInstitution,
      usersByRegion,
      userGrowthOverTime,
    };
  }, [currentInstitutionData]);
}