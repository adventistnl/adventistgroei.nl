# LanguageSelectorInput - Guia de Uso

## Componente Unificado para Seleção de Idiomas

O `LanguageSelectorInput` é um componente React unificado que padroniza a seleção de idiomas em todo o projeto.

## Importação

```typescript
import { LanguageSelectorInput } from "@/components/shared/language-selector-input"
```

## Exemplos de Uso

### 1. Uso Básico - Variante Select (Simples)

```tsx
function MyForm() {
  const [language, setLanguage] = useState("")

  return (
    <LanguageSelectorInput
      value={language}
      onValueChange={setLanguage}
      label="Idioma"
      placeholder="Selecione um idioma"
      variant="select"
      required
    />
  )
}
```

### 2. Uso Avançado - Variante Combobox (Com Busca)

```tsx
function AdvancedForm() {
  const [formData, setFormData] = useState({
    language_preference: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageChange = (value: string) => {
    setFormData(prev => ({ ...prev, language_preference: value }))
    // Limpar erro quando usuário seleciona
    if (errors.language_preference) {
      setErrors(prev => ({ ...prev, language_preference: "" }))
    }
  }

  return (
    <LanguageSelectorInput
      value={formData.language_preference}
      onValueChange={handleLanguageChange}
      label="Preferência de Idioma"
      placeholder="Buscar idiomas..."
      variant="combobox"
      disabled={isLoading}
      error={errors.language_preference}
      required
    />
  )
}
```

### 3. Em Formulários de Modal

```tsx
// Em modais como edit-institution-modal.tsx
<LanguageSelectorInput
  value={formData.language_preference || ''}
  onValueChange={(value: string) => handleInputChange('language_preference', value)}
  label={t_institution.languagePreference}
  placeholder={t_institution.languagePreferencePlaceholder}
  variant="select"
  disabled={isLoading}
  error={errors.language_preference}
  required
/>
```

### 4. Com Integração de Hook de Dados

```tsx
function UserEditForm() {
  const [userForm, setUserForm] = useState({
    language_preference: ""
  })

  const handleInputChange = (field: string, value: any) => {
    setUserForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <LanguageSelectorInput
      value={userForm.language_preference || ''}
      onValueChange={(value: string) => handleInputChange('language_preference', value)}
      label="Language Preference"
      placeholder="Select language"
      variant="combobox"
      error={errors.language_preference}
      required
    />
  )
}
```

## Props Disponíveis

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `value` | `string` | `undefined` | Código do idioma atualmente selecionado |
| `onValueChange` | `(value: string) => void` | **obrigatório** | Callback executado quando idioma é selecionado |
| `label` | `string` | `undefined` | Label exibido acima do seletor (com ícone Globe) |
| `placeholder` | `string` | `"Select language"` | Texto exibido quando nenhum idioma está selecionado |
| `required` | `boolean` | `false` | Adiciona asterisco (*) ao label |
| `disabled` | `boolean` | `false` | Desabilita o seletor |
| `error` | `string` | `undefined` | Mensagem de erro exibida abaixo do seletor |
| `variant` | `"combobox" \| "select"` | `"combobox"` | Tipo de interface do seletor |
| `className` | `string` | `undefined` | Classes CSS adicionais |

## Variantes

### Combobox (Padrão)
- Interface rica com busca
- Ideal para formulários principais
- Suporta filtragem por texto
- Melhor UX para muitas opções

```tsx
<LanguageSelectorInput variant="combobox" />
```

### Select
- Interface simples e limpa
- Ideal para configurações básicas
- Menor overhead visual
- Melhor para espaços limitados

```tsx
<LanguageSelectorInput variant="select" />
```

## Estados

### Estado Normal
```tsx
<LanguageSelectorInput
  value="en"
  onValueChange={setLanguage}
  label="Language"
/>
```

### Estado de Erro
```tsx
<LanguageSelectorInput
  value=""
  onValueChange={setLanguage}
  label="Language"
  error="Language is required"
  required
/>
```

### Estado Desabilitado
```tsx
<LanguageSelectorInput
  value="en"
  onValueChange={setLanguage}
  label="Language"
  disabled
/>
```

## Idiomas Suportados

O componente suporta automaticamente os seguintes idiomas através do hook `useLanguageOptions()`:

| Código | Nome | Bandeira |
|--------|------|----------|
| `en` | English | 🇬🇧 |
| `nl` | Nederlands | 🇳🇱 |
| `pt` | Português | 🇵🇹 |
| `es` | Español | 🇪🇸 |
| `fr` | Français | 🇫🇷 |
| `de` | Deutsch | 🇩🇪 |

## Validação e Tratamento de Erros

```tsx
function ValidatedForm() {
  const [language, setLanguage] = useState("")
  const [errors, setErrors] = useState({})

  const validateLanguage = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, language: "Language is required" }))
      return false
    }
    setErrors(prev => ({ ...prev, language: "" }))
    return true
  }

  const handleSubmit = () => {
    if (validateLanguage(language)) {
      // Prosseguir com submissão
    }
  }

  return (
    <LanguageSelectorInput
      value={language}
      onValueChange={(value) => {
        setLanguage(value)
        validateLanguage(value) // Validar em tempo real
      }}
      label="Preferred Language"
      error={errors.language}
      required
    />
  )
}
```

## Integração com Formulários

### React Hook Form
```tsx
function HookFormExample() {
  const { control, formState: { errors } } = useForm()

  return (
    <Controller
      name="language"
      control={control}
      rules={{ required: "Language is required" }}
      render={({ field }) => (
        <LanguageSelectorInput
          value={field.value || ''}
          onValueChange={field.onChange}
          label="Language Preference"
          error={errors.language?.message}
          required
        />
      )}
    />
  )
}
```

## Customização Visual

### Classes CSS Personalizadas
```tsx
<LanguageSelectorInput
  value={language}
  onValueChange={setLanguage}
  label="Language"
  className="my-custom-selector"
/>
```

### Estilos Específicos para Estados
```tsx
<LanguageSelectorInput
  value={language}
  onValueChange={setLanguage}
  label="Language"
  error={hasError ? "Invalid selection" : undefined}
  // Bordas vermelhas são aplicadas automaticamente quando há erro
/>
```

## Boas Práticas

### ✅ Faça
- Use `variant="combobox"` para formulários principais
- Use `variant="select"` para configurações simples
- Sempre forneça `label` descritivo
- Use `required` quando apropriado
- Implemente validação adequada

### ❌ Evite
- Não reimplemente seletores de idioma manualmente
- Não ignore mensagens de erro
- Não use placeholder muito genérico
- Não esqueça de tratar estado loading quando necessário

## Troubleshooting

### Problema: Componente não renderiza opções
**Solução:** Verifique se o hook `useLanguageOptions()` está funcionando

### Problema: Valores não são atualizados
**Solução:** Certifique-se de que `onValueChange` está atualizando o estado corretamente

### Problema: Erro de TypeScript
**Solução:** Verifique se está passando `string` para `onValueChange`

## Migração de Seletores Antigos

Para migrar seletores existentes:

1. **Remova** o código do seletor manual
2. **Importe** o `LanguageSelectorInput`
3. **Substitua** pelo novo componente
4. **Ajuste** os nomes das props se necessário
5. **Teste** a funcionalidade

### Exemplo de Migração

**Antes:**
```tsx
<Select value={language} onValueChange={setLanguage}>
  <SelectTrigger>
    <SelectValue placeholder="Select language" />
  </SelectTrigger>
  <SelectContent>
    {languages.map(lang => (
      <SelectItem key={lang.code} value={lang.code}>
        {lang.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Depois:**
```tsx
<LanguageSelectorInput
  value={language}
  onValueChange={setLanguage}
  placeholder="Select language"
  variant="select"
/>
```