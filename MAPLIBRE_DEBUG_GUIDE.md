# 🐛 MapLibre - Guia de Debug e Troubleshooting

## ✅ Correções Implementadas

### 1. **Debug Completo do Carregamento GeoJSON**

O componente agora fornece logs detalhados em cada etapa:

```
🔄 Iniciando carregamento do GeoJSON das províncias...
📍 URL: https://raw.githubusercontent.com/...
📡 Status da resposta: 200 OK
✅ GeoJSON carregado com sucesso!
📊 Tipo de dados: FeatureCollection
📊 Features encontradas: 12
🗺️ Províncias no GeoJSON: [...]
```

### 2. **Zoom Automático ao Clicar em Província**

Quando você clica em uma província:
- ✅ Calcula automaticamente o bounding box da província
- ✅ Aplica zoom suave (1.5 segundos de animação)
- ✅ Adiciona padding para melhor visualização
- ✅ Limita zoom máximo para não ficar muito próximo

```typescript
map.fitBounds(bounds, {
  padding: { top: 100, bottom: 100, left: 100, right: 100 },
  maxZoom: 10,
  duration: 1500,
});
```

### 3. **Painel de Debug Visual**

Ative o painel com `showDebugPanel={true}`:

```tsx
<MapLibre
  regions={regions}
  showDebugPanel={true}
/>
```

**O painel mostra:**
- Total de províncias (12)
- Províncias mapeadas
- Número de regiões
- Províncias não mapeadas
- Features carregadas do GeoJSON
- Província atualmente com hover
- Região da província com hover

---

## 🔍 Como Identificar Problemas

### Console Logs por Etapa

#### Etapa 1: Carregamento do GeoJSON
```
🔄 Iniciando carregamento do GeoJSON das províncias...
📍 URL: [url do geojson]
```
**Problema possível:** URL incorreta ou sem acesso à internet

#### Etapa 2: Resposta HTTP
```
📡 Status da resposta: 200 OK
```
**Problema possível:** Status diferente de 200 (404, 500, etc.)

#### Etapa 3: Parsing do JSON
```
✅ GeoJSON carregado com sucesso!
📊 Tipo de dados: FeatureCollection
```
**Problema possível:** JSON malformado ou tipo errado

#### Etapa 4: Validação de Features
```
📊 Features encontradas: 12
🗺️ Províncias no GeoJSON: [lista de províncias]
```
**Problema possível:** Número incorreto de features ou propriedades faltando

#### Etapa 5: Mapeamento de Regiões
```
🎨 Iniciando configuração de regiões e províncias...
📊 Regiões fornecidas: 4
📊 Dados GeoJSON carregados: true
```

Para cada região:
```
📍 Região: Distrito Norte (#3b82f6)
   Províncias: NLGR, NLFR, NLDR
   ✓ NLGR → NL-GR → #3b82f6
   ✓ NLFR → NL-FR → #3b82f6
   ✓ NLDR → NL-DR → #3b82f6
```
**Problema possível:** Código de província inválido
```
⚠️ Código de província inválido: NLXX
```

#### Etapa 6: Resumo Final
```
📊 Mapeamento final:
   Total de províncias mapeadas: 12
   Províncias esperadas: 12
   Mapa de cores: { NL-GR: '#3b82f6', ... }
```

#### Etapa 7: Configuração de Camadas
```
✅ Source de províncias adicionado
🎨 Expressão de cores criada: ['match', ['get', 'iso_3166_2'], ...]
✅ Camada de preenchimento adicionada
✅ Camada de borda adicionada
✅ Camada de hover adicionada
```

#### Etapa 8: Resultado Final
```
✅ Configuração de províncias concluída!
📊 Resumo: {
  totalProvinces: 12,
  mappedProvinces: 12,
  regions: 4,
  unmappedProvinces: 0
}
```

---

## 🚨 Erros Comuns e Soluções

### Erro: "Erro ao carregar dados das províncias"

**Causa:** Falha no fetch do GeoJSON

**Como diagnosticar:**
1. Abra o console do navegador
2. Procure por: `❌ ERRO ao carregar GeoJSON das províncias:`
3. Veja os detalhes do erro logo abaixo

**Soluções:**

#### A. URL incorreta
```javascript
// Logs mostrarão:
📍 URL: https://url-errada.com/...
📡 Status da resposta: 404 Not Found
```
**Solução:** Verifique a prop `provincesGeoJsonUrl` ou use a URL padrão

#### B. Sem conexão com internet
```javascript
// Logs mostrarão:
❌ ERRO: Failed to fetch
```
**Solução:** Verifique sua conexão ou use GeoJSON local

#### C. CORS bloqueado
```javascript
// Logs mostrarão:
❌ ERRO: CORS policy
```
**Solução:** Use proxy ou hospede o GeoJSON localmente

#### D. JSON malformado
```javascript
// Logs mostrarão:
❌ ERRO: Unexpected token
```
**Solução:** Valide o JSON em https://geojsonlint.com/

---

### Erro: "GeoJSON inválido: não contém array de features"

**Causa:** Estrutura do GeoJSON não é FeatureCollection

**Solução:**
```javascript
// Estrutura esperada:
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "iso_3166_2": "NL-GR",
        "name": "Groningen"
      },
      "geometry": { ... }
    }
  ]
}
```

---

### Províncias não aparecem coloridas

**Causa 1:** Códigos de províncias incorretos

**Diagnóstico:**
```javascript
// Procure no console:
⚠️ Código de província inválido: NLXX
```

**Códigos válidos:**
```
NLGR, NLFR, NLDR (Norte)
NLNH, NLZH, NLUT, NLFL (Oeste)
NLZL, NLNB, NLLI (Sul)
NLOV, NLGE (Leste)
```

**Causa 2:** Propriedade `iso_3166_2` faltando no GeoJSON

**Diagnóstico:**
```javascript
// Verifique os logs:
🗺️ Províncias no GeoJSON: [
  { name: "Groningen", iso: undefined }  // ❌ ISO faltando!
]
```

**Solução:** Use GeoJSON que contenha a propriedade `iso_3166_2`

---

### Zoom não funciona ao clicar

**Causa:** Geometria da feature está vazia ou inválida

**Diagnóstico:**
```javascript
// Procure no console após clicar:
🖱️ Província clicada: { province: "NL-GR", ... }
❌ Erro ao calcular bounds: [erro]
```

**Solução:** Verifique se o GeoJSON tem coordenadas válidas

---

## 🛠️ Ferramentas de Debug

### 1. Painel de Debug (Recomendado)

```tsx
<MapLibre
  regions={regions}
  showDebugPanel={true}  // ← Ativar painel
/>
```

**Mostra em tempo real:**
- ✅ Status do carregamento
- ✅ Províncias mapeadas vs total
- ✅ Província em hover
- ✅ Região da província

### 2. Console Logs

Todos os logs importantes têm emojis para facilitar:
- 🔄 = Processamento
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso
- 📍 = Localização/URL
- 📡 = Network
- 📊 = Dados/Estatísticas
- 🗺️ = Mapa
- 🎨 = Estilo/Cores
- 🖱️ = Interação

### 3. Validação Manual

```javascript
// No console do navegador:
map.current.getSource('provinces')  // Ver source
map.current.getLayer('provinces-layer')  // Ver camada
```

---

## 📊 Checklist de Validação

### Antes de usar o componente:

- [ ] URL do GeoJSON está acessível
- [ ] GeoJSON contém propriedade `iso_3166_2`
- [ ] Códigos de províncias estão corretos
- [ ] Cores estão em formato hexadecimal (`#3b82f6`)
- [ ] Array de regiões não está vazio

### Durante o desenvolvimento:

- [ ] Console não mostra erros em vermelho
- [ ] Log final mostra `unmappedProvinces: 0`
- [ ] Painel de debug mostra 12/12 províncias
- [ ] Hover funciona em todas as províncias
- [ ] Clique faz zoom suave

### Em produção:

- [ ] Desative o painel de debug: `showDebugPanel={false}`
- [ ] Remova logs desnecessários (opcional)
- [ ] Teste em diferentes navegadores
- [ ] Teste em diferentes tamanhos de tela

---

## 🎯 Teste Rápido

Execute este código no console após o mapa carregar:

```javascript
// 1. Verificar se o source foi criado
console.log('Source:', map.current.getSource('provinces'))

// 2. Verificar se as camadas foram criadas
console.log('Layer:', map.current.getLayer('provinces-layer'))

// 3. Ver todas as features
const source = map.current.getSource('provinces')
console.log('Features:', source._data.features)

// 4. Verificar propriedades das features
source._data.features.forEach(f => {
  console.log(f.properties.name, f.properties.iso_3166_2)
})
```

---

## 📞 Suporte

Se após seguir este guia o problema persistir:

1. **Copie TODOS os logs do console** (desde o início)
2. **Tire um screenshot do painel de debug**
3. **Informe:**
   - Navegador e versão
   - Configuração de regiões usada
   - URL do GeoJSON (se customizada)

---

## ✅ Resultado Esperado

Quando tudo estiver funcionando corretamente, você verá:

```
🔄 Iniciando carregamento do GeoJSON das províncias...
📍 URL: https://raw.githubusercontent.com/...
📡 Status da resposta: 200 OK
✅ GeoJSON carregado com sucesso!
📊 Tipo de dados: FeatureCollection
📊 Features encontradas: 12
🎨 Iniciando configuração de regiões e províncias...
📊 Regiões fornecidas: 4
  📍 Região: Distrito Norte (#3b82f6)
     Províncias: NLGR, NLFR, NLDR
     ✓ NLGR → NL-GR → #3b82f6
     ✓ NLFR → NL-FR → #3b82f6
     ✓ NLDR → NL-DR → #3b82f6
  [... outras regiões ...]
📊 Mapeamento final:
   Total de províncias mapeadas: 12
   Províncias esperadas: 12
✅ Source de províncias adicionado
✅ Camada de preenchimento adicionada
✅ Camada de borda adicionada
✅ Camada de hover adicionada
✅ Configuração de províncias concluída!
📊 Resumo: {
  totalProvinces: 12,
  mappedProvinces: 12,
  regions: 4,
  unmappedProvinces: 0
}
```

E no mapa você verá:
- ✅ Todas as 12 províncias coloridas
- ✅ Cursor vira "pointer" ao passar mouse
- ✅ Borda preta aparece no hover
- ✅ Zoom suave ao clicar
- ✅ Painel de debug mostrando 12/12

🎉 **Tudo funcionando perfeitamente!**
