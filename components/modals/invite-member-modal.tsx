"use client"

import * as React from "react"
import { useState } from "react"
import { Copy, Mail, Link as LinkIcon, Users, Shield, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface InviteMemberModalProps {
  children: React.ReactNode
  onInviteSent?: (inviteData: InviteData) => void
}

interface InviteData {
  type: "email" | "link"
  email?: string
  role: string
  expiresIn: string
  message?: string
  inviteLink?: string
}

const ROLES = [
  { value: "member", label: "Member", description: "Basic access to church activities" },
  { value: "volunteer", label: "Volunteer", description: "Can participate in church services" },
  { value: "leader", label: "Leader", description: "Can manage specific departments" },
  { value: "pastor", label: "Pastor", description: "Full access to pastoral functions" },
  { value: "admin", label: "Administrator", description: "Complete system access" },
]

const EXPIRY_OPTIONS = [
  { value: "24h", label: "24 hours" },
  { value: "3d", label: "3 days" },
  { value: "7d", label: "1 week" },
  { value: "30d", label: "30 days" },
]

export function InviteMemberModal({ children, onInviteSent }: InviteMemberModalProps) {
  const [open, setOpen] = useState(false)
  const [inviteStep, setInviteStep] = useState<"form" | "success">("form")
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<InviteData>({
    defaultValues: {
      type: "email",
      role: "member",
      expiresIn: "7d",
      message: "",
    },
  })

  const inviteType = form.watch("type")

  // Simular geração de JWT e link
  const generateInviteLink = async (data: InviteData): Promise<string> => {
    setIsGenerating(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular geração de JWT token
    const mockJWT = btoa(JSON.stringify({
      role: data.role,
      type: data.type,
      email: data.email,
      expiresAt: Date.now() + (parseInt(data.expiresIn) * 24 * 60 * 60 * 1000),
      invitedBy: "current-user-id",
      timestamp: Date.now()
    }))

    const inviteLink = `${window.location.origin}/register?invite=${mockJWT}`
    
    setIsGenerating(false)
    return inviteLink
  }

  const onSubmit = async (data: InviteData) => {
    try {
      const inviteLink = await generateInviteLink(data)
      
      setGeneratedLink(inviteLink)
      setInviteStep("success")
      
      const finalInviteData = {
        ...data,
        inviteLink
      }
      
      onInviteSent?.(finalInviteData)
      
      toast.success(
        data.type === "email" 
          ? `📧 Convite enviado para ${data.email}!\n🔗 Link também disponível para compartilhamento.` 
          : "🔗 Link de convite gerado com sucesso!\n📋 Pronto para compartilhar.",
        {
          duration: 5000,
          style: {
            minWidth: '320px',
          },
        }
      )
      
    } catch (error) {
      toast.error("Erro ao gerar convite. Tente novamente.")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("📋 Link copiado para a área de transferência!", {
        duration: 3000,
      })
    } catch (error) {
      toast.error("❌ Erro ao copiar link. Tente novamente.", {
        duration: 4000,
      })
    }
  }

  const resetModal = () => {
    setInviteStep("form")
    setGeneratedLink("")
    form.reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(resetModal, 300) // Reset after modal closes
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {inviteStep === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Convidar Novo Membro
              </DialogTitle>
              <DialogDescription>
                Envie um convite seguro para que novos membros possam se registrar no sistema
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Tipo de Convite */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Convite</FormLabel>
                      <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Específico
                          </TabsTrigger>
                          <TabsTrigger value="link" className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Link Compartilhável
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="email" className="mt-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Convite por Email</CardTitle>
                              <CardDescription>
                                O convite será enviado diretamente para o email especificado
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email do Novo Membro</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="exemplo@email.com" 
                                        type="email"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="link" className="mt-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Link Compartilhável</CardTitle>
                              <CardDescription>
                                Qualquer pessoa com este link poderá se registrar com o role selecionado
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <LinkIcon className="w-4 h-4" />
                                Link será gerado após configurar as opções abaixo
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Seleção de Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Função/Role do Membro
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{role.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {role.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Esta função determinará as permissões do novo membro no sistema
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expiração */}
                <FormField
                  control={form.control}
                  name="expiresIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Expiração do Convite
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tempo de expiração" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXPIRY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O convite expirará automaticamente após este período
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mensagem Opcional */}
                {inviteType === "email" && (
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem Personalizada (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Adicione uma mensagem pessoal ao convite..."
                            className="resize-none"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Esta mensagem será incluída no email de convite
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        {inviteType === "email" ? (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Enviar Convite
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Gerar Link
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {inviteStep === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Convite Gerado com Sucesso!
              </DialogTitle>
              <DialogDescription>
                {inviteType === "email" 
                  ? "O convite foi enviado por email. O link abaixo também pode ser compartilhado."
                  : "Seu link de convite está pronto para ser compartilhado."
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Informações do Convite */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Detalhes do Convite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Função:</span>
                    <Badge variant="secondary">
                      {ROLES.find(r => r.value === form.getValues("role"))?.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expira em:</span>
                    <span className="text-sm">
                      {EXPIRY_OPTIONS.find(o => o.value === form.getValues("expiresIn"))?.label}
                    </span>
                  </div>
                  {inviteType === "email" && form.getValues("email") && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Enviado para:</span>
                      <span className="text-sm font-medium">{form.getValues("email")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Link de Convite */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Link de Convite</CardTitle>
                  <CardDescription>
                    Compartilhe este link com o novo membro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input 
                      value={generatedLink} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(generatedLink)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={resetModal}
              >
                Novo Convite
              </Button>
              <Button onClick={() => handleOpenChange(false)}>
                Concluir
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
