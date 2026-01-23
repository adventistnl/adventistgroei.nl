/**
 * REGIONS PAGE TRANSLATIONS
 * Traduções específicas para a página de gestão de regiões
 * Suporta: Português (pt), Inglês (en), Holandês (nl)
 */

export const regionsPageTranslations = {
  pt: {
    // Map Tabs
    tabs: {
      regions_cities: "Regiões & Cidades",
      churches_registered: "Igrejas Registradas",
    },
    
    // Map Titles
    map: {
      churches_title: "Mapa de Igrejas da Holanda",
      churches_description: "Igrejas registradas nos distritos da Holanda",
    },
    
    // Church Popup
    popup: {
      without_region: "Sem Região",
      without_institution: "Sem inst.",
      zip_code_not_available: "N/A",
    },
    
    // City/Region Popup
    cityPopup: {
      region_label: "Região",
      city_label: "Cidade",
      churches_count: "igrejas",
      province_label: "Província",
    },
    
    // Console Messages
    console: {
      map_loaded: "MapLibre carregado com sucesso",
      city_markers_added: "marcadores de cidades adicionados ao mapa",
      church_markers_added: "marcadores de igrejas adicionados ao mapa",
      map_clicked: "Mapa clicado:",
      church_invalid_zipcode: "zip_code inválido ou ausente",
    },
  },
  
  en: {
    // Map Tabs
    tabs: {
      regions_cities: "Regions & Cities",
      churches_registered: "Registered Churches",
    },
    
    // Map Titles
    map: {
      churches_title: "Netherlands Churches Map",
      churches_description: "Churches registered in Netherlands districts",
    },
    
    // Church Popup
    popup: {
      without_region: "No Region",
      without_institution: "No inst.",
      zip_code_not_available: "N/A",
    },
    
    // City/Region Popup
    cityPopup: {
      region_label: "Region",
      city_label: "City",
      churches_count: "churches",
      province_label: "Province",
    },
    
    // Console Messages
    console: {
      map_loaded: "Map loaded successfully",
      city_markers_added: "city markers added to map",
      church_markers_added: "church markers added to map",
      map_clicked: "Map clicked:",
      church_invalid_zipcode: "invalid or missing zip_code",
    },
  },
  
  nl: {
    // Map Tabs
    tabs: {
      regions_cities: "Regio's & Steden",
      churches_registered: "Geregistreerde Kerken",
    },
    
    // Map Titles
    map: {
      churches_title: "Nederlandse Kerken Kaart",
      churches_description: "Kerken geregistreerd in Nederlandse districten",
    },
    
    // Church Popup
    popup: {
      without_region: "Geen Regio",
      without_institution: "Geen inst.",
      zip_code_not_available: "N.v.t.",
    },
    
    // City/Region Popup
    cityPopup: {
      region_label: "Regio",
      city_label: "Stad",
      churches_count: "kerken",
      province_label: "Provincie",
    },
    
    // Console Messages
    console: {
      map_loaded: "MapLibre succesvol geladen",
      city_markers_added: "stadsmarkeringen toegevoegd aan kaart",
      church_markers_added: "kerkmarkeringen toegevoegd aan kaart",
      map_clicked: "Kaart geklikt:",
      church_invalid_zipcode: "ongeldige of ontbrekende postcode",
    },
  },
}

export type RegionsPageTranslations = typeof regionsPageTranslations.pt
