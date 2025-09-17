"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLogin } from '@/hooks/use-login';
import { AuthModel, RoleModel } from '@/types/graphql-global-types';

interface AuthContextType {
  user: AuthModel['user'] | null;
  token: string | null;
  permissions: string[]; // Adicionado para armazenar permissões derivadas
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthModel['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]); // Novo estado para permissões
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Verificar token no localStorage quando o componente monta
  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    const storedUser = localStorage.getItem('auth-user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Restaurar permissões do usuário
        const storedPermissions = parsedUser.user_roles.flatMap((role: RoleModel) =>
          role.permissions.flatMap((group: { data: { key_code: string }[] }) => group.data.map((perm) => perm.key_code))
        );
        setPermissions(storedPermissions);
      } catch (error) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      }
    }
    setIsLoading(false);
  }, []);

  const [loginMutation] = useLogin();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.accessToken && data.login.user) {
        const accessToken = data.login.accessToken;

        // Armazenar token no localStorage
        localStorage.setItem('auth-token', accessToken);
        localStorage.setItem('auth-user', JSON.stringify(data.login.user));

        const permissions = data.login.user.user_roles.flatMap((role: RoleModel) =>
          role.permissions.flatMap((group: { data: { name: string }[] }) => group.data.map((perm) => perm.name))
        );

        // Armazenar token e permissões como cookies
        document.cookie = `auth-token=${accessToken}; path=/; SameSite=Strict; Secure; max-age=3600;`;
        document.cookie = `auth-permissions=${encodeURIComponent(
          JSON.stringify(permissions)
        )}; path=/; SameSite=Strict; Secure; max-age=3600;`;

        setToken(accessToken);
        setUser(data.login.user);
        setPermissions(permissions);

        return true;
      }
      return false;
    } catch (error) {
      setError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    permissions,
    login,
    logout: () => {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');

      // Remover cookies relacionados à autenticação
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'auth-permissions=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

      setToken(null);
      setUser(null);
      setPermissions([]);
    },
    isLoading,
    isAuthenticated: !!token && !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
