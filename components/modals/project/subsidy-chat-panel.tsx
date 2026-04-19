"use client"

import * as React from "react"
import { 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  AtSign, 
  X, 
  Send, 
  Pencil, 
  Ban,
  UploadCloud
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

interface StatusHistoryItem {
  id: string
  status: "pending" | "in_review" | "approved" | "rejected"
  reason: string
  changed_by: string
  user_id: string
  changed_at: Date
  isNew: boolean
  type?: "STATUS_CHANGE" | "PRIORITY_CHANGE" | "COMMENT" | "DOCUMENT_ACTION"
}

interface ActivityItem {
  id: string
  name: string
  documents: Array<{ id: string; file_name: string }>
}

interface StatusConfig {
  [key: string]: {
    label: string
    icon?: React.ElementType
    className?: string
    color?: string
    bgColor?: string
  }
}

interface SubsidyChatPanelProps {
  // Visibilidade
  isSidebarOpen: boolean
  isMobileChatOpen: boolean
  onMobileChatClose: () => void
  
  // Tradução
  t: (key: string, params?: any) => string
  
  // Contadores
  newMessagesCount: number
  
  // Mensagens
  filteredMessages: StatusHistoryItem[]
  
  // Atividades
  activities: ActivityItem[]
  
  // Filtros
  chatFilterActivity: string | null
  setChatFilterActivity: (id: string | null) => void
  
  // Referências
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  
  // Menções
  mentionStatus: "pending" | "in_review" | "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_refund" | null
  setMentionStatus: React.Dispatch<React.SetStateAction<"pending" | "in_review" | "approved" | "rejected" | "closed" | "advanced_closed" | "waiting_refund" | null>>
  mentionPriority: "low" | "medium" | "high" | null
  setMentionPriority: React.Dispatch<React.SetStateAction<"low" | "medium" | "high" | null>>
  
  // Edição
  editingMessage: string | null
  setEditingMessage: React.Dispatch<React.SetStateAction<string | null>>
  
  // Comentários em documentos
  commentingDocument: { id: string; name: string } | null
  setCommentingDocument: (doc: { id: string; name: string } | null) => void
  
  // Modo de rejeição
  mentionMode: string | null
  setMentionMode: (mode: string | null) => void
  
  // Input de mensagem
  newMessage: string
  setNewMessage: (message: string) => void
  chatInputRef: React.RefObject<HTMLInputElement | null>
  
  // Status atual
  currentSubsidyStatus: string
  currentPriority: string
  
  // Configurações
  statusConfig: any
  
  // Usuário autenticado
  user: { id: string; name?: string } | null
  
  // Handlers
  handleSendMessage: () => void
}

export function SubsidyChatPanel({
  isSidebarOpen,
  isMobileChatOpen,
  onMobileChatClose,
  t,
  newMessagesCount,
  filteredMessages,
  activities,
  chatFilterActivity,
  setChatFilterActivity,
  messagesEndRef,
  mentionStatus,
  setMentionStatus,
  mentionPriority,
  setMentionPriority,
  editingMessage,
  setEditingMessage,
  commentingDocument,
  setCommentingDocument,
  mentionMode,
  setMentionMode,
  newMessage,
  setNewMessage,
  chatInputRef,
  currentSubsidyStatus,
  currentPriority,
  statusConfig,
  user,
  handleSendMessage
}: SubsidyChatPanelProps) {
  // Inner content shared between desktop panel and mobile sheet
  const chatInnerContent = (
    <div className="flex flex-col h-full w-full min-h-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t('subsidy.history')}
            </h3>
            {newMessagesCount > 0 && (
              <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center text-[10px] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                {newMessagesCount}
              </Badge>
            )}
          </div>
          {/* Close button – visible only in mobile sheet */}
          {isMobileChatOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={onMobileChatClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filteredMessages.map((item, index) => {
              // Check if this message is related to an activity
              const relatedActivity = activities.find(act => 
                item.reason.toLowerCase().includes(act.name.toLowerCase())
              )
              const showActivityDivider = relatedActivity && (
                index === 0 || 
                !filteredMessages[index - 1]?.reason.toLowerCase().includes(relatedActivity.name.toLowerCase())
              )

              // Determinar tipo de mensagem e ícone — para DOCUMENT_ACTION, usar o campo `reason`
              // pois `item.status` reflete o status do SUBSÍDIO, não do documento.
              const reasonLower = item.reason?.toLowerCase() || ''
              const isDocumentRejection = item.type === 'DOCUMENT_ACTION' && (
                reasonLower.includes('rejected') ||
                reasonLower.includes('rejeitado') ||
                reasonLower.includes('afgewezen')
              )
              const isDocumentValidation = item.type === 'DOCUMENT_ACTION' && !isDocumentRejection && (
                reasonLower.includes('validated') ||
                reasonLower.includes('approved') ||
                reasonLower.includes('validado') ||
                reasonLower.includes('goedgekeurd')
              )
              const isDocumentUpload = item.type === 'DOCUMENT_ACTION' && !isDocumentRejection && !isDocumentValidation
              const isDocumentComment = item.type === 'COMMENT'
              const isStatusChange = item.type === 'STATUS_CHANGE' || item.type === 'PRIORITY_CHANGE' || (!item.type)
              
              let MessageIcon = MessageCircle
              let iconColor = "text-gray-500 dark:text-gray-400"
              
              if (isDocumentValidation) {
                MessageIcon = CheckCircle2
                iconColor = "text-gray-600 dark:text-gray-400"
              } else if (isDocumentUpload) {
                MessageIcon = UploadCloud
                iconColor = "text-gray-600 dark:text-gray-400"
              } else if (isDocumentRejection) {
                MessageIcon = XCircle
                iconColor = "text-gray-600 dark:text-gray-400"
              } else if (isDocumentComment) {
                MessageIcon = FileText
                iconColor = "text-gray-600 dark:text-gray-400"
              } else if (isStatusChange) {
                MessageIcon = AlertCircle
                iconColor = "text-gray-600 dark:text-gray-400"
              }
              
              // Check if message can be edited (user's own messages)
              const canEdit = user?.id === item.user_id

              return (
                <React.Fragment key={item.id}>
                  {/* Activity Divider */}
                  {showActivityDivider && relatedActivity && !chatFilterActivity && (
                    <div className="flex items-center gap-3 py-4">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-gray-300 dark:to-gray-600" />
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                        <FileText className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {relatedActivity.name}
                        </span>
                      </div>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-600 via-gray-300 dark:via-gray-600 to-transparent" />
                    </div>
                  )}
                  
                  <div className="group relative">
                    <div className={cn(
                      "flex gap-3",
                      canEdit && "flex-row-reverse"
                    )}>
                      <div className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                        <MessageIcon className={cn("w-3.5 h-3.5", iconColor)} />
                      </div>
                      
                      <div className={cn(
                        "flex-1 min-w-0 pb-3 max-w-[75%]",
                        canEdit && "flex flex-col items-end"
                      )}>
                        <div className={cn(
                          "rounded-lg p-3 mb-2",
                          canEdit 
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900" 
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-[10px] font-medium",
                              canEdit 
                                ? "text-gray-300 dark:text-gray-600" 
                                : "text-gray-600 dark:text-gray-400"
                            )}>
                              {isDocumentUpload && t('subsidy.documentUploaded')}
                              {isDocumentValidation && t('subsidy.documentApproved')}
                              {isDocumentRejection && t('subsidy.documentRejected')}
                              {isDocumentComment && t('subsidy.documentComment')}
                              {isStatusChange && t('subsidy.statusUpdate')}
                            </span>
                            {item.isNew && (
                              <Badge variant="default" className="text-[9px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-1.5 py-0">
                                {t('subsidy.newBadge')}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={cn(
                            "text-xs mb-0 leading-relaxed break-words overflow-wrap-anywhere",
                            canEdit 
                              ? "text-white dark:text-gray-900" 
                              : "text-gray-700 dark:text-gray-300"
                          )}>
                            {item.reason}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                          <User className="w-3 h-3" />
                          <span>{item.changed_by}</span>
                          <span>•</span>
                          <span>{format(item.changed_at, "dd/MM HH:mm", { locale: ptBR })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Mention Labels */}
            {(mentionStatus || mentionPriority) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {mentionStatus && (
                  <div className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs font-medium",
                    mentionStatus === 'approved' && "bg-green-50 dark:bg-green-950/30 border-green-400 text-green-700 dark:text-green-400",
                    mentionStatus === 'rejected' && "bg-red-50 dark:bg-red-950/30 border-red-400 text-red-700 dark:text-red-400",
                    mentionStatus === 'in_review' && "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-400",
                    mentionStatus === 'pending' && "bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-700 dark:text-amber-400"
                  )}>
                    <AtSign className="w-3 h-3" />
                    <span>Status: {statusConfig[mentionStatus]?.label}</span>
                    <button onClick={() => setMentionStatus(null)} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {mentionPriority && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100">
                    <AtSign className="w-3 h-3" />
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      mentionPriority === 'high' && "bg-red-500",
                      mentionPriority === 'medium' && "bg-yellow-500",
                      mentionPriority === 'low' && "bg-green-500"
                    )} />
                    <span>{t('filters.priority')}: {mentionPriority === 'high' ? t('subsidy.priority.high') : mentionPriority === 'medium' ? t('subsidy.priority.medium') : t('subsidy.priority.low')}</span>
                    <button onClick={() => setMentionPriority(null)} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Context Banners */}
            {editingMessage && (
              <div className="mb-3 p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Pencil className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-200 truncate">
                      {t('subsidy.editingComment')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingMessage(null)
                      setNewMessage("")
                    }}
                    className="h-5 w-5 p-0 text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {commentingDocument && (
              <div className="mb-3 p-2.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-200 truncate">
                      {t('subsidy.commentOn')}{commentingDocument.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCommentingDocument(null)
                      setNewMessage("")
                    }}
                    className="h-5 w-5 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {mentionMode && (
              <div className="mb-3 p-2.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Ban className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-red-900 dark:text-red-200 truncate">
                      {t('subsidy.rejectingDocument')}: {activities.flatMap(a => a.documents).find(d => d.id === mentionMode)?.file_name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMentionMode(null)
                      setNewMessage("")
                    }}
                    className="h-5 w-5 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Single Unified Input */}
            <div className="flex gap-2 items-center">
              {/* Mention Buttons */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={currentSubsidyStatus === 'closed'}>
                  <Button variant="outline" size="sm" className="h-9 px-2">
                    <AtSign className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="z-[100]">
                  <DropdownMenuLabel>{t('subsidy.mention')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setMentionStatus(currentSubsidyStatus as any)}>
                    {t('subsidy.currentStatus')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMentionPriority(currentPriority as any)}>
                    {t('subsidy.currentPriority')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                ref={chatInputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  editingMessage
                    ? t('subsidy.placeholders.editComment')
                    : commentingDocument 
                    ? t('subsidy.placeholders.documentComment')
                    : mentionMode 
                    ? t('subsidy.placeholders.rejectReason')
                    : t('subsidy.placeholders.addComment')
                }
                disabled={currentSubsidyStatus === 'closed'}
                className={cn(
                  "flex-1 h-9 text-xs transition-all",
                  editingMessage && "border-amber-500 dark:border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900",
                  commentingDocument && "border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900",
                  mentionMode && "border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900",
                  !editingMessage && !commentingDocument && !mentionMode && "border-gray-300 dark:border-gray-700"
                )}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || currentSubsidyStatus === 'closed'}
                size="sm"
                className="h-9 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop side panel (lg+) ──────────────────────────────────── */}
      <div className={cn(
        "hidden lg:flex flex-col border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 transition-all duration-300 overflow-hidden",
        isSidebarOpen ? "w-80 xl:w-96 min-w-[280px]" : "w-0 border-l-0"
      )}>
        {isSidebarOpen && chatInnerContent}
      </div>

      {/* ── Mobile bottom sheet (< lg) ────────────────────────────────── */}
      {isMobileChatOpen && (
        <div className="lg:hidden fixed inset-0 z-[150] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileChatClose}
          />
          {/* Sheet */}
          <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl h-[80dvh] flex flex-col shadow-2xl border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            {chatInnerContent}
          </div>
        </div>
      )}
    </>
  )
}
