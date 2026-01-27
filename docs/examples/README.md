# Church-Region Linking Examples

Este diretório contém exemplos práticos de como usar o sistema de auto-linking de Churches e Regions em diferentes contextos.

## 📁 Arquivos

### `church-region-chart-example.tsx`

Exemplos completos de uso do `church-region-matcher` em:

1. **ChurchDistributionChart** - Gráfico de barras empilhadas (Recharts)
   - Mostra distribuição de churches por região
   - Separa visualmente churches originais vs auto-linked
   - Tooltip customizado com detalhes
   - Estatísticas agregadas no header

2. **ChurchAutoLinkingKPIs** - Cards de KPI
   - Total de churches
   - Churches com link original
   - Churches auto-linked (high + medium confidence)
   - Churches sem link

3. **ChurchListWithAutoLinking** - Lista com visual feedback
   - Bordas sólidas para links originais
   - Bordas tracejadas para auto-linked
   - Badges de confidence
   - Cores da região

## 🚀 Como Usar

### 1. Copiar o código de exemplo

```bash
# Os exemplos estão prontos para uso
# Basta importar e usar nos seus componentes
```

### 2. Importar no seu componente

```typescript
import { ChurchDistributionChart } from '@/docs/examples/church-region-chart-example'

function MyDashboard() {
  return (
    <div>
      <ChurchDistributionChart />
    </div>
  )
}
```

### 3. Adaptar para suas necessidades

Os exemplos são templates. Customize conforme necessário:
- Cores
- Estilos
- Métricas
- Layout

## 📚 Documentação Completa

Ver: `/docs/CHURCH_REGION_LINKING_GUIDE.md`

## 🔧 Utilitário Principal

Ver: `/lib/church-region-matcher.ts`

---

**Última atualização:** 27/01/2026
