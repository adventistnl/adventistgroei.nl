"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
  value: string
  label: string
}

interface ProfileFieldProps {
  label: string
  value: string
  displayValue?: string // Valor a ser exibido quando não está editando
  icon?: LucideIcon
  isEditing: boolean
  onChange?: (value: string) => void
  type?: string
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  mask?: 'phone' // Tipo de máscara a ser aplicada
}

// Função para formatar telefone brasileiro: (DD) XXXXX-XXXX
function formatPhoneMask(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos (2 do DDD + 9 do número)
  const limitedNumbers = numbers.slice(0, 11)
  
  // Aplica a máscara
  if (limitedNumbers.length <= 2) {
    return limitedNumbers
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`
  }
}

// Função para remover máscara e retornar apenas números
function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}

export function ProfileField({
  label,
  value,
  displayValue,
  icon: Icon,
  isEditing,
  onChange,
  type = "text",
  options,
  placeholder,
  disabled = false,
  mask,
}: ProfileFieldProps) {
  // Se tem options, é um select
  const isSelect = options && options.length > 0
  
  // Handler para input com máscara
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    
    if (mask === 'phone') {
      // Aplica máscara de telefone
      const formattedValue = formatPhoneMask(inputValue)
      onChange?.(formattedValue)
    } else {
      onChange?.(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {isEditing && !disabled ? (
        isSelect ? (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder={placeholder || label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={type}
            value={value}
            onChange={handleInputChange}
            className="bg-background border-border"
            placeholder={placeholder}
            maxLength={mask === 'phone' ? 15 : undefined}
          />
        )
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <p className={`text-foreground ${disabled ? 'text-muted-foreground' : ''}`}>
            {displayValue || value || '-'}
          </p>
        </div>
      )}
    </div>
  )
}
