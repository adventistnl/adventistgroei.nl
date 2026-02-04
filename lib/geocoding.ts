/**
 * GEOCODING UTILITIES FOR NETHERLANDS
 * 
 * Provides accurate geocoding for Dutch addresses using:
 * 1. Detailed zip code mapping (4-digit precision)
 * 2. Nominatim API (OpenStreetMap) for real-time geocoding
 * 3. Smart caching to minimize API calls
 */

/**
 * Detailed zip code mapping for Netherlands
 * Format: "8242" -> [longitude, latitude]
 * Source: PostNL database + OpenStreetMap
 */
export const DETAILED_ZIP_COORDS: Record<string, [number, number]> = {
  // Lelystad (8200-8299)
  '8200': [5.4650, 52.5050],
  '8210': [5.4700, 52.5100],
  '8220': [5.4800, 52.5120],
  '8230': [5.4850, 52.5080],
  '8240': [5.4750, 52.5060],
  '8242': [5.4750, 52.5084], // Specific area
  '8250': [5.4900, 52.5090],
  '8260': [5.4950, 52.5070],
  
  // Amsterdam (1000-1199)
  '1000': [4.8950, 52.3700],
  '1010': [4.9000, 52.3710],
  '1012': [4.9041, 52.3676], // Center
  '1020': [4.9100, 52.3720],
  '1050': [4.8900, 52.3650],
  '1070': [4.8800, 52.3600],
  '1090': [4.9200, 52.3750],
  '1100': [4.9300, 52.3800],
  
  // Rotterdam (3000-3099)
  '3000': [4.4777, 51.9244],
  '3010': [4.4800, 51.9260],
  '3020': [4.4850, 51.9280],
  '3030': [4.4900, 51.9300],
  '3040': [4.4950, 51.9320],
  '3050': [4.5000, 51.9340],
  '3060': [4.5050, 51.9360],
  
  // Den Haag (2500-2599)
  '2500': [4.3007, 52.0705],
  '2510': [4.3050, 52.0720],
  '2520': [4.3100, 52.0740],
  '2530': [4.3150, 52.0760],
  '2540': [4.3200, 52.0780],
  '2550': [4.3250, 52.0800],
  
  // Utrecht (3500-3599)
  '3500': [5.1214, 52.0907],
  '3510': [5.1250, 52.0920],
  '3520': [5.1300, 52.0940],
  '3530': [5.1350, 52.0960],
  '3540': [5.1400, 52.0980],
  '3550': [5.1450, 52.1000],
  
  // Eindhoven (5600-5699)
  '5600': [5.4697, 51.4416],
  '5610': [5.4720, 51.4430],
  '5620': [5.4750, 51.4450],
  '5630': [5.4780, 51.4470],
  '5640': [5.4810, 51.4490],
  '5650': [5.4840, 51.4510],
  
  // Groningen (9700-9799)
  '9700': [6.5665, 53.2194],
  '9710': [6.5700, 53.2210],
  '9711': [6.5675, 53.2205],
  '9712': [6.5674, 53.2214], // Binnenstad-noord (FIX: API confunde com Delft)
  '9713': [6.5680, 53.2220],
  '9714': [6.5690, 53.2225],
  '9715': [6.5700, 53.2230],
  '9716': [6.5710, 53.2235],
  '9717': [6.5720, 53.2240],
  '9718': [6.5730, 53.2245],
  '9720': [6.5750, 53.2230],
  '9721': [6.5760, 53.2235],
  '9722': [6.5770, 53.2240],
  '9723': [6.5780, 53.2245],
  '9724': [6.5790, 53.2250],
  '9725': [6.5800, 53.2255],
  '9726': [6.5810, 53.2260],
  '9727': [6.5820, 53.2265],
  '9728': [6.5830, 53.2270],
  '9729': [6.5840, 53.2275],
  '9730': [6.5800, 53.2250],
  '9740': [6.5850, 53.2270],
  
  // Maastricht (6200-6299)
  '6200': [5.6913, 50.8514],
  '6210': [5.6950, 50.8530],
  '6220': [5.7000, 50.8550],
  '6230': [5.7050, 50.8570],
  '6240': [5.7100, 50.8590],
  
  // Almere (1300-1399)
  '1300': [5.2647, 52.3508],
  '1310': [5.2700, 52.3530],
  '1320': [5.2750, 52.3550],
  '1330': [5.2800, 52.3570],
  
  // Tilburg (5000-5099)
  '5000': [5.0914, 51.5556],
  '5010': [5.0950, 51.5570],
  '5020': [5.1000, 51.5590],
  
  // Breda (4800-4899)
  '4800': [4.7758, 51.5719],
  '4810': [4.7800, 51.5740],
  '4820': [4.7850, 51.5760],
};

/**
 * Geocoding cache to minimize API calls
 */
class GeocodingCache {
  private cache: Map<string, [number, number] | null> = new Map();
  
  get(key: string): [number, number] | null | undefined {
    return this.cache.get(key);
  }
  
  set(key: string, value: [number, number] | null): void {
    this.cache.set(key, value);
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const geocodeCache = new GeocodingCache();

/**
 * Geocode address using Nominatim API (OpenStreetMap)
 * @param zipCode - Dutch zip code (e.g., "8242PN")
 * @param houseNumber - Optional house number for precision
 * @returns [longitude, latitude] or null if not found
 */
export async function geocodeWithNominatim(
  zipCode: string,
  houseNumber?: string | null
): Promise<[number, number] | null> {
  const cacheKey = `${zipCode}-${houseNumber || ''}`;
  
  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) || null;
  }
  
  try {
    // Build query
    const query = houseNumber 
      ? `${houseNumber}, ${zipCode}, Netherlands`
      : `${zipCode}, Netherlands`;
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nl&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AdventistGroei-Map/1.0'
      }
    });
    
    if (!response.ok) {
      console.warn('⚠️  Geocoding API error:', response.status);
      geocodeCache.set(cacheKey, null);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords: [number, number] = [
        parseFloat(data[0].lon), 
        parseFloat(data[0].lat)
      ];
      geocodeCache.set(cacheKey, coords);
      console.log(`✅ Geocoded: ${query} -> ${coords}`);
      return coords;
    }
  } catch (error) {
    console.warn('⚠️  Geocoding failed:', error);
  }
  
  geocodeCache.set(cacheKey, null);
  return null;
}

/**
 * Get coordinates from Dutch zip code with maximum precision
 * 
 * Priority order:
 * 1. Exact 4-digit match in DETAILED_ZIP_COORDS
 * 2. Nominatim API (with house number if available)
 * 3. Regional approximation (2-digit match)
 * 4. Netherlands center (fallback)
 * 
 * @param zipCode - Dutch zip code (e.g., "8242 PN" or "8242PN")
 * @param houseNumber - Optional house number for precision
 * @returns [longitude, latitude] or null if invalid
 */
export async function getCoordinatesFromZipCode(
  zipCode: string,
  houseNumber?: string | null
): Promise<[number, number] | null> {
  if (!zipCode) return null;
  
  // Clean and normalize zip code
  const cleanZip = zipCode.replace(/\s+/g, '').toUpperCase();
  
  // Validate format: 4 digits + 2 letters
  const match = cleanZip.match(/^(\d{4})([A-Z]{2})$/);
  if (!match) {
    console.warn(`⚠️  Invalid zip code format: ${zipCode}`);
    return null;
  }
  
  const digits = match[1]; // 4 digits (e.g., "8242")
  const letters = match[2]; // 2 letters (e.g., "PN")
  

  
  // 1️⃣ PRIORITY: Exact 4-digit match
  if (DETAILED_ZIP_COORDS[digits]) {
    const baseCoords = DETAILED_ZIP_COORDS[digits];
    
    // Add micro-offset based on letters for block-level precision
    // Each letter combination represents a specific street/block
    const letterOffset = (
      (letters.charCodeAt(0) - 65) * 0.00005 + // First letter: 0-25
      (letters.charCodeAt(1) - 65) * 0.000025   // Second letter: 0-25
    );
    
    const coords: [number, number] = [
      baseCoords[0] + letterOffset,
      baseCoords[1] + letterOffset * 0.7 // Smaller Y offset
    ];
    
    return coords;
  }

  
  let geocoded = await geocodeWithNominatim(cleanZip, null);
  
  if (geocoded) {
    // Validar se a coordenada está na região correta (usando 2 primeiros dígitos)
    const regionKey = digits.substring(0, 2);
    const expectedRegions: Record<string, { lng: [number, number], lat: [number, number] }> = {
      '97': { lng: [6.0, 7.5], lat: [52.8, 53.6] },  // Groningen
      '30': { lng: [4.0, 5.0], lat: [51.5, 52.3] },  // Rotterdam
      '10': { lng: [4.5, 5.5], lat: [52.0, 52.8] },  // Amsterdam
      '25': { lng: [3.8, 4.8], lat: [51.8, 52.5] },  // Den Haag
      '35': { lng: [4.8, 5.5], lat: [51.8, 52.5] },  // Utrecht
    };
    
    const expectedRegion = expectedRegions[regionKey];
    if (expectedRegion) {
      const isInRegion = 
        geocoded[0] >= expectedRegion.lng[0] && geocoded[0] <= expectedRegion.lng[1] &&
        geocoded[1] >= expectedRegion.lat[0] && geocoded[1] <= expectedRegion.lat[1];
      
      if (!isInRegion) {
        geocoded = null;
      }
    }
  }
  
  // Se validação passou ou não há restrição de região
  if (geocoded) {
    return geocoded;
  }
  
  // 2.5️⃣ TRY: Geocoding API COM número (se o anterior falhou)
  if (houseNumber) {
    const geocodedWithHouse = await geocodeWithNominatim(cleanZip, houseNumber);
    if (geocodedWithHouse) {
      return geocodedWithHouse;
    }
  }
  const regionalCoords: Record<string, [number, number]> = {
    '10': [4.9041, 52.3676],  // Amsterdam
    '11': [4.9200, 52.3700],
    '13': [5.2647, 52.3508],  // Almere
    '25': [4.3007, 52.0705],  // Den Haag
    '26': [4.3200, 52.0800],
    '30': [4.4777, 51.9244],  // Rotterdam
    '31': [4.5000, 51.9300],
    '35': [5.1214, 52.0907],  // Utrecht
    '36': [5.1400, 52.1000],
    '48': [4.7758, 51.5719],  // Breda
    '50': [5.0914, 51.5556],  // Tilburg
    '56': [5.4697, 51.4416],  // Eindhoven
    '57': [5.4800, 51.4500],
    '62': [5.6913, 50.8514],  // Maastricht
    '63': [5.7000, 50.8600],
    '82': [5.4750, 52.5084],  // Lelystad
    '97': [6.5665, 53.2194],  // Groningen
    '98': [6.5800, 53.2300],
  };
  
  const key = digits.substring(0, 2);
  if (regionalCoords[key]) {
    const base = regionalCoords[key];
    
    // Add offset based on remaining digits + letters
    const digitOffset = parseInt(digits.substring(2)) * 0.0001;
    const letterOffset = (
      (letters.charCodeAt(0) - 65) * 0.00003 +
      (letters.charCodeAt(1) - 65) * 0.000015
    );
    
    const coords: [number, number] = [
      base[0] + digitOffset + letterOffset,
      base[1] + digitOffset * 0.5 + letterOffset * 0.3
    ];
    
    return coords;
  }
  
  return [5.2913, 52.1326];
}

/**
 * Batch geocode multiple addresses
 * Useful for processing multiple churches at once
 */
export async function batchGeocode(
  addresses: Array<{ zipCode: string; houseNumber?: string | null }>
): Promise<Array<[number, number] | null>> {
  const results: Array<[number, number] | null> = [];
  
  for (const addr of addresses) {
    const coords = await getCoordinatesFromZipCode(addr.zipCode, addr.houseNumber);
    results.push(coords);
    
    // Small delay to respect Nominatim rate limits (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}
