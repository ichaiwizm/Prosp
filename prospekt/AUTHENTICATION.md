# Système d'Authentification Prospekt

## Vue d'ensemble

Le système d'authentification de Prospekt est basé sur Supabase Auth avec une intégration complète dans Next.js 15 (App Router).

## Architecture

### 1. Hooks d'authentification

#### `useAuth()` - Hook principal d'authentification
Localisation: `/src/hooks/useAuth.ts`

Fonctionnalités:
- Gestion de la session utilisateur
- Login / Logout
- Inscription (signup)
- Réinitialisation de mot de passe
- Gestion des erreurs détaillée

```typescript
const {
  user,           // Utilisateur Supabase
  session,        // Session active
  loading,        // État de chargement
  error,          // Erreurs d'authentification
  isAuthenticated, // Booléen d'authentification
  login,          // Fonction de connexion
  logout,         // Fonction de déconnexion
  signUp,         // Fonction d'inscription
  resetPassword   // Fonction de réinitialisation
} = useAuth();
```

#### `useUser()` - Hook de profil utilisateur
Localisation: `/src/hooks/use-user.ts`

Fonctionnalités:
- Récupération du profil complet depuis la table `users`
- Synchronisation automatique avec l'état d'authentification
- Informations enrichies (nom, rôle, email)

```typescript
const {
  user,           // Utilisateur Supabase
  profile,        // Profil enrichi (UserProfile)
  loading,        // État de chargement
  error,          // Erreurs de chargement
  isAuthenticated // Booléen d'authentification
} = useUser();

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'TECH' | 'COMMERCIAL';
}
```

### 2. Page de connexion

Localisation: `/src/app/(auth)/login/page.tsx`

Caractéristiques:
- Design moderne et épuré
- Validation en temps réel des champs (email et mot de passe)
- Messages d'erreur contextuels et traduits
- État de chargement avec spinner
- Boutons de remplissage automatique pour les comptes de test
- Animations fluides (fade-in, shake sur erreur)

### 3. Layout d'authentification

Localisation: `/src/app/(auth)/layout.tsx`

Caractéristiques:
- Layout simple sans sidebar
- Design centré avec gradient de fond
- Appliqué automatiquement à toutes les routes dans `(auth)`

### 4. Middleware de protection

Localisation: `/src/middleware.ts` et `/src/lib/supabase/middleware.ts`

Logique de protection:
- Routes publiques: `/login`, `/signup`, `/reset-password`
- Routes protégées: Toutes les autres routes
- Redirections automatiques:
  - Non authentifié → `/login`
  - Authentifié sur page auth → `/dashboard`
  - Authentifié sur `/` → `/dashboard`
  - Non authentifié sur `/` → `/login`

### 5. Composants UI

#### Sidebar
Localisation: `/src/components/layout/sidebar.tsx`

Affiche:
- Logo et navigation
- Informations utilisateur avec photo (initiale)
- Badge de rôle (TECH / COMMERCIAL)
- Bouton de déconnexion

#### Dashboard
Localisation: `/src/app/(app)/dashboard/page.tsx`

Affiche:
- Carte de bienvenue personnalisée avec nom et rôle
- Statistiques CRM (prospects, deals, tâches, revenus)
- Design moderne avec icônes et badges

## Comptes de test

Deux comptes sont configurés dans Supabase:

### 1. Compte Technique
- Email: `ichai@prospekt.app`
- Mot de passe: `password123`
- Rôle: `TECH`

### 2. Compte Commercial
- Email: `manu@prospekt.app`
- Mot de passe: `password123`
- Rôle: `COMMERCIAL`

## Flux d'authentification

### Connexion réussie
```
1. Utilisateur entre email/password
2. Validation des champs côté client
3. Appel à login() via useAuth
4. Supabase authentifie et crée une session
5. Middleware vérifie la session
6. Redirection vers /dashboard
7. useUser() charge le profil depuis la table users
8. Affichage du dashboard personnalisé
```

### Déconnexion
```
1. Utilisateur clique sur "Déconnexion"
2. Appel à logout() via useAuth
3. Supabase supprime la session
4. Middleware détecte l'absence de session
5. Redirection vers /login
```

### Protection des routes
```
1. Utilisateur tente d'accéder à une route protégée
2. Middleware vérifie la session Supabase
3. Si pas de session → Redirection vers /login
4. Si session valide → Accès autorisé
```

## Configuration Supabase

### Projet
- ID: `wjrptrpnjpqtowveijbv`
- URL: `https://wjrptrpnjpqtowveijbv.supabase.co`

### Variables d'environnement
Fichier `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://wjrptrpnjpqtowveijbv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre_clé_anon>
```

### Table users
Structure:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('TECH', 'COMMERCIAL')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Styles et Design

### Design System
Le système utilise les variables CSS définies dans `globals.css`:
- Couleurs: Primary, Secondary, Accent, Destructive, Success, etc.
- Radius: Bordures arrondies cohérentes
- Spacing: Espacement standardisé
- Animations: fade-in, shake

### Composants UI
Basés sur Radix UI et Tailwind CSS:
- Button
- Input
- Card
- Badge
- Dialog
- etc.

## Gestion des erreurs

### Erreurs d'authentification
Les erreurs Supabase sont traduites en messages français contextuels:

| Erreur Supabase | Message affiché |
|----------------|-----------------|
| Invalid login credentials | Email ou mot de passe incorrect |
| Email not confirmed | Veuillez confirmer votre email |
| Too many requests | Trop de tentatives. Réessayez plus tard |

### Erreurs de validation
- Email vide → "Email requis"
- Email invalide → "Format email invalide"
- Mot de passe vide → "Mot de passe requis"
- Mot de passe < 6 caractères → "Au moins 6 caractères requis"

## Sécurité

### Bonnes pratiques implémentées
1. Session-based authentication avec Supabase
2. Cookies HTTP-only pour les tokens
3. Protection CSRF via Supabase
4. Validation côté client ET serveur
5. Middleware de protection des routes
6. Pas de stockage de mots de passe en clair
7. Refresh automatique des sessions

### Row Level Security (RLS)
Les politiques RLS Supabase garantissent que:
- Chaque utilisateur ne peut voir que ses propres données
- Les requêtes sont automatiquement filtrées par `user_id`

## Développement

### Tester localement
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

### Ajouter un nouvel utilisateur
1. Se connecter à Supabase Dashboard
2. Aller dans Authentication > Users
3. Créer un nouvel utilisateur
4. Ajouter une entrée dans la table `users` avec le même ID

## Troubleshooting

### Erreur "Invalid login credentials"
- Vérifier que l'utilisateur existe dans Auth
- Vérifier que le mot de passe est correct
- Vérifier que l'email est confirmé

### Erreur "Failed to load user profile"
- Vérifier que la table `users` contient une entrée pour cet utilisateur
- Vérifier les politiques RLS sur la table `users`

### Redirect loops
- Vérifier la configuration du middleware
- Vérifier que les routes publiques sont bien définies
- Vérifier que les cookies Supabase sont correctement configurés

## Roadmap

### Fonctionnalités futures
- [ ] Page d'inscription (signup)
- [ ] Réinitialisation de mot de passe
- [ ] Authentification à deux facteurs (2FA)
- [ ] Connexion avec OAuth (Google, GitHub)
- [ ] Gestion des sessions multiples
- [ ] Page de profil utilisateur
- [ ] Changement de mot de passe
- [ ] Vérification d'email
