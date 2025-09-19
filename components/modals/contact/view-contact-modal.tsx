"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Contact, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  FileText,
  X,
  Building,
  Calendar,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { contactTranslations } from "@/lib/translations/contact"

export interface ContactData {
  id: string
  name?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  country?: string | null
  city?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  is_primary?: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

interface ViewContactModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  contact: ContactData | null
  entityName?: string // Nome da entidade (ex: "São Paulo Capital", "Igreja Central")
  entityType?: string // Tipo da entidade (ex: "Region", "Church", "Department")
  className?: string
}

/**
 * Modal reutilizável para visualizar informações de contato
 * Estilo minimalista e totalmente reutilizável para qualquer página
 */
export function ViewContactModal({
  isOpen,
  onOpenChange,
  contact,
  entityName,
  entityType = "Entity",
  className
}: ViewContactModalProps) {
  const { i18n } = useTranslation()
  
  if (!contact) return null

  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = contactTranslations[currentLanguage as keyof typeof contactTranslations] || contactTranslations.en

  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Obter tradução do tipo de entidade
  const getEntityTypeTranslation = (type: string) => {
    const normalizedType = type.toLowerCase()
    return t.entityTypes[normalizedType as keyof typeof t.entityTypes] || type
  }

  const hasContactInfo = contact.name || contact.phone || contact.mobile || contact.email
  const hasAddressInfo = contact.country || contact.city || contact.address || contact.postal_code
  const hasAdditionalInfo = contact.website || contact.notes

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6", className)}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Contact className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
                  {t.title}
                </DialogTitle>
                {entityName && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                    {getEntityTypeTranslation(entityType)}: {entityName}
                  </p>
                )}
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={contact.is_primary ? "default" : "secondary"} className="bg-teal-100 text-teal-700 text-xs sm:text-sm">
              {contact.is_primary ? t.primaryContact : t.secondaryContact}
            </Badge>
            {contact.is_deleted && (
              <Badge variant="destructive" className="text-xs sm:text-sm">{t.deleted}</Badge>
            )}
          </div>

          {/* Main Contact Information */}
          {hasContactInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                  {t.contactDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.name && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{contact.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.contactName}</p>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">{contact.phone}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.phone}</p>
                    </div>
                  </div>
                )}

                {contact.mobile && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">{contact.mobile}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.mobile}</p>
                    </div>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base break-all">{contact.email}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Address Information */}
          {hasAddressInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  {t.addressInformation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.full_address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{contact.full_address}</p>
                      <p className="text-sm text-muted-foreground">{t.fullAddress}</p>
                    </div>
                  </div>
                )}

                {contact.address && !contact.full_address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{contact.address}</p>
                      <p className="text-sm text-muted-foreground">{t.address}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contact.city && (
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contact.city}</p>
                        <p className="text-sm text-muted-foreground">{t.city}</p>
                      </div>
                    </div>
                  )}

                  {contact.country && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contact.country}</p>
                        <p className="text-sm text-muted-foreground">{t.country}</p>
                      </div>
                    </div>
                  )}

                  {contact.postal_code && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contact.postal_code}</p>
                        <p className="text-sm text-muted-foreground">{t.postalCode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {hasAdditionalInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal-600" />
                  {t.additionalInformation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <a 
                        href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-teal-600 hover:text-teal-700 underline"
                      >
                        {contact.website}
                      </a>
                      <p className="text-sm text-muted-foreground">{t.website}</p>
                    </div>
                  </div>
                )}

                {contact.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{contact.notes}</p>
                      <p className="text-sm text-muted-foreground">{t.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                {t.systemInformation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t.created}</p>
                  <p className="font-medium">{formatDate(contact.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.updated}</p>
                  <p className="font-medium">{formatDate(contact.updated_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.createdBy}</p>
                  <p className="font-medium">{contact.created_by}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.updatedBy}</p>
                  <p className="font-medium">{contact.updated_by}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
