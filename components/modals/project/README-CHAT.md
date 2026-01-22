# SubsidyChatPanel - Componente de Chat Isolado

## 📋 Visão Geral

Componente separado e reutilizável que gerencia o painel de chat/histórico do modal de subsídios. Facilita a manutenção focada apenas na funcionalidade do chat sem afetar o resto do modal.

## 🎯 Localização

```
components/modals/project/subsidy-chat-panel.tsx
```

## 📦 Props

### Essenciais
- `isSidebarOpen: boolean` - Controla visibilidade do painel
- `t: (key: string, params?: any) => string` - Função de tradução i18n
- `user: { id: string; name?: string } | null` - Usuário autenticado

### Mensagens
- `filteredMessages: StatusHistoryItem[]` - Lista de mensagens do histórico
- `newMessagesCount: number` - Contador de mensagens novas
- `messagesEndRef: React.RefObject<HTMLDivElement | null>` - Ref para scroll automático

### Atividades
- `activities: ActivityItem[]` - Lista de atividades do subsídio
- `chatFilterActivity: string | null` - Filtro ativo de atividade
- `setChatFilterActivity: (id: string | null) => void` - Setter do filtro

### Menções/Status
- `mentionStatus: "pending" | "in_review" | "approved" | "rejected" | "closed" | null`
- `setMentionStatus: React.Dispatch<...>` - Setter de status mencionado
- `mentionPriority: "low" | "medium" | "high" | null`
- `setMentionPriority: React.Dispatch<...>` - Setter de prioridade mencionada

### Edição/Comentários
- `editingMessage: string | null` - ID da mensagem sendo editada
- `setEditingMessage: React.Dispatch<...>` - Setter de mensagem em edição
- `commentingDocument: { id: string; name: string } | null` - Documento sendo comentado
- `setCommentingDocument: (doc) => void` - Setter de documento em comentário
- `mentionMode: string | null` - Modo de menção/rejeição ativo
- `setMentionMode: (mode: string | null) => void` - Setter do modo de menção

### Input
- `newMessage: string` - Texto da nova mensagem
- `setNewMessage: (message: string) => void` - Setter do texto
- `chatInputRef: React.RefObject<HTMLInputElement | null>` - Ref do input

### Configurações
- `currentSubsidyStatus: string` - Status atual do subsídio
- `currentPriority: string` - Prioridade atual
- `statusConfig: any` - Configuração de status (labels, cores, ícones)

### Handlers
- `handleSendMessage: () => void` - Função para enviar mensagem

## 🔧 Uso

```tsx
import { SubsidyChatPanel } from "@/components/modals/project/subsidy-chat-panel"

<SubsidyChatPanel
  isSidebarOpen={isSidebarOpen}
  t={t}
  newMessagesCount={newMessagesCount}
  filteredMessages={filteredMessages}
  activities={activities}
  chatFilterActivity={chatFilterActivity}
  setChatFilterActivity={setChatFilterActivity}
  messagesEndRef={messagesEndRef}
  mentionStatus={mentionStatus}
  setMentionStatus={setMentionStatus}
  mentionPriority={mentionPriority}
  setMentionPriority={setMentionPriority}
  editingMessage={editingMessage}
  setEditingMessage={setEditingMessage}
  commentingDocument={commentingDocument}
  setCommentingDocument={setCommentingDocument}
  mentionMode={mentionMode}
  setMentionMode={setMentionMode}
  newMessage={newMessage}
  setNewMessage={setNewMessage}
  chatInputRef={chatInputRef}
  currentSubsidyStatus={currentSubsidyStatus}
  currentPriority={currentPriority}
  statusConfig={statusConfig}
  user={user}
  handleSendMessage={handleSendMessage}
/>
```

## ✨ Funcionalidades

### 1. **Visualização de Mensagens**
- Mensagens com ícones por tipo (validação, rejeição, comentário, mudança de status)
- Alinhamento automático: usuário à direita, outros à esquerda
- Badges de status e mensagens novas
- Divisores de atividades

### 2. **Menções e Contexto**
- Menção de status atual
- Menção de prioridade atual
- Labels visuais coloridos

### 3. **Banners de Contexto**
- Edição de comentário (amarelo)
- Comentário em documento (azul)
- Rejeição de documento (vermelho)

### 4. **Input Unificado**
- Placeholder dinâmico baseado no contexto
- Desabilitado quando subsídio está fechado
- Bordas coloridas por tipo de ação
- Botão de envio com validação

## 🎨 Estilo e Design

- **Dark Mode**: Suporte completo com cores adaptativas
- **Responsivo**: Layout flexível com largura fixa de 96 (w-96)
- **Transições**: Animações suaves de abertura/fechamento
- **Cores por Tipo**:
  - ✅ Aprovado: Verde
  - ❌ Rejeitado: Vermelho
  - 📝 Em revisão: Azul
  - ⏳ Pendente: Âmbar

## 🔄 Integração com ViewSubsidyModal

O componente foi extraído do `view-subsidy-modal.tsx` (linhas 1458-1851) e agora é importado e usado diretamente, reduzindo a complexidade do modal principal de ~1900 para ~1600 linhas.

## 🛠️ Manutenção

Para modificar apenas o chat:
1. Abra `subsidy-chat-panel.tsx`
2. Faça as alterações necessárias
3. TypeScript garantirá que as props estejam corretas
4. Teste apenas o componente de chat isoladamente

## ⚠️ Observações

- O componente usa `user?.id === item.user_id` para validação de propriedade de mensagens
- Status e prioridades são tipados estaticamente para segurança
- Refs com `| null` para compatibilidade com useRef do React
- `statusConfig` usa `any` para flexibilidade com diferentes estruturas de configuração
