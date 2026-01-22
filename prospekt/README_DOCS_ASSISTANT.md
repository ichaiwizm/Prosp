# Centre de Documentation et Assistant IA - Documentation

Bienvenue dans la documentation du Centre de Documentation et de l'Assistant IA pour Prospekt !

## Navigation rapide

### 🚀 Pour démarrer rapidement
**[QUICK_START.md](./QUICK_START.md)** - Guide de démarrage en 5 minutes

### 📚 Pour installer proprement
**[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Guide d'installation complet avec troubleshooting

### 📖 Pour comprendre les fonctionnalités
**[SUMMARY.md](./SUMMARY.md)** - Résumé détaillé de toutes les fonctionnalités

### 🔧 Pour utiliser l'API et les composants
**[DOCS_ASSISTANT_README.md](./DOCS_ASSISTANT_README.md)** - Documentation technique complète

### 📝 Pour voir ce qui a été créé
**[FILES_CREATED.md](./FILES_CREATED.md)** - Liste de tous les fichiers créés

---

## Vue d'ensemble

### Centre de Documentation
Un système complet de gestion de documentation avec :
- ✅ Recherche full-text
- ✅ Filtres par catégorie et tags
- ✅ Rendu markdown
- ✅ Design moderne
- ✅ 4 documents d'exemple

### Assistant IA
Un assistant intelligent basé sur Claude avec :
- ✅ Chat interactif
- ✅ Contexte automatique du prospect
- ✅ Suggestions intelligentes
- ✅ Intégration transparente
- ✅ Interface moderne

---

## Démarrage

### Option 1 : Démarrage rapide (5 min)
```bash
# 1. Exécuter la migration SQL dans Supabase
# 2. Ajouter ANTHROPIC_API_KEY dans .env.local
# 3. Redémarrer le serveur
npm run dev
# 4. Tester sur /docs et dans un prospect
```

→ Voir [QUICK_START.md](./QUICK_START.md)

### Option 2 : Installation complète (15 min)
Suivez le guide détaillé avec vérifications et troubleshooting.

→ Voir [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

---

## Structure de la documentation

```
Documentation/
├── README_DOCS_ASSISTANT.md    ← Vous êtes ici (Index)
├── QUICK_START.md              ← Démarrage rapide
├── INSTALLATION_GUIDE.md       ← Installation complète
├── SUMMARY.md                  ← Résumé des fonctionnalités
├── DOCS_ASSISTANT_README.md    ← Documentation technique
└── FILES_CREATED.md            ← Liste des fichiers

Migration/
└── supabase/migrations/
    └── create_knowledge_docs.sql

Code source/
├── src/app/api/knowledge-docs/ ← API REST
├── src/app/(app)/docs/         ← Pages front
├── src/components/features/
│   ├── docs/                   ← Composants docs
│   └── assistant/              ← Composants assistant
├── src/hooks/
│   └── useAssistant.ts         ← Hook personnalisé
└── src/types/index.ts          ← Types TypeScript
```

---

## Fonctionnalités principales

### 📚 Centre de Documentation

#### Interface utilisateur
- Barre de recherche avec debounce
- Filtres par catégorie (SITUATION, SERVICE, PROCESS, TEMPLATE)
- Filtres par tags dynamiques
- Cards avec hover effects
- Vue détaillée avec markdown
- Suggestions de documents similaires

#### Backend
- API REST complète (GET, POST, PUT, DELETE)
- Base de données Supabase optimisée
- Row Level Security (RLS)
- Recherche full-text en français
- Index pour la performance

### 🤖 Assistant IA

#### Interface utilisateur
- Chat moderne avec bulles
- Sidebar contextuelle
- Informations du prospect
- Historique des échanges
- Suggestions intelligentes
- Auto-scroll et animations

#### Backend
- Intégration Claude 3.5 Sonnet
- Contexte automatique du prospect
- Analyse des échanges et notes
- Suggestions personnalisées
- API extensible

---

## Utilisation

### Centre de Documentation

```typescript
// Accéder à la page principale
http://localhost:3000/docs

// API - Liste des documents
GET /api/knowledge-docs?search=query&category=SERVICE&tag=conseil

// API - Créer un document (admin)
POST /api/knowledge-docs
{
  "title": "Mon document",
  "category": "SERVICE",
  "content": "# Contenu\n\nVotre contenu...",
  "tags": ["tag1", "tag2"]
}

// API - Récupérer un document
GET /api/knowledge-docs/[id]

// API - Mettre à jour (admin)
PUT /api/knowledge-docs/[id]

// API - Supprimer (admin)
DELETE /api/knowledge-docs/[id]
```

### Assistant IA

```typescript
// Intégrer dans une page
import { AssistantButton } from '@/components/features/assistant/assistant-button';

<AssistantButton
  context={{
    prospectId: prospect.id,
    prospect: prospect,
    exchanges: exchanges,
    notes: notes
  }}
/>

// Utiliser le hook
import { useAssistant } from '@/hooks/useAssistant';

const { sendMessage, loading, error } = useAssistant();

const response = await sendMessage(
  'Comment gérer cette objection ?',
  prospectId,
  { prospect, exchanges }
);
```

---

## Configuration requise

### Variables d'environnement
```env
# Supabase (normalement déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon

# Anthropic (à ajouter)
ANTHROPIC_API_KEY=sk-ant-votre-cle-api
```

### Base de données
- Table `knowledge_docs` créée via migration SQL
- Row Level Security (RLS) configurée
- Index pour la performance

---

## Technologies utilisées

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Supabase** - Base de données et authentification
- **Anthropic Claude** - Assistant IA
- **Tailwind CSS 4** - Styling
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes
- **date-fns** - Manipulation de dates

---

## Support et ressources

### Documentation officielle
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Anthropic](https://docs.anthropic.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Fichiers de référence
- [Guide de démarrage rapide](./QUICK_START.md)
- [Guide d'installation](./INSTALLATION_GUIDE.md)
- [Documentation technique](./DOCS_ASSISTANT_README.md)
- [Résumé des fonctionnalités](./SUMMARY.md)
- [Liste des fichiers](./FILES_CREATED.md)

### Troubleshooting
Consultez la section "Dépannage" dans [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

---

## Checklist de mise en route

- [ ] Lire [QUICK_START.md](./QUICK_START.md)
- [ ] Exécuter la migration SQL
- [ ] Configurer `ANTHROPIC_API_KEY`
- [ ] Redémarrer le serveur
- [ ] Tester le centre de documentation
- [ ] Tester l'assistant IA
- [ ] Lire [DOCS_ASSISTANT_README.md](./DOCS_ASSISTANT_README.md) pour plus de détails

---

## Prochaines étapes

Après avoir vérifié que tout fonctionne :

1. **Personnaliser** les documents d'exemple
2. **Ajuster** le design selon vos préférences
3. **Étendre** avec de nouvelles fonctionnalités
4. **Former** votre équipe à l'utilisation
5. **Déployer** en production

---

## Statistiques du projet

- **17 fichiers créés** (12 code + 5 documentation)
- **Aucune nouvelle dépendance** ajoutée
- **4 documents d'exemple** fournis
- **2 fonctionnalités majeures** complètes
- **100% TypeScript** pour la sécurité des types
- **Prêt pour la production**

---

**Développé avec ❤️ en utilisant Next.js 16, React 19, Supabase et Claude AI**

**Date** : Janvier 2026

**Version** : 1.0.0

---

Pour commencer, rendez-vous sur [QUICK_START.md](./QUICK_START.md) !
