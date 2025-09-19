# ViewContactModal - Modal Reutilizável para Visualizar Contatos

## 📋 Visão Geral

O `ViewContactModal` é um componente modal totalmente reutilizável para visualizar informações de contato de qualquer entidade (regiões, igrejas, departamentos, etc.). Ele segue um design minimalista e é baseado na estrutura ERD do sistema.

## 🎨 Características

- **Design Minimalista**: Interface limpa e focada no conteúdo
- **Totalmente Reutilizável**: Pode ser usado em qualquer página
- **Responsivo**: Adapta-se a diferentes tamanhos de tela (mobile-first)
- **Baseado no ERD**: Estrutura de dados compatível com o banco de dados
- **Ícone Teal**: Usa o ícone `Contact` com cor teal conforme especificado
- **i18n Completo**: Suporte completo para EN/NL/PT com traduções automáticas

## 📦 Estrutura de Dados

```typescript
interface ContactData {
  id: string
  name?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  country?: string | null
  city?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  is_primary?: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}
```

## 🌍 Internacionalização (i18n)

O modal suporta automaticamente 3 idiomas:

- **🇺🇸 English (EN)**: Idioma padrão
- **🇳🇱 Nederlands (NL)**: Holandês
- **🇧🇷 Português (PT)**: Português brasileiro

### Traduções Incluídas

- ✅ Títulos e subtítulos
- ✅ Labels de campos
- ✅ Badges de status
- ✅ Botões e ações
- ✅ Tipos de entidade
- ✅ Formatação de datas (localizada)

### Como Funciona

O modal detecta automaticamente o idioma atual do sistema (`i18n.language`) e aplica as traduções correspondentes. Não é necessário passar props de idioma.

## 🚀 Como Usar

### 1. Importar o Componente

```typescript
import { ViewContactModal, ContactData } from "@/components/modals/contact"
```

### 2. Adicionar Estados

```typescript
const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
const [selectedEntityName, setSelectedEntityName] = useState<string>("")
```

### 3. Criar Função Handler

```typescript
const handleViewContact = (id: string) => {
  const entity = MOCK_DATA.find(item => item.id === id)
  if (entity && entity.contact) {
    // Converter dados para ContactData
    const contactData: ContactData = {
      id: `contact_${entity.id}`,
      name: entity.contact.name || null,
      phone: entity.contact.phone || null,
      mobile: entity.contact.mobile || null,
      email: entity.contact.email || null,
      country: entity.contact.country || null,
      city: entity.contact.city || null,
      address: entity.contact.address || null,
      full_address: entity.contact.full_address || null,
      postal_code: entity.contact.postal_code || null,
      website: entity.contact.website || null,
      notes: entity.contact.notes || null,
      is_primary: true,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by: entity.created_by,
      updated_by: entity.updated_by,
      is_deleted: false
    }
    
    setSelectedContact(contactData)
    setSelectedEntityName(entity.name)
    setIsViewContactModalOpen(true)
  }
}
```

### 4. Adicionar ao JSX

```typescript
<ViewContactModal
  isOpen={isViewContactModalOpen}
  onOpenChange={setIsViewContactModalOpen}
  contact={selectedContact}
  entityName={selectedEntityName}
  entityType="YourEntityType" // ex: "Region", "Church", "Department"
/>
```

## 🎯 Exemplos de Implementação

### Regions Page
```typescript
<ViewContactModal
  isOpen={isViewContactModalOpen}
  onOpenChange={setIsViewContactModalOpen}
  contact={selectedContact}
  entityName={selectedRegion?.name}
  entityType="Region"
/>
```

### Churches Page
```typescript
<ViewContactModal
  isOpen={isViewContactModalOpen}
  onOpenChange={setIsViewContactModalOpen}
  contact={selectedContact}
  entityName={selectedEntityName}
  entityType="Church"
/>
```

### Departments Page
```typescript
<ViewContactModal
  isOpen={isViewContactModalOpen}
  onOpenChange={setIsViewContactModalOpen}
  contact={selectedContact}
  entityName={selectedEntityName}
  entityType="Department"
/>
```

## 🎨 Seções do Modal

### 1. **Contact Details**
- Nome do contato
- Telefone
- Celular
- Email

### 2. **Address Information**
- Endereço completo
- Cidade
- País
- CEP

### 3. **Additional Information**
- Website (com link clicável)
- Notas

### 4. **System Information**
- Data de criação
- Data de atualização
- Criado por
- Atualizado por

## 🏷️ Badges e Status

- **Primary Contact**: Badge verde para contato primário
- **Secondary Contact**: Badge cinza para contato secundário
- **Deleted**: Badge vermelho se o contato foi deletado

## 📱 Responsividade

### Mobile (< 640px)
- **Modal**: 95% da largura da viewport
- **Header**: Ícone menor (8x8), título truncado
- **Cards**: Layout em coluna única
- **Texto**: Tamanhos menores (text-sm)
- **Grid**: 1 coluna para informações de sistema

### Tablet (640px - 1024px)
- **Modal**: Largura máxima 2xl
- **Header**: Ícone médio (10x10)
- **Cards**: Layout otimizado
- **Texto**: Tamanhos médios (text-base)
- **Grid**: 2 colunas para informações de sistema

### Desktop (> 1024px)
- **Modal**: Largura máxima 2xl com padding maior
- **Header**: Ícone grande (10x10)
- **Cards**: Espaçamento otimizado
- **Texto**: Tamanhos grandes (text-lg)
- **Grid**: 2 colunas com espaçamento adequado

### Características Responsivas
- ✅ **Truncate**: Textos longos são cortados com "..."
- ✅ **Break-all**: Emails longos quebram adequadamente
- ✅ **Flex-wrap**: Badges se ajustam em múltiplas linhas
- ✅ **Min-width**: Elementos não ficam muito pequenos
- ✅ **Scroll interno**: Para conteúdo longo

## 🔧 Customização

### Props Opcionais

- `className`: Classes CSS customizadas
- `entityName`: Nome da entidade (opcional)
- `entityType`: Tipo da entidade (opcional)

### Estilos

O modal usa classes Tailwind CSS e pode ser customizado através da prop `className`:

```typescript
<ViewContactModal
  className="max-w-3xl" // Customizar largura máxima
  // ... outras props
/>
```

## ✅ Funcionalidades

- ✅ Visualização completa de dados de contato
- ✅ Links clicáveis para websites
- ✅ Formatação automática de datas
- ✅ Badges de status
- ✅ Design responsivo
- ✅ Acessibilidade (ARIA labels)
- ✅ Fechamento por ESC ou clique fora
- ✅ Scroll interno para conteúdo longo

## 🎯 Casos de Uso

1. **Regions**: Visualizar contato do pastor regional
2. **Churches**: Visualizar contato da igreja
3. **Departments**: Visualizar contato do departamento
4. **Users**: Visualizar informações de contato do usuário
5. **Projects**: Visualizar contato do projeto
6. **Events**: Visualizar contato do evento

## 🔄 Reutilização

Este modal foi projetado para ser usado em **qualquer página** do sistema que precise exibir informações de contato. A estrutura de dados é consistente com o ERD e pode ser facilmente adaptada para diferentes entidades.
