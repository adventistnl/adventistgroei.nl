# 🗺️ Mapbox Migration - Complete

## ✅ Instalações Completas

```bash
✓ pnpm install react-map-gl mapbox-gl
✓ pnpm install -D @types/mapbox-gl
```

## 📦 Pacotes Instalados

- **react-map-gl** v8.1.0 - React wrapper para Mapbox GL JS
- **mapbox-gl** v3.16.0 - Mapbox GL JS core library
- **@types/mapbox-gl** v3.4.1 - TypeScript definitions

## 🚀 Próximos Passos

### 1. Obter Token do Mapbox (OBRIGATÓRIO)

1. Criar conta em: https://account.mapbox.com/
2. Acessar: https://account.mapbox.com/access-tokens/
3. Criar um novo token ou usar o token público padrão
4. Copiar o token

### 2. Configurar Token

Edite o arquivo `.env.local` e substitua o token de exemplo:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_real_aqui
```

### 3. Reiniciar Servidor

```bash
# Parar o servidor se estiver rodando (Ctrl+C)
# Reiniciar o servidor
pnpm run dev
```

### 4. Reiniciar TypeScript Server (no VS Code)

1. Abra o Command Palette: `Cmd+Shift+P` (Mac) ou `Ctrl+Shift+P` (Windows/Linux)
2. Digite: `TypeScript: Restart TS Server`
3. Enter

## 🎨 Novo Componente

### Localização
`/components/maps/europe-regions-map-mapbox.tsx`

### Uso

```tsx
import { EuropeRegionsMap } from "@/components/maps/europe-regions-map-mapbox"

const regions = [
  {
    id: 'region-norte',
    name: 'Distrito Norte',
    color: '#3b82f6',
    provinces: ['NLGR', 'NLFR', 'NLDR'],
    churches_count: 8,
    members_count: 320
  }
]

<EuropeRegionsMap 
  regions={regions}
  onRegionClick={(region) => console.log(region)}
  height={600}
/>
```

## ✨ Melhorias vs react-simple-maps

✅ **Performance**: Renderização vetorial WebGL (muito mais rápida)  
✅ **Qualidade**: Mapas de alta resolução com suporte a retina  
✅ **Interatividade**: Controles nativos suaves de zoom/pan  
✅ **Modernidade**: Biblioteca mantida ativamente pelo Mapbox  
✅ **Recursos**: Suporte a 3D, terreno, animações avançadas  
✅ **Responsividade**: Melhor adaptação a diferentes tamanhos de tela  

## 🗑️ Remover Biblioteca Antiga (Opcional)

Após confirmar que tudo funciona:

```bash
pnpm remove react-simple-maps
```

## 📁 Arquivos Modificados

- ✅ `/components/maps/europe-regions-map-mapbox.tsx` (NOVO)
- ✅ `/app/regions-example/page.tsx` (atualizado import)
- ✅ `.env.local` (criado com token de exemplo)
- ✅ `package.json` (dependências adicionadas)

## 🐛 Troubleshooting

### "Cannot find module 'react-map-gl'"

1. Reinicie o TypeScript Server (ver passo 4 acima)
2. Reinicie o VS Code completamente
3. Limpe o cache do Next.js:
   ```bash
   rm -rf .next
   pnpm run dev
   ```

### Mapa não carrega

1. Verifique se o token do Mapbox está correto no `.env.local`
2. Verifique se o token começa com `pk.`
3. Abra o console do navegador para ver erros
4. Certifique-se de que o servidor foi reiniciado após adicionar o token

### Erros de CORS

- Verifique se adicionou `localhost` nas URLs permitidas no dashboard do Mapbox
- URL: https://account.mapbox.com/access-tokens/

## 📚 Documentação

- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js/
- **react-map-gl**: https://visgl.github.io/react-map-gl/
- **Exemplos**: https://visgl.github.io/react-map-gl/examples

---

**Status**: ✅ Instalação completa - Aguardando token do Mapbox
