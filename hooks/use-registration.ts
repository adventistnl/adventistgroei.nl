"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { useCreateUserMutation } from "./graphql/use-user-mutation"
import { useAuth } from "@/contexts/auth-context"
import { CreateUserVariables } from "@/types/CreateUser"
import { GenderType } from "@/types/globalTypes"
import { useValidateInviteTokenMutation } from "./graphql/use-invite-user-mutation"
import { ValidateInviteToken } from "@/types/ValidateInviteToken"
import { LanguagePreference } from "@/types/graphql-global-types"
import { registerTranslations } from "@/lib/translations/register"
import { loginTranslations } from "@/lib/translations/login"
// Schema de validação para o formulário de registro
const registrationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
  gender: z.nativeEnum(GenderType, { required_error: "Gênero é obrigatório" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

export type RegistrationForm = z.infer<typeof registrationSchema>

export interface InviteData {
  role: string
  type: "email" | "link"
  email?: string
  expiresAt: number
  invitedBy: string
  timestamp: number
}

interface UseRegistrationProps {
  language: string
}

/**
 * Hook customizado para gerenciar toda a lógica de registro
 * Centraliza validação de convites, formulário e submissão
 */
export function useRegistration({ language }: UseRegistrationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ createUser ] = useCreateUserMutation();
  const [ validateInviteToken ] = useValidateInviteTokenMutation();
  const {login} = useAuth();
  // Busca o objeto de traduções correto
  // @ts-ignore
  const translations = registerTranslations[language as keyof typeof registerTranslations] || registerTranslations.en;
  const LTranslations = loginTranslations[language as keyof typeof loginTranslations] || loginTranslations.en;
  // Estados do componente
  const [inviteData, setInviteData] = useState< ValidateInviteToken['validateInviteToken'] | null>(null)
  const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [isTokenValidated, setIsTokenValidated] = useState(false); // New state for token validation

  // Função para carregar dados salvos do localStorage
  const loadSavedData = (): Partial<RegistrationForm> => {
    try {
      const savedData = localStorage.getItem('registration-form-data')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Remove senhas dos dados salvos
        const { password, confirmPassword, ...safeData } = parsed
        return safeData
      }
    } catch (error) {
      console.warn('Erro ao carregar dados salvos:', error)
    }
    return {}
  }

  // Função para salvar dados no localStorage (exceto senhas)
  const saveToLocalStorage = (data: Partial<RegistrationForm>) => {
    try {
      // Remove senhas antes de salvar
      const { password, confirmPassword, ...safeData } = data
      localStorage.setItem('registration-form-data', JSON.stringify(safeData))
    } catch (error) {
      console.warn('Erro ao salvar dados:', error)
    }
  }

  // Função para limpar dados salvos
  const clearSavedData = () => {
    try {
      localStorage.removeItem('registration-form-data')
    } catch (error) {
      console.warn('Erro ao limpar dados salvos:', error)
    }
  }

  // Configuração do formulário com dados salvos
  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: undefined, // Corrige o valor padrão para ser compatível com GenderType
      ...loadSavedData(), // Carrega dados salvos
    },
  })

  /**
   * Animação de loading inicial
   * Simula carregamento da página por 2 segundos
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowContent(true), 300)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  /**
   * Salva dados automaticamente no localStorage quando os campos mudam
   * Exclui senhas por segurança
   */
  useEffect(() => {
    const subscription = form.watch((data) => {
      // Debounce para evitar muitas operações de escrita
      const timeoutId = setTimeout(() => {
        if (data.name || data.email) {
          saveToLocalStorage(data)
        }
      }, 500) // Salva após 500ms de inatividade

      return () => clearTimeout(timeoutId)
    })

    return () => subscription.unsubscribe()
  }, [form])

  /**
   * Limpar dados salvos quando a página for descarregada
   * Isso acontece quando o usuário fecha o navegador ou navega para outra página
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Limpar dados após um tempo para permitir navegação normal
      setTimeout(() => {
        clearSavedData()
      }, 10000) // 10 segundos
    }

    const handlePageHide = () => {
      clearSavedData()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])

  /**
   * Validação do convite ao carregar a página
   * Decodifica JWT e verifica expiração
   */
  useEffect(() => {
    async function validateInviteTokenHandle() {
      setIsLoading(true);
      try {
        const token = searchParams.get("invite");

        if (!token) {
          setIsValidInvite(false);
          setIsTokenValidated(true);
          setIsLoading(false);
          return;
        }

        const isValid = await validateInviteToken({ variables: { token } });

        if (isValid.data && isValid.data.validateInviteToken) {
          setIsValidInvite(true);
          setInviteData(isValid.data.validateInviteToken);
          form.register("email", { value: isValid.data.validateInviteToken.email || "" });
          setInviteToken(token);
        } else {
          setIsValidInvite(false);
        }
      } catch (error) {
        setIsValidInvite(false);
      } finally {
        setIsTokenValidated(true); // Mark validation as complete
        setIsLoading(false);
      }
    }
    validateInviteTokenHandle();
  }, [searchParams]);

  useEffect(() => {
    if (isTokenValidated && isValidInvite) {
      // Additional API calls or logic after token validation
      form.setValue("email", inviteData?.email || "");
    }
  }, [isTokenValidated, isValidInvite, inviteData, form])

  /**
   * Validação do Step 1 (Informações Pessoais)
   */
  const validateStep1 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['name', 'email', 'gender'])
    if (!isValid) {
      toast.error(translations.fillRequiredFields, { duration: 4000 })
      return false
    }
    toast.success(translations.stepCompleted, { duration: 1500 })
    return true
  }

  /**
   * Validação do Step 2 (Configuração de Senha)
   */
  const validateStep2 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['password', 'confirmPassword'])
    if (!isValid) {
      toast.error(translations.fillRequiredFields, { duration: 4000 })
      return false
    }

    const password = form.getValues('password')
    const confirmPassword = form.getValues('confirmPassword')
    
    if (password.length < 6) {
      toast.error(translations.passwordTooShort, { duration: 4000 })
      return false
    }
    
    if (password !== confirmPassword) {
      toast.error(translations.passwordsDontMatch, { duration: 4000 })
      return false
    }

    toast.success(translations.stepCompleted, { duration: 1500 })
    return true
  }

  /**
   * Validação do Step 3 (Dados Institucionais)
   */
  const validateStep3 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['gender'])
    if (!isValid) {
      toast.error(translations.fillRequiredFields, { duration: 4000 })
      return false
    }
    return true
  }

  /**
   * Submissão do formulário
   * Processa os dados e redireciona para login
   */
  const onSubmit = async (data: RegistrationForm) => {
    if (!inviteData) {
      toast.error("Dados do convite não encontrados. Tente novamente.")
      return
    }
    setIsSubmitting(true)
    
    try {
      // Simular validação de email único
      if (data.email === "admin@teste.com") {
        toast.error(translations.emailAlreadyExists)
        setIsSubmitting(false)
        return
      }

      const loadingToast = toast.loading(translations.finishing)
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Estrutura de dados conforme especificado
      const registrationData: CreateUserVariables = {
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender,
        language_preference: inviteData.language_preference || LanguagePreference.En,
        roles: inviteData.role_ids || [], // Role do convite ou padrão MEMBER
        invite_token: inviteToken || "",
        institution_id: inviteData.institution_id,
        institution_department_id: inviteData.institution_department_id,
        church_id: inviteData.church_id,
        church_department_id: inviteData.church_department_id,
      }
      
      toast.dismiss(loadingToast)

      const { data: userCreated, error } = await createUser({ variables: registrationData });
      if (error || !userCreated) {
        toast.error(translations.registrationError, { duration: 5000 })
        throw new Error(translations.registrationError);
      }
      
      toast.success(translations.registrationSuccess, {
        duration: 6000,
        style: { minWidth: '350px' }
      })
      
      // Redirecionar para login após sucesso
      await login(data.email, data.password, true);
      router.push(`/dashboard`);
      clearSavedData()
      return userCreated.createUser || null;  
      // return null
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          toast.error(LTranslations.invalidCredentials, { duration: 5000 })
          return
        } else if (error.message === 'User has no active roles') {
          toast.error(LTranslations.noActiveRoles, { duration: 5000 })
          return
        } else if (error.message === 'invalid token') {
          toast.error(LTranslations.loginError, { duration: 5000 })
          return
        } else if (error.message === 'Invalid credentials') {
          toast.error(LTranslations.invalidCredentials, { duration: 5000 })
          return
        } else {
          toast.error(translations.registrationError, { duration: 5000 })
          return
        }
      } else {
        toast.error(translations.registrationError, { duration: 5000 })
        return
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    // Estados
    inviteData,
    isValidInvite,
    currentStep,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    isLoading,
    showContent,
    
    // Setters
    setCurrentStep,
    setShowPassword,
    setShowConfirmPassword,
    
    // Form
    form,
    
    // Validações
    validateStep1,
    validateStep2,
    
    // Submissão
    onSubmit,
    
    // Navegação
    goToLogin: () => router.push("/login")
  }
}
