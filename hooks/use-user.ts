import { useMemo } from "react";
import { useCookies } from "./use-cookies";
import { useGetUserQuery } from "./graphql/use-get-user-query";
import { useCreateUserMutation, useUpdateUserMutation, useAddRoleToUserMutation, useDeleteUserMutation, useRemoveRoleFromUserMutation } from "./graphql/use-user-mutation";
import { LanguagePreference } from "@/types/globalTypes";
import { UpdateUserVariables } from "@/types/UpdateUser";

function decodeJWT(token: string): any {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch (e) {
    return null;
  }
}

export function useUser({token, id}:{token?: string, id?: string}) {
  const { getCookies } = useCookies()

  const cookies = getCookies();

  const jwt = token || cookies['auth-token'];
  const loggedUserId = useMemo(() => {
    if (!jwt) return null;
    const decoded = decodeJWT(jwt);
    return decoded?.sub || null;
  }, [jwt]);

  const { data, error, loading } = useGetUserQuery({ id: id ? id : loggedUserId },);

  const [ createUser ] = useCreateUserMutation();
  const [ updateUser ] = useUpdateUserMutation();
  const [ addRoleToUser ] = useAddRoleToUserMutation();
  const [ deleteUser ] = useDeleteUserMutation();
  const [ removeRoleFromUser ] = useRemoveRoleFromUserMutation();

  const deleteUserById = async (userId: string) => {
    try {
      const { data } = await deleteUser({ variables: { id: userId } });
      return data?.deleteUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const updateUserById = async (
    userId: string,
    userData: Omit<UpdateUserVariables, 'id'>,
    roleIds: { add: string[]; remove: string[] }
  ) => {
    try {
      // Update user data
      const { data: updatedUser } = await updateUser({
        variables: {
          id: userId,
          ...userData,
        },
      });

      // Add roles
      for (const roleId of roleIds.add) {
        await addRoleToUser({ variables: { userId, roleId } });
      }

      // Remove roles
      for (const roleId of roleIds.remove) {
        await removeRoleFromUser({ variables: { userId, roleId } });
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return {
    user: data?.user || null,
    loggedUserId,
    loading,
    error,
    createUser,
    updateUser,
    addRoleToUser,
    deleteUser,
    removeRoleFromUser,
    deleteUserById,
    updateUserById,
  };
}
