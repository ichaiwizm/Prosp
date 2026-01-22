# Guide d'installation - Centre de Documentation et Assistant IA

Ce guide vous accompagne pas à pas pour mettre en place le centre de documentation et l'assistant IA dans Prospekt.

## Prérequis

- Node.js 18+ installé
- Compte Supabase actif
- Compte Anthropic (pour l'API Claude)
- Accès à votre projet Prospekt

## Étape 1 : Configuration de la base de données

### 1.1 Créer la table knowledge_docs

1. Ouvrez votre projet Supabase dans le dashboard
2. Allez dans l'éditeur SQL (SQL Editor)
3. Copiez le contenu du fichier `/supabase/migrations/create_knowledge_docs.sql`
4. Exécutez le script SQL

Cela va créer :
- La table `knowledge_docs`
- Les index pour la performance
- Les policies RLS pour la sécurité
- 4 documents d'exemple

### 1.2 Vérifier la création

Exécutez cette requête pour vérifier :
```sql
SELECT * FROM knowledge_docs;
```

Vous devriez voir 4 documents d'exemple.

### 1.3 Configurer les permissions (optionnel)

Si vous voulez autoriser certains utilisateurs à créer/modifier des documents :

```sql
-- Ajouter un champ role à la table profiles si ce n'est pas déjà fait
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Définir un utilisateur comme admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'votre.email@example.com';
```

## Étape 2 : Configuration des variables d'environnement

### 2.1 Vérifier les variables Supabase

Ouvrez votre fichier `.env.local` et vérifiez que ces variables existent :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

### 2.2 Ajouter la clé API Anthropic

Ajoutez cette variable pour l'assistant IA :

```env
ANTHROPIC_API_KEY=sk-ant-votre-cle-api
```

Pour obtenir une clé API :
1. Créez un compte sur https://console.anthropic.com
2. Allez dans "API Keys"
3. Créez une nouvelle clé
4. Copiez-la dans votre `.env.local`

### 2.3 Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Redémarrez-le
npm run dev
```

## Étape 3 : Vérification de l'installation

### 3.1 Tester le centre de documentation

1. Ouvrez votre navigateur à `http://localhost:3000`
2. Connectez-vous à votre compte
3. Cliquez sur "Docs" dans la sidebar
4. Vous devriez voir les 4 documents d'exemple

Testez :
- La recherche (tapez "découverte" par exemple)
- Les filtres par catégorie
- Cliquez sur un document pour voir le détail
- Vérifiez le rendu markdown

### 3.2 Tester l'assistant IA

1. Allez dans "Prospects"
2. Cliquez sur un prospect existant
3. Cliquez sur le bouton "Assistant IA" en haut à droite
4. Le panel devrait s'ouvrir avec :
   - Les informations du prospect dans la sidebar
   - Un message de bienvenue
   - Une zone de saisie de message

Testez :
- Posez une question comme "Quels sont les points clés à aborder ?"
- Vérifiez que l'assistant répond
- Vérifiez que le contexte du prospect est pris en compte

## Étape 4 : Personnalisation (optionnel)

### 4.1 Ajouter vos propres documents

Vous pouvez ajouter des documents via l'API ou directement dans Supabase :

#### Via SQL (Supabase)
```sql
INSERT INTO knowledge_docs (title, category, content, tags)
VALUES (
  'Mon document personnalisé',
  'SERVICE',
  '# Contenu en markdown\n\nVotre contenu ici...',
  ARRAY['tag1', 'tag2']
);
```

#### Via l'API (pour les admins)
```javascript
const response = await fetch('/api/knowledge-docs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Mon document',
    category: 'SERVICE',
    content: '# Contenu\n\nVotre contenu...',
    tags: ['tag1', 'tag2']
  })
});
```

### 4.2 Personnaliser l'assistant

Modifiez le fichier `/src/app/api/assistant/route.ts` pour :
- Changer le modèle Claude utilisé
- Ajuster le system prompt
- Ajouter plus de contexte
- Modifier la longueur des réponses

### 4.3 Personnaliser le design

Les couleurs des catégories sont définies dans :
- `/src/components/features/docs/doc-card.tsx`
- `/src/app/(app)/docs/[id]/page.tsx`

Modifiez la constante `categoryColors` pour changer les couleurs.

## Étape 5 : Déploiement

### 5.1 Vérifier les variables d'environnement en production

Dans votre plateforme de déploiement (Vercel, Netlify, etc.), configurez :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
```

### 5.2 Build et déploiement

```bash
npm run build
npm start
```

ou

```bash
# Si vous utilisez Vercel
vercel --prod
```

## Dépannage

### Problème : "Document not found"

**Solution** : Vérifiez que la migration SQL a bien été exécutée dans Supabase.

### Problème : "Anthropic API error"

**Solutions** :
1. Vérifiez que `ANTHROPIC_API_KEY` est bien configurée
2. Vérifiez que votre clé API est valide
3. Vérifiez que vous avez des crédits sur votre compte Anthropic

### Problème : "Failed to fetch documents"

**Solutions** :
1. Vérifiez que la table `knowledge_docs` existe
2. Vérifiez les policies RLS dans Supabase
3. Vérifiez que l'utilisateur est bien authentifié

### Problème : Les documents ne s'affichent pas

**Solutions** :
1. Ouvrez la console du navigateur (F12) et vérifiez les erreurs
2. Vérifiez que l'API `/api/knowledge-docs` retourne bien des données
3. Vérifiez les permissions RLS dans Supabase

### Problème : L'assistant ne répond pas

**Solutions** :
1. Vérifiez la clé API Anthropic
2. Ouvrez la console du navigateur pour voir les erreurs
3. Vérifiez les logs du serveur
4. Assurez-vous que l'API `/api/assistant` fonctionne

## Vérification des permissions RLS

Si vous avez des problèmes de permissions, vérifiez les policies dans Supabase :

```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'knowledge_docs';

-- Si nécessaire, recréer la policy de lecture
DROP POLICY IF EXISTS "Allow authenticated users to read knowledge docs" ON knowledge_docs;
CREATE POLICY "Allow authenticated users to read knowledge docs"
  ON knowledge_docs
  FOR SELECT
  TO authenticated
  USING (true);
```

## Support et ressources

- Documentation Supabase : https://supabase.com/docs
- Documentation Anthropic : https://docs.anthropic.com
- Documentation Next.js : https://nextjs.org/docs

## Checklist de vérification

- [ ] Table `knowledge_docs` créée dans Supabase
- [ ] 4 documents d'exemple visibles dans la base de données
- [ ] Variables d'environnement configurées (Supabase + Anthropic)
- [ ] Serveur redémarré après ajout des variables
- [ ] Centre de documentation accessible à `/docs`
- [ ] Recherche et filtres fonctionnels
- [ ] Vue détaillée des documents fonctionne
- [ ] Assistant IA s'ouvre depuis la page prospect
- [ ] Assistant IA répond aux questions
- [ ] Contexte du prospect affiché dans l'assistant

---

Si tout est coché, vous êtes prêt à utiliser le centre de documentation et l'assistant IA !

Pour toute question, référez-vous au fichier `DOCS_ASSISTANT_README.md` pour plus de détails techniques.
