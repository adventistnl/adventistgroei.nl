"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLogin } from '@/hooks/use-login'
import { useUser } from '@/hooks/use-user'
import { Login_login_user } from '@/types/Login'

interface AuthContextType {
  user: Login_login_user | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  error: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Login_login_user | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Verificar token no localStorage quando o componente monta
  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token')
    const storedUser = localStorage.getItem('auth-user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')
      }
    }
    setIsLoading(false)
  }, [])

  const [loginMutation] = useLogin();

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data} = await loginMutation({ variables: { email, password } });
      if (data && data.login && data.login.accessToken && data.login.user) {
        const accessToken = data.login.accessToken;
        localStorage.setItem('auth-token', accessToken);
        localStorage.setItem('auth-user', JSON.stringify(data.login.user));
        setToken(accessToken);
        setUser(data.login.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }  

  const logout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
