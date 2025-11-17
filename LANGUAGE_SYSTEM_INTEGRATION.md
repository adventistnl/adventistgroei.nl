# Sistema de Gerenciamento de Linguagens - Integração Completa

## 🎯 Visão Geral

Sistema centralizado de gerenciamento de linguagens com persistência em sessionStorage e sincronização bidirecional entre página de configurações e dropdown do header.

## 🏗️ Arquitetura

### 1. Context Provider (`/contexts/language-settings-context.tsx`)

**Responsabilidades:**
- Gerenciar estado de todas as linguagens do sistema
- Persistir configurações em sessionStorage
- Sincronizar com localStorage para compatibilidade i18n
- Filtrar linguagens habilitadas

**Linguagens Disponíveis:**
```typescript
const SYSTEM_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", enabled: true },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", enabled: true },
  { code: "pt", name: "Português", flag: "🇧🇷", enabled: true },
  { code: "es", name: "Español", flag: "🇪🇸", enabled: false },
  { code: "twi", name: "Twi", flag: "🇬🇭", enabled: false },
  { code: "pap", name: "Papiamento", flag: "🇦🇼", enabled: false },
]
```

**Chaves de Armazenamento:**
- `system-enabled-languages` → sessionStorage (configurações habilitadas)
- `system-preferred-language` → sessionStorage (linguagem preferida)
- `preferred-language` → localStorage (compatibilidade i18n)

**API Disponível:**
```typescript
const {
  availableLanguages,      // Todas as 6 linguagens
  enabledLanguages,        // Apenas linguagens habilitadas
  preferredLanguage,       // Linguagem selecionada
  setPreferredLanguage,    // Atualizar preferência
  toggleLanguageEnabled,   // Habilitar/desabilitar linguagem
  isLanguageEnabled,       // Verificar se está ativa
} = useLanguageSettings()
```

### 2. Language Selector (`/components/language-selector.tsx`)

**Integração:**
- Usa `useLanguageSettings()` para obter dados
- Mostra apenas `enabledLanguages` do contexto
- Exibe bandeira + código no botão
- Sincroniza mudanças com sessionStorage e localStorage

**Funcionalidades:**
- ✅ Dropdown com busca (Command pattern)
- ✅ Ícone de bandeira ao invés de Globe
- ✅ Filtragem por linguagens habilitadas
- ✅ Check icon na linguagem atual
- ✅ Toast com bandeira ao trocar linguagem
- ✅ Sincronização automática

### 3. System Preferences Tab (`/components/settings/system-preferences-tab.tsx`)

**Campos:**
1. **Default Language**: 
   - Dropdown Command com bandeiras
   - Apenas linguagens habilitadas
   - Usa contexto para obter lista

2. **Currency**: 
   - EUR (€), USD ($), GBP (£), CAD (C$)
   - Dropdown Command com símbolos

3. **Mode Preference**: 
   - Light (☀️), Dark (🌙), System (💻)
   - Dropdown Command com emojis
   - Suporta preferência do sistema operacional

**Removido:**
- ❌ Date Format (removido por simplificação)

### 4. Languages Tab (`/components/settings/languages-tab.tsx`)

**Seções:**
1. **Preferred Language**:
   - Dropdown Command com bandeiras
   - Apenas linguagens habilitadas
   - Atualiza contexto diretamente

2. **Available Languages**:
   - Lista com todas as 6 linguagens
   - Toggle switch para habilitar/desabilitar
   - Contador: "X of Y enabled"
   - Bandeira + Nome + Código

**Auto-contido:**
- Sem props necessárias
- Usa contexto diretamente
- Gerencia próprio estado via contexto

### 5. Settings Page (`/app/settings/page.tsx`)

**Simplificado:**
- Removidos estados de linguagem (agora no contexto)
- LanguagesTab não recebe props
- Integração com `useLanguageSettings()`

## 🔄 Fluxo de Sincronização

### Cenário 1: Usuário muda linguagem no header
```
Header Dropdown (language-selector.tsx)
  ↓ onChange
Context.setPreferredLanguage(code)
  ↓ salva
sessionStorage["system-preferred-language"] = code
localStorage["preferred-language"] = code (i18n)
  ↓ atualiza
Settings Page reflete mudança automaticamente
```

### Cenário 2: Usuário desabilita linguagem nas configurações
```
Settings Page > Languages Tab
  ↓ toggle switch
Context.toggleLanguageEnabled(code)
  ↓ salva
sessionStorage["system-enabled-languages"] = [...codes]
  ↓ atualiza
Header Dropdown remove linguagem automaticamente
Settings Page > Preferred Language remove opção
```

### Cenário 3: Usuário muda linguagem preferida nas configurações
```
Settings Page > Languages Tab > Preferred Language
  ↓ onChange
Context.setPreferredLanguage(code)
  ↓ salva
sessionStorage["system-preferred-language"] = code
localStorage["preferred-language"] = code (i18n)
  ↓ atualiza
Header Dropdown reflete mudança automaticamente
Sistema i18n carrega traduções
```

## 📦 Persistência

### SessionStorage (Settings)
```typescript
// Carregado ao montar o contexto
const storedLanguages = sessionStorage.getItem("system-enabled-languages")
const storedPreferred = sessionStorage.getItem("system-preferred-language")

// Salvo automaticamente em cada mudança
useEffect(() => {
  sessionStorage.setItem("system-enabled-languages", JSON.stringify(codes))
  sessionStorage.setItem("system-preferred-language", preferredLanguage)
}, [availableLanguages, preferredLanguage])
```

### LocalStorage (i18n Compatibility)
```typescript
// Sincronizado quando muda preferência
setPreferredLanguage(code) {
  // ... atualiza contexto
  localStorage.setItem("preferred-language", code)
}
```

## 🎨 Padrão Visual

### Bandeiras (Emojis)
- 🇺🇸 English
- 🇳🇱 Nederlands
- 🇧🇷 Português
- 🇪🇸 Español
- 🇬🇭 Twi
- 🇦🇼 Papiamento

### Dropdowns (Command Pattern)
```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <span>{flag}</span>
      <span>{value}</span>
      <ChevronsUpDown />
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandGroup>
        {items.map(item => (
          <CommandItem key={item.value} value={item.value}>
            <Check className={cn(selected ? "opacity-100" : "opacity-0")} />
            <span>{item.flag}</span>
            <span>{item.label}</span>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  </PopoverContent>
</Popover>
```

## ✅ Checklist de Integração

- [x] Context criado com gestão de estado
- [x] SessionStorage implementado
- [x] LocalStorage sync para i18n
- [x] Language selector integrado
- [x] Settings page atualizada
- [x] Bandeiras padronizadas
- [x] Dropdowns padronizados (Command pattern)
- [x] Provider adicionado ao layout
- [x] Date Format removido
- [x] Mode Preference adicionado
- [x] Filtragem de linguagens habilitadas
- [x] Sincronização bidirecional

## 🚀 Como Testar

### Teste 1: Habilitar/Desabilitar Linguagem
1. Acesse Settings > Languages
2. Desabilite "Español" (toggle switch)
3. Vá para o header dropdown
4. ✅ "Español" não deve aparecer na lista

### Teste 2: Mudar Linguagem no Header
1. Clique no dropdown do header
2. Selecione "Nederlands"
3. Acesse Settings > Languages
4. ✅ "Nederlands" deve estar selecionado como preferido

### Teste 3: Persistência
1. Configure linguagem preferida: "English"
2. Habilite apenas: PT, EN, NL
3. Recarregue a página (F5)
4. ✅ Configurações devem persistir

### Teste 4: Mode Preference
1. Settings > System Preferences > Mode Preference
2. Selecione "System" (💻)
3. Mude tema do OS (Dark/Light)
4. ✅ App deve seguir tema do sistema

## 🔧 Manutenção

### Adicionar Nova Linguagem
```typescript
// Em language-settings-context.tsx
const SYSTEM_LANGUAGES: LanguageConfig[] = [
  ...existing,
  { code: "fr", name: "Français", flag: "🇫🇷", enabled: false },
]
```

### Mudar Linguagem Padrão
```typescript
// Em language-settings-context.tsx
const [preferredLanguage, setPreferredLanguageState] = useState(() => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("system-preferred-language") || "pt" // ← Alterar aqui
  }
  return "pt" // ← E aqui
})
```

### Remover Linguagem
1. Remover do array `SYSTEM_LANGUAGES`
2. Verificar se não é usada como default
3. Limpar sessionStorage se necessário

## 📚 Documentação Relacionada

- `/SETTINGS_PAGE_ARCHITECTURE.md` - Arquitetura completa da página
- `/contexts/language-settings-context.tsx` - Código do contexto
- `/components/language-selector.tsx` - Dropdown do header
- `/app/settings/page.tsx` - Página de configurações

## 🎯 Resultado Final

**Antes:**
- ❌ Linguagens não persistentes
- ❌ Configurações não sincronizadas
- ❌ Todas linguagens sempre visíveis
- ❌ Sem identificação visual
- ❌ Dropdowns inconsistentes

**Depois:**
- ✅ Persistência em sessionStorage
- ✅ Sincronização bidirecional completa
- ✅ Filtragem de linguagens habilitadas
- ✅ Bandeiras emoji para identificação
- ✅ Dropdowns padronizados (Command pattern)
- ✅ Mode Preference com suporte a tema do sistema
- ✅ Interface minimalista e responsiva
