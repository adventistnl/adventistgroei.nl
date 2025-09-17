"use client"

import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import { 
  User, 
  Mail, 
  Lock,
  Building, 
  Church, 
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
  ChevronUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import toast from "react-hot-toast"
import { registerTranslations } from "@/lib/translations/register"
import { MultiStepForm } from "@/components/shared/multi-step-form"

// Schema de validação baseado na nova estrutura
const registrationSchema = z.object({
  // Dados Pessoais
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
  
  // Dados da Instituição (institution_id será automático)
  department_id: z.string().min(1, "Departamento é obrigatório"),
  church_id: z.string().min(1, "Igreja é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type RegistrationForm = z.infer<typeof registrationSchema>

interface InviteData {
  role: string
  type: "email" | "link"
  email?: string
  expiresAt: number
  invitedBy: string
  timestamp: number
}

// Mock data - Institution será automática baseada no contexto do usuário logado
const DEFAULT_INSTITUTION_ID = "1580c125-edfd-43e6-a169-cecd4b19e2e8"

const DEPARTMENTS = [
  { id: "6107a2bc-c1d7-4567-b8f8-5818eb4c4a04", name: "Administração", description: "Gestão administrativa e financeira" },
  { id: "7107a2bc-c1d7-4567-b8f8-5818eb4c4a05", name: "Pastoral", description: "Ministério pastoral e evangelismo" },
  { id: "8107a2bc-c1d7-4567-b8f8-5818eb4c4a06", name: "Educação", description: "Ensino e educação cristã" },
  { id: "9107a2bc-c1d7-4567-b8f8-5818eb4c4a07", name: "Comunicação", description: "Marketing e comunicação" },
  { id: "a107a2bc-c1d7-4567-b8f8-5818eb4c4a08", name: "Jovens", description: "Ministério jovem e adolescentes" },
  { id: "b107a2bc-c1d7-4567-b8f8-5818eb4c4a09", name: "Música", description: "Louvor e ministério musical" },
  { id: "c107a2bc-c1d7-4567-b8f8-5818eb4c4a0a", name: "Diaconia", description: "Serviços sociais e assistência" },
]

const CHURCHES = {
  "6107a2bc-c1d7-4567-b8f8-5818eb4c4a04": [
    { id: "993acf3c-8b16-4cf2-a55d-9f93b06efe02", name: "Igreja Central de São Paulo", location: "Centro, SP" },
    { id: "a93acf3c-8b16-4cf2-a55d-9f93b06efe03", name: "Igreja de Vila Madalena", location: "Vila Madalena, SP" },
    { id: "b93acf3c-8b16-4cf2-a55d-9f93b06efe04", name: "Igreja da Mooca", location: "Mooca, SP" },
    { id: "c93acf3c-8b16-4cf2-a55d-9f93b06efe05", name: "Igreja do Ipiranga", location: "Ipiranga, SP" },
    { id: "d93acf3c-8b16-4cf2-a55d-9f93b06efe06", name: "Igreja de Santana", location: "Santana, SP" },
  ],
  "7107a2bc-c1d7-4567-b8f8-5818eb4c4a05": [
    { id: "e93acf3c-8b16-4cf2-a55d-9f93b06efe07", name: "Igreja Pastoral Central", location: "Centro Pastoral, SP" },
    { id: "f93acf3c-8b16-4cf2-a55d-9f93b06efe08", name: "Igreja Pastoral Norte", location: "Zona Norte, SP" },
    { id: "g93acf3c-8b16-4cf2-a55d-9f93b06efe09", name: "Igreja Pastoral Sul", location: "Zona Sul, SP" },
  ],
  "8107a2bc-c1d7-4567-b8f8-5818eb4c4a06": [
    { id: "h93acf3c-8b16-4cf2-a55d-9f93b06efe0a", name: "Centro Educacional Adventista", location: "Educação, SP" },
    { id: "i93acf3c-8b16-4cf2-a55d-9f93b06efe0b", name: "Escola Adventista Central", location: "Centro Educacional, SP" },
  ],
  "9107a2bc-c1d7-4567-b8f8-5818eb4c4a07": [
    { id: "j93acf3c-8b16-4cf2-a55d-9f93b06efe0c", name: "Centro de Comunicação", location: "Comunicação, SP" },
    { id: "k93acf3c-8b16-4cf2-a55d-9f93b06efe0d", name: "Estúdio de Mídia Adventista", location: "Mídia, SP" },
  ],
  "a107a2bc-c1d7-4567-b8f8-5818eb4c4a08": [
    { id: "l93acf3c-8b16-4cf2-a55d-9f93b06efe0e", name: "Centro de Jovens Central", location: "Jovens, SP" },
    { id: "m93acf3c-8b16-4cf2-a55d-9f93b06efe0f", name: "Clube de Desbravadores", location: "Desbravadores, SP" },
    { id: "n93acf3c-8b16-4cf2-a55d-9f93b06efe10", name: "Ministério Jovem Adventista", location: "Jovens, SP" },
  ],
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
]

const ROLE_LABELS = {
  member: "Membro",
  volunteer: "Voluntário", 
  leader: "Líder",
  pastor: "Pastor",
  admin: "Administrador",
}

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { i18n, t: translate } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t = registerTranslations[currentLanguage as keyof typeof registerTranslations] || registerTranslations.en

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department_id: "",
      church_id: "",
    },
  })

  const selectedDepartment = form.watch("department_id")

  // Loading animation and content reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowContent(true), 300)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Language change handler
  const changeLanguage = (languageCode: string) => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(languageCode)
      const selectedLanguage = LANGUAGES.find(l => l.code === languageCode)
      toast.success(`${selectedLanguage?.flag} Language changed to ${selectedLanguage?.name}`, {
        duration: 3000
      })
    }
  }

  // Theme change handler
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    toast.success(`${newTheme === "dark" ? "🌙" : "☀️"} Theme changed to ${newTheme} mode`, {
      duration: 2000
    })
  }

  // Validar convite ao carregar a página
  useEffect(() => {
    const inviteToken = searchParams.get("invite")
    
    if (!inviteToken) {
      setIsValidInvite(false)
      return
    }

    try {
      // Decodificar JWT simulado
      const decodedInvite = JSON.parse(atob(inviteToken)) as InviteData
      
      // Verificar se o convite não expirou
      if (decodedInvite.expiresAt < Date.now()) {
        setIsValidInvite(false)
        toast.error(t.expiredInvite)
        return
      }

      setInviteData(decodedInvite)
      setIsValidInvite(true)

      // Se o convite tem email específico, preencher o campo
      if (decodedInvite.email) {
        form.setValue("email", decodedInvite.email)
      }

      toast.success(t.validInvite)
      
    } catch (error) {
      setIsValidInvite(false)
      toast.error(t.invalidInviteError)
    }
  }, [searchParams, form, t])

  // Limpar igreja quando departamento muda
  useEffect(() => {
    form.setValue("church_id", "")
  }, [selectedDepartment, form])

  const onSubmit = async (data: RegistrationForm) => {
    if (!inviteData) {
      toast.error("Dados do convite não encontrados. Tente novamente.")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simular validação de email único
      if (data.email === "admin@teste.com") {
        toast.error(t.emailAlreadyExists)
        setIsSubmitting(false)
        return
      }

      const loadingToast = toast.loading(t.finishing)
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Estrutura de dados conforme especificado
      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        language_preference: currentLanguage,
        institution_id: DEFAULT_INSTITUTION_ID,
        department_id: data.department_id,
        church_id: data.church_id,
        contact: {
          name: null,
          phone: null,
          mobile: null,
          email: null,
          country: null,
          city: null,
          address: null,
          full_address: null,
          website: null,
          postal_code: null,
          notes: null
        }
      }
      
      console.log("Registration data:", registrationData)
      
      toast.dismiss(loadingToast)
      toast.success(t.registrationSuccess, {
        duration: 6000,
        style: { minWidth: '350px' }
      })
      
      // Redirecionar para login após sucesso
      setTimeout(() => {
        router.push(`/login?registered=true&email=${encodeURIComponent(data.email)}&role=${inviteData.role}`)
      }, 2000)
      
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(t.registrationError, { duration: 5000 })
      setIsSubmitting(false)
    }
  }

  // Validation functions for each step
  const validateStep1 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['name', 'email'])
    if (!isValid) {
      toast.error(t.fillRequiredFields, { duration: 4000 })
      return false
    }
    toast.success(t.stepCompleted, { duration: 1500 })
    return true
  }

  const validateStep2 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['password', 'confirmPassword'])
    if (!isValid) {
      toast.error(t.fillRequiredFields, { duration: 4000 })
      return false
    }

    const password = form.getValues('password')
    const confirmPassword = form.getValues('confirmPassword')
    
    if (password.length < 6) {
      toast.error(t.passwordTooShort, { duration: 4000 })
      return false
    }
    
    if (password !== confirmPassword) {
      toast.error(t.passwordsDontMatch, { duration: 4000 })
      return false
    }

    toast.success(t.stepCompleted, { duration: 1500 })
    return true
  }

  const validateStep3 = async (): Promise<boolean> => {
    const isValid = await form.trigger(['department_id', 'church_id'])
    if (!isValid) {
      toast.error(t.fillRequiredFields, { duration: 4000 })
      return false
    }
    return true
  }

  // Define steps configuration
  const steps = [
    {
      id: "personal-info",
      title: t.personalInfo,
      description: t.personalInfoDesc,
      validation: validateStep1,
      fields: (
        <div className="space-y-1.5rem">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
                  <User className="w-1rem h-1rem" />
                  {t.name}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t.namePlaceholder} 
                    className="h-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
                  <Mail className="w-1rem h-1rem" />
                  {t.email}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t.emailPlaceholder} 
                    type="email" 
                    className="h-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                    disabled={!!inviteData?.email}
                    {...field} 
                  />
                </FormControl>
                {inviteData?.email && (
                  <FormDescription className="text-0.75rem">
                    {t.emailAutoFilled}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )
    },
    {
      id: "password-setup",
      title: t.passwordSetup,
      description: t.passwordSetupDesc,
      validation: validateStep2,
      fields: (
        <div className="space-y-1.5rem">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
                  <Lock className="w-1rem h-1rem" />
                  {t.password}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder={t.passwordPlaceholder} 
                      className="h-3rem pr-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0.5rem top-1/2 transform -translate-y-1/2 h-2rem w-2rem p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-1rem h-1rem" /> : <Eye className="w-1rem h-1rem" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
                  <Lock className="w-1rem h-1rem" />
                  {t.confirmPassword}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t.confirmPasswordPlaceholder} 
                      className="h-3rem pr-3rem text-1rem bg-background border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0.5rem top-1/2 transform -translate-y-1/2 h-2rem w-2rem p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-1rem h-1rem" /> : <Eye className="w-1rem h-1rem" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )
    },
    {
      id: "department-church",
      title: t.institutionData,
      description: t.institutionDataDesc,
      validation: validateStep3,
      fields: (
        <div className="space-y-1.5rem">
          {/* Department Selection - Card Options */}
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
                  <Shield className="w-1rem h-1rem" />
                  {t.department}
                </FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.75rem">
                  {DEPARTMENTS.map((department) => (
                    <div
                      key={department.id}
                      className={`cursor-pointer transition-all duration-200 p-1rem rounded-lg border-2 ${
                        field.value === department.id 
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                          : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onClick={() => field.onChange(department.id)}
                    >
                      <div className="flex items-center gap-0.5rem mb-0.5rem">
                        <div className={`w-0.75rem h-0.75rem rounded-full ${
                          field.value === department.id ? "bg-primary" : "bg-muted"
                        }`} />
                        <h4 className="font-medium text-0.875rem">{department.name}</h4>
                      </div>
                      <p className="text-0.75rem text-muted-foreground leading-relaxed">
                        {department.description}
                      </p>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Church Selection - Card Options */}
          <FormField
            control={form.control}
            name="church_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="flex items-center gap-0.5rem text-0.875rem font-medium">
                  <Church className="w-1rem h-1rem" />
                  {t.church}
                </FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.75rem">
                  {selectedDepartment && CHURCHES[selectedDepartment as keyof typeof CHURCHES]?.map((church) => (
                    <div
                      key={church.id}
                      className={`cursor-pointer transition-all duration-200 p-1rem rounded-lg border-2 ${
                        field.value === church.id 
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                          : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onClick={() => field.onChange(church.id)}
                    >
                      <div className="flex items-center gap-0.5rem mb-0.5rem">
                        <div className={`w-0.75rem h-0.75rem rounded-full ${
                          field.value === church.id ? "bg-primary" : "bg-muted"
                        }`} />
                        <h4 className="font-medium text-0.875rem">{church.name}</h4>
                      </div>
                      <p className="text-0.75rem text-muted-foreground">
                        {church.location}
                      </p>
                    </div>
                  ))}
                </div>
                {!selectedDepartment && (
                  <FormDescription className="text-0.75rem">
                    Selecione um departamento primeiro
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )
    }
  ]

  const progress = (currentStep / 3) * 100

  // Loading screen with animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Church className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">{t.loading}</p>
        </div>
      </div>
    )
  }

  // Se ainda está validando o convite
  if (isValidInvite === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-muted-foreground">{t.validatingInvite}</p>
        </div>
      </div>
    )
  }

  // Se o convite é inválido
  if (!isValidInvite) {
    return (
      <div className="min-h-screen bg-background">
        <div className="grid grid-cols-7 min-h-screen">
          <div className="col-span-6 flex items-center justify-center p-8">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="text-center">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <CardTitle>{t.invalidInvite}</CardTitle>
                <CardDescription>{t.invalidInviteDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/login")} className="w-full">
                  {t.goToLogin}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Column 7: Dark sidebar */}
          <div className="col-span-1 bg-gray-900 dark:bg-gray-950 relative">
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Church className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`grid grid-cols-7 min-h-screen transition-all duration-1000 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Columns 1-6: Registration Content */}
        <div className="col-span-6 flex items-center justify-center p-1rem sm:p-2rem">
          <div className="w-full max-w-2xl">
            
            {/* Header with Controls */}
            <div className="flex justify-between items-center mb-2rem">
              <h1 className="text-2rem sm:text-2.5rem font-bold">{t.title}</h1>
              
              {/* Language and Theme Controls */}
              <div className="flex gap-0.5rem">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-0.5rem h-2.5rem px-0.75rem">
                      <Globe className="w-1rem h-1rem" />
                      <span className="hidden sm:inline text-0.875rem">
                        {LANGUAGES.find(l => l.code === currentLanguage)?.flag}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {LANGUAGES.map((language) => (
                      <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="gap-0.5rem"
                      >
                        {language.flag} {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-2.5rem w-2.5rem p-0"
                >
                  {theme === "dark" ? <Sun className="w-1rem h-1rem" /> : <Moon className="w-1rem h-1rem" />}
                </Button>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground mb-1.5rem text-0.875rem sm:text-1rem">{t.subtitle}</p>
            
            {inviteData && (
              <div className="flex items-center justify-center gap-0.5rem mb-2rem">
                <Badge variant="secondary" className="flex items-center gap-0.25rem text-0.75rem">
                  <Shield className="w-0.75rem h-0.75rem" />
                  {ROLE_LABELS[inviteData.role as keyof typeof ROLE_LABELS]}
                </Badge>
              </div>
            )}

            {/* Multi-Step Form Component */}
            <Form {...form}>
              <MultiStepForm
                steps={steps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onSubmit={() => form.handleSubmit(onSubmit)()}
                isSubmitting={isSubmitting}
                previousLabel={t.previous}
                nextLabel={t.next}
                submitLabel={t.finishRegistration}
                submittingLabel={t.finishing}
                stepperVariant="circles"
              />
            </Form>
          </div>
        </div>
        
        {/* Column 7: Dark sidebar with logo */}
        <div className="col-span-1 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
          {/* Logo centered at top */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Church className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-48 left-1/4 w-8 h-8 bg-white/60 rounded-full"></div>
            <div className="absolute top-64 right-1/4 w-12 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/80 rounded-full"></div>
          </div>
          
          {/* Subtle decorative lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  )
}
