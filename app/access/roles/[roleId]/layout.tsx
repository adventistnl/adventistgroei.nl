import { AppLayout } from "@/components/layouts/app-layout";
import RolePermissionsPage from "./page";

const RolePermissionsLayout = async ({ params }: { params: { roleId: string } }) => {
  const roleId = (await params)?.roleId; // Garantir que params seja resolvido de forma assíncrona

  if (!roleId) {
    return <div>Role ID is required</div>;
  }

  return (
    <RolePermissionsPage roleId={roleId} />
  );
};

export default RolePermissionsLayout;