# Sistema de Demarcação e Hover de Províncias

## 📋 Visão Geral

Implementação completa de sistema de demarcação de províncias com destaque interativo no hover, seguindo as melhores práticas do MapLibre GL JS.

## 🎯 Funcionalidades

### 1. **Demarcação Visual das Províncias**
- Linhas de contorno escuras (#222222) com 1.5px de espessura
- Opacidade de 80% para visibilidade sem poluir o mapa
- Segue exatamente os limites geográficos do GeoJSON

### 2. **Sistema de Hover Interativo**
- Destaque automático ao passar o mouse sobre qualquer província
- Feedback visual em 3 camadas:
  - **Opacidade aumentada**: 70% → 95% no hover
  - **Contorno de destaque**: Linha preta de 3px
  - **Cursor pointer**: Indicação visual de interatividade

### 3. **Estados Visuais**

| Estado | Opacidade Fill | Contorno | Cursor | Descrição |
|--------|----------------|----------|--------|-----------|
| **Normal** | 0.7 (70%) | 1.5px #222 | default | Estado padrão da província |
| **Hover** | 0.95 (95%) | 3px #000 | pointer | Província sob o mouse |
| **Sem Região** | 0.7 (70%) | 1.5px #222 | default | Província não atribuída (cinza) |

## 🏗️ Arquitetura de Layers

```typescript
// Ordem de renderização (bottom → top)
7. region-labels-text       // Texto dos labels
6. region-labels-background  // Círculos coloridos
5. provinces-hover           // Destaque no hover (3px, preto)
4. provinces-outline         // Contorno padrão (1.5px, #222)
3. provinces-fill            // Preenchimento colorido
2. Base map                  // Mapa de fundo (Carto)
```

## 💻 Implementação Técnica

### Layer de Preenchimento com Hover

```typescript
map.current.addLayer({
  id: 'provinces-fill',
  type: 'fill',
  source: 'netherlands-provinces',
  paint: {
    'fill-color': colorExpression,
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.95, // Opacidade no hover
      0.7   // Opacidade normal
    ],
  },
});
```

**Explicação:**
- `colorExpression`: Expressão match que mapeia ISO codes → cores
- `feature-state`: Estado dinâmico controlado por JavaScript
- `case`: Expressão condicional do MapLibre (ternário)
- Transição automática entre estados

### Layer de Demarcação (Contorno)

```typescript
map.current.addLayer({
  id: 'provinces-outline',
  type: 'line',
  source: 'netherlands-provinces',
  paint: {
    'line-color': '#222222',
    'line-width': 1.5,
    'line-opacity': 0.8,
  },
});
```

**Características:**
- Cor escura para contraste com qualquer fundo
- Espessura balanceada (não muito grossa)
- Sempre visível independente do hover

### Layer de Hover (Destaque)

```typescript
map.current.addLayer({
  id: 'provinces-hover',
  type: 'line',
  source: 'netherlands-provinces',
  paint: {
    'line-color': '#000000',
    'line-width': 3,
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,   // Totalmente visível no hover
      0    // Invisível normalmente
    ],
  },
});
```

**Lógica:**
- Linha preta mais grossa (3px)
- Só aparece quando `hover` state = true
- Cria efeito de "borda brilhante"

## 🖱️ Sistema de Eventos

### Evento: mousemove (Hover)

```typescript
map.current.on('mousemove', 'provinces-fill', (e) => {
  if (!e.features || e.features.length === 0) return;

  const feature = e.features[0];
  const isoCode = feature.properties?.iso_3166_2;
  const provinceName = feature.properties?.name;

  // 1. Mudar cursor
  map.current.getCanvas().style.cursor = 'pointer';

  // 2. Remover hover anterior
  if (hoveredId !== null && hoveredId !== feature.id) {
    map.current.setFeatureState(
      { source: 'netherlands-provinces', id: hoveredId },
      { hover: false }
    );
  }

  // 3. Adicionar hover atual
  hoveredId = feature.id;
  map.current.setFeatureState(
    { source: 'netherlands-provinces', id: hoveredId },
    { hover: true }
  );

  // 4. Callbacks
  setHoveredProvince(isoCode);
  onProvinceHover?.(isoCode, regionName);

  console.log('🖱️ Hover:', provinceName, '→', regionName || 'Sem região');
});
```

### Evento: mouseleave (Sair do Hover)

```typescript
map.current.on('mouseleave', 'provinces-fill', () => {
  // 1. Restaurar cursor
  map.current.getCanvas().style.cursor = '';
  
  // 2. Remover hover state
  if (hoveredId !== null) {
    map.current.setFeatureState(
      { source: 'netherlands-provinces', id: hoveredId },
      { hover: false }
    );
  }
  hoveredId = null;
  
  // 3. Limpar estado
  setHoveredProvince(null);
  onProvinceHover?.(null);
});
```

## 🎨 Personalização

### Ajustar Cores de Demarcação

```typescript
// Contorno mais suave
'line-color': '#666666',  // Cinza médio
'line-width': 1,
'line-opacity': 0.6,

// Contorno mais forte
'line-color': '#000000',  // Preto puro
'line-width': 2,
'line-opacity': 1,
```

### Ajustar Intensidade do Hover

```typescript
// Hover mais sutil
'fill-opacity': [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  0.85,  // Menos opaco no hover
  0.65   // Mais transparente normalmente
],

// Hover mais dramático
'fill-opacity': [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  1.0,   // Totalmente opaco no hover
  0.5    // Bem transparente normalmente
],
```

### Adicionar Animação de Transição

```typescript
map.current.addLayer({
  id: 'provinces-fill',
  type: 'fill',
  source: 'netherlands-provinces',
  paint: {
    'fill-color': colorExpression,
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.95,
      0.7
    ],
    'fill-opacity-transition': {
      duration: 300,  // 300ms de transição suave
      delay: 0
    }
  },
});
```

## 📊 Exemplos de Uso

### Exemplo 1: Hover com Tooltip

```typescript
const [hoveredInfo, setHoveredInfo] = useState<{
  province: string;
  region: string;
  position: [number, number];
} | null>(null);

<MapLibre
  regions={regions}
  onProvinceHover={(code, region) => {
    if (code) {
      setHoveredInfo({
        province: NETHERLANDS_PROVINCES[code],
        region: region || 'Sem região',
        position: event.lngLat.toArray()
      });
    } else {
      setHoveredInfo(null);
    }
  }}
/>

{hoveredInfo && (
  <Popup position={hoveredInfo.position}>
    <strong>{hoveredInfo.province}</strong>
    <br />
    <span>{hoveredInfo.region}</span>
  </Popup>
)}
```

### Exemplo 2: Hover com Analytics

```typescript
<MapLibre
  regions={regions}
  onProvinceHover={(code, region) => {
    if (code) {
      trackEvent('map_province_hover', {
        province_code: code,
        region_name: region,
        timestamp: Date.now()
      });
    }
  }}
/>
```

### Exemplo 3: Múltiplos Estados Visuais

```typescript
// Adicionar estado de "selecionado"
map.current.on('click', 'provinces-fill', (e) => {
  const feature = e.features[0];
  
  // Toggle selected state
  const currentState = map.current.getFeatureState({
    source: 'netherlands-provinces',
    id: feature.id
  });
  
  map.current.setFeatureState(
    { source: 'netherlands-provinces', id: feature.id },
    { selected: !currentState.selected }
  );
});

// Layer com múltiplos estados
map.current.addLayer({
  id: 'provinces-fill',
  type: 'fill',
  source: 'netherlands-provinces',
  paint: {
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      1.0,  // Selecionado
      ['boolean', ['feature-state', 'hover'], false],
      0.95, // Hover
      0.7   // Normal
    ],
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      '#ffeb3b', // Amarelo quando selecionado
      colorExpression // Cor normal
    ]
  },
});
```

## 🐛 Troubleshooting

### Problema 1: Hover não funciona

**Sintomas:**
- Passar o mouse sobre província não causa nenhum efeito
- Console não mostra logs de hover

**Soluções:**

1. **Verificar se GeoJSON tem `id` único:**
   ```typescript
   // Cada feature deve ter id
   {
     "type": "Feature",
     "id": 123,  // ← OBRIGATÓRIO para feature-state
     "properties": { "iso_3166_2": "NL-DR" },
     "geometry": { ... }
   }
   ```

2. **Adicionar IDs se não existirem:**
   ```typescript
   map.current.addSource('netherlands-provinces', {
     type: 'geojson',
     data: provincesData,
     generateId: true  // ← Gera IDs automáticos
   });
   ```

3. **Verificar nome da layer:**
   ```typescript
   // Certifique-se que o listener usa a layer correta
   map.current.on('mousemove', 'provinces-fill', ...);
   //                           ^^^^^^^^^^^^^^^ nome exato da layer
   ```

### Problema 2: Contorno não aparece

**Soluções:**

1. **Verificar ordem das layers:**
   ```typescript
   // outline deve vir DEPOIS do fill
   map.current.addLayer(fillLayer);   // 1º
   map.current.addLayer(outlineLayer); // 2º
   ```

2. **Ajustar espessura:**
   ```typescript
   'line-width': 2,  // Aumentar se não visível
   ```

3. **Verificar opacidade:**
   ```typescript
   'line-opacity': 1,  // 100% visível
   ```

### Problema 3: Hover fica preso

**Sintomas:**
- Hover permanece ativo mesmo após sair da província
- Múltiplas províncias ficam destacadas

**Solução:**

```typescript
let hoveredId: string | number | null = null;

map.current.on('mousemove', 'provinces-fill', (e) => {
  const feature = e.features[0];
  
  // ← IMPORTANTE: Remover hover anterior
  if (hoveredId !== null && hoveredId !== feature.id) {
    map.current.setFeatureState(
      { source: 'netherlands-provinces', id: hoveredId },
      { hover: false }
    );
  }
  
  hoveredId = feature.id;
  map.current.setFeatureState(
    { source: 'netherlands-provinces', id: hoveredId },
    { hover: true }
  );
});

// ← IMPORTANTE: Cleanup no mouseleave
map.current.on('mouseleave', 'provinces-fill', () => {
  if (hoveredId !== null) {
    map.current.setFeatureState(
      { source: 'netherlands-provinces', id: hoveredId },
      { hover: false }
    );
  }
  hoveredId = null;
});
```

## 🎓 Referências

### Documentação MapLibre GL JS

- **Feature State**: https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setfeaturestate
- **Paint Properties**: https://maplibre.org/maplibre-style-spec/layers/
- **Expressions**: https://maplibre.org/maplibre-style-spec/expressions/

### Conceitos-Chave

1. **Feature State**: Estado dinâmico de features sem modificar dados
2. **Paint Properties**: Estilização visual das layers
3. **Expressions**: Lógica condicional declarativa no estilo do mapa

## ✅ Checklist de Implementação

- [x] Layer de preenchimento com opacidade dinâmica
- [x] Layer de contorno para demarcação clara
- [x] Layer de hover para destaque
- [x] Evento mousemove com cursor pointer
- [x] Evento mouseleave com cleanup
- [x] Gerenciamento de estado hover
- [x] Logs de debug para hover
- [x] Callbacks para integração externa
- [x] Suporte a províncias sem região
- [x] Documentação completa

## 🚀 Próximos Passos Sugeridos

1. **Adicionar Tooltip Personalizado**: Mostrar informações detalhadas no hover
2. **Implementar Multi-Seleção**: Permitir selecionar múltiplas províncias
3. **Adicionar Animações**: Transições suaves entre estados
4. **Criar Temas de Cores**: Diferentes esquemas de cores (claro/escuro)
5. **Implementar Zoom Inteligente**: Ajustar demarcação conforme zoom level

---

**Última atualização:** 29 de outubro de 2025  
**Versão do MapLibre GL JS:** 5.10.0  
**Status:** ✅ Implementação Completa
