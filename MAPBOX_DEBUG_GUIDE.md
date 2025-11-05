# 🐛 Mapbox Debug Guide

## ✅ Debug Features Adicionadas

### 1. Console Logs
O componente agora imprime no console:
- Token do Mapbox (primeiros 20 caracteres)
- Número de regiões
- Estado da visualização (latitude, longitude, zoom)

### 2. Debug Panel (Visual)
Painel no canto superior esquerdo mostra:
- ✓/✗ Status do token (válido se começa com `pk.`)
- ✓/⏳ Status do carregamento do mapa
- Número de regiões carregadas
- Posição atual (lat, lng)

### 3. Error Display
Se houver erro no mapa:
- Banner vermelho no topo
- Mensagem de erro detalhada

### 4. Loading State
Spinner de carregamento enquanto o mapa está sendo inicializado

## 🔍 Como Diagnosticar Problemas

### Abra o Console do Navegador
1. Chrome/Edge: `F12` ou `Cmd+Option+I` (Mac)
2. Procure por mensagens com 🗺️, ✅, ❌

### Verifique o Debug Panel
No canto superior esquerdo do mapa você verá:

```
🐛 Debug Info:
Token: ✓ Valid / ✗ Invalid
Map: ✓ Loaded / ⏳ Loading
Regions: 4
Position: 52.50, 5.29
```

## 🚨 Problemas Comuns e Soluções

### Problema 1: Mapa não aparece (tela branca)

**Sintomas:**
- Spinner infinito
- Debug Panel mostra "Token: ✗ Invalid"

**Solução:**
1. Verifique o `.env.local`
2. Token deve começar com `pk.`
3. Reinicie o servidor: `pnpm run dev`

### Problema 2: Erro de token inválido

**Sintomas:**
- Banner vermelho com erro
- Console: "❌ Map error: Invalid token"

**Solução:**
1. Crie conta em: https://account.mapbox.com/
2. Acesse: https://account.mapbox.com/access-tokens/
3. Copie o **Default public token**
4. Adicione ao `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_aqui
   ```
5. Reinicie o servidor

### Problema 3: CORS error

**Sintomas:**
- Console: "Access-Control-Allow-Origin"
- Mapa carrega mas GeoJSON não

**Solução:**
- O GeoJSON está em URL pública, não deveria ter CORS
- Se tiver problema, use um GeoJSON local

### Problema 4: Mapa carrega mas é cinza

**Sintomas:**
- Debug Panel mostra "Map: ✓ Loaded"
- Mas mapa está cinza sem detalhes

**Solução:**
1. Verifique conexão com internet
2. Verifique se o estilo do Mapbox está acessível
3. Tente outro estilo:
   ```tsx
   mapStyle="mapbox://styles/mapbox/streets-v12"
   ```

## 🎯 Token Atual

Atualmente usando token público de exemplo do Mapbox:
```
pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw
```

⚠️ **IMPORTANTE**: Este é um token público de exemplo com limites de uso.
Para produção, crie seu próprio token em: https://account.mapbox.com/

## 📊 Verificações Rápidas

Execute no console do navegador:

```javascript
// 1. Verificar se o token está definido
console.log('Token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN)

// 2. Verificar se react-map-gl está carregado
console.log('MapGL:', typeof MapGL)

// 3. Verificar se mapbox-gl está carregado
console.log('Mapbox GL:', typeof mapboxgl)
```

## 🔧 Próximos Passos

1. **Teste o componente**
   ```bash
   pnpm run dev
   ```

2. **Acesse a página**
   ```
   http://localhost:3000/regions-example
   ```

3. **Verifique o Debug Panel**
   - Token deve estar ✓ Valid
   - Map deve mostrar ✓ Loaded
   - Regions: 4

4. **Teste interações**
   - Arraste para mover (pan)
   - Scroll para zoom
   - Clique nas províncias

5. **Verifique o console**
   - Procure por erros em vermelho
   - Logs 🗺️ devem mostrar valores corretos

## 🗑️ Remover Debug (Produção)

Quando tudo funcionar, remova:

1. **Console logs**:
   ```tsx
   // Remova o useEffect com console.log
   ```

2. **Debug Panel**:
   ```tsx
   {/* Debug Panel - removível após testes */}
   ```

3. **Loading/Error states** (opcional):
   - Podem ser mantidos para melhor UX

## 📞 Suporte

Se ainda não funcionar:

1. Compartilhe o console log completo
2. Tire screenshot do Debug Panel
3. Verifique erros de rede na aba Network (F12)
4. Confirme que o servidor foi reiniciado após adicionar token

---

**Status Atual**: Debug completo adicionado ✅
**Token**: Usando token público de exemplo (substituir para produção) ⚠️
