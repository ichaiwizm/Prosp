# Système de Layout Prospekt

Système de layout moderne et réutilisable inspiré de Linear et Notion.

## Structure

```
src/
├── app/
│   ├── (app)/              # Layout principal avec sidebar
│   │   ├── layout.tsx      # Layout wrapper
│   │   ├── dashboard/      # Pages de l'app
│   │   ├── prospects/
│   │   ├── deals/
│   │   ├── tasks/
│   │   ├── docs/
│   │   └── settings/
│   └── auth/               # Pages auth (sans sidebar)
└── components/
    └── layout/
        ├── sidebar.tsx     # Navigation principale
        ├── header.tsx      # En-tête de page
        ├── page-container.tsx  # Container de contenu
        ├── index.ts        # Exports
        └── README.md       # Documentation détaillée
```

## Composants

### 1. Sidebar (`sidebar.tsx`)

Navigation principale de l'application.

**Caractéristiques:**
- Logo avec dégradé primary → accent
- Navigation avec icônes lucide-react
- Active state avec indicateur visuel (barre bleue à gauche)
- Description au hover
- Section utilisateur avec avatar généré
- Badge de rôle
- Bouton de déconnexion
- Animations subtiles (200-300ms)

**Usage:**
Utilisé automatiquement dans le layout `(app)`.

**Données utilisateur:**
- Utilise `useUser()` pour récupérer le profil
- Utilise `useAuth()` pour la déconnexion
- Affiche le nom, email et rôle

### 2. Header (`header.tsx`)

En-tête de page avec titre, breadcrumbs et actions.

**Props:**
```typescript
interface HeaderProps {
  title: string;              // Titre principal (requis)
  description?: string;        // Description sous le titre
  breadcrumbs?: Array<{       // Fil d'Ariane
    label: string;
    href?: string;
  }>;
  actions?: ReactNode;        // Boutons d'action
  className?: string;
}
```

**Exemple:**
```tsx
<Header
  title="Prospects"
  description="Gérez vos leads et contacts"
  breadcrumbs={[
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Prospects' },
  ]}
  actions={
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      Ajouter
    </Button>
  }
/>
```

**Features:**
- Sticky (reste visible au scroll)
- Backdrop blur
- Hauteur fixe: 64px (h-16)
- Responsive

### 3. PageContainer (`page-container.tsx`)

Container pour le contenu des pages.

**Props:**
```typescript
interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}
```

**Max-width:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px (défaut)
- `full`: 100%

**Features:**
- Padding horizontal: 24px (px-6)
- Padding vertical: 32px (py-8)
- Centré automatiquement (mx-auto)

### 4. App Layout (`(app)/layout.tsx`)

Layout principal de l'application.

**Structure:**
```tsx
<div className="flex h-screen">
  <Sidebar />
  <main className="flex-1 overflow-y-auto">
    {children}
  </main>
</div>
```

**Features:**
- Full height viewport
- Sidebar fixe (64px / 256px de largeur)
- Contenu scrollable
- Responsive (sidebar cachée sur mobile)

## Structure de page type

```tsx
import { Header, PageContainer } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MyPage() {
  return (
    <>
      <Header
        title="Ma Page"
        description="Description de la page"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Ma Page' },
        ]}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Créer
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-6">
          <Card>
            {/* Votre contenu */}
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
```

## Design System

### Couleurs

Variables CSS définies dans `globals.css`:

**Sidebar:**
- `--sidebar`: Fond (blanc en light, gris foncé en dark)
- `--sidebar-foreground`: Texte
- `--sidebar-primary`: Couleur primaire (état actif)
- `--sidebar-accent`: Fond hover
- `--sidebar-border`: Bordures

**Thème:**
- `--primary`: Couleur primaire (oklch 0.45 0.15 260)
- `--accent`: Couleur d'accentuation (oklch 0.55 0.12 200)
- `--muted`: Couleur de texte secondaire
- `--border`: Bordures

### Spacing

```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 0.75rem;  /* 12px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
```

### Border Radius

```css
--radius: 0.625rem;     /* 10px - base */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-xl: 14px;
```

### Animations

```css
transition-all duration-200 ease-in-out  /* Hover rapide */
transition-all duration-300 ease-in-out  /* Transitions standards */
```

### Typography

**Fonts:**
- Sans: Plus Jakarta Sans (variable)
- Mono: Geist Mono (variable)

**Tailles:**
- Page title (h1): `text-2xl font-bold` (24px)
- Section title (h2): `text-xl font-semibold` (20px)
- Card title: `text-lg font-semibold` (18px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Extra small: `text-xs` (12px)

## Responsive

### Breakpoints Tailwind

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Comportement

**Desktop (lg+):**
- Sidebar visible (w-64)
- Layout flex horizontal
- Cards en grille (2-4 colonnes)

**Tablet (md-lg):**
- Sidebar cachée (TODO: menu hamburger)
- Cards en grille (2 colonnes)

**Mobile (< md):**
- Sidebar cachée
- Cards en colonne unique
- Actions empilées

## Exemples

Voir `/app/(app)/exemple/page.tsx` pour une démonstration complète incluant:
- Header avec toutes les options
- Cards avec badges et actions
- Tableaux de données
- Layouts en grille
- Boutons variés

## Routes

### Pages principales

- `/dashboard` - Vue d'ensemble
- `/prospects` - Gestion des prospects
- `/prospects/[id]` - Détail d'un prospect (avec breadcrumbs)
- `/deals` - Pipeline de ventes
- `/tasks` - Gestion des tâches
- `/docs` - Documentation
- `/settings` - Paramètres
- `/exemple` - Page d'exemple complète

### Pages hors app

- `/auth/login` - Connexion (sans sidebar)
- `/auth/signup` - Inscription (sans sidebar)

## Notes techniques

### Next.js App Router

Le dossier `(app)` utilise la convention de route group de Next.js:
- Les parenthèses n'apparaissent pas dans l'URL
- Le layout s'applique à toutes les routes enfants
- Permet d'avoir plusieurs layouts (auth vs app)

### Server vs Client Components

- **Sidebar**: Client component (utilise useState, hooks)
- **Header**: Client component (navigation)
- **PageContainer**: Server component (pas d'état)
- **App Layout**: Server component (wrapper)

### Performance

- Images optimisées avec Next.js Image
- CSS variables pour le theming
- Animations GPU-accelerated (transform, opacity)
- Lazy loading des routes

## TODO

- [ ] Menu hamburger mobile
- [ ] Sidebar collapsible
- [ ] Dark mode toggle dans settings
- [ ] Animations de transition entre pages
- [ ] Skeleton loaders
- [ ] Composant Breadcrumb dédié
- [ ] Analytics de navigation
- [ ] Raccourcis clavier (cmd+k pour search)

## Maintenance

### Ajouter une nouvelle page

1. Créer le fichier dans `app/(app)/ma-page/page.tsx`
2. Utiliser Header + PageContainer
3. Ajouter la route dans `sidebar.tsx` si nécessaire

### Modifier la navigation

Éditer l'array `navigation` dans `sidebar.tsx`:

```tsx
const navigation = [
  {
    name: 'Ma Page',
    href: '/ma-page',
    icon: MonIconLucide,
    description: 'Description au hover'
  },
];
```

### Personnaliser les couleurs

Éditer les variables CSS dans `app/globals.css`:

```css
:root {
  --primary: oklch(0.45 0.15 260);  /* Votre couleur */
}
```
