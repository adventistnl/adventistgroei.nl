"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Church, 
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import toast from "react-hot-toast"

// Schema de validação
const registrationSchema = z.object({
  // Dados Pessoais
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  
  // Dados da Igreja
  institution: z.string().min(1, "Instituição é obrigatória"),
  region: z.string().min(1, "Região é obrigatória"),
  church: z.string().min(1, "Igreja é obrigatória"),
  
  // Informações Adicionais
  address: z.string().optional(),
  notes: z.string().optional(),
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

// Mock data expandido - em produção viria da API
const INSTITUTIONS = [
  { value: "usp", label: "União Sul-Paulista" },
  { value: "ucb", label: "União Central Brasileira" },
  { value: "uan", label: "União Amazônica" },
  { value: "une", label: "União Nordeste Brasileira" },
  { value: "uso", label: "União Sul-Oeste" },
  { value: "unb", label: "União Norte Brasileira" },
  { value: "ues", label: "União Este Brasileira" },
  { value: "ueb", label: "União Extremo Oeste Brasileira" },
]

const REGIONS = {
  usp: [
    { value: "sp-capital", label: "São Paulo Capital" },
    { value: "sp-interior", label: "São Paulo Interior" },
    { value: "sp-litoral", label: "São Paulo Litoral" },
    { value: "sp-vale", label: "Vale do Paraíba" },
    { value: "mg-sul", label: "Minas Gerais Sul" },
    { value: "mg-triangulo", label: "Triângulo Mineiro" },
    { value: "rj-capital", label: "Rio de Janeiro Capital" },
    { value: "rj-interior", label: "Rio de Janeiro Interior" },
  ],
  ucb: [
    { value: "df", label: "Distrito Federal" },
    { value: "go-central", label: "Goiás Central" },
    { value: "go-norte", label: "Goiás Norte" },
    { value: "go-sul", label: "Goiás Sul" },
    { value: "mt-norte", label: "Mato Grosso Norte" },
    { value: "mt-sul", label: "Mato Grosso Sul" },
    { value: "ms", label: "Mato Grosso do Sul" },
    { value: "to", label: "Tocantins" },
  ],
  uan: [
    { value: "am-manaus", label: "Amazonas - Manaus" },
    { value: "am-interior", label: "Amazonas Interior" },
    { value: "ac", label: "Acre" },
    { value: "rr", label: "Roraima" },
    { value: "pa-belem", label: "Pará - Belém" },
    { value: "pa-interior", label: "Pará Interior" },
    { value: "ap", label: "Amapá" },
  ],
  une: [
    { value: "ba-salvador", label: "Bahia - Salvador" },
    { value: "ba-interior", label: "Bahia Interior" },
    { value: "pe-recife", label: "Pernambuco - Recife" },
    { value: "pe-interior", label: "Pernambuco Interior" },
    { value: "ce", label: "Ceará" },
    { value: "rn", label: "Rio Grande do Norte" },
    { value: "pb", label: "Paraíba" },
    { value: "al", label: "Alagoas" },
    { value: "se", label: "Sergipe" },
    { value: "ma", label: "Maranhão" },
    { value: "pi", label: "Piauí" },
  ],
  uso: [
    { value: "pr-curitiba", label: "Paraná - Curitiba" },
    { value: "pr-interior", label: "Paraná Interior" },
    { value: "sc-floripa", label: "Santa Catarina - Florianópolis" },
    { value: "sc-interior", label: "Santa Catarina Interior" },
    { value: "rs-poa", label: "Rio Grande do Sul - Porto Alegre" },
    { value: "rs-interior", label: "Rio Grande do Sul Interior" },
  ],
  unb: [
    { value: "ro", label: "Rondônia" },
    { value: "mt-norte", label: "Mato Grosso Norte" },
    { value: "pa-sul", label: "Pará Sul" },
  ],
  ues: [
    { value: "es", label: "Espírito Santo" },
    { value: "mg-leste", label: "Minas Gerais Leste" },
    { value: "rj-norte", label: "Rio de Janeiro Norte" },
  ],
  ueb: [
    { value: "ms-oeste", label: "Mato Grosso do Sul Oeste" },
    { value: "mt-oeste", label: "Mato Grosso Oeste" },
    { value: "ro-oeste", label: "Rondônia Oeste" },
  ],
}

const CHURCHES = {
  "sp-capital": [
    { value: "central-sp", label: "Igreja Central de São Paulo" },
    { value: "vila-madalena", label: "Igreja de Vila Madalena" },
    { value: "mooca", label: "Igreja da Mooca" },
    { value: "ipiranga", label: "Igreja do Ipiranga" },
    { value: "santana", label: "Igreja de Santana" },
    { value: "liberdade", label: "Igreja da Liberdade" },
    { value: "vila-maria", label: "Igreja de Vila Maria" },
    { value: "penha", label: "Igreja da Penha" },
    { value: "tatuape", label: "Igreja do Tatuapé" },
    { value: "bela-vista", label: "Igreja da Bela Vista" },
  ],
  "sp-interior": [
    { value: "campinas", label: "Igreja de Campinas" },
    { value: "sorocaba", label: "Igreja de Sorocaba" },
    { value: "santos", label: "Igreja de Santos" },
    { value: "ribeirao-preto", label: "Igreja de Ribeirão Preto" },
    { value: "sao-jose-campos", label: "Igreja de São José dos Campos" },
    { value: "piracicaba", label: "Igreja de Piracicaba" },
    { value: "bauru", label: "Igreja de Bauru" },
    { value: "marilia", label: "Igreja de Marília" },
    { value: "presidente-prudente", label: "Igreja de Presidente Prudente" },
  ],
  "sp-litoral": [
    { value: "santos-central", label: "Igreja Central de Santos" },
    { value: "sao-vicente", label: "Igreja de São Vicente" },
    { value: "guaruja", label: "Igreja do Guarujá" },
    { value: "cubatao", label: "Igreja de Cubatão" },
    { value: "bertioga", label: "Igreja de Bertioga" },
  ],
  "sp-vale": [
    { value: "sao-jose-central", label: "Igreja Central de São José dos Campos" },
    { value: "taubate", label: "Igreja de Taubaté" },
    { value: "guaratingueta", label: "Igreja de Guaratinguetá" },
    { value: "caraguatatuba", label: "Igreja de Caraguatatuba" },
  ],
  "mg-sul": [
    { value: "bh-central", label: "Igreja Central de Belo Horizonte" },
    { value: "bh-savassi", label: "Igreja de Savassi" },
    { value: "contagem", label: "Igreja de Contagem" },
    { value: "betim", label: "Igreja de Betim" },
    { value: "juiz-de-fora", label: "Igreja de Juiz de Fora" },
    { value: "uberlandia", label: "Igreja de Uberlândia" },
    { value: "montes-claros", label: "Igreja de Montes Claros" },
  ],
  "rj-capital": [
    { value: "rj-central", label: "Igreja Central do Rio de Janeiro" },
    { value: "copacabana", label: "Igreja de Copacabana" },
    { value: "tijuca", label: "Igreja da Tijuca" },
    { value: "barra", label: "Igreja da Barra da Tijuca" },
    { value: "niteroi", label: "Igreja de Niterói" },
    { value: "nova-iguacu", label: "Igreja de Nova Iguaçu" },
    { value: "duque-caxias", label: "Igreja de Duque de Caxias" },
  ],
  "df": [
    { value: "brasilia-central", label: "Igreja Central de Brasília" },
    { value: "asa-norte", label: "Igreja da Asa Norte" },
    { value: "asa-sul", label: "Igreja da Asa Sul" },
    { value: "taguatinga", label: "Igreja de Taguatinga" },
    { value: "ceilandia", label: "Igreja de Ceilândia" },
    { value: "sobradinho", label: "Igreja de Sobradinho" },
    { value: "planaltina", label: "Igreja de Planaltina" },
  ],
  "go-central": [
    { value: "goiania-central", label: "Igreja Central de Goiânia" },
    { value: "goiania-sul", label: "Igreja Goiânia Sul" },
    { value: "goiania-norte", label: "Igreja Goiânia Norte" },
    { value: "aparecida", label: "Igreja de Aparecida de Goiânia" },
    { value: "anapolis", label: "Igreja de Anápolis" },
    { value: "rio-verde", label: "Igreja de Rio Verde" },
  ],
  "ba-salvador": [
    { value: "salvador-central", label: "Igreja Central de Salvador" },
    { value: "barra-salvador", label: "Igreja da Barra" },
    { value: "pituba", label: "Igreja da Pituba" },
    { value: "ondina", label: "Igreja de Ondina" },
    { value: "itapua", label: "Igreja de Itapuã" },
    { value: "lauro-freitas", label: "Igreja de Lauro de Freitas" },
  ],
  "pe-recife": [
    { value: "recife-central", label: "Igreja Central do Recife" },
    { value: "boa-viagem", label: "Igreja de Boa Viagem" },
    { value: "casa-forte", label: "Igreja de Casa Forte" },
    { value: "olinda", label: "Igreja de Olinda" },
    { value: "jaboatao", label: "Igreja de Jaboatão dos Guararapes" },
  ],
  "am-manaus": [
    { value: "manaus-central", label: "Igreja Central de Manaus" },
    { value: "zona-norte", label: "Igreja da Zona Norte" },
    { value: "zona-sul", label: "Igreja da Zona Sul" },
    { value: "zona-leste", label: "Igreja da Zona Leste" },
    { value: "zona-oeste", label: "Igreja da Zona Oeste" },
  ],
  "pr-curitiba": [
    { value: "curitiba-central", label: "Igreja Central de Curitiba" },
    { value: "batel", label: "Igreja do Batel" },
    { value: "agua-verde", label: "Igreja da Água Verde" },
    { value: "sao-francisco", label: "Igreja de São Francisco" },
    { value: "pinhais", label: "Igreja de Pinhais" },
    { value: "colombo", label: "Igreja de Colombo" },
  ],
  "rs-poa": [
    { value: "poa-central", label: "Igreja Central de Porto Alegre" },
    { value: "moinhos", label: "Igreja de Moinhos de Vento" },
    { value: "zona-sul", label: "Igreja da Zona Sul" },
    { value: "zona-norte", label: "Igreja da Zona Norte" },
    { value: "canoas", label: "Igreja de Canoas" },
    { value: "novo-hamburgo", label: "Igreja de Novo Hamburgo" },
  ],
}

const ROLE_LABELS = {
  member: "Membro",
  volunteer: "Voluntário",
  leader: "Líder",
  pastor: "Pastor",
  admin: "Administrador",
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      institution: "",
      region: "",
      church: "",
      address: "",
      notes: "",
    },
  })

  const selectedInstitution = form.watch("institution")
  const selectedRegion = form.watch("region")

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
        toast.error("Este convite expirou")
        return
      }

      setInviteData(decodedInvite)
      setIsValidInvite(true)

      // Se o convite tem email específico, preencher o campo
      if (decodedInvite.email) {
        form.setValue("email", decodedInvite.email)
      }

      toast.success("Convite válido! Preencha seus dados para completar o registro.")
      
    } catch (error) {
      setIsValidInvite(false)
      toast.error("Convite inválido")
    }
  }, [searchParams, form])

  // Limpar região e igreja quando instituição muda
  useEffect(() => {
    form.setValue("region", "")
    form.setValue("church", "")
  }, [selectedInstitution, form])

  // Limpar igreja quando região muda
  useEffect(() => {
    form.setValue("church", "")
  }, [selectedRegion, form])

  const onSubmit = async (data: RegistrationForm) => {
    if (!inviteData) {
      toast.error("Dados do convite não encontrados. Tente novamente.")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Validação adicional antes do envio
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'institution', 'region', 'church']
      const missingFields = requiredFields.filter(field => !data[field as keyof RegistrationForm])
      
      if (missingFields.length > 0) {
        toast.error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`)
        setIsSubmitting(false)
        return
      }

      // Simular validação de email único
      if (data.email === "admin@teste.com") {
        toast.error("Este email já está em uso. Use outro email.")
        setIsSubmitting(false)
        return
      }

      // Toast de loading
      const loadingToast = toast.loading("Processando registro...")
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const registrationData = {
        ...data,
        role: inviteData.role,
        invitedBy: inviteData.invitedBy,
        registrationDate: new Date().toISOString(),
        inviteToken: searchParams.get("invite"),
      }
      
      console.log("Registration data:", registrationData)
      
      // Dismiss loading toast
      toast.dismiss(loadingToast)
      
      // Success toast
      toast.success(
        `🎉 Registro concluído com sucesso!\n👤 Função: ${ROLE_LABELS[inviteData.role as keyof typeof ROLE_LABELS]}\n🔐 Faça seu primeiro login para acessar o sistema.`,
        {
          duration: 6000,
          style: {
            minWidth: '350px',
          },
        }
      )
      
      // Redirecionar para login após sucesso
      setTimeout(() => {
        router.push(`/login?registered=true&email=${encodeURIComponent(data.email)}&role=${inviteData.role}`)
      }, 2000)
      
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(
        "❌ Erro ao processar registro.\nVerifique sua conexão e tente novamente.",
        {
          duration: 5000,
        }
      )
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (currentStep >= 3) return

    // Validar campos da etapa atual antes de prosseguir
    let fieldsToValidate: (keyof RegistrationForm)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'birthDate']
    } else if (currentStep === 2) {
      fieldsToValidate = ['institution', 'region', 'church']
    }

    const isValid = await form.trigger(fieldsToValidate)
    
    if (!isValid) {
      toast.error("⚠️ Preencha todos os campos obrigatórios antes de continuar.", {
        duration: 4000,
      })
      return
    }

    // Validação específica para etapa 1
    if (currentStep === 1) {
      const emailValue = form.getValues('email')
      const phoneValue = form.getValues('phone')
      
      // Validar formato do email
      if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        toast.error("📧 Formato de email inválido.", {
          duration: 4000,
        })
        return
      }
      
      // Validar telefone (mínimo 10 dígitos)
      if (phoneValue && phoneValue.replace(/\D/g, '').length < 10) {
        toast.error("📱 Telefone deve ter pelo menos 10 dígitos.", {
          duration: 4000,
        })
        return
      }
    }

    toast.success("✅ Etapa concluída!", {
      duration: 2000,
    })
    
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progress = (currentStep / 3) * 100

  // Se ainda está validando o convite
  if (isValidInvite === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Validando convite...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Se o convite é inválido
  if (!isValidInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Convite Inválido</CardTitle>
            <CardDescription>
              Este link de convite é inválido ou expirou. Entre em contato com o administrador para obter um novo convite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push("/login")} 
              className="w-full"
            >
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Registro de Novo Membro</h1>
            <p className="text-muted-foreground mb-4">
              Complete seu registro no sistema Church Growth International
            </p>
            
            {inviteData && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {ROLE_LABELS[inviteData.role as keyof typeof ROLE_LABELS]}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Convite válido
                </Badge>
              </div>
            )}
            
            {/* Progress */}
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Etapa {currentStep} de 3
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 && <><User className="w-5 h-5" /> Dados Pessoais</>}
                {currentStep === 2 && <><Church className="w-5 h-5" /> Informações da Igreja</>}
                {currentStep === 3 && <><CheckCircle className="w-5 h-5" /> Revisão e Confirmação</>}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Preencha suas informações pessoais básicas"}
                {currentStep === 2 && "Selecione sua instituição, região e igreja"}
                {currentStep === 3 && "Revise suas informações antes de finalizar"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Etapa 1: Dados Pessoais */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Nome</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Seu nome" 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Sobrenome</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Seu sobrenome" 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <Mail className="w-5 h-5" />
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="seu@email.com" 
                                type="email" 
                                className="h-12 text-base"
                                disabled={!!inviteData?.email}
                                {...field} 
                              />
                            </FormControl>
                            {inviteData?.email && (
                              <FormDescription className="text-sm">
                                Email preenchido automaticamente pelo convite
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Phone className="w-5 h-5" />
                                Telefone
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(11) 99999-9999" 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Calendar className="w-5 h-5" />
                                Data de Nascimento
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <MapPin className="w-5 h-5" />
                              Endereço (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Seu endereço completo..."
                                rows={3}
                                className="text-base resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Etapa 2: Informações da Igreja */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <Building className="w-5 h-5" />
                              Instituição
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Selecione sua instituição" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INSTITUTIONS.map((institution) => (
                                  <SelectItem key={institution.value} value={institution.value}>
                                    <div className="py-2">
                                      <span className="font-medium">{institution.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <MapPin className="w-5 h-5" />
                              Região
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              disabled={!selectedInstitution}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Selecione sua região" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedInstitution && REGIONS[selectedInstitution as keyof typeof REGIONS]?.map((region) => (
                                  <SelectItem key={region.value} value={region.value}>
                                    <div className="py-2">
                                      <span className="font-medium">{region.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!selectedInstitution && (
                              <FormDescription className="text-sm">
                                Selecione uma instituição primeiro
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="church"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <Church className="w-5 h-5" />
                              Igreja
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              disabled={!selectedRegion}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Selecione sua igreja" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedRegion && CHURCHES[selectedRegion as keyof typeof CHURCHES]?.map((church) => (
                                  <SelectItem key={church.value} value={church.value}>
                                    <div className="py-2">
                                      <span className="font-medium">{church.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!selectedRegion && (
                              <FormDescription className="text-sm">
                                Selecione uma região primeiro
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base font-medium">Observações (Opcional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Informações adicionais sobre você ou seu ministério..."
                                rows={4}
                                className="text-base resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Etapa 3: Revisão */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Revisão Final</AlertTitle>
                        <AlertDescription>
                          Verifique se todas as informações estão corretas antes de finalizar o registro.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Dados Pessoais */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Dados Pessoais
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Nome:</span>
                              <p className="font-medium">{form.getValues("firstName")} {form.getValues("lastName")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email:</span>
                              <p className="font-medium">{form.getValues("email")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Telefone:</span>
                              <p className="font-medium">{form.getValues("phone")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Nascimento:</span>
                              <p className="font-medium">{form.getValues("birthDate")}</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Dados da Igreja */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Church className="w-4 h-4" />
                              Informações da Igreja
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Instituição:</span>
                              <p className="font-medium">
                                {INSTITUTIONS.find(i => i.value === form.getValues("institution"))?.label}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Região:</span>
                              <p className="font-medium">
                                {selectedInstitution && REGIONS[selectedInstitution as keyof typeof REGIONS]?.find(r => r.value === form.getValues("region"))?.label}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Igreja:</span>
                              <p className="font-medium">
                                {selectedRegion && CHURCHES[selectedRegion as keyof typeof CHURCHES]?.find(c => c.value === form.getValues("church"))?.label}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Função:</span>
                              <Badge variant="secondary">
                                {inviteData && ROLE_LABELS[inviteData.role as keyof typeof ROLE_LABELS]}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center justify-center gap-2 h-12 text-base min-w-32"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Anterior
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center justify-center gap-2 h-12 text-base min-w-32"
                      >
                        Próximo
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 h-12 text-base min-w-48"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Finalizando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Finalizar Registro
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
