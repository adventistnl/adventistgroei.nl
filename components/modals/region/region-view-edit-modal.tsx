"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ColorBadge } from "@/components/ui/color-badge"
import {
  MapPin,
  Edit,
  X,
  Check,
  Copy,
  ChevronDown,
  Home,
  Globe,
  Calendar
} from "lucide-react"
import toast from "react-hot-toast"
import { regionTranslations } from "@/lib/translations/regions"
import { Regions_regions } from "@/types/Regions"

export interface RegionViewEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  region: Regions_regions | null
  onEdit?: (region: Regions_regions) => void
  churchCountByRegion: Record<string, number>
}

export function RegionViewEditModal({
  isOpen,
  onOpenChange,
  region,
  onEdit,
  churchCountByRegion
}: RegionViewEditModalProps) {
  const { i18n } = useTranslation()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    territory: false,
    churches: false,
    cities: false,
    system: false
  })

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tRegion = regionTranslations[currentLanguage as keyof typeof regionTranslations] || regionTranslations.en

  // Parse territory data
  const territoryData = useMemo(() => {
    if (!region?.territory) return null
    try {
      return typeof region.territory === 'string' ? JSON.parse(region.territory) : region.territory
    } catch {
      return null
    }
  }, [region?.territory])

  // Extract provinces and cities
  const provinces = useMemo(() => {
    if (!territoryData?.NL) return []
    return Object.keys(territoryData.NL)
  }, [territoryData])

  const cities = useMemo(() => {
    if (!territoryData?.NL) return []
    const allCities: string[] = []
    Object.values(territoryData.NL).forEach((provinceCities: any) => {
      if (Array.isArray(provinceCities)) {
        allCities.push(...provinceCities)
      }
    })
    return allCities
  }, [territoryData])

  // Get churches for this region
  const regionChurches = useMemo(() => {
    const filtered = region?.churches?.filter(c => !c.is_deleted) || []
    return filtered
  }, [region?.churches, region?.name, region?.id, churchCountByRegion])

  const churchCount = useMemo(() => {
    const count = region ? (churchCountByRegion[region.id] || 0) : 0
    return count
  }, [region, churchCountByRegion])

  const handleClose = () => {
    onOpenChange(false)
  }
  
  const handleEdit = () => {
    if (region && onEdit) {
      onEdit(region)
      onOpenChange(false)
    }
  }

  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      const successMessage = currentLanguage === 'pt' ? 'Copiado para área de transferência!' : currentLanguage === 'nl' ? 'Gekopieerd naar klembord!' : 'Copied to clipboard!'
      toast.success(successMessage, {
        duration: 2000,
        icon: '📋'
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      const errorMessage = currentLanguage === 'pt' ? 'Falha ao copiar' : currentLanguage === 'nl' ? 'Kopiëren mislukt' : 'Failed to copy'
      toast.error(errorMessage)
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const renderCopyableField = (value: string | null | undefined, fieldKey: string, placeholder?: string) => {
    return (
      <div className="group relative py-2 text-sm flex items-center justify-between min-h-[32px]">
        <span className={value ? "text-gray-900" : "text-gray-400 italic"}>
          {value || placeholder || (currentLanguage === 'pt' ? 'Não fornecido' : currentLanguage === 'nl' ? 'Niet verstrekt' : 'Not provided')}
        </span>
        {value && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(value, fieldKey)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-gray-100"
            title={currentLanguage === 'pt' ? 'Copiar para área de transferência' : currentLanguage === 'nl' ? 'Kopiëren naar klembord' : 'Copy to clipboard'}
          >
            {copiedField === fieldKey ? (
              <Check className="w-3 h-3 text-gray-600" />
            ) : (
              <Copy className="w-3 h-3 text-gray-500" />
            )}
          </Button>
        )}
      </div>
    )
  }

  const renderCollapsibleSection = (
    sectionKey: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey]
    
    return (
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full group hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            }`}
          />
        </button>
        
        {!isCollapsed && (
          <div className="animate-in fade-in-0 duration-200 slide-in-from-top-1">
            {content}
          </div>
        )}
      </div>
    )
  }

  const renderViewMode = () => {
    return (
      <div className="space-y-8">
        {/* Basic Information Section */}
        {renderCollapsibleSection(
          'basic',
          <MapPin className="w-4 h-4 text-gray-500" />,
          tRegion.steps?.step_2_title || "Basic Information",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {tRegion.fields?.name || "Region Name"}
              </Label>
              {renderCopyableField(region?.name, 'name')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {tRegion.fields?.description || "Description"}
              </Label>
              {renderCopyableField(region?.description, 'description')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {tRegion.fields?.color || "Color"}
              </Label>
              <div className="py-2">
                <ColorBadge color={region?.color || '#10b981'} showHex={true} />
              </div>
            </div>
          </div>
        )}

        {/* Territory Information Section */}
        {renderCollapsibleSection(
          'territory',
          <Globe className="w-4 h-4 text-gray-500" />,
          tRegion.fields?.provinces || "Territory",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {tRegion.fields?.provinces || "Provinces"}
              </Label>
              <div className="py-2">
                {provinces.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {provinces.map(province => (
                      <Badge key={province} variant="secondary" className={`bg-${region?.color || '10b981'}20 text-color${region?.color || '10b981'} border-color${region?.color || '10b981'}border`}>
                        {province}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    {currentLanguage === 'pt' ? 'Nenhuma província atribuída' : currentLanguage === 'nl' ? 'Geen provincies toegewezen' : 'No provinces assigned'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cities Section */}
        {renderCollapsibleSection(
          'cities',
          <MapPin className="w-4 h-4 text-gray-500" />,
          `${currentLanguage === 'pt' ? 'Cidades' : currentLanguage === 'nl' ? 'Steden' : 'Cities'} (${cities.length})`,
          <div className="space-y-2">
            {cities.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {cities.map((city, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">
                {currentLanguage === 'pt' ? 'Nenhuma cidade atribuída' : currentLanguage === 'nl' ? 'Geen steden toegewezen' : 'No cities assigned'}
              </span>
            )}
          </div>
        )}

        {/* Churches Section */}
        {renderCollapsibleSection(
          'churches',
          <Home className="w-4 h-4 text-gray-500" />,
          `${currentLanguage === 'pt' ? 'Igrejas' : currentLanguage === 'nl' ? 'Kerken' : 'Churches'} (${churchCount})`,
          <div className="space-y-2">
            {regionChurches.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {regionChurches.map((church) => (
                  <div key={church.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${region?.color || '#10b981'}20` }}
                    >
                      <Home 
                        className="w-4 h-4" 
                        style={{ color: region?.color || '#10b981' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">{church.name}</div>
                      {church.contact?.city && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {church.contact.city}{church.contact.state ? `, ${church.contact.state}` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 italic">
                  {currentLanguage === 'pt' ? 'Nenhuma igreja atribuída a esta região' : currentLanguage === 'nl' ? 'Geen kerken toegewezen aan deze regio' : 'No churches assigned to this region'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* System Information Section */}
        {renderCollapsibleSection(
          'system',
          <Calendar className="w-4 h-4 text-gray-500" />,
          currentLanguage === 'pt' ? 'Informações do Sistema' : currentLanguage === 'nl' ? 'Systeeminformatie' : 'System Information',
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {currentLanguage === 'pt' ? 'Criado Em' : currentLanguage === 'nl' ? 'Aangemaakt Op' : 'Created At'}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {region?.created_at ? formatDate(region.created_at) : 'N/A'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {currentLanguage === 'pt' ? 'Atualizado Em' : currentLanguage === 'nl' ? 'Bijgewerkt Op' : 'Updated At'}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {region?.updated_at ? formatDate(region.updated_at) : 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {currentLanguage === 'pt' ? 'ID da Região' : currentLanguage === 'nl' ? 'Regio ID' : 'Region ID'}
              </Label>
              {renderCopyableField(region?.id, 'id')}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg text-gray-900">
            <MapPin className="w-5 h-5 text-gray-600" />
            {tRegion.modals?.details?.title || "Region Details"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {region?.name || (currentLanguage === 'pt' ? 'Informações da Região' : currentLanguage === 'nl' ? 'Regio-informatie' : 'Region Information')}
          </DialogDescription>
          
          {/* Region Status and Edit Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Badge variant={region?.is_deleted ? "destructive" : "default"} className="bg-gray-100 text-gray-800 border-gray-300">
                <MapPin className="w-3 h-3 mr-1" />
                {region?.is_deleted 
                  ? (currentLanguage === 'pt' ? 'Deletada' : currentLanguage === 'nl' ? 'Verwijderd' : 'Deleted')
                  : (currentLanguage === 'pt' ? 'Ativa' : currentLanguage === 'nl' ? 'Actief' : 'Active')
                }
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <Home className="w-3 h-3 mr-1" />
                {churchCount} {churchCount === 1 
                  ? (currentLanguage === 'pt' ? 'Igreja' : currentLanguage === 'nl' ? 'Kerk' : 'Church')
                  : (currentLanguage === 'pt' ? 'Igrejas' : currentLanguage === 'nl' ? 'Kerken' : 'Churches')
                }
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleEdit} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Edit className="w-4 h-4 mr-2" />
              {currentLanguage === 'pt' ? 'Editar' : currentLanguage === 'nl' ? 'Bewerken' : 'Edit'}
            </Button>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {renderViewMode()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-end items-center">
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="w-3 h-3 mr-1" />
              {currentLanguage === 'pt' ? 'Fechar' : currentLanguage === 'nl' ? 'Sluiten' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
