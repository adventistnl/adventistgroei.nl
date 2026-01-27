/**
 * CHURCH-REGION MATCHER UTILITY
 * 
 * Sistema inteligente de matching automático entre Churches e Regions
 * baseado em validação geográfica (província + cidade).
 * 
 * @module church-region-matcher
 * @version 1.0.0
 * @author AdventistGroei Development Team
 */

import { Regions_regions } from "@/types/Regions"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ChurchLocation {
  id: string
  name: string
  contact?: {
    city?: string | null
    state?: string | null
  } | null
  region_id?: string | null
  region?: any
}

export interface MatchResult {
  region: Regions_regions | null
  confidence: number // 0, 70, ou 100
  matchType: 'none' | 'province' | 'city'
  reason?: string
}

export interface EnrichedChurch extends ChurchLocation {
  has_auto_link: boolean
  suggested_region: Regions_regions | null
  link_confidence: number
  link_match_type: 'none' | 'province' | 'city'
}

export interface AutoLinkStats {
  total: number
  withOriginalLink: number
  withAutoLink: number
  withHighConfidence: number
  withMediumConfidence: number
  withoutLink: number
}

// ============================================================================
// PROVINCE NORMALIZATION MAP
// ============================================================================

/**
 * Mapa de normalização de províncias holandesas
 * Converte nomes completos para códigos de 2 letras
 * 
 * @example
 * normalizeProvinceCode("Flevoland") // "FL"
 * normalizeProvinceCode("FL") // "FL"
 */
const PROVINCE_NORMALIZATION_MAP: Record<string, string> = {
  'drenthe': 'DR',
  'flevoland': 'FL',
  'friesland': 'FR',
  'fryslân': 'FR',
  'gelderland': 'GE',
  'groningen': 'GR',
  'limburg': 'LI',
  'noord-brabant': 'NB',
  'noord brabant': 'NB',
  'brabant': 'NB',
  'noord-holland': 'NH',
  'noord holland': 'NH',
  'overijssel': 'OV',
  'utrecht': 'UT',
  'zeeland': 'ZL',
  'zuid-holland': 'ZH',
  'zuid holland': 'ZH',
  // Códigos já normalizados
  'dr': 'DR',
  'fl': 'FL',
  'fr': 'FR',
  'ge': 'GE',
  'gr': 'GR',
  'li': 'LI',
  'nb': 'NB',
  'nh': 'NH',
  'ov': 'OV',
  'ut': 'UT',
  'zl': 'ZL',
  'zh': 'ZH',
}

// ============================================================================
// NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normaliza código de província para formato padrão de 2 letras
 * 
 * @param province - Nome completo ou código da província
 * @returns Código normalizado (2 letras maiúsculas) ou null se inválido
 * 
 * @example
 * normalizeProvinceCode("Flevoland") // "FL"
 * normalizeProvinceCode("fl") // "FL"
 * normalizeProvinceCode("Invalid") // null
 */
export function normalizeProvinceCode(province: string | null | undefined): string | null {
  if (!province) return null
  
  const normalized = province.trim().toLowerCase()
  return PROVINCE_NORMALIZATION_MAP[normalized] || null
}

/**
 * Normaliza nome de cidade para código de 3 letras
 * 
 * @param city - Nome da cidade
 * @returns Código de 3 letras maiúsculas
 * 
 * @example
 * normalizeCityCode("Lelystad") // "LEL"
 * normalizeCityCode("Amsterdam") // "AMS"
 */
export function normalizeCityCode(city: string | null | undefined): string | null {
  if (!city) return null
  
  const cleaned = city.trim().toUpperCase()
  
  // Mapeamento manual para cidades conhecidas
  const cityMap: Record<string, string> = {
    'LELYSTAD': 'LEL',
    'ALMERE': 'ALM',
    'AMSTERDAM': 'AMS',
    'ROTTERDAM': 'ROT',
    'THE HAGUE': 'DHA',
    'DEN HAAG': 'DHA',
    'UTRECHT': 'UTR',
    'EINDHOVEN': 'EIN',
    'GRONINGEN': 'GRO',
    'MAASTRICHT': 'MAA',
    'ASSEN': 'ASS',
    'EMMEN': 'EMM',
    'ZWOLLE': 'ZWO',
  }
  
  // Se tem mapeamento manual, usar
  if (cityMap[cleaned]) {
    return cityMap[cleaned]
  }
  
  // Caso contrário, pegar primeiras 3 letras
  return cleaned.substring(0, 3)
}

// ============================================================================
// CORE MATCHING LOGIC
// ============================================================================

/**
 * Encontra região correspondente para uma igreja baseado em localização geográfica
 * 
 * ALGORITMO:
 * 1. Extrai província e cidade da church.contact
 * 2. Normaliza província e cidade para códigos padronizados
 * 3. Para cada região, valida se church pertence ao território
 * 4. Retorna match com confidence:
 *    - 100%: Província + Cidade coincidem
 *    - 70%: Apenas província coincide
 *    - 0%: Sem match
 * 
 * @param church - Objeto church com dados de localização
 * @param regions - Array de regiões disponíveis
 * @returns Resultado do matching com região, confidence e tipo
 * 
 * @example
 * const church = { 
 *   name: "dev Church", 
 *   contact: { city: "Lelystad", state: "Flevoland" } 
 * }
 * const match = findMatchingRegion(church, regions)
 * // { region: {...}, confidence: 100, matchType: 'city' }
 */
export function findMatchingRegion(
  church: ChurchLocation,
  regions: Regions_regions[]
): MatchResult {
  // Validação de input
  if (!church.contact) {
    return { 
      region: null, 
      confidence: 0, 
      matchType: 'none',
      reason: 'Church has no contact data'
    }
  }
  
  const churchCity = church.contact.city
  const churchProvince = church.contact.state // state = província
  
  if (!churchProvince) {
    return { 
      region: null, 
      confidence: 0, 
      matchType: 'none',
      reason: 'Church has no province/state data'
    }
  }
  
  // Normalizar dados da church
  const normalizedChurchProvince = normalizeProvinceCode(churchProvince)
  const normalizedChurchCity = normalizeCityCode(churchCity)
  
  if (!normalizedChurchProvince) {
    return { 
      region: null, 
      confidence: 0, 
      matchType: 'none',
      reason: `Invalid province: ${churchProvince}`
    }
  }
  
  // Procurar match em cada região
  for (const region of regions) {
    if (region.is_deleted) continue
    if (!region.territory) continue
    
    try {
      // Parse do territory JSON
      const territoryParsed = typeof region.territory === 'string' 
        ? JSON.parse(region.territory) 
        : region.territory
      
      if (!territoryParsed?.NL) continue
      
      // Extrair províncias e cidades do territory
      const territoryProvinces = Object.keys(territoryParsed.NL)
      
      // Validar se província da church está no territory
      if (!territoryProvinces.includes(normalizedChurchProvince)) {
        continue // Próxima região
      }
      
      // MATCH DE PROVÍNCIA! Agora verificar cidade
      const citiesInProvince = territoryParsed.NL[normalizedChurchProvince] || []
      const cityCodes = citiesInProvince.map((c: string) => c.toUpperCase())
      
      // Se cidade também coincide = HIGH CONFIDENCE (100%)
      if (normalizedChurchCity && cityCodes.includes(normalizedChurchCity)) {
        return {
          region,
          confidence: 100,
          matchType: 'city',
          reason: `Province + City match: ${normalizedChurchProvince}/${normalizedChurchCity}`
        }
      }
      
      // Se apenas província coincide = MEDIUM CONFIDENCE (70%)
      return {
        region,
        confidence: 70,
        matchType: 'province',
        reason: `Province match only: ${normalizedChurchProvince}`
      }
      
    } catch (error) {
      console.error(`Error parsing territory for region ${region.name}:`, error)
      continue
    }
  }
  
  // Nenhum match encontrado
  return { 
    region: null, 
    confidence: 0, 
    matchType: 'none',
    reason: `No region found for ${normalizedChurchProvince}/${normalizedChurchCity || 'unknown'}`
  }
}

// ============================================================================
// ENRICHMENT FUNCTIONS
// ============================================================================

/**
 * Enriquece array de churches com auto-linking aplicado
 * 
 * Para cada church:
 * - Se já tem região: mantém original
 * - Se não tem região: aplica auto-matching
 * 
 * @param churches - Array de churches a processar
 * @param regions - Array de regiões disponíveis
 * @returns Array de churches enriquecidas com dados de auto-linking
 * 
 * @example
 * const enriched = enrichChurchesWithAutoLink(churches, regions)
 * enriched.forEach(church => {
 *   if (church.has_auto_link) {
 *     console.log(`Auto-linked to ${church.suggested_region.name}`)
 *   }
 * })
 */
export function enrichChurchesWithAutoLink(
  churches: ChurchLocation[],
  regions: Regions_regions[]
): EnrichedChurch[] {
  return churches.map((church) => {
    // Se já tem região linkada, retornar sem alteração
    if (church.region_id && church.region) {
      return {
        ...church,
        has_auto_link: false,
        suggested_region: null,
        link_confidence: 0,
        link_match_type: 'none' as const,
      }
    }
    
    // Se não tem região, tentar encontrar match automático
    const match = findMatchingRegion(church, regions)
    
    return {
      ...church,
      has_auto_link: !!match.region,
      suggested_region: match.region,
      link_confidence: match.confidence,
      link_match_type: match.matchType,
      // Aplicar região sugerida para renderização
      region: match.region || church.region,
      region_id: match.region?.id || church.region_id,
    }
  })
}

/**
 * Calcula estatísticas de auto-linking
 * 
 * @param enrichedChurches - Array de churches já enriquecidas
 * @returns Objeto com estatísticas agregadas
 * 
 * @example
 * const stats = calculateAutoLinkStats(enrichedChurches)
 * console.log(`Auto-linked: ${stats.withAutoLink} of ${stats.total}`)
 */
export function calculateAutoLinkStats(
  enrichedChurches: EnrichedChurch[]
): AutoLinkStats {
  const total = enrichedChurches.length
  const withOriginalLink = enrichedChurches.filter(
    c => !c.has_auto_link && c.region_id
  ).length
  const withAutoLink = enrichedChurches.filter(c => c.has_auto_link).length
  const withHighConfidence = enrichedChurches.filter(
    c => c.link_confidence === 100
  ).length
  const withMediumConfidence = enrichedChurches.filter(
    c => c.link_confidence === 70
  ).length
  const withoutLink = enrichedChurches.filter(c => !c.region_id).length
  
  return {
    total,
    withOriginalLink,
    withAutoLink,
    withHighConfidence,
    withMediumConfidence,
    withoutLink,
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Valida se uma igreja pertence ao território de uma região específica
 * 
 * @param church - Church a validar
 * @param region - Region para validar contra
 * @returns true se church pertence ao território da região
 * 
 * @example
 * const isValid = validateChurchInRegion(church, region)
 * if (!isValid) {
 *   console.warn(`Church ${church.name} is outside region ${region.name}`)
 * }
 */
export function validateChurchInRegion(
  church: ChurchLocation,
  region: Regions_regions
): boolean {
  const match = findMatchingRegion(church, [region])
  return match.confidence > 0
}

/**
 * Filtra churches que pertencem a uma região específica
 * 
 * @param churches - Array de churches a filtrar
 * @param region - Region para filtrar
 * @returns Array de churches que pertencem à região
 * 
 * @example
 * const churchesInRegion = filterChurchesByRegion(allChurches, selectedRegion)
 */
export function filterChurchesByRegion(
  churches: ChurchLocation[],
  region: Regions_regions
): ChurchLocation[] {
  return churches.filter(church => validateChurchInRegion(church, region))
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Exporta todas as funções e tipos principais
 */
export const ChurchRegionMatcher = {
  // Funções de normalização
  normalizeProvinceCode,
  normalizeCityCode,
  
  // Matching
  findMatchingRegion,
  
  // Enrichment
  enrichChurchesWithAutoLink,
  calculateAutoLinkStats,
  
  // Validation
  validateChurchInRegion,
  filterChurchesByRegion,
}

export default ChurchRegionMatcher
