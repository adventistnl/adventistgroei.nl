"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { ColorBadge } from "@/components/ui/color-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Navigation
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { structureTranslations } from "@/lib/translations/structure"
import { regionTranslations } from "@/lib/translations/regions"
import { regionsPageTranslations } from "@/lib/translations/regions-page"
import { DataTable } from "@/components/ui/data-table"
import { AddRegionModal, EditRegionModal, DeleteRegionModal } from "@/components/modals/region"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { ChartHeader } from "@/components/shared/chart-header"
import MapLibre, { NETHERLANDS_CENTER, generateCityMarkers, RegionConfig as MapRegionConfig } from "@/components/maps/map-libre-refactored"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@apollo/client"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"

import { useRegions } from "@/hooks/use-regions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { Regions_regions } from "@/types/Regions"
import { getCoordinatesFromZipCode } from "@/lib/geocoding"
import { 
  enrichChurchesWithAutoLink, 
  calculateAutoLinkStats,
  findMatchingRegion,
  type EnrichedChurch 
} from "@/lib/church-region-matcher"

/**
 * PÁGINA DE GESTÃO DE REGIÕES
 * Interface dedicada para gerenciar regiões baseada no ERD do AdventistGroei
 */
export default function RegionsPage() {
  const { t, i18n } = useTranslation()
  const { theme, resolvedTheme } = useTheme()
  const { regions, refetchRegions } = useRegions();
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'regions' | 'churches'>('regions')
  
  // Fetch churches data
  const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY);
  const churches = useMemo(() => churchesData?.churches?.filter((c: any) => !c.is_deleted) || [], [churchesData]);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<Regions_regions | null>(null)
  
  // Map ref for refocus functionality
  const [mapInstance, setMapInstance] = useState<any>(null)
  
  // ============================================================================
  // TRANSLATIONS & PAGE CONFIG
  // ============================================================================
  
  const currentLanguage = i18n?.language || 'en'
  const tStructure = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
  const tRegion = regionTranslations[currentLanguage as keyof typeof regionTranslations] || regionTranslations.en
  const tPage = regionsPageTranslations[currentLanguage as keyof typeof regionsPageTranslations] || regionsPageTranslations.en
  
  // ============================================================================
  // CONSOLIDATED DEBUG: REGIONS ↔ CHURCHES RELATIONSHIP
  // ============================================================================
  useEffect(() => {
    if (regions.length === 0 || churches.length === 0) return;
    
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║          🔍 CONSOLIDATED DEBUG: REGIONS ↔ CHURCHES               ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
    
    // ========== PART 1: REGIONS DATA ==========
    console.log('📍 ===== REGIONS DATA (Complete Registry) =====\n');
    
    regions.forEach((region, index) => {
      console.log(`\n┌─── Region ${index + 1}: ${region.name} ───┐`);
      console.log('│ 🆔 ID:', region.id);
      console.log('│ 🎨 Color:', region.color);
      console.log('│ 📝 Description:', region.description || 'N/A');
      console.log('│ 🗺️  Territory JSON:', region.territory);
      
      // Parse territory
      let territoryParsed = null;
      let provinces: string[] = [];
      let cities: string[] = [];
      
      if (region.territory) {
        try {
          territoryParsed = typeof region.territory === 'string' 
            ? JSON.parse(region.territory) 
            : region.territory;
          
          if (territoryParsed?.NL) {
            provinces = Object.keys(territoryParsed.NL);
            cities = Object.values(territoryParsed.NL).flat() as string[];
          }
        } catch (e) {
          console.log('│ ⚠️  Territory parse error');
        }
      }
      
      console.log('│ 🏙️  Provinces:', provinces.join(', ') || 'None');
      console.log('│ 📌 Cities Count:', cities.length);
      console.log('│ 🏛️  Churches in Region:', region.churches?.length || 0);
      console.log('│ 📊 KPI Data:', region.kpiData);
      console.log('│');
      console.log('│ 📦 Churches List:');
      
      if (region.churches && region.churches.length > 0) {
        region.churches.forEach((church, idx) => {
          const contactData = church.contact;
          console.log(`│   ${idx + 1}. ${church.name}`);
          console.log(`│      - Church ID: ${church.id}`);
          console.log(`│      - Contact: ${contactData ? 'YES' : 'NO'}`);
          if (contactData) {
            console.log(`│      - City: ${contactData.city || 'N/A'}`);
            console.log(`│      - State/Province: ${contactData.state || 'N/A'}`);
            console.log(`│      - Country: ${contactData.country || 'N/A'}`);
          }
        });
      } else {
        console.log('│   (No churches assigned)');
      }
      
      console.log('└────────────────────────────────────────┘');
    });
    
    // ========== PART 2: CHURCHES DATA ==========
    console.log('\n\n🏛️  ===== CHURCHES DATA (Complete Registry) =====\n');
    
    churches.forEach((church, index) => {
      console.log(`\n┌─── Church ${index + 1}: ${church.name} ───┐`);
      console.log('│ 🆔 ID:', church.id);
      console.log('│ 🏢 Institution ID:', church.institution_id);
      console.log('│ 📍 Region ID:', church.region_id || '❌ NO REGION');
      console.log('│ 📬 Contact ID:', church.contact_id || 'N/A');
      console.log('│ 🏷️  Type:', church.type);
      console.log('│ 📮 Zip Code:', church.zip_code || 'N/A');
      console.log('│ 🏠 House Number:', church.house_number || 'N/A');
      console.log('│ 🔘 Is Deleted:', church.is_deleted);
      console.log('│');
      console.log('│ 👤 Leader:');
      if (church.leader) {
        console.log(`│   - Name: ${church.leader.name}`);
        console.log(`│   - Email: ${church.leader.email}`);
      } else {
        console.log('│   (No leader assigned)');
      }
      console.log('│');
      console.log('│ 📞 Contact Data:');
      if (church.contact) {
        console.log(`│   - City: ${church.contact.city || 'N/A'}`);
        console.log(`│   - State/Province: ${church.contact.state || 'N/A'}`);
        console.log(`│   - Country: ${church.contact.country || 'N/A'}`);
        console.log(`│   - Postal Code: ${church.contact.postal_code || 'N/A'}`);
      } else {
        console.log('│   (No contact data)');
      }
      console.log('│');
      console.log('│ 🌍 Region Link:');
      if (church.region) {
        console.log(`│   ✅ LINKED to: ${church.region.name}`);
        console.log(`│   - Region Color: ${church.region.color}`);
      } else if (church.region_id) {
        console.log(`│   ⚠️  Has region_id but NO region object`);
      } else {
        console.log('│   ❌ NOT LINKED to any region');
        
        // VALIDAÇÃO AUTOMÁTICA: Tentar encontrar região correspondente
        const match = findMatchingRegion(church, regions);
        if (match.region) {
          console.log(`│`);
          console.log(`│ 💡 SUGGESTED MATCH (${match.confidence}% confidence):`);
          console.log(`│   🎯 Should link to: ${match.region.name}`);
          console.log(`│   📍 Match type: ${match.matchType === 'city' ? 'Province + City' : 'Province only'}`);
          console.log(`│   🎨 Region color: ${match.region.color}`);
          if (match.matchType === 'province') {
            console.log(`│   ⚠️  City not found in region's territory, but province matches`);
          }
        } else {
          console.log(`│`);
          console.log(`│ ⚠️  No matching region found for this location`);
        }
      }
      console.log('└────────────────────────────────────────┘');
    });
    
    // ========== PART 3: RELATIONSHIP ANALYSIS ==========
    console.log('\n\n🔗 ===== RELATIONSHIP ANALYSIS =====\n');
    
    const churchesWithRegion = churches.filter((c: any) => c.region_id);
    const churchesWithoutRegion = churches.filter((c: any) => !c.region_id);
    const churchesWithContact = churches.filter((c: any) => c.contact);
    const churchesWithZipCode = churches.filter((c: any) => c.zip_code);
    
    console.log('📊 Overall Statistics:');
    console.log('  ├─ Total Regions:', regions.length);
    console.log('  ├─ Total Churches:', churches.length);
    console.log('  ├─ Churches WITH region:', churchesWithRegion.length);
    console.log('  ├─ Churches WITHOUT region:', churchesWithoutRegion.length);
    console.log('  ├─ Churches with contact data:', churchesWithContact.length);
    console.log('  └─ Churches with zip code:', churchesWithZipCode.length);
    
    console.log('\n🗺️  Region Distribution:');
    regions.forEach(region => {
      const churchCount = region.churches?.length || 0;
      const percentage = churches.length > 0 
        ? ((churchCount / churches.length) * 100).toFixed(1) 
        : '0';
      console.log(`  ├─ ${region.name}: ${churchCount} churches (${percentage}%)`);
    });
    console.log(`  └─ Unassigned: ${churchesWithoutRegion.length} churches (${churches.length > 0 ? ((churchesWithoutRegion.length / churches.length) * 100).toFixed(1) : '0'}%)`);
    
    // Match validation
    console.log('\n✅ Church-Region Matching Validation:');
    const matchingIssues: any[] = [];
    
    churchesWithRegion.forEach((church: any) => {
      const region = regions.find(r => r.id === church.region_id);
      const hasRegionObject = !!church.region;
      const regionMatch = region && church.region && region.id === church.region.id;
      
      if (!region) {
        matchingIssues.push({
          church: church.name,
          issue: 'Region ID exists but region not found in regions array',
          region_id: church.region_id
        });
      } else if (!hasRegionObject) {
        matchingIssues.push({
          church: church.name,
          issue: 'Has region_id but region object is null',
          region_id: church.region_id
        });
      } else if (!regionMatch) {
        matchingIssues.push({
          church: church.name,
          issue: 'Region object ID mismatch',
          expected: church.region_id,
          actual: church.region?.id
        });
      }
    });
    
    if (matchingIssues.length > 0) {
      console.log('  ⚠️  Issues Found:');
      matchingIssues.forEach((issue, idx) => {
        console.log(`  ${idx + 1}. ${issue.church}:`);
        console.log(`     ${issue.issue}`);
        if (issue.expected) console.log(`     Expected: ${issue.expected}, Actual: ${issue.actual}`);
      });
    } else {
      console.log('  ✅ All churches have valid region relationships!');
    }
    
    // Orphan churches
    if (churchesWithoutRegion.length > 0) {
      console.log('\n⚠️  Orphan Churches (No Region Assigned):');
      churchesWithoutRegion.forEach((church: any, idx) => {
        console.log(`  ${idx + 1}. ${church.name}`);
        console.log(`     - Has contact: ${church.contact ? 'YES' : 'NO'}`);
        console.log(`     - Has zip code: ${church.zip_code ? 'YES' : 'NO'}`);
        if (church.contact?.city) {
          console.log(`     - Location: ${church.contact.city}, ${church.contact.state || 'N/A'}`);
        }
      });
    }
    
    // ========== AUTO-LINKING SUGGESTIONS ==========
    console.log('\n\n🤖 ===== AUTO-LINKING SUGGESTIONS =====\n');
    
    const orphansWithSuggestions: any[] = [];
    const orphansWithoutSuggestions: any[] = [];
    
    churchesWithoutRegion.forEach((church: any) => {
      const match = enrichChurchesWithAutoLink([church], regions)[0];
      if (match.has_auto_link && match.suggested_region) {
        orphansWithSuggestions.push({ 
          church, 
          match: {
            region: match.suggested_region,
            confidence: match.link_confidence,
            matchType: match.link_match_type
          }
        });
      } else {
        orphansWithoutSuggestions.push(church);
      }
    });
    
    console.log('📊 Summary:');
    console.log(`  ├─ Orphan churches: ${churchesWithoutRegion.length}`);
    console.log(`  ├─ With auto-match suggestions: ${orphansWithSuggestions.length}`);
    console.log(`  └─ Without matches: ${orphansWithoutSuggestions.length}`);
    
    if (orphansWithSuggestions.length > 0) {
      console.log('\n✨ Churches that CAN be auto-linked:');
      orphansWithSuggestions.forEach(({ church, match }, idx) => {
        console.log(`\n  ${idx + 1}. ${church.name}`);
        console.log(`     🎯 Suggested Region: ${match.region.name}`);
        console.log(`     📍 Match Type: ${match.matchType === 'city' ? '✅ Province + City' : '⚠️  Province only'}`);
        console.log(`     💯 Confidence: ${match.confidence}%`);
        console.log(`     📌 Location: ${church.contact?.city || 'N/A'}, ${church.contact?.state || 'N/A'}`);
        console.log(`     🔗 Action: UPDATE church SET region_id = '${match.region.id}'`);
      });
    }
    
    if (orphansWithoutSuggestions.length > 0) {
      console.log('\n❌ Churches that CANNOT be auto-linked (missing/invalid location data):');
      orphansWithoutSuggestions.forEach((church, idx) => {
        console.log(`  ${idx + 1}. ${church.name}`);
        console.log(`     - Has contact: ${church.contact ? 'YES' : 'NO'}`);
        console.log(`     - City: ${church.contact?.city || 'MISSING'}`);
        console.log(`     - Province: ${church.contact?.state || 'MISSING'}`);
        console.log(`     ⚠️  Action: Update contact data or assign region manually`);
      });
    }
    
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                    🏁 END OF CONSOLIDATED DEBUG                   ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
    
  }, [regions, churches]);
  
  // ============================================================================
  // AUTO-LINKING: Apply suggestions to churches data
  // ============================================================================
  
  /**
   * Cria versão enriquecida de churches com auto-linking aplicado
   * Usa funções do @/lib/church-region-matcher
   */
  const churchesWithAutoLink = useMemo<EnrichedChurch[]>(() => {
    if (churches.length === 0 || regions.length === 0) return [];
    
    return enrichChurchesWithAutoLink(churches, regions);
  }, [churches, regions]);
  
  /**
   * Estatísticas de auto-linking para debug e UI
   * Usa funções do @/lib/church-region-matcher
   */
  const autoLinkStats = useMemo(() => {
    return calculateAutoLinkStats(churchesWithAutoLink);
  }, [churchesWithAutoLink]);
  
  // Log auto-link stats
  useEffect(() => {
    if (churchesWithAutoLink.length > 0) {
      console.log('\n🔗 ===== AUTO-LINK STATISTICS =====');
      console.log(`  Total churches: ${autoLinkStats.total}`);
      console.log(`  ✅ With original region link: ${autoLinkStats.withOriginalLink}`);
      console.log(`  🤖 With auto-suggested link: ${autoLinkStats.withAutoLink}`);
      console.log(`     ├─ High confidence (100%): ${autoLinkStats.withHighConfidence}`);
      console.log(`     └─ Medium confidence (70%): ${autoLinkStats.withMediumConfidence}`);
      console.log(`  ❌ Without any link: ${autoLinkStats.withoutLink}`);
      console.log('==========================================\n');
    }
  }, [autoLinkStats, churchesWithAutoLink.length]);
  
  // Gerar markers de cidades com cores das regiões
  const cityMarkers = useMemo(() => {
    if (regions.length === 0) return [];
    
    // Converter regiões para formato do MapLibre com territory real
    const mapRegions: MapRegionConfig[] = regions
      .filter(region => !region.is_deleted)
      .map(region => {
        // Debug: território da região
        console.log(`📍 Region: ${region.name}`);
        console.log('  Territory JSON:', region.territory);
        
        const churchesWithLocation = region.churches?.map(church => {
          // Usar dados de contact diretamente da church (já vem da query de regions)
          // Ou buscar do array churches como fallback
          const contactData = church.contact || churches.find(c => c.id === church.id)?.contact;
          const city = contactData?.city;
          const province = contactData?.state; // state = província
          
          console.log(`    Church: ${church.name}`);
          console.log(`      City: ${city || 'N/A'}`);
          console.log(`      Province: ${province || 'N/A'}`);
          console.log(`      Contact data:`, contactData);
          
          return {
            id: church.id,
            name: church.name,
            city: city,
            province: province,
          };
        }) || [];
        
        return {
          id: region.id,
          name: region.name,
          color: region.color || '#10b981',
          provinces: getProvincesFromTerritory(region.territory),
          territory: region.territory,
          churches: churchesWithLocation,
          churches_count: region.churches?.length || 0,
        };
      });
    
    const generatedMarkers = generateCityMarkers(mapRegions);
    
    // Adicionar popupHTML customizado a cada marker
    return generatedMarkers.map(marker => {
      // Extrair nome da região da descrição existente (formato: "Região: Nome da Região")
      const regionName = marker.description?.replace('Região: ', '') || '';
      const region = regions.find(r => r.name === regionName);
      const regionColor = region?.color || marker.color || '#10b981';
      const churchesCount = region?.churches?.length || 0;
      
      return {
        ...marker,
        popupHTML: `
          <div style="
            padding: 6px; 
            width: 100px;
            max-height: 150px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid ${regionColor};
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow: hidden;
          ">
            <div style="margin-bottom: 4px;">
              <h3 style="
                margin: 0; 
                font-size: 10px; 
                font-weight: 700; 
                color: ${regionColor};
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
                ${marker.title}
              </h3>
            </div>
            
            <div style="
              font-size: 8px; 
              color: #6b7280;
              margin-bottom: 3px;
              line-height: 1.2;
            ">
              ${tPage.cityPopup.city_label}
            </div>
            
            <div style="
              padding: 3px 4px;
              background: ${regionColor}15;
              border-left: 2px solid ${regionColor};
              border-radius: 3px;
              font-size: 8px;
              color: ${regionColor};
              font-weight: 600;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 3px;
            ">
              ${regionName || tPage.cityPopup.region_label}
            </div>
            
            ${churchesCount > 0 ? `
              <div style="
                padding: 3px 4px;
                background: rgba(16, 185, 129, 0.1);
                border-left: 2px solid #9ca3af;
                border-radius: 3px;
                font-size: 8px;
                color: #6b7280;
                font-weight: 600;
              ">
                ${churchesCount} ${tPage.cityPopup.churches_count}
              </div>
            ` : ''}
          </div>
        `,
      };
    });
  }, [regions, tPage]);
  
  // Gerar markers de TODAS as churches usando zip_code + AUTO-LINKING
  const [churchMarkersState, setChurchMarkersState] = useState<any[]>([]);
  
  // Processar churches de forma assíncrona para geocoding
  useEffect(() => {
    if (churchesWithAutoLink.length === 0) return;
    
    const processChurches = async () => {
      const markers: any[] = [];
      
      for (const church of churchesWithAutoLink) {
        // Obter coordenadas usando sistema de geocoding melhorado
        const coords = church.zip_code 
          ? await getCoordinatesFromZipCode(church.zip_code, church.house_number)
          : null;
        
        if (!coords) continue;
        
        const hasRegion = !!church.region_id;
        const churchColor = hasRegion && church.region?.color ? church.region.color : '#9ca3af';
        const churchRegion = church.region || regions.find(r => r.id === church.region_id);
        
        markers.push({
          lngLat: coords,
          title: church.name,
          description: hasRegion ? churchRegion?.name : tPage.popup.without_region,
          color: churchColor,
          popupHTML: `
            <div style="
              padding: 12px; 
              min-width: 180px;
              max-width: 220px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
              <h3 style="
                margin: 0 0 8px 0; 
                font-size: 13px; 
                font-weight: 600; 
                color: #1f2937;
                line-height: 1.4;
              ">
                ${church.name}
              </h3>
              
              ${church.contact?.city && church.contact?.state ? `
                <div style="
                  font-size: 11px; 
                  color: #6b7280; 
                  margin-bottom: 6px;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <span style="color: #9ca3af;">📍</span>
                  ${church.contact.city}, ${church.contact.state}
                </div>
              ` : ''}
              
              ${church.zip_code ? `
                <div style="
                  font-size: 11px; 
                  color: #6b7280; 
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <span style="color: #9ca3af;">📮</span>
                  ${church.zip_code}${church.house_number ? ` #${church.house_number}` : ''}
                </div>
              ` : ''}
              
              ${hasRegion && churchRegion ? `
                <div style="
                  padding: 6px 10px;
                  background: ${churchRegion.color}15;
                  border-left: 3px solid ${churchRegion.color};
                  border-radius: 4px;
                  font-size: 11px;
                  color: ${churchRegion.color};
                  font-weight: 600;
                ">
                  ${churchRegion.name}
                </div>
              ` : `
                <div style="
                  padding: 6px 10px;
                  background: #f3f4f6;
                  border-left: 3px solid #d1d5db;
                  border-radius: 4px;
                  font-size: 11px;
                  color: #9ca3af;
                  font-weight: 500;
                ">
                  Sem região
                </div>
              `}
            </div>
          `,
        });
      }
      
      setChurchMarkersState(markers);
    };
    
    processChurches();
  }, [churchesWithAutoLink, regions, tPage, autoLinkStats]);
  
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  // Extrair províncias do território JSON
  function getProvincesFromTerritory(territory: any): string[] {
    if (!territory) return [];
    
    try {
      const parsed = typeof territory === 'string' ? JSON.parse(territory) : territory;
      if (parsed?.NL) {
        return Object.keys(parsed.NL).map(provinceCode => `NL${provinceCode}`);
      }
      return parsed?.provinces || [];
    } catch {
      return [];
    }
  }
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleRefocusMap = () => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: NETHERLANDS_CENTER,
        zoom: 7,
        duration: 1500
      })
      toast.success(tRegion.map?.refocus_success || 'Map repositioned to Netherlands')
    }
  }
  
  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {t('common.structure_organization')}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {t('regions.title')}
    </span>
  ), [t])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  // ============================================================================
  // KPI DATA
  // ============================================================================
  const kpiCardsData: KPICardData[] = useMemo(() => {
    // Use churchesWithAutoLink para contar churches com região (original + auto-linked)
    const churchesWithRegionAssigned = churchesWithAutoLink.filter(c => c.region_id).length;
    
    return [
      {
        id: "total-regions",
        title: tRegion.page.totalRegions,
        value: regions.reduce((count, region) => count + (region.is_deleted ? 0 : 1), 0),
        icon: MapPin,
        subtitle: tRegion.page.active_regions
      },
      {
        id: "total-churches",
        title: tRegion.page.totalChurches,
        value: churchesWithRegionAssigned,
        icon: Home,
        subtitle: tRegion.page.churches_in_regions
      },
      {
        id: "total-provinces",
        title: tRegion.page.totalProvinces,
        value: regions.reduce((count, region) => !region.is_deleted ? count + (region.kpiData?.totalProvinces || 0) : count, 0),
        icon: MapPin,
        subtitle: tRegion.page.provinces_in_regions
      },
      {
        id: "total-cities",
        title: tRegion.page.totalCities,
        value: regions.reduce((count, region) => !region.is_deleted ? count + (region.kpiData?.totalCities || 0) : count, 0),
        icon: MapPin,
        subtitle: tRegion.page.cities_in_regions
      }
    ]
  }, [regions, tRegion, churchesWithAutoLink, autoLinkStats])
  
  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(tRegion.messages.loading)
      
      try {
        await refetchRegions()
        
        toast.dismiss(loadingToast)
        toast.success(tRegion.messages.refresh_success, { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(tRegion.messages.error_loading)
        setIsLoading(false)
      }
    }

    loadData()
  }, [refetchRegions, tRegion])

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(tRegion.messages.loading)
    
    try {
      await Promise.all([refetchRegions(), refetchChurches()])
      toast.dismiss(refreshToast)
      toast.success(tRegion.messages.refresh_success, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(tRegion.messages.refresh_failed)
    } finally {
      setRefreshing(false)
    }
  }

  const handleEdit = (region: Regions_regions) => {
    if (region) {
      setSelectedRegion(region);
      setIsEditModalOpen(true);
    }
  };
  
  const handleDelete = (region: Regions_regions) => {
    if (region) {
      setSelectedRegion(region);
      setIsDeleteModalOpen(true);
    }
  };

  // Modal handlers
  const handleRegionCreated = () => {
    handleRefresh()
  }

  const handleRegionUpdated = () => {
    toast.success(tRegion.toasts.updated)
    handleRefresh()
  }

  const handleRegionDeleted = () => {
    toast.success(tRegion.toasts.deactivated)
    handleRefresh()
  }

  // ============================================================================
  // TABLE COLUMNS DEFINITION
  // ============================================================================
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: tRegion.table.name,
      cell: ({ row }) => {
        const color = row.original.color || '#10b981'; // Default green color
        return (
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <MapPin 
                className="w-4 h-4" 
                style={{ color: color }}
              />
            </div>
            <div>
              <div className="font-medium">{row.original.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: "color",
      accessorKey: "color",
      header: tRegion.table.color,
      cell: ({ row }) => {
        const color = row.original.color || '#10b981';
        return <ColorBadge color={color} showHex={true} />;
      },
    },
    {
      id: "provinces",
      header: tRegion.table.provinces,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{row.original.kpiData?.totalProvinces || 0}</span>
          </div>
        );
      },
    },
    {
      id: "cities",
      header: tRegion.table.cities,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{row.original.kpiData?.totalCities || 0}</span>
          </div>
        );
      },
    },
    {
      id: "churches",
      accessorKey: "churches_count",
      header: tRegion.table.churches,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.churches?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right font-medium">
          {t('common.actions')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <WithPermission requiredPermissions={[PermissionResolverName.UpdateRegion]}>
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {tRegion.messages.edit_region}
                </DropdownMenuItem>
              </WithPermission>
              <WithPermission requiredPermissions={[PermissionResolverName.DeleteRegion]}>
                <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {tRegion.messages.delete_region}
                </DropdownMenuItem>
              </WithPermission>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <WithPermission requiredPermissions={[PermissionResolverName.Regions]} fallback={<AccessDenied/>}>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {tStructure.regionsTitle}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {tStructure.regionsSubtitle}
          </p>
        </div>
          
          <div className="flex items-center gap-3">
            <WithPermission requiredPermissions={[PermissionResolverName.CreateRegion]}>
              <AddRegionModal
                onSuccess={handleRegionCreated}
              >
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {tStructure.createRegion}
                </Button>
              </AddRegionModal>
            </WithPermission>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          showCarousel={true}
          minCardsForCarousel={2}
        />

        <Separator />

        {/* MapLibre - Netherlands Overview with Tabs */}
        <Card>
          <ChartHeader
            title={activeTab === 'regions' 
              ? (tRegion.map?.title || 'Netherlands Regions Map')
              : tPage.map.churches_title || ''}
            description={activeTab === 'regions'
              ? (tRegion.map?.description || 'Interactive geographic visualization')
              : tPage.map.churches_description || ''}
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefocusMap}
                disabled={!mapInstance}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {tRegion.map?.refocus_button || 'Refocus'}
              </Button>
            }
          />
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'regions' | 'churches')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="regions" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {tPage.tabs.regions_cities}
                </TabsTrigger>
                <TabsTrigger value="churches" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {tPage.tabs.churches_registered}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="regions" className="mt-0">
                <MapLibre
                  center={NETHERLANDS_CENTER}
                  zoom={7}
                  height="500px"
                  theme={(resolvedTheme === 'dark' ? 'dark' : 'light') as 'dark' | 'light' | 'voyager'}
                  showControls={true}
                  showGeolocation={true}
                  showFullscreen={true}
                  showScale={true}
                  markers={cityMarkers}
                  onLoad={(map) => {
                    setMapInstance(map)
                  }}
                />
              </TabsContent>
              
              <TabsContent value="churches" className="mt-0">
                <MapLibre
                  center={NETHERLANDS_CENTER}
                  zoom={7}
                  height="500px"
                  theme={(resolvedTheme === 'dark' ? 'dark' : 'light') as 'dark' | 'light' | 'voyager'}
                  showControls={true}
                  showGeolocation={true}
                  showFullscreen={true}
                  showScale={true}
                  markers={churchMarkersState}
                  onLoad={(map) => {
                    setMapInstance(map)
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Separator />

        {/* Regions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {tRegion.page.title}
            </CardTitle>
            <CardDescription>{tRegion.page.description}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DataTable
              columns={columns}
              data={regions}
              searchKey="name"
              searchPlaceholder="Search regions..."
              filterableColumns={[]}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        {selectedRegion && (
          <EditRegionModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            region={selectedRegion}
            onSave={handleRegionUpdated}
          />
        )}

        {selectedRegion && (
          <DeleteRegionModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            region={selectedRegion}
            onSuccess={handleRegionDeleted}
          />
        )}
      </div>
      </WithPermission>
    </AppLayout>
  )
}