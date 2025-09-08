# Chat Drawer Component

A reusable chat drawer component for direct messaging between users in the system.

## Features

- ✅ **Real-time Chat Interface**: WhatsApp-like chat experience
- ✅ **Message History**: Grouped by date with scroll functionality
- ✅ **Read Status**: Visual indicators for sent/delivered/read messages
- ✅ **File Attachments**: Drag & drop file upload support
- ✅ **Message Templates**: Quick professional message templates
- ✅ **Responsive Design**: Mobile-first with adaptive layout
- ✅ **Internationalization**: Complete EN/NL translation support
- ✅ **Monochromatic Design**: Clean, professional appearance

## Usage

```tsx
import { ChatDrawer } from "@/components/chat"

function UserProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsChatOpen(true)}>
        Send Message
      </Button>
      
      <ChatDrawer
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        currentUser={currentUser}
        targetUser={targetUser}
        messages={existingMessages} // Optional
      />
    </>
  )
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls drawer visibility |
| `onOpenChange` | `(open: boolean) => void` | Callback for drawer state changes |
| `currentUser` | `User` | Currently authenticated user |
| `targetUser` | `User` | User to chat with |
| `messages` | `DirectMessage[]` | Optional existing messages |

## Message Templates

The component includes 4 professional message templates:

1. **Meeting Request** - Schedule meetings
2. **Subsidy Follow-up** - Follow up on subsidy requests
3. **Event Invitation** - Invite to events
4. **Document Request** - Request documents

## File Upload

- **Drag & Drop**: Drop files directly into chat area
- **File Picker**: Click paperclip icon to select files
- **File Types**: PDF, DOC, DOCX, TXT, images
- **Size Limit**: 10MB per file
- **Preview**: Shows file name, size, and remove option

## Message Status

- **Sent** (✓): Message sent successfully
- **Delivered** (✓✓): Message delivered to recipient
- **Read** (✓✓ blue): Message read by recipient

## Responsive Design

- **Mobile**: Full-width drawer, stacked input controls
- **Tablet**: Optimized width with side-by-side controls
- **Desktop**: Fixed max-width with proper spacing

## Internationalization

All text content is fully translated:

```typescript
// English
no_messages_title: "No messages yet"
quick_templates: "Quick message templates"
message_placeholder: "Type your message here..."

// Dutch
no_messages_title: "Nog geen berichten"
quick_templates: "Snelle berichtsjablonen"
message_placeholder: "Typ hier je bericht..."
```

## Data Structure

Based on the ERD structure:

```typescript
interface DirectMessage {
  id: string
  institution_id: string
  sender_id: string
  title: string
  content: string
  status: 'sent' | 'delivered' | 'read'
  sent_at: string
  // ... other fields
}
```

## Keyboard Shortcuts

- **Ctrl+Enter**: Send message
- **Escape**: Close drawer

## Example Implementation

```tsx
// In a user management page
<DropdownMenuItem onClick={() => setIsChatOpen(true)}>
  <Send className="w-4 h-4 mr-2" />
  Send Message
</DropdownMenuItem>

// In a user list
<Button onClick={() => openChatWith(user)}>
  <MessageCircle className="w-4 h-4 mr-2" />
  Chat
</Button>
```

## Styling

- **Monochromatic**: Neutral colors with minimal accent colors
- **Consistent**: Uses shadcn/ui components throughout
- **Professional**: Clean, business-appropriate design
- **Accessible**: Proper contrast and keyboard navigation
