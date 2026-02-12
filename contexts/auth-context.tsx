"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthModel, RoleModel } from '@/types/graphql-global-types';
import { useCookies } from '@/hooks/use-cookies';
import { validateToken } from '@/utils/validateToken';
import { useLoginMutation } from '@/hooks/graphql/use-login-mutation';
import { User } from '@/types/User';
import { th } from 'date-fns/locale';

interface AuthContextType {
  user: AuthModel['user'] | null;
  token: string | null;
  permissions: string[]; // Adicionado para armazenar permissões derivadas
  roles: RoleModel['key_code'][]; // Novo campo para armazenar roles
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean | undefined>;
  logout: () => void;
  updateAuthUser: (updatedUser: AuthModel['user']) => void; // Nova função para atualizar dados do usuário
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
      const cookies = getCookies();
      const rawStoredToken = cookies['auth-token'];
      const tokenIsValid = validateToken(rawStoredToken)
      if (!tokenIsValid) throw new Error('invalid token');
      
      const storedUser = localStorage.getItem('auth-user');
      const rawPermissions = cookies['auth-permissions'];
      let decodedPermissions = rawPermissions ? JSON.parse(rawPermissions) : [];
      if (
        rawStoredToken &&
        storedUser) {
        const parsedUser: AuthModel['user'] = JSON.parse(storedUser);
        
        // Se não tiver permissions no cookie, reconstruir do user.user_roles
        if (decodedPermissions.length === 0 && parsedUser.user_roles) {
          decodedPermissions = parsedUser.user_roles.flatMap((role: RoleModel) =>
            role.permissions.flatMap((group: { data: { resolver_name: string }[] }) => 
              group.data.map((perm) => perm.resolver_name)
            )
          );
          // Salvar as permissions reconstruídas no cookie para próxima vez
          const maxAge = 2592000; // 30 dias (assumir remember me = true)
          const isProduction = process.env.NODE_ENV === 'production'
          setCookie('auth-permissions', JSON.stringify(decodedPermissions), { 
            path: '/', 
            sameSite: 'Strict', 
            secure: isProduction, 
            maxAge 
          });
        }
        
        setUser(parsedUser);
        setToken(rawStoredToken);
        setPermissions(decodedPermissions);
        setRoles(parsedUser.user_roles.map((role) => role.key_code) || []);
      } else {
        throw new Error('fail on getting auth data');
      }
    } catch (error) {
      // Apenas limpar se o token for inválido ou expirado
      if (error instanceof Error && error.message === 'invalid token') {
        localStorage.removeItem('auth-user');
        clearAllCookies();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [loginMutation] = useLoginMutation();

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean | undefined> => {
    setIsLoading(true);
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.accessToken && data.login.user) {
        const accessToken = data.login.accessToken;
        const permissions = data.login.user.user_roles.flatMap((role: RoleModel) =>
          role.permissions.flatMap((group: { data: { resolver_name: string }[] }) => group.data.map((perm) => perm.resolver_name))
        );

        const maxAge = rememberMe ? 2592000 : 86400; // 30 dias ou 1 dia
        const isProduction = process.env.NODE_ENV === 'production'

        // Armazenar user no localStorage
        localStorage.setItem('auth-user', JSON.stringify(data.login.user));
        // Armazenar token e permissões como cookies (secure apenas em produção/HTTPS)
        setCookie('auth-token', accessToken, { path: '/', sameSite: 'Strict', secure: isProduction, maxAge });
        setCookie('auth-permissions', JSON.stringify(permissions), { path: '/', sameSite: 'Strict', secure: isProduction, maxAge });
        setToken(accessToken);
        setUser(data.login.user);
        setPermissions(permissions);
        setRoles(data.login.user.user_roles.map((role) => role.key_code) || []); // Define os roles a partir do login

        return true;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred during login');
      } 
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar dados do usuário logado
  const updateAuthUser = React.useCallback((updatedUser: AuthModel['user']) => {
    try {
      // Atualizar estado
      setUser(updatedUser);
      
      // Atualizar localStorage
      localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      
      // Atualizar roles se necessário
      const userRoles = updatedUser?.user_roles?.map((role) => role.key_code) || [];
      setRoles(userRoles);
      
    } catch (error) {
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    permissions,
    roles, // Inclui roles no valor do contexto
    login,
    logout: () => {
      localStorage.removeItem('auth-user');
      clearAllCookies();

      setToken(null);
      setUser(null);
      setPermissions([]);
      setRoles([]); // Limpa os roles ao fazer logout
    },
    updateAuthUser, // Adicionar função ao contexto
    isLoading,
    isAuthenticated: !!token && !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
