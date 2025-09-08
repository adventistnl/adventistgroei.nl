# Instruções do Projeto adventistgroei.nl

Este arquivo serve como guia rápido para onboarding, manutenção e evolução do projeto. Para dúvidas ou instruções específicas, consulte a documentação das bibliotecas utilizadas ou peça orientação ao time técnico.

## Contexto do Produto
Este projeto é uma plataforma web para gestão, colaboração e comunicação de entidades ligadas à comunidade adventista. Ele oferece funcionalidades administrativas, controle de membros, voluntários, igrejas, departamentos, instituições, regiões, eventos, relatórios, subsídios e projetos missionários. O objetivo é facilitar processos internos, promover transparência e eficiência organizacional.

## Stack Tecnológica
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **pnpm** como gerenciador de pacotes
- **Radix UI, Zod, i18next, Lucide, Embla Carousel, Recharts, Sonner** e outras libs modernas

## Estrutura do Projeto
- `app/`: Rotas e páginas, organizadas por domínio (ex: churches, dashboard, events, etc.), com suporte a rotas dinâmicas e loading states.
- `components/`: Componentes reutilizáveis, organizados por contexto (UI, modais, layouts, navegação, autenticação).
- `config/`, `contexts/`, `data/`, `hooks/`, `lib/`, `public/`, `styles/`: Pastas para configuração, contextos globais, dados mockados, hooks customizados, utilitários, arquivos públicos e estilos.
- Arquivos de configuração: `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `vercel.json`, etc.

## Boas Práticas TypeScript
1. **Tipagem explícita:** Sempre tipar props, estados e funções. Use interfaces/types para modelos de dados.
2. **Evite `any`:** Prefira tipos precisos, utilize generics e utility types.
3. **Organização:** Separe tipos em arquivos próprios ou junto ao domínio.
4. **Integração:** Instale pacotes de tipagem para libs externas e valide dados com Zod.
5. **Configuração:** Mantenha o `tsconfig.json` ajustado e use `strict` mode.
6. **Documentação:** Comente tipos complexos e interfaces públicas.
7. **Refatoração:** Atualize e remova tipos conforme o projeto evolui.

## Outras Recomendações
- Utilize componentes e hooks já existentes para manter consistência visual e funcional.
- Aproveite o sistema de temas e internacionalização.
- Siga o padrão de rotas do Next.js App Router.
- Mantenha o código limpo, modular e fácil de escalar.

### Como funciona a autenticação

- O login é realizado via mutation GraphQL (`login`), enviando email e senha.
- Se o login for bem-sucedido, a API retorna um `accessToken` (JWT) e os dados do usuário.
- O token e os dados do usuário são salvos no `localStorage` (`auth-token` e `auth-user`).
- O contexto de autenticação (`AuthProvider` em `contexts/auth-context.tsx`) gerencia o estado do usuário, token, login e logout.

### Conexão com a API GraphQL

- O Apollo Client é configurado em `lib/apollo/apollo-client.ts`.
- Antes de cada requisição, um link de contexto adiciona o header `Authorization: Bearer <token>` usando o token salvo no `localStorage`.
- Todas as requisições GraphQL autenticadas enviam o token JWT para a API, permitindo acesso autorizado aos dados.

**Resumo:** O login gera um token JWT salvo no navegador, e o Apollo Client injeta esse token nos headers das requisições GraphQL automaticamente. O contexto React gerencia o estado de autenticação na aplicação.
