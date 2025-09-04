import { redirect } from 'next/navigation'

export default function HomePage() {
  // Server-side redirect para melhor SEO e compatibilidade com Vercel
  redirect('/login')
}
