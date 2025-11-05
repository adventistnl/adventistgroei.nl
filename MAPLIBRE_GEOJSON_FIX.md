# MapLibre Component - GeoJSON Fix

## 🔧 Problema Identificado

**Erro 404**: A URL original do GeoJSON não existe mais:
```
https://raw.githubusercontent.com/deldersveld/topojson/master/countries/netherlands/netherlands-provinces.json
```

## ✅ Solução Implementada

### 1. GeoJSON Local
Criado arquivo local em `/public/data/netherlands-provinces-simple.geojson` com:
- 12 províncias dos Países Baixos
- Geometrias Point (simplificadas para fallback)
- Propriedades: `iso_3166_2`, `name`, `code`

### 2. Detecção Automática de Propriedades
O componente agora detecta automaticamente qual propriedade usar:
```typescript
let propertyName = 'iso_3166_2';
if (provincesData.features && provincesData.features.length > 0) {
  const props = provincesData.features[0].properties || {};
  if (props.statnaam) propertyName = 'statnaam'; // CartoMap
  else if (props.name) propertyName = 'name';
  // ... outros fallbacks
}
```

### 3. URLs Alternativas com Fallback
```typescript
// Tentativa 1: URL local (padrão)
'/data/netherlands-provinces-simple.geojson'

// Tentativa 2: URL alternativa (se URL externa falhar)
'https://raw.githubusercontent.com/benassa-de-glassa/netherlands_地域_geography/master/provinces.geojson'
```

### 4. Melhor Tratamento de Erros
- Mensagens de erro mais descritivas
- Logs de debug com emojis
- Tentativa automática de URLs alternativas
- Exibição de propriedades disponíveis no console

## 🎯 Funcionalidades Adicionadas

### Debug Automático
```javascript
// Mostra propriedades disponíveis no GeoJSON
console.log('🔍 Propriedades disponíveis:', Object.keys(data.features[0].properties));
console.log('🔍 Usando propriedade:', propertyName);
```

### Função generateColorExpression() Atualizada
```typescript
function generateColorExpression(
  regions: RegionConfig[], 
  propertyName: string = 'iso_3166_2'
): any[]
```
Agora aceita um parâmetro para especificar qual propriedade usar.

## 📊 GeoJSON Local

### Estrutura
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "iso_3166_2": "NL-DR",
        "name": "Drenthe",
        "code": "NLDR"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [6.5665, 52.9476]
      }
    },
    // ... 11 outras províncias
  ]
}
```

### Províncias Incluídas
1. **NL-DR** - Drenthe
2. **NL-FL** - Flevoland
3. **NL-FR** - Friesland
4. **NL-GE** - Gelderland
5. **NL-GR** - Groningen
6. **NL-LI** - Limburg
7. **NL-NB** - Noord-Brabant
8. **NL-NH** - Noord-Holland
9. **NL-OV** - Overijssel
10. **NL-UT** - Utrecht
11. **NL-ZL** - Zeeland
12. **NL-ZH** - Zuid-Holland

## 🔄 Próximos Passos (Opcional)

### Para Geometrias Completas
Se quiser usar polígonos reais das províncias:

1. **Opção 1**: Natural Earth Data
```
https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
```

2. **Opção 2**: OpenStreetMap via Overpass API
```typescript
const fetchOSMProvinces = async () => {
  const query = `
    [out:json];
    area["ISO3166-2"~"NL-"]->.nl;
    (
      relation["admin_level"="4"](area.nl);
    );
    out geom;
  `;
  // ... fetch logic
};
```

3. **Opção 3**: PDOK (Publieke Dienstverlening Op de Kaart)
```
https://www.pdok.nl/datasets
```

## 🧪 Testar

1. Abra `/regions-example` no navegador
2. Abra o console do navegador (F12)
3. Verifique os logs:
   ```
   🔄 Carregando GeoJSON das províncias...
   📍 URL: /data/netherlands-provinces-simple.geojson
   ✅ GeoJSON carregado com sucesso!
   📊 Features encontradas: 12
   🔍 Propriedades disponíveis: ["iso_3166_2", "name", "code"]
   🎨 Gerando expressão de cores MapLibre...
   ```

4. O mapa deve carregar com marcadores Point para cada província

## ⚠️ Limitações Atuais

- **Geometrias simplificadas**: Usando Point em vez de Polygon
- **Sem hover visual em áreas**: Apenas em marcadores
- **Zoom limitado**: Point geometry não permite fitBounds preciso

## 🎨 Para Usar Polígonos Completos

Substitua o conteúdo de `netherlands-provinces-simple.geojson` por um GeoJSON com geometrias Polygon/MultiPolygon completas. O componente detectará automaticamente e funcionará com hover, click e zoom corretos.

## 📝 Notas

- O componente agora é **resiliente a mudanças de URL**
- **Funciona offline** com o GeoJSON local
- **Detecta automaticamente** propriedades disponíveis
- **Debug extensivo** para facilitar troubleshooting
