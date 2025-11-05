export type District = {
  id: string;
  name: string;
  provinces: string[];
  color: string;
  description?: string;
};

export const districts: District[] = [
  {
    id: 'district-1',
    name: 'Distrito Norte',
    provinces: ['Flevoland', 'Friesland'],
    color: '#3B82F6', // Azul
    description: 'Região norte da Holanda incluindo Flevoland e Friesland'
  },
  {
    id: 'district-2',
    name: 'Distrito Sul',
    provinces: ['Noord-Brabant', 'Limburg'],
    color: '#EF4444', // Vermelho
    description: 'Região sul incluindo Noord-Brabant e Limburg'
  },
  {
    id: 'district-3',
    name: 'Distrito Oeste',
    provinces: ['Noord-Holland', 'Zuid-Holland'],
    color: '#10B981', // Verde
    description: 'Região oeste incluindo Noord-Holland e Zuid-Holland'
  },
  {
    id: 'district-4',
    name: 'Distrito Centro',
    provinces: ['Utrecht', 'Gelderland'],
    color: '#F59E0B', // Laranja
    description: 'Região central incluindo Utrecht e Gelderland'
  },
  {
    id: 'district-5',
    name: 'Distrito Nordeste',
    provinces: ['Groningen', 'Drenthe', 'Overijssel'],
    color: '#8B5CF6', // Roxo
    description: 'Região nordeste incluindo Groningen, Drenthe e Overijssel'
  },
  {
    id: 'district-6',
    name: 'Distrito Sudoeste',
    provinces: ['Zeeland'],
    color: '#EC4899', // Rosa
    description: 'Região sudoeste incluindo Zeeland'
  }
];

// Função auxiliar para buscar distrito por província
export function getDistrictByProvince(provinceName: string): District | undefined {
  if (!provinceName || typeof provinceName !== 'string') {
    return undefined;
  }
  
  return districts.find(district =>
    district.provinces.some(
      province => province.toLowerCase() === provinceName.toLowerCase()
    )
  );
}

// Função auxiliar para buscar distrito por ID
export function getDistrictById(districtId: string): District | undefined {
  return districts.find(district => district.id === districtId);
}
