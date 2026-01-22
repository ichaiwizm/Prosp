# Quick Start - Système d'Authentification Prospekt

## Démarrage rapide (2 minutes)

### 1. Démarrer le serveur
```bash
npm run dev
```

### 2. Ouvrir l'application
```
http://localhost:3000
```

### 3. Se connecter

Utilisez l'un des comptes de test :

**Compte Technique**
- Email : `ichai@prospekt.app`
- Mot de passe : `password123`
- Rôle : TECH

**Compte Commercial**
- Email : `manu@prospekt.app`
- Mot de passe : `password123`
- Rôle : COMMERCIAL

### 4. Navigation

L'application vous redirige automatiquement :
- **Non connecté** → `/login`
- **Connecté** → `/dashboard`

## Pages disponibles

### Authentification
- `/login` - Page de connexion

### Application (nécessite authentification)
- `/dashboard` - Tableau de bord personnalisé
- `/prospects` - Gestion des prospects
- `/deals` - Gestion des deals
- `/tasks` - Gestion des tâches
- `/settings` - Paramètres

## Fonctionnalités implémentées

### Page de login (/login)
- ✅ Formulaire email/password
- ✅ Validation en temps réel
- ✅ Messages d'erreur en français
- ✅ Loading state
- ✅ Boutons de remplissage automatique pour les tests
- ✅ Design moderne et responsive
- ✅ Animations (fade-in, shake)

### Système d'authentification
- ✅ Login / Logout
- ✅ Gestion des sessions Supabase
- ✅ Protection des routes via middleware
- ✅ Redirections automatiques
- ✅ Cookies sécurisés (HTTP-only)

### Dashboard
- ✅ Carte de bienvenue personnalisée
- ✅ Affichage du nom et rôle de l'utilisateur
- ✅ Dashboard différent selon le rôle (TECH / COMMERCIAL)
- ✅ Statistiques en temps réel
- ✅ Actions rapides

### Sidebar
- ✅ Logo et navigation
- ✅ Profil utilisateur avec avatar
- ✅ Badge de rôle
- ✅ Bouton de déconnexion

## Structure des hooks

### useAuth()
Hook principal pour l'authentification.

```typescript
import { useAuth } from '@/hooks/useAuth';

const {
  user,           // Utilisateur Supabase
  session,        // Session active
  loading,        // État de chargement
  error,          // Erreurs d'authentification
  isAuthenticated,// Booléen
  login,          // login(email, password)
  logout,         // logout()
  signUp,         // signUp(email, password)
  resetPassword   // resetPassword(email)
} = useAuth();
```

### useUser()
Hook pour le profil utilisateur complet.

```typescript
import { useUser } from '@/hooks/use-user';

const {
  user,           // Utilisateur Supabase
  profile,        // { id, email, name, role }
  loading,        // État de chargement
  error,          // Erreurs de chargement
  isAuthenticated // Booléen
} = useUser();
```

## Tester l'authentification

### Test 1 : Connexion
1. Aller sur `/login`
2. Cliquer sur le bouton "Tech" ou "Commercial"
3. Cliquer sur "Se connecter"
4. ✅ Vérifier la redirection vers `/dashboard`
5. ✅ Vérifier l'affichage du nom dans la sidebar
6. ✅ Vérifier le badge de rôle

### Test 2 : Protection des routes
1. Se déconnecter
2. Taper `/dashboard` dans la barre d'adresse
3. ✅ Vérifier la redirection vers `/login`
4. Se reconnecter
5. ✅ Vérifier le retour au dashboard

### Test 3 : Redirection automatique
1. Se déconnecter
2. Aller sur la page d'accueil `/`
3. ✅ Vérifier la redirection vers `/login`
4. Se connecter
5. ✅ Vérifier la redirection vers `/dashboard`
6. Essayer d'aller sur `/login`
7. ✅ Vérifier la redirection vers `/dashboard`

### Test 4 : Déconnexion
1. Connecté, aller sur le dashboard
2. Cliquer sur "Déconnexion" dans la sidebar
3. ✅ Vérifier la redirection vers `/login`
4. Essayer d'aller sur `/dashboard`
5. ✅ Vérifier la redirection vers `/login`

## Messages d'erreur

Le système traduit automatiquement les erreurs Supabase en français :

| Erreur Supabase | Message affiché |
|----------------|-----------------|
| Invalid login credentials | Email ou mot de passe incorrect |
| Email not confirmed | Veuillez confirmer votre email avant de vous connecter |
| Too many requests | Trop de tentatives. Veuillez réessayer dans quelques minutes |

## Validation des champs

### Email
- ✅ Requis
- ✅ Format email valide
- ✅ Validation en temps réel

### Mot de passe
- ✅ Requis
- ✅ Minimum 6 caractères
- ✅ Validation en temps réel

## Variables d'environnement

Fichier `.env.local` (déjà configuré) :
```env
NEXT_PUBLIC_SUPABASE_URL=https://wjrptrpnjpqtowveijbv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre_clé>
```

## Scripts utiles

### Tester l'authentification
```bash
./scripts/test-auth.sh
```

### Démarrer le serveur
```bash
npm run dev
```

### Build de production
```bash
npm run build
```

### Vérifier TypeScript
```bash
npx tsc --noEmit
```

## Troubleshooting rapide

### Erreur "Invalid login credentials"
→ Vérifier l'email et le mot de passe

### Erreur de compilation
→ Relancer `npm install` puis `npm run dev`

### Boucle de redirection
→ Effacer les cookies du navigateur et réessayer

### Session expirée
→ Se reconnecter

## Documentation complète

Pour plus de détails, consulter :
- `/AUTHENTICATION.md` - Documentation complète
- `/AUTH_SETUP_COMPLETE.md` - Résumé de l'implémentation

## Support

En cas de problème :
1. Vérifier les logs du navigateur (F12 → Console)
2. Vérifier les logs du serveur Next.js
3. Consulter la documentation Supabase

---

**✅ Le système d'authentification est maintenant complètement fonctionnel !**

Vous pouvez maintenant :
- Vous connecter avec les comptes de test
- Naviguer dans l'application
- Voir votre profil dans la sidebar
- Vous déconnecter

Bon développement ! 🚀
