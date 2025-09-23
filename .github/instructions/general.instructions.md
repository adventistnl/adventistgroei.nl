 # Instruções do Projeto adventistgroei.nl

Este arquivo serve como guia rápido para onboarding, manutenção e evolução do projeto. Para dúvidas ou instruções específicas, consulte a documentação das bibliotecas utilizadas ou peça orientação ao time técnico.

## Contexto do Produto
Este projeto é uma plataforma web para gestão, colaboração e comunicação de entidades ligadas à comunidade adventista. Ele oferece funcionalidades administrativas, controle de membros, voluntários, igrejas, departamentos, instituições, regiões, eventos, relatórios, subsídios e projetos missionários. O objetivo é facilitar processos internos, promover transparência e eficiência organizacional.

### Funcionalidades Principais
- **Gerenciamento de Acesso**: Sistema unificado para usuários, roles e permissões, com KPIs, gráficos interativos (distribuição de roles, permissões por categoria), tabelas avançadas (filtro, paginação, ordenação) e configuração granular de permissões (30+ em 6 grupos: USER, ROLE, PERMISSION, INSTITUTION, REGION, CHURCH).
- **Gerenciamento de Instituições**: Página com KPIs (instituições, regiões, igrejas, usuários, orçamentos), gráficos (igrejas por região, usuários por role, tendências de subsídios), tabelas reutilizáveis com filtros e modais para criação/edição.
- **Configuração de Permissões**: Interface dedicada para editar permissões de roles específicos, com design monocromático, grupos colapsáveis e feedback visual.
- **Outras Funcionalidades**: Dashboard, projetos, relatórios, eventos, subsídios, voluntários, etc., com dados mockados baseados em ERD (Entity-Relationship Diagram) para simulação realista.
- **Internacionalização**: Suporte a inglês (en) e holandês (nl) com i18next.
- **Responsividade**: Design mobile-first, grids adaptativos, touch-friendly.
- **Temas**: Sistema de temas com TailwindCSS e shadcn/ui.

## Stack Tecnológica
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **pnpm** como gerenciador de pacotes
- **Radix UI, Zod, i18next, Lucide, Embla Carousel, Recharts, Sonner** e outras libs modernas
- **Apollo Client**: Para integração GraphQL, com codegen para tipos.
- **TanStack Table**: Para tabelas avançadas (filtro, paginação, ordenação).
- **React Hook Form + Zod**: Para validação de formulários.

## Estrutura do Projeto
- `app/`: Rotas e páginas, organizadas por domínio (ex: churches, dashboard, events, access, institutions, etc.), com suporte a rotas dinâmicas e loading states.
- `components/`: Componentes reutilizáveis, organizados por contexto (UI, modais, layouts, navegação, autenticação, access, institutions, etc.).
- `config/`, `contexts/`, `data/`, `hooks/`, `lib/`, `public/`, `styles/`: Pastas para configuração, contextos globais, dados mockados, hooks customizados, utilitários, arquivos públicos e estilos.
- `graphql/`: Queries e mutations GraphQL em subpastas (queries/, mutations/).
- `hooks/graphql/`: Hooks customizados para operações GraphQL.
- `types/`: Tipos TypeScript, incluindo gerados pelo codegen.
- Arquivos de configuração: `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `vercel.json`, `codegen.yml`, etc.

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
- Use dados mockados para desenvolvimento e testes, baseados em ERD realista.

### Como funciona a autenticação

- O login é realizado via mutation GraphQL (`login`), enviando email e senha.
- Se o login for bem-sucedido, a API retorna um `accessToken` (JWT) e os dados do usuário.
- O token e os dados do usuário são salvos no `localStorage` (`auth-token` e `auth-user`).
- O contexto de autenticação (`AuthProvider` em `contexts/auth-context.tsx`) gerencia o estado do usuário, token, login e logout.

### Conexão com a API GraphQL

- O Apollo Client é configurado em `lib/apollo/apollo-client.ts`.
- Antes de cada requisição, um link de contexto adiciona o header `Authorization: Bearer <token>` usando o token salvo no `localStorage`.
- Todas as requisições GraphQL autenticadas enviam o token JWT para a API, permitindo acesso autorizado aos dados.
- **Flow de Queries/Mutations**:
  - Queries e mutations são definidas manualmente em `graphql/queries/` e `graphql/mutations/` usando `gql`.
  - Tipos TypeScript são gerados automaticamente via `graphql-codegen` (script `pnpm generate:codegen`), salvos em `types/`.
  - Hooks customizados são criados em `hooks/graphql/`, importando queries/mutations e tipos, e usando `useQuery` ou `useMutation` do Apollo Client para encapsular lógica e permitir reutilização em componentes.

**Resumo:** O login gera um token JWT salvo no navegador, e o Apollo Client injeta esse token nos headers das requisições GraphQL automaticamente. O contexto React gerencia o estado de autenticação na aplicação. O sistema GraphQL usa codegen para tipagem forte e hooks customizados para integração React.
