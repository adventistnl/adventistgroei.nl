"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { validateToken } from "@/utils/validateToken"
import { jwtDecode } from "jwt-decode"
import { useCreateUserMutation } from "./graphql/use-user-mutation"
import { InviteUserVariables } from "@/types/InviteUser"
import { useAuth } from "@/contexts/auth-context"
import { roles } from "@/data/usersData"
import { CreateUserVariables } from "@/types/CreateUser"
import { GenderType } from "@/types/globalTypes"

// Schema de validação para o formulário de registro
const registrationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
  department_id: z.string().min(1, "Departamento é obrigatório"),
  church_id: z.string().min(1, "Igreja é obrigatória"),
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
  translations: any
  defaultInstitutionId: string
}

/**
 * Hook customizado para gerenciar toda a lógica de registro
 * Centraliza validação de convites, formulário e submissão
 */
export function useRegistration({ translations, defaultInstitutionId }: UseRegistrationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ createUser ] = useCreateUserMutation();
  const {login} = useAuth();
  // Estados do componente
  const [inviteData, setInviteData] = useState<InviteUserVariables | null>(null)
  const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

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
      department_id: "",
      church_id: "",
      gender: undefined, // Corrige o valor padrão para ser compatível com GenderType
      ...loadSavedData(), // Carrega dados salvos
    },
  })
  const selectedDepartment = form.watch("department_id")

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
        if (data.name || data.email || data.department_id || data.church_id) {
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
    const token = searchParams.get("invite")

    if (!token) {
      setIsValidInvite(false)
      setIsLoading(false)
      return
    }

    const isValid = validateToken(token)
    setIsValidInvite(isValid)

    if (isValid) {
      try {
        const decodedToken = jwtDecode<InviteUserVariables>(token)
        setInviteData(decodedToken)
        form.register("email", { value: decodedToken.email || "" });
      } catch (error) {
        setIsValidInvite(false)
      }
    }

    setIsLoading(false)
  }, [searchParams])

  /**
   * Limpar igreja quando departamento muda
   * Garante consistência na seleção
   */
  useEffect(() => {
    form.setValue("church_id", "")
  }, [selectedDepartment, form])

  /**
   * Validação do Step 1 (Informações Pessoais)
   */
  const validateStep1 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['name', 'email'])
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
    const isValid = await form.trigger(['department_id', 'church_id'])
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
        language_preference: inviteData.language_preference,
        institution_id: inviteData.institution_id,
        department_id: data.department_id,
        church_id: data.church_id,
        roles: inviteData.role_ids || [], // Role do convite ou padrão MEMBER
        gender: data.gender
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
      
      // Limpar dados salvos após registro bem-sucedido
      
      // // Redirecionar para login após sucesso
      await login(data.email, data.password);
      router.push(`/dashboard`);
      clearSavedData()
      return userCreated.createUser || null;  
      
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(translations.registrationError, { duration: 5000 })
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
    selectedDepartment,
    
    // Setters
    setCurrentStep,
    setShowPassword,
    setShowConfirmPassword,
    
    // Form
    form,
    
    // Validações
    validateStep1,
    validateStep2,
    validateStep3,
    
    // Submissão
    onSubmit,
    
    // Navegação
    goToLogin: () => router.push("/login")
  }
}
