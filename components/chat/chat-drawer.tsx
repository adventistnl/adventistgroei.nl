"use client"

import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  MessageCircle,
  Paperclip,
  X,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Download,
  Calendar,
  DollarSign,
  FileIcon
} from "lucide-react"
import toast from "react-hot-toast"
import { User } from "@/data/usersData"

export interface DirectMessage {
  id: string
  institution_id: string
  sender_id: string
  title: string
  content: string
  status: 'sent' | 'delivered' | 'read'
  sent_at: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string
  deleted_by?: string
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface ChatDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentUser: User
  targetUser: User
  messages?: DirectMessage[]
}

const MESSAGE_TEMPLATES = [
  {
    id: 'meeting_request',
    title: 'Meeting Request',
    content: 'Hi! I would like to schedule a meeting to discuss important matters. Please let me know your availability.'
  },
  {
    id: 'subsidy_follow_up',
    title: 'Subsidy Follow-up',
    content: 'Hello! I wanted to follow up on the recent subsidy request. Could you provide an update on the status?'
  },
  {
    id: 'event_invitation',
    title: 'Event Invitation',
    content: 'Greetings! We have an upcoming event that might interest you. Would you like to participate?'
  },
  {
    id: 'document_request',
    title: 'Document Request',
    content: 'Hi! Could you please share the requested documents when you have a moment? Thank you!'
  }
]

export function ChatDrawer({
  isOpen,
  onOpenChange,
  currentUser,
  targetUser,
  messages = []
}: ChatDrawerProps) {
  const { t } = useTranslation()
  const [messageContent, setMessageContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [attachments, setAttachments] = useState<MessageAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mock messages for demonstration
  const mockMessages: DirectMessage[] = [
    {
      id: 'msg1',
      institution_id: currentUser.institution_id,
      sender_id: currentUser.id,
      title: 'Welcome Message',
      content: 'Hello! Welcome to our system. If you have any questions, feel free to reach out.',
      status: 'read',
      sent_at: '2024-01-15T10:30:00Z',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      created_by: currentUser.id,
      updated_by: currentUser.id,
      is_deleted: false
    },
    {
      id: 'msg2',
      institution_id: currentUser.institution_id,
      sender_id: targetUser.id,
      title: 'Thank you',
      content: 'Thank you for the warm welcome! I appreciate your help and look forward to working together.',
      status: 'read',
      sent_at: '2024-01-15T14:20:00Z',
      created_at: '2024-01-15T14:20:00Z',
      updated_at: '2024-01-15T14:20:00Z',
      created_by: targetUser.id,
      updated_by: targetUser.id,
      is_deleted: false
    }
  ]

  const allMessages = [...mockMessages, ...messages].sort((a, b) => 
    new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
  )

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [allMessages, isOpen])

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error(t('chat.errors.empty_message'))
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t('chat.sending_message'))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success(t('chat.message_sent'), { icon: "📨" })
      setMessageContent('')
      setAttachments([])
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('chat.send_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateClick = (template: typeof MESSAGE_TEMPLATES[0]) => {
    setMessageContent(template.content)
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        return
      }

      const newAttachment: MessageAttachment = {
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }

      setAttachments(prev => [...prev, newAttachment])
      toast.success(`File ${file.name} attached successfully`)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const groupMessagesByDate = (messages: DirectMessage[]) => {
    const groups: { [key: string]: DirectMessage[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.sent_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return Object.entries(groups).map(([date, msgs]) => ({
      date: new Date(date),
      messages: msgs
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="w-3 h-3 text-muted-foreground" />
      case 'delivered': return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />
      default: return <Clock className="w-3 h-3 text-muted-foreground" />
    }
  }

  const messageGroups = groupMessagesByDate(allMessages)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {targetUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-left truncate">{targetUser.name}</SheetTitle>
              <SheetDescription className="text-left truncate">{targetUser.email}</SheetDescription>
            </div>
            <Badge variant="outline" className={targetUser.is_deleted ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}>
              {targetUser.is_deleted ? 'Offline' : 'Online'}
            </Badge>
          </div>
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {allMessages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <MessageCircle className="w-16 h-16 text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-muted-foreground">
                    {t('chat.no_messages_title')}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {t('chat.no_messages_description', { name: targetUser.name })}
                  </p>
                </div>
                
                {/* Message Templates */}
                <div className="space-y-3 mt-6 w-full max-w-sm">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('chat.quick_templates')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MESSAGE_TEMPLATES.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateClick(template)}
                        className="text-xs h-8"
                      >
                        {template.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Message History */
              <div className="space-y-6">
                {messageGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-4">
                    {/* Date Separator */}
                    <div className="flex items-center gap-3">
                      <Separator className="flex-1" />
                      <Badge variant="outline" className="text-xs">
                        {group.date.toLocaleDateString()}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    
                    {/* Messages for this date */}
                    <div className="space-y-3">
                      {group.messages.map((message) => {
                        const isFromCurrentUser = message.sender_id === currentUser.id
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${isFromCurrentUser ? 'order-2' : 'order-1'}`}>
                              <Card className={`${
                                isFromCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                <CardContent className="p-3">
                                  {message.title && (
                                    <p className="font-medium text-sm mb-1">{message.title}</p>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  
                                  {/* Message attachments */}
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                      {message.attachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-background/10 rounded">
                                          <FileIcon className="w-4 h-4" />
                                          <span className="text-xs flex-1 truncate">{attachment.name}</span>
                                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                            <Download className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <div className={`flex items-center gap-2 mt-2 text-xs ${
                                    isFromCurrentUser ? 'justify-end' : 'justify-start'
                                  }`}>
                                    <span className="opacity-70">
                                      {new Date(message.sent_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    {isFromCurrentUser && getStatusIcon(message.status)}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* File Upload Drop Zone */}
          {isDragOver && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Paperclip className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-primary">Drop files to attach</p>
              </div>
            </div>
          )}

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="p-4 border-t bg-muted/30">
              <div className="space-y-2">
                <p className="text-sm font-medium">Attachments ({attachments.length})</p>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-background rounded">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm flex-1 truncate">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAttachment(attachment.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div 
            className="p-4 border-t bg-background"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-3">
              {/* Quick Templates (only show if no messages) */}
              {allMessages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {MESSAGE_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateClick(template)}
                      className="text-xs h-7"
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder={t('chat.message_placeholder')}
                    rows={3}
                    className="resize-none"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="h-10 w-10 p-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={isLoading || !messageContent.trim()}
                    className="h-10 w-10 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {t('chat.send_hint')}
              </p>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        />
      </SheetContent>
    </Sheet>
  )
}
