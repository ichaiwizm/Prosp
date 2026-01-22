# Centre de Documentation et Assistant IA - Guide d'utilisation

## Vue d'ensemble

Ce projet inclut maintenant deux nouvelles fonctionnalités majeures :
1. **Centre de Documentation** - Un système complet de gestion de la documentation
2. **Assistant IA** - Un assistant intelligent basé sur Claude pour aider à la gestion des prospects

---

## 1. Centre de Documentation

### Structure des fichiers

```
/home/ichai/dev/Prosp/prospekt/
├── src/
│   ├── app/
│   │   ├── api/knowledge-docs/         # API routes pour les documents
│   │   │   ├── route.ts               # Liste et création de documents
│   │   │   └── [id]/route.ts          # Opérations sur un document spécifique
│   │   └── docs/                      # Pages du centre de documentation
│   │       ├── page.tsx               # Page principale avec recherche et filtres
│   │       └── [id]/page.tsx          # Page de vue détaillée d'un document
│   └── components/
│       └── features/
│           └── docs/
│               ├── doc-search.tsx      # Composant de recherche avec debounce
│               ├── doc-card.tsx        # Card pour afficher un document
│               └── markdown-renderer.tsx # Rendu du contenu markdown
```

### Utilisation

#### Accéder au centre de documentation
Naviguez vers `/docs` depuis l'application. Le lien est déjà présent dans la sidebar.

#### Fonctionnalités disponibles

1. **Recherche full-text**
   - Barre de recherche en haut de la page
   - Recherche dans les titres et le contenu
   - Debounce automatique (300ms)

2. **Filtres**
   - Par catégorie : SITUATION, SERVICE, PROCESS, TEMPLATE
   - Par tags : affichés dynamiquement selon les documents disponibles
   - Combinaison de filtres possible

3. **Vue détaillée**
   - Cliquez sur une card pour voir le document complet
   - Rendu markdown avec syntaxe enrichie
   - Suggestions de documents similaires
   - Navigation facile (retour vers la liste)

### Types de documents

```typescript
export type KnowledgeDocCategory = 'SITUATION' | 'SERVICE' | 'PROCESS' | 'TEMPLATE';

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: KnowledgeDocCategory;
  content: string;  // Support du markdown
  tags: string[];
  created_at: string;
  updated_at: string;
}
```

### API Endpoints

#### GET /api/knowledge-docs
Liste tous les documents avec filtres optionnels
```typescript
// Query params
?search=keyword       // Recherche full-text
?category=SERVICE     // Filtre par catégorie
?tag=conseil         // Filtre par tag

// Response
KnowledgeDoc[]
```

#### GET /api/knowledge-docs/[id]
Récupère un document spécifique
```typescript
// Response
KnowledgeDoc
```

#### POST /api/knowledge-docs
Crée un nouveau document (nécessite rôle admin)
```typescript
// Body
{
  title: string;
  category: KnowledgeDocCategory;
  content: string;
  tags?: string[];
}

// Response
KnowledgeDoc
```

#### PUT /api/knowledge-docs/[id]
Met à jour un document (nécessite rôle admin)
```typescript
// Body (tous les champs sont optionnels)
{
  title?: string;
  category?: KnowledgeDocCategory;
  content?: string;
  tags?: string[];
}

// Response
KnowledgeDoc
```

#### DELETE /api/knowledge-docs/[id]
Supprime un document (nécessite rôle admin)
```typescript
// Response
{ success: true }
```

---

## 2. Assistant IA

### Structure des fichiers

```
/home/ichai/dev/Prosp/prospekt/
├── src/
│   ├── app/api/assistant/
│   │   └── route.ts                    # API route pour Claude
│   ├── components/features/assistant/
│   │   ├── assistant-panel.tsx         # Panel principal avec chat
│   │   └── assistant-button.tsx        # Bouton pour ouvrir l'assistant
│   └── hooks/
│       └── useAssistant.ts             # Hook personnalisé
```

### Utilisation

#### Intégrer l'assistant dans une page

```tsx
import { AssistantButton } from '@/components/features/assistant/assistant-button';
import { AssistantContext } from '@/types';

// Dans votre composant
const assistantContext: AssistantContext = {
  prospectId: prospect.id,
  prospect: prospect,
  exchanges: exchanges,
  notes: notes,
  callObjective: 'Qualifier le besoin et proposer une démo',
  suggestedQuestions: [
    'Quelle est votre situation actuelle ?',
    'Quels sont vos objectifs à 6 mois ?',
    'Qui sont les décideurs ?'
  ],
  possibleObjections: [
    'C\'est trop cher',
    'Nous n\'avons pas le temps',
    'Nous avons déjà une solution'
  ],
  relevantDocs: [] // Optionnel : documents pertinents
};

// Afficher le bouton
<AssistantButton context={assistantContext} />
```

#### Exemple complet dans une page de détail prospect

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AssistantButton } from '@/components/features/assistant/assistant-button';
import { Prospect } from '@/types';

export default function ProspectDetailPage() {
  const params = useParams();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [exchanges, setExchanges] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Fetch prospect data
    fetchProspectData();
  }, [params.id]);

  const fetchProspectData = async () => {
    // Fetch prospect, exchanges, notes...
  };

  if (!prospect) return <div>Loading...</div>;

  return (
    <div>
      {/* Prospect info */}
      <div>{prospect.name}</div>

      {/* Assistant button */}
      <AssistantButton
        context={{
          prospectId: prospect.id,
          prospect,
          exchanges,
          notes
        }}
        variant="default"
        size="default"
      />
    </div>
  );
}
```

### Fonctionnalités de l'assistant

1. **Contexte automatique**
   - Informations du prospect (nom, email, entreprise, statut)
   - Historique des échanges (10 derniers)
   - Notes récentes (10 dernières)

2. **Suggestions intelligentes**
   - Objectif de l'appel
   - Questions stratégiques à poser
   - Objections possibles et comment y répondre
   - Documents pertinents

3. **Chat interactif**
   - Interface moderne avec bulles de chat
   - Historique de conversation
   - Envoi par Entrée
   - Loading states et animations

4. **Sidebar contextuelle**
   - Informations du prospect
   - Suggestions en temps réel
   - Accès rapide aux documents utiles

### Types

```typescript
export interface AssistantContext {
  prospectId?: string;
  prospect?: Prospect;
  exchanges?: any[];
  notes?: any[];
  callObjective?: string;
  suggestedQuestions?: string[];
  possibleObjections?: string[];
  relevantDocs?: KnowledgeDoc[];
}

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AssistantResponse {
  message: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}
```

### API Endpoint

#### POST /api/assistant
Envoie un message à l'assistant Claude
```typescript
// Body
{
  message: string;
  prospectId?: string;
  context?: string;  // JSON stringifié
}

// Response
{
  message: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  }
}
```

### Hook personnalisé

```tsx
import { useAssistant } from '@/hooks/useAssistant';

function MyComponent() {
  const { sendMessage, loading, error } = useAssistant();

  const handleSend = async () => {
    const response = await sendMessage(
      'Comment gérer cette objection ?',
      prospectId,
      { prospect, exchanges }
    );

    if (response) {
      console.log(response.message);
    }
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? 'Envoi...' : 'Envoyer'}
    </button>
  );
}
```

---

## 3. Base de données

### Table knowledge_docs

Exécutez le fichier de migration pour créer la table :

```bash
# Le fichier SQL se trouve dans :
/home/ichai/dev/Prosp/prospekt/supabase/migrations/create_knowledge_docs.sql
```

Structure de la table :
```sql
CREATE TABLE knowledge_docs (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SITUATION', 'SERVICE', 'PROCESS', 'TEMPLATE')),
  content TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

Fonctionnalités :
- Row Level Security (RLS) activée
- Lecture pour tous les utilisateurs authentifiés
- Écriture pour les admins uniquement
- Index pour la recherche full-text
- 4 exemples de documents pré-insérés

---

## 4. Design et UX

### Centre de documentation
- Style moderne inspiré de Notion/Linear
- Cards avec hover effects
- Badges colorés par catégorie
- Responsive design
- Animations fluides

### Assistant IA
- Chat moderne avec bulles
- Sidebar contextuelle (masquée sur mobile)
- Loading states avec animations
- Auto-scroll vers les nouveaux messages
- Design cohérent avec le reste de l'app

### Couleurs par catégorie

```typescript
const categoryColors = {
  SITUATION: 'blue',    // Bleu
  SERVICE: 'green',     // Vert
  PROCESS: 'purple',    // Violet
  TEMPLATE: 'orange'    // Orange
};
```

---

## 5. Prochaines étapes (optionnel)

### Améliorations possibles

1. **Centre de documentation**
   - Système de versions
   - Favoris et bookmarks
   - Export PDF
   - Statistiques de consultation
   - Éditeur WYSIWYG pour le markdown

2. **Assistant IA**
   - Streaming des réponses
   - Historique des conversations sauvegardé
   - Actions suggérées (créer tâche, envoyer email, etc.)
   - Multi-modal (images, documents)
   - Voice input

3. **Intégration**
   - Suggérer automatiquement des docs pertinents
   - Analyser les échanges pour détecter les besoins
   - Génération automatique de résumés
   - Templates d'emails personnalisés

---

## 6. Variables d'environnement requises

Assurez-vous d'avoir ces variables dans votre `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic (pour l'assistant IA)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## Support

Pour toute question ou problème :
1. Vérifiez que la table `knowledge_docs` existe dans Supabase
2. Vérifiez que l'API key Anthropic est configurée
3. Consultez les logs de la console pour les erreurs
4. Vérifiez les permissions RLS dans Supabase

---

Développé avec Next.js 16, React 19, Supabase, et Claude AI.
