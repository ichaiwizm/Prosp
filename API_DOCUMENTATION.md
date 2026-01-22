# API Documentation - Prospekt

## Vue d'ensemble

Cette API utilise un pattern catch-all pour respecter la limite Vercel de 12 functions. Chaque ressource principale (prospects, exchanges, notes, docs) a une seule route qui gère tous les endpoints.

## Structure des Routes

### 1. `/api/prospects/[...path]`

#### GET /api/prospects
Liste tous les prospects
```bash
curl https://your-domain.com/api/prospects
```

#### GET /api/prospects/[id]
Récupère un prospect spécifique
```bash
curl https://your-domain.com/api/prospects/123
```

#### GET /api/prospects/[id]/exchanges
Liste les exchanges d'un prospect
```bash
curl https://your-domain.com/api/prospects/123/exchanges
```

#### GET /api/prospects/[id]/notes
Liste les notes d'un prospect
```bash
curl https://your-domain.com/api/prospects/123/notes
```

#### GET /api/prospects/[id]/docs
Liste les documents d'un prospect
```bash
curl https://your-domain.com/api/prospects/123/docs
```

#### POST /api/prospects
Crée un nouveau prospect
```bash
curl -X POST https://your-domain.com/api/prospects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "ACME Corp",
    "status": "lead"
  }'
```

#### PUT /api/prospects/[id]
Met à jour un prospect
```bash
curl -X PUT https://your-domain.com/api/prospects/123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified"
  }'
```

#### DELETE /api/prospects/[id]
Supprime un prospect
```bash
curl -X DELETE https://your-domain.com/api/prospects/123
```

---

### 2. `/api/exchanges/[...path]`

#### GET /api/exchanges
Liste tous les exchanges (avec relations)
```bash
curl https://your-domain.com/api/exchanges
```

#### GET /api/exchanges?prospect_id=[id]
Liste les exchanges d'un prospect
```bash
curl https://your-domain.com/api/exchanges?prospect_id=123
```

#### GET /api/exchanges/[id]
Récupère un exchange spécifique
```bash
curl https://your-domain.com/api/exchanges/456
```

#### POST /api/exchanges
Crée un nouvel exchange
```bash
curl -X POST https://your-domain.com/api/exchanges \
  -H "Content-Type: application/json" \
  -d '{
    "prospect_id": "123",
    "type": "email",
    "subject": "Proposition commerciale",
    "content": "Contenu de l'email..."
  }'
```

#### PUT /api/exchanges/[id]
Met à jour un exchange
```bash
curl -X PUT https://your-domain.com/api/exchanges/456 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent"
  }'
```

#### DELETE /api/exchanges/[id]
Supprime un exchange
```bash
curl -X DELETE https://your-domain.com/api/exchanges/456
```

---

### 3. `/api/notes/[...path]`

#### GET /api/notes
Liste toutes les notes
```bash
curl https://your-domain.com/api/notes
```

#### GET /api/notes?prospect_id=[id]
Liste les notes d'un prospect
```bash
curl https://your-domain.com/api/notes?prospect_id=123
```

#### GET /api/notes/[id]
Récupère une note spécifique
```bash
curl https://your-domain.com/api/notes/789
```

#### POST /api/notes
Crée une nouvelle note
```bash
curl -X POST https://your-domain.com/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "prospect_id": "123",
    "content": "Appel téléphonique très productif",
    "type": "call"
  }'
```

#### PUT /api/notes/[id]
Met à jour une note
```bash
curl -X PUT https://your-domain.com/api/notes/789 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Note mise à jour"
  }'
```

#### DELETE /api/notes/[id]
Supprime une note
```bash
curl -X DELETE https://your-domain.com/api/notes/789
```

---

### 4. `/api/docs/[...path]`

#### GET /api/docs
Liste tous les documents
```bash
curl https://your-domain.com/api/docs
```

#### GET /api/docs?prospect_id=[id]
Liste les documents d'un prospect
```bash
curl https://your-domain.com/api/docs?prospect_id=123
```

#### GET /api/docs/[id]
Récupère un document spécifique
```bash
curl https://your-domain.com/api/docs/999
```

#### GET /api/docs/[id]/download
Génère une URL signée pour télécharger un document
```bash
curl https://your-domain.com/api/docs/999/download
```

#### POST /api/docs
Upload un nouveau document
```bash
curl -X POST https://your-domain.com/api/docs \
  -F "file=@/path/to/document.pdf" \
  -F "prospect_id=123" \
  -F "title=Contrat signé" \
  -F "description=Contrat de prestation signé"
```

#### PUT /api/docs/[id]
Met à jour les métadonnées d'un document
```bash
curl -X PUT https://your-domain.com/api/docs/999 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouveau titre",
    "description": "Nouvelle description"
  }'
```

#### DELETE /api/docs/[id]
Supprime un document (fichier + entrée DB)
```bash
curl -X DELETE https://your-domain.com/api/docs/999
```

---

### 5. `/api/assistant`

#### POST /api/assistant
Interagit avec l'assistant IA Claude
```bash
curl -X POST https://your-domain.com/api/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quelles actions devrais-je prendre pour ce prospect?",
    "prospectId": "123",
    "context": "Le prospect a manifesté un intérêt pour notre produit premium"
  }'
```

Réponse:
```json
{
  "message": "Basé sur les informations du prospect...",
  "usage": {
    "input_tokens": 250,
    "output_tokens": 180
  }
}
```

#### GET /api/assistant?prospect_id=[id]
Récupère l'historique des conversations (à implémenter)
```bash
curl https://your-domain.com/api/assistant?prospect_id=123
```

---

## Gestion des Erreurs

Toutes les routes retournent des erreurs au format JSON:

```json
{
  "error": "Description de l'erreur",
  "details": "Message détaillé de l'erreur"
}
```

Codes HTTP:
- `200` - Succès
- `201` - Création réussie
- `400` - Mauvaise requête
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## Configuration Requise

### Variables d'environnement

Créer un fichier `.env` à la racine du projet:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Base de données Supabase

Tables requises:
- `prospects`
- `exchanges`
- `notes`
- `documents`

Bucket Storage:
- `documents` (pour stocker les fichiers)

---

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement
# Éditer .env avec vos credentials

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

---

## Déploiement sur Vercel

1. Push le code sur GitHub
2. Importer le projet dans Vercel
3. Configurer les variables d'environnement dans Vercel
4. Déployer

Le pattern catch-all garantit que vous ne dépasserez pas la limite de 12 functions de Vercel.

---

## Avantages du Pattern Catch-All

1. **Limite Vercel respectée**: Seulement 5 routes API au lieu de 20+
2. **Maintenance simplifiée**: Toute la logique d'une ressource dans un seul fichier
3. **Performance**: Moins de cold starts sur Vercel
4. **Flexibilité**: Facile d'ajouter de nouveaux endpoints
5. **Organisation**: Code bien structuré et prévisible
