# Layout Components

Système de layout pour Prospekt inspiré de Linear/Notion.

## Composants

### Sidebar
Navigation principale de l'application avec logo, menu et section utilisateur.

```tsx
import { Sidebar } from '@/components/layout';

// Utilisé automatiquement dans le layout (app)
```

**Features:**
- Logo Prospekt avec dégradé
- Navigation avec icônes lucide-react
- Active state avec indicateur visuel
- Section utilisateur avec avatar et rôle
- Bouton de déconnexion
- Animations subtiles au hover

### Header
En-tête de page avec titre, breadcrumbs et actions.

```tsx
import { Header } from '@/components/layout';

<Header
  title="Dashboard"
  description="Vue d'ensemble de votre activité"
  breadcrumbs={[
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Dashboard' },
  ]}
  actions={
    <Button>Nouvelle action</Button>
  }
/>
```

**Props:**
- `title`: Titre de la page (requis)
- `description`: Description optionnelle
- `breadcrumbs`: Fil d'Ariane optionnel
- `actions`: Boutons d'action optionnels
- `className`: Classes CSS additionnelles

### PageContainer
Container pour le contenu des pages avec padding et max-width cohérents.

```tsx
import { PageContainer } from '@/components/layout';

<PageContainer maxWidth="2xl">
  {/* Contenu de la page */}
</PageContainer>
```

**Props:**
- `children`: Contenu (requis)
- `maxWidth`: Largeur maximale ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full')
- `className`: Classes CSS additionnelles

## Structure de page type

```tsx
import { Header, PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MyPage() {
  return (
    <>
      <Header
        title="Ma Page"
        description="Description de ma page"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Ma Page' },
        ]}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle action
          </Button>
        }
      />
      <PageContainer>
        {/* Votre contenu ici */}
      </PageContainer>
    </>
  );
}
```

## Design System

### Couleurs
Utilise les variables CSS définies dans `globals.css`:
- `--sidebar`: Fond de la sidebar
- `--sidebar-foreground`: Texte de la sidebar
- `--sidebar-primary`: Couleur primaire (état actif)
- `--sidebar-accent`: Fond hover
- `--sidebar-border`: Bordures

### Animations
- Transitions douces (200-300ms)
- Hover states subtils
- Active states avec indicateur visuel
- Backdrop blur pour le header

### Responsive
- Desktop: Sidebar visible (w-64)
- Mobile: Sidebar cachée (TODO: Menu hamburger)

## Notes

- Toutes les pages dans `app/(app)/` utilisent automatiquement le layout avec sidebar
- Le header est sticky et reste visible lors du scroll
- Les breadcrumbs montrent le chemin de navigation
- La section utilisateur affiche l'email et le rôle depuis Supabase
