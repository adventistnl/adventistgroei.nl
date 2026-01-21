import * as React from "react"
import { Globe, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useLanguageOptions } from "@/hooks/use-language-preferences"

export interface LanguageSelectorProps {
  /**
   * Valor atual selecionado (code do idioma)
   */
  value?: string
  
  /**
   * Callback quando valor é alterado
   */
  onValueChange: (value: string) => void
  
  /**
   * Placeholder quando nenhum valor está selecionado
   */
  placeholder?: string
  
  /**
   * Label do campo
   */
  label?: string
  
  /**
   * Se o campo é obrigatório (adiciona * ao label)
   */
  required?: boolean
  
  /**
   * Se o componente está desabilitado
   */
  disabled?: boolean
  
  /**
   * Mensagem de erro
   */
  error?: string
  
  /**
   * Variante do seletor: 'combobox' (mais rico) ou 'select' (mais simples)
   */
  variant?: "combobox" | "select"
  
  /**
   * Classes CSS adicionais
   */
  className?: string
}

/**
 * Componente unificado para seleção de linguagens em formulários.
 * Suporta duas variantes: combobox (com busca) e select (simples).
 * Usa o padrão value/label do hook useLanguageOptions().
 */
export function LanguageSelectorInput({
  value,
  onValueChange,
  placeholder = "Select language",
  label,
  required = false,
  disabled = false,
  error,
  variant = "combobox",
  className
}: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const languageOptions = useLanguageOptions()

  const selectedLanguage = languageOptions.find(lang => lang.value === value)

  const renderCombobox = () => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 w-full justify-between text-base",
            !value && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
          disabled={disabled}
        >
          {selectedLanguage ? (
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">{selectedLanguage.value.toUpperCase()}</span>
              <span className="text-sm font-normal">{selectedLanguage.label}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search languages..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languageOptions.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.label}
                  onSelect={() => {
                    onValueChange(language.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === language.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-sm font-medium">{language.value.toUpperCase()}</span>
                  <span>{language.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  const renderSelect = () => (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn(
        "h-12 text-base",
        error && "border-red-500",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            <span className="text-sm font-medium">{language.value.toUpperCase()}</span>
            <span>{language.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <div className="space-y-2">
      {label && (
        <Label className="flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      {variant === "combobox" ? renderCombobox() : renderSelect()}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}