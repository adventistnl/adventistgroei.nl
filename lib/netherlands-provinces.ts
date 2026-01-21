/**
 * Estrutura de Províncias dos Países Baixos (Holanda)
 * 
 * Organização:
 * - 12 Províncias principais
 * - Principais cidades por província
 */

export interface City {
  code: string
  name: string
  lat: number
  lng: number
}

export interface Province {
  code: string
  name: string
  region: 'north' | 'east' | 'west' | 'south'
  cities: City[]
}

export interface Territory {
  NL: {
    [provinceCode: string]: string[] // Array de códigos de cidades
  }
}

// Todas as 12 províncias da Holanda com suas principais cidades
export const netherlandsProvinces: Province[] = [
  // NORTE
  {
    code: 'GR',
    name: 'Groningen',
    region: 'north',
    cities: [
      { code: 'GRN', name: 'Groningen', lat: 53.2194, lng: 6.5665 },
      { code: 'DLF', name: 'Delfzijl', lat: 53.3308, lng: 6.9214 },
      { code: 'WNS', name: 'Winschoten', lat: 53.1427, lng: 7.0339 },
      { code: 'HGZ', name: 'Hoogezand', lat: 53.1631, lng: 6.7619 },
    ]
  },
  {
    code: 'FR',
    name: 'Friesland',
    region: 'north',
    cities: [
      { code: 'LWD', name: 'Leeuwarden', lat: 53.2012, lng: 5.7999 },
      { code: 'SNK', name: 'Sneek', lat: 53.0333, lng: 5.6583 },
      { code: 'HRV', name: 'Heerenveen', lat: 52.9597, lng: 5.9197 },
      { code: 'DRZ', name: 'Drachten', lat: 53.1123, lng: 6.0989 },
    ]
  },
  {
    code: 'DR',
    name: 'Drenthe',
    region: 'north',
    cities: [
      { code: 'ASN', name: 'Assen', lat: 52.9960, lng: 6.5623 },
      { code: 'EMM', name: 'Emmen', lat: 52.7793, lng: 6.8954 },
      { code: 'HGV', name: 'Hoogeveen', lat: 52.7227, lng: 6.4763 },
      { code: 'MPN', name: 'Meppel', lat: 52.6958, lng: 6.1944 },
    ]
  },

  // LESTE
  {
    code: 'OV',
    name: 'Overijssel',
    region: 'east',
    cities: [
      { code: 'ZWL', name: 'Zwolle', lat: 52.5168, lng: 6.0830 },
      { code: 'ENS', name: 'Enschede', lat: 52.2184, lng: 6.8961 },
      { code: 'ALM', name: 'Almelo', lat: 52.3560, lng: 6.6627 },
      { code: 'HGV', name: 'Hengelo', lat: 52.2658, lng: 6.7933 },
      { code: 'DVT', name: 'Deventer', lat: 52.2551, lng: 6.1637 },
    ]
  },
  {
    code: 'GE',
    name: 'Gelderland',
    region: 'east',
    cities: [
      { code: 'ARN', name: 'Arnhem', lat: 51.9851, lng: 5.8987 },
      { code: 'NJM', name: 'Nijmegen', lat: 51.8126, lng: 5.8372 },
      { code: 'APD', name: 'Apeldoorn', lat: 52.2110, lng: 5.9699 },
      { code: 'EDE', name: 'Ede', lat: 52.0408, lng: 5.6671 },
      { code: 'DOE', name: 'Doetinchem', lat: 51.9644, lng: 6.2886 },
    ]
  },

  // CENTRO
  {
    code: 'FL',
    name: 'Flevoland',
    region: 'west',
    cities: [
      { code: 'LEL', name: 'Lelystad', lat: 52.5082, lng: 5.4752 },
      { code: 'ALR', name: 'Almere', lat: 52.3702, lng: 5.2141 },
      { code: 'DRT', name: 'Dronten', lat: 52.5243, lng: 5.7198 },
    ]
  },
  {
    code: 'UT',
    name: 'Utrecht',
    region: 'west',
    cities: [
      { code: 'UTR', name: 'Utrecht', lat: 52.0907, lng: 5.1214 },
      { code: 'AMF', name: 'Amersfoort', lat: 52.1561, lng: 5.3878 },
      { code: 'NWG', name: 'Nieuwegein', lat: 52.0293, lng: 5.0802 },
      { code: 'VCH', name: 'Veenendaal', lat: 52.0280, lng: 5.5589 },
    ]
  },

  // OESTE
  {
    code: 'NH',
    name: 'Noord-Holland',
    region: 'west',
    cities: [
      { code: 'AMS', name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
      { code: 'HRL', name: 'Haarlem', lat: 52.3874, lng: 4.6462 },
      { code: 'ALK', name: 'Alkmaar', lat: 52.6323, lng: 4.7483 },
      { code: 'ZAN', name: 'Zaanstad', lat: 52.4391, lng: 4.8251 },
      { code: 'HLM', name: 'Hilversum', lat: 52.2235, lng: 5.1766 },
    ]
  },
  {
    code: 'ZH',
    name: 'Zuid-Holland',
    region: 'west',
    cities: [
      { code: 'RTM', name: 'Rotterdam', lat: 51.9244, lng: 4.4777 },
      { code: 'HAG', name: 'Den Haag', lat: 52.0705, lng: 4.3007 },
      { code: 'LDN', name: 'Leiden', lat: 52.1601, lng: 4.4970 },
      { code: 'DOR', name: 'Dordrecht', lat: 51.8133, lng: 4.6901 },
      { code: 'ZOE', name: 'Zoetermeer', lat: 52.0576, lng: 4.4932 },
    ]
  },
  {
    code: 'ZE',
    name: 'Zeeland',
    region: 'south',
    cities: [
      { code: 'MID', name: 'Middelburg', lat: 51.4988, lng: 3.6109 },
      { code: 'VLS', name: 'Vlissingen', lat: 51.4427, lng: 3.5734 },
      { code: 'GOS', name: 'Goes', lat: 51.5050, lng: 3.8883 },
      { code: 'TER', name: 'Terneuzen', lat: 51.3394, lng: 3.8275 },
    ]
  },

  // SUL
  {
    code: 'NB',
    name: 'Noord-Brabant',
    region: 'south',
    cities: [
      { code: 'EIN', name: 'Eindhoven', lat: 51.4416, lng: 5.4697 },
      { code: 'HTB', name: "'s-Hertogenbosch", lat: 51.6978, lng: 5.3037 },
      { code: 'TIL', name: 'Tilburg', lat: 51.5555, lng: 5.0913 },
      { code: 'BRD', name: 'Breda', lat: 51.5719, lng: 4.7683 },
      { code: 'HLM', name: 'Helmond', lat: 51.4816, lng: 5.6558 },
    ]
  },
  {
    code: 'LI',
    name: 'Limburg',
    region: 'south',
    cities: [
      { code: 'MST', name: 'Maastricht', lat: 50.8514, lng: 5.6910 },
      { code: 'VEN', name: 'Venlo', lat: 51.3704, lng: 6.1724 },
      { code: 'HRL', name: 'Heerlen', lat: 50.8836, lng: 5.9795 },
      { code: 'STD', name: 'Sittard-Geleen', lat: 50.9975, lng: 5.8694 },
    ]
  },
]

// Helper functions
export function getProvinceByCode(code: string): Province | undefined {
  return netherlandsProvinces.find(p => p.code === code)
}

export function getCityByCode(provinceCode: string, cityCode: string): City | undefined {
  const province = getProvinceByCode(provinceCode)
  return province?.cities.find(c => c.code === cityCode)
}

export function getProvincesByRegion(region: 'north' | 'east' | 'west' | 'south'): Province[] {
  return netherlandsProvinces.filter(p => p.region === region)
}

export function getAllCities(): City[] {
  return netherlandsProvinces.flatMap(p => p.cities)
}

// Cores por região (para visualização)
export const regionColors = {
  north: '#3B82F6', // Azul
  east: '#10B981',  // Verde
  west: '#F59E0B',  // Laranja
  south: '#EF4444', // Vermelho
}
