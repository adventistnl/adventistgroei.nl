"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from "react-hot-toast"
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Verificar se o usuário acabou de se registrar
  useEffect(() => {
    const registered = searchParams.get('registered')
    const registeredEmail = searchParams.get('email')
    const userRole = searchParams.get('role')
    
    if (registered === 'true') {
      if (registeredEmail) {
        setEmail(decodeURIComponent(registeredEmail))
        toast.success(
          `✅ Registro concluído com sucesso!\n👤 Role: ${userRole}\n🔐 Faça seu primeiro login abaixo.`,
          {
            duration: 6000,
            style: {
              minWidth: '350px',
            },
          }
        )
      } else {
        toast.success("✅ Registro concluído! Faça seu primeiro login.", {
          duration: 4000,
        })
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      setIsSubmitting(false)
      return
    }

    try {
      const success = await login(email, password)
      
      if (success) {
        router.push('/')
      } else {
        setError('Email ou senha inválidos. Tente novamente.')
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se já estiver autenticado, não mostrar nada (redirecionamento está acontecendo)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Grid Layout com 7 colunas */}
      <div className="grid grid-cols-7 min-h-screen">
        
        {/* Colunas 1-6: Área de Login */}
        <div className="col-span-6 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
              <CardHeader className="text-center space-y-4 pb-8">
                {/* Logo da Igreja */}
                <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-primary-foreground rounded-lg"></div>
                </div>
                
                {/* Título Principal */}
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold text-foreground">
                    SDA Church
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Sistema de Gerenciamento da Igreja Adventista
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                      <AlertDescription className="text-destructive-foreground">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Campo Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 text-base bg-background border-border focus:border-primary transition-all duration-200"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  {/* Campo Senha */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 text-base bg-background border-border focus:border-primary transition-all duration-200"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Botão de Login */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                        Entrando...
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
                
                {/* Link Esqueceu Senha */}
                <div className="text-center">
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                
                {/* Informação de Demonstração */}
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    <strong className="text-foreground">Para demonstração:</strong>
                  </p>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Use qualquer email e senha válidos para entrar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Coluna 7: Área Escura com Logo */}
        <div className="col-span-1 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
          {/* Logo do Sistema - Centralizada no Topo */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex flex-col items-center space-y-3">
              {/* Logo Principal */}
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-gray-900 rounded-lg"></div>
              </div>
              
              {/* Texto da Logo */}
              <div className="text-center">
                <h3 className="text-xs font-bold text-white leading-tight">
                  SDA
                </h3>
                <p className="text-xs text-gray-300 leading-tight">
                  Church
                </p>
              </div>
            </div>
          </div>
          
          {/* Padrão decorativo sutil */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-48 left-1/4 w-8 h-8 bg-white/60 rounded-full"></div>
            <div className="absolute top-64 right-1/4 w-12 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/80 rounded-full"></div>
            <div className="absolute bottom-16 left-1/3 w-6 h-6 bg-white rounded-full"></div>
          </div>
          
          {/* Linhas decorativas sutis */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
          
          {/* Conteúdo inferior da coluna */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mx-auto">
                <div className="w-4 h-4 bg-white/60 rounded-sm"></div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white/80 leading-tight">
                  Church Growth
                </h4>
                <p className="text-xs text-white/60 leading-tight">
                  International
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}