# Privacy Toggle Feature - Department Spending Chart

## 📋 Overview

Feature de privacidade implementada no componente `DepartmentSpendingChart` que permite ocultar informações sensíveis de orçamento com um único clique, similar ao sistema de lock/unlock usado na tabela de Annual Budget.

## 🎯 Objetivo

Proteger informações financeiras sensíveis durante apresentações, compartilhamento de tela ou quando o dashboard está sendo visualizado em ambientes públicos.

## ✨ Características Principais

### 1. **Toggle Button no Header**
- Localizado no canto superior direito do card
- Ícones intuitivos: `Eye` (visível) e `EyeOff` (oculto)
- Transição suave de cores ao hover
- Tooltip informativo ao passar o mouse

### 2. **Privacy Mode Ativado**
- **Blur Effect**: Todo o conteúdo fica desfocado
- **Skeleton Loading**: Componentes skeleton substituem os dados reais
- **Overlay Message**: Mensagem central indicando "Sensitive information hidden"
- **Backdrop Blur**: Camada adicional de blur para reforçar privacidade
- **Pointer Events Disabled**: Usuário não pode interagir com dados ocultos

### 3. **Privacy Mode Desativado**
- Exibe o gráfico completo com todos os dados
- Footer com totais e percentuais visíveis
- Todas as interações do gráfico funcionam normalmente

## 🎨 Design System

### Componentes UI Utilizados
```typescript
import { Eye, EyeOff } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
```

### Estados de Cor

| Estado | Ícone | Cor | Hover Color |
|--------|-------|-----|-------------|
| Visível (Normal) | `EyeOff` | `text-blue-600` | `text-gray-400` |
| Oculto (Privacy) | `Eye` | `text-gray-400` | `text-blue-600` |

### Efeitos Visuais

1. **Blur Principal**: `blur-sm` - Aplicado ao conteúdo
2. **Backdrop Blur**: `backdrop-blur-[2px]` - Overlay adicional
3. **Overlay Transparency**: `bg-white/30` - Fundo semi-transparente
4. **Message Box**: `bg-gray-900/90` - Background escuro com alta opacidade

## 🔧 Implementação Técnica

### State Management
```typescript
const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false)
```

### Toggle Handler
```typescript
onClick={() => setIsPrivacyEnabled(!isPrivacyEnabled)}
```

### Conditional Rendering - CardContent
```typescript
{isPrivacyEnabled ? (
  // Privacy Mode: Skeleton + Blur + Overlay
) : (
  // Normal Mode: Actual Chart
)}
```

### Conditional Rendering - CardFooter
```typescript
{isPrivacyEnabled ? (
  // Privacy Mode: Skeleton Footer
) : (
  // Normal Mode: Actual Footer
)}
```

## 📊 Estrutura do Privacy Mode

### Content Area (Gráfico)
```
┌─────────────────────────────────────┐
│  [Skeleton Title]     h-8 w-3/4     │
│                                      │
│  [Skeleton Chart]     h-64 w-full   │
│                                      │
│  [Skeleton] [Skeleton] [Skeleton]   │
│     Legend placeholders              │
└─────────────────────────────────────┘
      +
┌─────────────────────────────────────┐
│        OVERLAY MESSAGE               │
│   🔒 Sensitive information hidden   │
└─────────────────────────────────────┘
```

### Footer Area (Totais)
```
┌─────────────────────────────────────┐
│  [Skeleton]  h-4 w-48               │
│                                      │
│  [Skel]      [Skel]      [Skel]    │
│   h-10        h-10        h-10      │
└─────────────────────────────────────┘
```

## 🎭 Behavior & UX

### Transições
- **Icon Color**: `transition-colors duration-200`
- **Tooltip Opacity**: `transition-opacity duration-200`

### Acessibilidade
- `title` attribute no botão para screen readers
- Tooltip descritivo ao hover
- Cores com contraste adequado
- Mensagem clara quando privacy está ativada

### Segurança
- `pointer-events-none` desabilita interações
- `select-none` previne seleção de texto
- Blur multi-camadas impede leitura de dados

## 📱 Responsividade

### Desktop
- Botão no canto superior direito do header
- Tooltip posicionado abaixo do ícone
- Overlay message centralizada

### Mobile
- Botão mantém posicionamento
- Tooltip adaptado para touch
- Message box responsiva

## 🔄 Estados do Componente

| Estado | isPrivacyEnabled | Ícone | Conteúdo | Footer |
|--------|------------------|-------|----------|--------|
| **Normal** | `false` | `EyeOff` | Gráfico real | Dados reais |
| **Privacy** | `true` | `Eye` | Skeleton + Blur | Skeleton |

## 💡 Use Cases

### 1. Apresentações Públicas
Usuário apresentando dashboard em reunião com stakeholders externos - pode ocultar valores específicos mantendo a estrutura visual.

### 2. Screen Sharing
Durante chamadas de vídeo, ocultar informações sensíveis antes de compartilhar tela.

### 3. Ambientes Compartilhados
Dashboard exibido em monitores públicos ou áreas comuns - ativar privacy mode automaticamente.

### 4. Screenshots & Documentação
Capturar imagens do dashboard sem expor dados reais para documentação.

## 🚀 Extensões Futuras

### Possíveis Melhorias

1. **Auto-Hide Timer**
   ```typescript
   // Ativar privacy mode automaticamente após X segundos de inatividade
   useEffect(() => {
     const timer = setTimeout(() => setIsPrivacyEnabled(true), 60000)
     return () => clearTimeout(timer)
   }, [lastInteraction])
   ```

2. **Keyboard Shortcut**
   ```typescript
   // Toggle com atalho de teclado (ex: Ctrl+H)
   useEffect(() => {
     const handleKeyPress = (e: KeyboardEvent) => {
       if (e.ctrlKey && e.key === 'h') {
         setIsPrivacyEnabled(prev => !prev)
       }
     }
     window.addEventListener('keydown', handleKeyPress)
     return () => window.removeEventListener('keydown', handleKeyPress)
   }, [])
   ```

3. **Global Privacy Mode**
   ```typescript
   // Context para controlar privacy em múltiplos charts
   const { isPrivacyEnabled, togglePrivacy } = usePrivacyContext()
   ```

4. **Customizable Blur Level**
   ```typescript
   // Permitir usuário escolher intensidade do blur
   const blurLevels = {
     low: 'blur-sm',
     medium: 'blur-md',
     high: 'blur-lg'
   }
   ```

5. **Privacy Analytics**
   ```typescript
   // Rastrear quando privacy mode é usado
   const handlePrivacyToggle = () => {
     setIsPrivacyEnabled(!isPrivacyEnabled)
     analytics.track('privacy_mode_toggled', {
       enabled: !isPrivacyEnabled,
       chart: 'department-spending'
     })
   }
   ```

## 📋 Checklist de Implementação

- [x] Adicionar estado `isPrivacyEnabled`
- [x] Implementar toggle button no header
- [x] Criar conditional rendering para CardContent
- [x] Criar conditional rendering para CardFooter
- [x] Adicionar skeleton components
- [x] Implementar blur effects
- [x] Criar overlay message
- [x] Adicionar tooltip informativo
- [x] Testar transições de estado
- [x] Validar acessibilidade
- [x] Verificar responsividade

## 🎨 Código de Referência

### Toggle Button
```typescript
<button
  onClick={() => setIsPrivacyEnabled(!isPrivacyEnabled)}
  className="relative group ml-2 flex-shrink-0"
  title={isPrivacyEnabled ? "Show sensitive information" : "Hide sensitive information"}
>
  {isPrivacyEnabled ? (
    <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors duration-200" />
  ) : (
    <EyeOff className="w-4 h-4 text-blue-600 hover:text-gray-400 transition-colors duration-200" />
  )}
  
  <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
    {isPrivacyEnabled ? "Click to show information" : "Click to hide information"}
  </div>
</button>
```

### Privacy Overlay
```typescript
<div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
  <div className="bg-gray-900/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
    <EyeOff className="w-4 h-4" />
    <span className="text-sm font-medium">Sensitive information hidden</span>
  </div>
</div>
```

## 📚 Componentes Similares

Este pattern pode ser replicado em:

- ✅ **DepartmentSpendingChart** (implementado)
- 🔄 **BudgetDistributionChart** (pendente)
- 🔄 **SpendingOverTimeChart** (pendente)
- 🔄 **KPI Cards** (pendente)
- 🔄 **Budget Requests Table** (pendente)

## 🔐 Considerações de Segurança

### O que o Privacy Mode NÃO faz:
- ❌ Não impede screenshot de sistema operacional
- ❌ Não remove dados da memória
- ❌ Não protege contra inspect element
- ❌ Não criptografa dados

### O que o Privacy Mode FAZ:
- ✅ Oculta dados visualmente
- ✅ Dificulta leitura casual
- ✅ Previne exposição acidental
- ✅ Adiciona camada de conscientização

### Recomendações:
Para segurança real, implementar:
1. Autenticação robusta
2. Controle de acesso baseado em roles
3. Audit logging
4. Data encryption at rest and in transit
5. Session timeout automático

## 📖 Documentação Relacionada

- [Annual Budget Page Documentation](./app/finance/annual-budget/README.md)
- [Chart Components Guide](./components/charts/README.md)
- [Shadcn UI - Skeleton](https://ui.shadcn.com/docs/components/skeleton)
- [Lucide Icons - Eye/EyeOff](https://lucide.dev/icons/)

---

**Última atualização**: 22 de outubro de 2025  
**Versão**: 1.0.0  
**Mantido por**: Equipe Frontend
