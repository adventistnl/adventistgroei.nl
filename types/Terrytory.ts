export interface TerritoryMap {
  [country: string]: {
    [state: string]: string[];
  };
}

export interface TerritoryBase {
  code: string
  name: string
}

export interface TerritoryChildrensBase {
  [provinceCode: string]: TerritoryBase[]
}

export interface MixedTerritoryBase {
  [countryCode: string]: {
    [provinceCode: string]: TerritoryBase[]
  }
}
