/**
 * Chat — i18n translations
 *
 * Covers all static text in:
 *  - components/chat/chat-sidebar.tsx
 *  - components/chat/chat-project-list.tsx
 *  - components/chat/chat-project-room.tsx
 *
 * Usage:
 *   import { chatTranslations } from "@/lib/translations/chat"
 *   const tC = chatTranslations[i18n.language] ?? chatTranslations.en
 */

export type ChatI18n = {
  /** Sidebar (drawer header) */
  sidebar: {
    title: string
    subtitle: string
    back: string
  }
  /** Project list */
  list: {
    searchPlaceholder: string
    projectsAvailable: (n: number) => string
    newMessages: (n: number) => string
    noResults: string
    noProjects: string
    roles: {
      owner: string
      coOwner: string
      collaborator: string
    }
  }
  /** Chat room */
  room: {
    participants: (n: number) => string
    you: string
    mentionHint: string
    mentionHintAt: string
    mentionHintStatus: string
    sendAriaLabel: string
    noMessages: string
  }
}

// ─── English ─────────────────────────────────────────────────────────────────

const en: ChatI18n = {
  sidebar: {
    title: "Project Chats",
    subtitle: "Messages from your collaborative projects",
    back: "Back to projects",
  },
  list: {
    searchPlaceholder: "Search project...",
    projectsAvailable: (n) => `${n} project${n !== 1 ? "s" : ""} available`,
    newMessages: (n) => `· ${n} new${n !== 1 ? "" : ""}`,
    noResults: "No projects found",
    noProjects: "You are not part of any project yet",
    roles: {
      owner: "Owner",
      coOwner: "Co-owner",
      collaborator: "Collaborator",
    },
  },
  room: {
    participants: (n) => `${n} participant${n !== 1 ? "s" : ""}`,
    you: "You",
    mentionHint: "Use",
    mentionHintAt: "@name",
    mentionHintStatus: "@status:",
    sendAriaLabel: "Send message",
    noMessages: "No messages yet",
  },
}

// ─── Portuguese ───────────────────────────────────────────────────────────────

const pt: ChatI18n = {
  sidebar: {
    title: "Chats dos Projetos",
    subtitle: "Mensagens dos seus projetos colaborativos",
    back: "Voltar aos projetos",
  },
  list: {
    searchPlaceholder: "Buscar projeto...",
    projectsAvailable: (n) =>
      `${n} projeto${n !== 1 ? "s" : ""} disponíve${n !== 1 ? "is" : "l"}`,
    newMessages: (n) => `· ${n} nova${n !== 1 ? "s" : ""}`,
    noResults: "Nenhum projeto encontrado",
    noProjects: "Você ainda não está em nenhum projeto",
    roles: {
      owner: "Proprietário",
      coOwner: "Co-proprietário",
      collaborator: "Colaborador",
    },
  },
  room: {
    participants: (n) => `${n} participante${n !== 1 ? "s" : ""}`,
    you: "Você",
    mentionHint: "Use",
    mentionHintAt: "@nome",
    mentionHintStatus: "@status:",
    sendAriaLabel: "Enviar mensagem",
    noMessages: "Nenhuma mensagem ainda",
  },
}

// ─── Dutch ────────────────────────────────────────────────────────────────────

const nl: ChatI18n = {
  sidebar: {
    title: "Projectchats",
    subtitle: "Berichten van uw samenwerkingsprojecten",
    back: "Terug naar projecten",
  },
  list: {
    searchPlaceholder: "Project zoeken...",
    projectsAvailable: (n) => `${n} project${n !== 1 ? "en" : ""} beschikbaar`,
    newMessages: (n) => `· ${n} nieuw${n !== 1 ? "e" : ""}`,
    noResults: "Geen projecten gevonden",
    noProjects: "U maakt nog geen deel uit van een project",
    roles: {
      owner: "Eigenaar",
      coOwner: "Mede-eigenaar",
      collaborator: "Medewerker",
    },
  },
  room: {
    participants: (n) => `${n} deelnemer${n !== 1 ? "s" : ""}`,
    you: "Jij",
    mentionHint: "Gebruik",
    mentionHintAt: "@naam",
    mentionHintStatus: "@status:",
    sendAriaLabel: "Bericht versturen",
    noMessages: "Nog geen berichten",
  },
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const chatTranslations: Record<string, ChatI18n> = { en, pt, nl }
