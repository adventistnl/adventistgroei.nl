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
  zip_code?: string | null
  house_number?: number | null
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

/**
 * Extrai código de província do ZIP code holandês
 * 
 * @param zipCode - ZIP code formato "3015 GD" ou "3015GD"
 * @returns Código da província (ZH, NH, UT, etc.) ou null se inválido
 * 
 * @example
 * getProvinceFromZipCode("3015 GD") // "ZH" (Rotterdam, Zuid-Holland)
 * getProvinceFromZipCode("8242 PN") // "FL" (Lelystad, Flevoland)
 * getProvinceFromZipCode("1012 AB") // "NH" (Amsterdam, Noord-Holland)
 */
export function getProvinceFromZipCode(zipCode: string | null | undefined): string | null {
  if (!zipCode) return null;
  
  // Limpar e normalizar
  const clean = zipCode.replace(/\s+/g, '').toUpperCase();
  
  // Validar formato: 4 dígitos + 2 letras
  const match = clean.match(/^(\d{4})([A-Z]{2})$/);
  if (!match) return null;
  
  const firstTwoDigits = clean.substring(0, 2);
  
  // Mapa de ranges de ZIP code por província
  const zipToProvince: Record<string, string> = {
    // Noord-Holland (Amsterdam region: 10xx-12xx, 13xx-19xx)
    '10': 'NH', '11': 'NH', '12': 'NH', '13': 'NH', '14': 'NH', 
    '15': 'NH', '16': 'NH', '17': 'NH', '18': 'NH', '19': 'NH',
    
    // Zuid-Holland (Den Haag: 25xx-27xx, Rotterdam: 30xx-32xx, Leiden/Delft: 23xx-24xx, 26xx)
    '23': 'ZH', '24': 'ZH', '25': 'ZH', '26': 'ZH', '27': 'ZH',
    '28': 'ZH', '29': 'ZH', '30': 'ZH', '31': 'ZH', '32': 'ZH',
    '33': 'ZH', '34': 'ZH',
    
    // Utrecht (35xx-36xx)
    '35': 'UT', '36': 'UT',
    
    // Zeeland (43xx-45xx)
    '43': 'ZL', '44': 'ZL', '45': 'ZL', '46': 'ZL',
    
    // Noord-Brabant (47xx-54xx)
    '47': 'NB', '48': 'NB', '49': 'NB', '50': 'NB', '51': 'NB', 
    '52': 'NB', '53': 'NB', '54': 'NB', '55': 'NB',
    
    // Limburg (59xx-64xx)
    '59': 'LI', '60': 'LI', '61': 'LI', '62': 'LI', '63': 'LI', '64': 'LI',
    
    // Gelderland (65xx-73xx)
    '65': 'GE', '66': 'GE', '67': 'GE', '68': 'GE', '69': 'GE',
    '70': 'GE', '71': 'GE', '72': 'GE', '73': 'GE',
    
    // Overijssel (74xx-77xx, 80xx-81xx, 84xx) - Excluindo 82-83 que são Flevoland
    '74': 'OV', '75': 'OV', '76': 'OV', '77': 'OV',
    '80': 'OV', '81': 'OV', '84': 'OV',
    
    // Flevoland (13xx para Almere, 82xx-83xx para Lelystad/Dronten)
    '82': 'FL', '83': 'FL',
    
    // Drenthe (78xx-79xx, 94xx-95xx)
    '78': 'DR', '79': 'DR', '94': 'DR', '95': 'DR',
    
    // Friesland (88xx-91xx)
    '88': 'FR', '89': 'FR', '90': 'FR', '91': 'FR',
    
    // Groningen (96xx-99xx)
    '96': 'GR', '97': 'GR', '98': 'GR', '99': 'GR',
  };
  
  // Casos especiais
  // Almere (1300-1399) é Flevoland, não Noord-Holland
  if (firstTwoDigits === '13' && parseInt(clean.substring(2, 4)) <= 99) {
    const fourDigits = clean.substring(0, 4);
    if (fourDigits >= '1300' && fourDigits <= '1399') {
      return 'FL'; // Almere = Flevoland
    }
  }
  
  return zipToProvince[firstTwoDigits] || null;
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
  
  // ⚠️  VALIDAÇÃO CRUZADA: ZIP CODE vs CONTACT.STATE
  const zipCodeProvince = getProvinceFromZipCode(church.zip_code);
  const normalizedContactProvince = normalizeProvinceCode(churchProvince);
  
  // Detectar conflito: ZIP code e contact.state apontam para províncias diferentes
  if (zipCodeProvince && normalizedContactProvince && zipCodeProvince !== normalizedContactProvince) {
    console.warn(`\n⚠️  [CONFLICT DETECTED] Church: ${church.name}`);
    console.warn(`   ZIP Code: ${church.zip_code} → Province: ${zipCodeProvince}`);
    console.warn(`   Contact State: ${churchProvince} → Province: ${normalizedContactProvince}`);
    console.warn(`   ⚡ Using ZIP code province as SOURCE OF TRUTH\n`);
    
    // PRIORIZAR ZIP CODE (mais confiável que contact.state)
    // Procurar região com base no ZIP code
    for (const region of regions) {
      if (region.is_deleted) continue;
      if (!region.territory) continue;
      
      try {
        const territoryParsed = typeof region.territory === 'string' 
          ? JSON.parse(region.territory) 
          : region.territory;
        
        if (!territoryParsed?.NL) continue;
        
        const territoryProvinces = Object.keys(territoryParsed.NL);
        
        // Validar se província do ZIP code está no territory
        if (territoryProvinces.includes(zipCodeProvince)) {
          console.log(`   ✅ Match found via ZIP code: ${region.name}`);
          return {
            region,
            confidence: 80, // Confidence alta (ZIP code-based)
            matchType: 'province',
            reason: `ZIP code province match (overriding contact.state): ${zipCodeProvince}`
          };
        }
      } catch (error) {
        continue;
      }
    }
  }
  
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
  getProvinceFromZipCode,
  
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
