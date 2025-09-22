"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageCircle, 
  Search, 
  Users, 
  X,
  Send
} from "lucide-react"
import { mockUsers } from "@/data/mockData"
import { ChatDrawer } from "./chat-drawer"

interface User {
  id: string
  name: string
  email: string
  role: string
  is_deleted: boolean
  institution_id: string
}

interface ChatUsersSelectorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentUser: User
}

export function ChatUsersSelector({
  isOpen,
  onOpenChange,
  currentUser
}: ChatUsersSelectorProps) {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => 
    user.id !== currentUser.id && // Exclude current user
    !user.is_deleted && // Only active users
    (user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
     user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
     user.role.toLowerCase().includes(searchValue.toLowerCase()))
  )

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setIsChatOpen(true)
    onOpenChange(false) // Close user selector
  }

  const handleCloseChatAndReopenSelector = () => {
    setIsChatOpen(false)
    setSelectedUser(null)
    onOpenChange(true) // Reopen user selector
  }

  return (
    <>
      {/* User Selector Sheet */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Start Conversation
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a user to start chatting
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                className="pl-10 h-10 border-2"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Users List */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground text-sm">
                    {searchValue ? "Try adjusting your search" : "No users available for chat"}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    onClick={() => handleUserSelect(user)}
                    className="w-full h-auto p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                        <Send className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Chat Drawer */}
      {selectedUser && (
        <ChatDrawer
          isOpen={isChatOpen}
          onOpenChange={(open) => {
            setIsChatOpen(open)
            if (!open) {
              setSelectedUser(null)
            }
          }}
          currentUser={currentUser}
          targetUser={selectedUser}
        />
      )}
    </>
  )
}
