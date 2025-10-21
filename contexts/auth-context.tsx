"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthModel, RoleModel } from '@/types/graphql-global-types';
import { useCookies } from '@/hooks/use-cookies';
import { validateToken } from '@/utils/validateToken';
import { useLoginMutation } from '@/hooks/graphql/use-login-mutation';
import { User } from '@/types/User';

interface AuthContextType {
  user: AuthModel['user'] | null;
  token: string | null;
  permissions: string[]; // Adicionado para armazenar permissões derivadas
  roles: RoleModel['key_code'][]; // Novo campo para armazenar roles
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
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
  const { getCookies, setCookie, clearAllCookies } = useCookies();
  const [user, setUser] = useState<AuthModel['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]); // Novo estado para permissões
  const [roles, setRoles] = useState<RoleModel['key_code'][]>([]); // Novo estado para roles
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  // Verificar token no localStorage quando o componente monta
  useEffect(() => {
    
    try {
      const cookies = getCookies(); // Utiliza o hook useCookies para obter os cookies
      const rawStoredToken = cookies['auth-token'];
      const tokenIsValid = validateToken(rawStoredToken)
      if (!tokenIsValid) throw new Error('invalid token');
      
      const storedUser = localStorage.getItem('auth-user');
      const rawPermissions = cookies['auth-permissions'];
      const decodedPermissions = rawPermissions ? JSON.parse(rawPermissions) : [];

      if (
        rawStoredToken &&
        storedUser &&
        Array.isArray(decodedPermissions) &&
        decodedPermissions.length > 0) {
        const parsedUser: AuthModel['user'] = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(rawStoredToken);
        setPermissions(decodedPermissions);
        setRoles(parsedUser.user_roles.map((role) => role.key_code) || []); // Define os roles a partir do usuário armazenado
      } else {
        throw new Error('fail on getting auth data');
      }
    } catch (error) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      clearAllCookies(); // Limpa todos os cookies em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [loginMutation] = useLoginMutation();

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.accessToken && data.login.user) {
        const accessToken = data.login.accessToken;
        const permissions = data.login.user.user_roles.flatMap((role: RoleModel) =>
          role.permissions.flatMap((group: { data: { resolver_name: string }[] }) => group.data.map((perm) => perm.resolver_name))
        );

        const maxAge = rememberMe ? 2592000 : 86400; // 30 dias ou 1 dia

        // Armazenar user no localStorage
        localStorage.setItem('auth-user', JSON.stringify(data.login.user));
        // Armazenar token e permissões como cookies
        setCookie('auth-token', accessToken, { path: '/', sameSite: 'Strict', secure: true, maxAge });
        setCookie('auth-permissions', JSON.stringify(permissions), { path: '/', sameSite: 'Strict', secure: true, maxAge });
        setToken(accessToken);
        setUser(data.login.user);
        setPermissions(permissions);
        setRoles(data.login.user.user_roles.map((role) => role.key_code) || []); // Define os roles a partir do login

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
    roles, // Inclui roles no valor do contexto
    login,
    logout: () => {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      clearAllCookies();

      setToken(null);
      setUser(null);
      setPermissions([]);
      setRoles([]); // Limpa os roles ao fazer logout
    },
    isLoading,
    isAuthenticated: !!token && !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
