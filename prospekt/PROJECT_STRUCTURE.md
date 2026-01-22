# Prospekt - Structure du Projet

## Structure des Dossiers

```
prospekt/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── auth/                 # Pages d'authentification
│   │   │   └── login/           # Page de connexion
│   │   ├── dashboard/           # Page du dashboard
│   │   ├── prospects/           # Page des prospects
│   │   ├── deals/               # Page des deals
│   │   ├── tasks/               # Page des tâches
│   │   ├── settings/            # Page des paramètres
│   │   ├── layout.tsx           # Layout principal avec providers
│   │   ├── page.tsx             # Page d'accueil (redirige vers dashboard)
│   │   ├── globals.css          # Styles globaux avec design system
│   │   └── providers.tsx        # React Query & Toaster providers
│   │
│   ├── components/
│   │   ├── ui/                  # Composants Shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tabs.tsx
│   │   │
│   │   ├── layout/              # Composants de layout
│   │   │   ├── Sidebar.tsx      # Sidebar de navigation
│   │   │   ├── Header.tsx       # Header avec user info
│   │   │   └── DashboardLayout.tsx  # Layout wrapper
│   │   │
│   │   ├── forms/               # Formulaires
│   │   │   ├── ProspectForm.tsx
│   │   │   ├── DealForm.tsx
│   │   │   └── TaskForm.tsx
│   │   │
│   │   └── shared/              # Composants partagés
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts          # Hook d'authentification
│   │   ├── useProspects.ts     # CRUD prospects
│   │   ├── useDeals.ts         # CRUD deals
│   │   └── useTasks.ts         # CRUD tasks
│   │
│   ├── lib/                     # Utilities
│   │   ├── supabase/
│   │   │   ├── client.ts       # Client Supabase (client-side)
│   │   │   ├── server.ts       # Client Supabase (server-side)
│   │   │   └── middleware.ts   # Auth middleware
│   │   └── utils.ts            # Utility functions (shadcn)
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts            # Types pour Database, Prospect, Deal, Task
│   │
│   └── middleware.ts            # Next.js middleware pour auth
│
├── .env.local                   # Variables d'environnement (configuré)
├── .env.example                 # Template des variables d'env
├── components.json              # Configuration Shadcn/ui
├── tailwind.config.ts          # Configuration Tailwind
├── tsconfig.json               # Configuration TypeScript
└── package.json                # Dépendances

## Dépendances Installées

### Core
- next@latest
- react & react-dom
- typescript

### Styling
- tailwindcss
- tailwind-merge
- class-variance-authority
- clsx

### UI Components
- @shadcn/ui (button, input, card, badge, dialog, select, textarea, sonner, skeleton, tabs)
- lucide-react (icons)

### Backend & Data
- @supabase/supabase-js
- @supabase/ssr
- @tanstack/react-query

### Utils
- date-fns
- sonner (toast notifications)

## Variables d'Environnement

Configurées dans `.env.local`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Design System

### Fonts
- Plus Jakarta Sans (principal)
- Inter (secondaire)
- Geist Mono (code)

### Couleurs
- Brand Primary: oklch(0.45 0.15 260)
- Brand Secondary: oklch(0.55 0.12 200)
- Status Colors: success, warning, info, destructive
- Dark mode supporté

### Spacing
- xs: 0.5rem
- sm: 0.75rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem

## Routes Protégées

Middleware configuré pour protéger:
- /dashboard
- /prospects
- /deals
- /tasks
- /settings

Redirection automatique vers `/auth/login` si non authentifié.

## Prochaines Étapes

1. Créer les tables Supabase (prospects, deals, tasks)
2. Configurer RLS (Row Level Security)
3. Développer les pages et composants complets
4. Ajouter les fonctionnalités avancées
