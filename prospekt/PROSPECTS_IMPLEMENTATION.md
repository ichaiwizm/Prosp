# Pages Prospects - Documentation d'implémentation

## Vue d'ensemble

Ce document décrit l'implémentation complète des pages prospects pour Prospekt, incluant la liste, la fiche détaillée, et tous les composants associés.

## Structure des fichiers créés

### Pages

1. **`src/app/(app)/prospects/page.tsx`** - Liste des prospects
   - Tableau avec colonnes : Entreprise, Contact, Status, Priorité, Dernier échange, Actions
   - Filtres : Status (dropdown), Priorité (dropdown), Recherche texte
   - Tri par colonnes cliquables
   - Pagination (20 par page)
   - Click sur ligne → navigation vers /prospects/[id]

2. **`src/app/(app)/prospects/[id]/page.tsx`** - Fiche prospect détaillée
   - Header avec informations principales
   - Badges Status et Priorité (éditables via dialog)
   - Section Besoin potentiel (éditable)
   - Section Besoin confirmé (éditable)
   - Onglets pour Échanges et Notes
   - Bouton Assistant IA (placeholder)

### Composants features

3. **`src/components/features/prospects/status-badge.tsx`** - Badge de status
   - Badges colorés pour chaque status
   - Colors: lead (gris), contacted (bleu), qualified (violet), proposal (indigo), negotiation (jaune), won (vert), lost (rouge)

4. **`src/components/features/prospects/priority-badge.tsx`** - Badge de priorité
   - Badges colorés pour chaque priorité
   - Colors: low (gris), medium (bleu), high (orange), urgent (rouge)

5. **`src/components/features/prospects/prospect-form.tsx`** - Formulaire prospect
   - Modal avec formulaire complet
   - Tous les champs : company_name, contact_name, email, phone, website, status, priority, potential_need, confirmed_need, source
   - Validation et gestion d'erreurs
   - Mode création et édition

6. **`src/components/features/exchanges/exchange-list.tsx`** - Liste et timeline des échanges
   - Affichage chronologique
   - Icônes selon type (call, email, meeting, linkedin, other)
   - Badges pour direction (entrant/sortant) et status
   - Formulaire d'ajout d'échange
   - Intégration avec API

7. **`src/components/features/notes/notes-list.tsx`** - Liste des notes
   - Notes épinglées en haut
   - Types de notes avec badges colorés
   - Formulaire d'ajout de note
   - Actions : épingler, supprimer
   - Intégration avec API

### Composants shared

8. **`src/components/shared/Pagination.tsx`** - Composant de pagination
   - Affichage du nombre d'items
   - Boutons Précédent/Suivant
   - Numéros de page cliquables
   - Ellipsis pour les pages intermédiaires

### Types

9. **`src/types/database.types.ts`** (mis à jour)
   - Interface Prospect avec nouveaux champs :
     - `company_name` : Nom de l'entreprise
     - `contact_name` : Nom du contact
     - `website` : Site web
     - `priority` : Priorité (low, medium, high, urgent)
     - `potential_need` : Besoin potentiel
     - `confirmed_need` : Besoin confirmé
     - `last_exchange` : Date du dernier échange
   - Interfaces CreateProspectRequest et UpdateProspectRequest mises à jour

### Base de données

10. **`PROSPECTS_SCHEMA.sql`** - Schéma SQL complet
    - Table prospects avec tous les nouveaux champs
    - Table exchanges pour l'historique des échanges
    - Table notes pour les notes sur le prospect
    - Table documents pour les fichiers liés
    - Indexes pour les performances
    - Triggers pour updated_at
    - Trigger pour mettre à jour last_exchange automatiquement

## Fonctionnalités implémentées

### Page Liste Prospects

✅ **Tableau complet**
- Colonnes : Entreprise, Contact, Status, Priorité, Dernier échange, Actions
- Affichage des informations de contact (email, téléphone) cliquables
- Lien vers le site web de l'entreprise
- Hover states sur les lignes

✅ **Filtres**
- Recherche textuelle (entreprise, contact, email)
- Filtre par status (dropdown)
- Filtre par priorité (dropdown)
- Filtrage en temps réel

✅ **Tri**
- Tri par entreprise, contact, status, priorité, dernier échange
- Direction ascendante/descendante
- Indicateur visuel de la colonne triée

✅ **Pagination**
- 20 items par page
- Navigation entre pages
- Affichage du nombre total de résultats
- Ellipsis pour les grandes listes

✅ **Actions**
- Bouton "Nouveau prospect" ouvre le modal de création
- Click sur une ligne navigue vers la fiche détaillée
- Bouton "Voir détails" dans chaque ligne

### Page Fiche Prospect

✅ **Header**
- Nom de l'entreprise (titre principal)
- Nom du contact (sous-titre)
- Bouton retour vers la liste
- Bouton "Modifier" ouvre le formulaire
- Bouton "Assistant IA" (placeholder)

✅ **Informations principales**
- Section Entreprise : nom, site web cliquable
- Section Contact : nom, email, téléphone (liens cliquables)
- Section État : badges status et priorité cliquables pour modification

✅ **Sections Besoins**
- Besoin potentiel : affichage + édition via dialog
- Besoin confirmé : affichage + édition via dialog
- Bouton d'édition pour chaque section

✅ **Onglets**
- Onglet Échanges : timeline complète des interactions
- Onglet Notes : liste des notes avec épinglage

✅ **Dialogs d'édition**
- Dialog pour modifier le status
- Dialog pour modifier la priorité
- Dialog pour éditer les besoins
- Formulaire complet pour modifier toutes les infos

### Composant Échanges

✅ **Timeline**
- Affichage chronologique des échanges
- Icônes selon le type (appel, email, réunion, LinkedIn, autre)
- Couleurs distinctes par type
- Badges direction (entrant/sortant) et status

✅ **Formulaire d'ajout**
- Type d'échange (dropdown)
- Direction (entrant/sortant)
- Objet
- Notes détaillées
- Validation et gestion d'erreurs

### Composant Notes

✅ **Affichage**
- Notes épinglées en premier
- Séparation visuelle entre notes épinglées et normales
- Types de notes avec badges colorés
- Date de création

✅ **Actions**
- Bouton d'ajout de note
- Épingler/désépingler une note
- Supprimer une note (avec confirmation)

✅ **Formulaire d'ajout**
- Type de note (dropdown)
- Checkbox pour épingler
- Zone de texte pour le contenu
- Validation

## Design System

### Couleurs des badges

**Status**
- Lead : Gris (#gray-100/800)
- Contacté : Bleu (#blue-100/800)
- Qualifié : Violet (#purple-100/800)
- Proposition : Indigo (#indigo-100/800)
- Négociation : Jaune (#yellow-100/800)
- Gagné : Vert (#green-100/800)
- Perdu : Rouge (#red-100/800)

**Priorité**
- Basse : Gris (#gray-100/600)
- Moyenne : Bleu (#blue-100/700)
- Haute : Orange (#orange-100/700)
- Urgente : Rouge (#red-100/700)

**Types d'échange**
- Appel : Bleu
- Email : Violet
- Réunion : Vert
- LinkedIn : Indigo
- Autre : Gris

**Types de note**
- Générale : Gris
- Appel : Bleu
- Réunion : Vert
- Rappel : Jaune
- Suivi : Violet

### Spacing et layout

- Padding de page : `p-6`
- Espacement entre sections : `space-y-6`
- Espacement entre éléments : `space-y-4`
- Gap dans les grids : `gap-4` ou `gap-6`
- Border radius : `rounded-lg` pour les cards

### Composants UI utilisés

- Button (variants: default, outline, ghost, destructive)
- Card
- Input
- Textarea
- Select
- Dialog
- Tabs
- Badge
- Skeleton (pour le loading)

## API utilisée

### Endpoints

**Prospects**
- `GET /api/prospects` - Liste des prospects
- `GET /api/prospects/[id]` - Détail d'un prospect
- `POST /api/prospects` - Créer un prospect
- `PUT /api/prospects/[id]` - Mettre à jour un prospect
- `DELETE /api/prospects/[id]` - Supprimer un prospect

**Exchanges**
- `GET /api/exchanges?prospect_id=[id]` - Liste des échanges d'un prospect
- `POST /api/exchanges` - Créer un échange
- `PUT /api/exchanges/[id]` - Mettre à jour un échange
- `DELETE /api/exchanges/[id]` - Supprimer un échange

**Notes**
- `GET /api/notes?prospect_id=[id]` - Liste des notes d'un prospect
- `POST /api/notes` - Créer une note
- `PUT /api/notes/[id]` - Mettre à jour une note
- `DELETE /api/notes/[id]` - Supprimer une note

### Client API

Le fichier `src/lib/api-client.ts` fournit des fonctions helpers :
- `prospectsApi.list()`, `get()`, `create()`, `update()`, `delete()`
- `exchangesApi.listByProspect()`, `create()`, `update()`, `delete()`
- `notesApi.listByProspect()`, `create()`, `update()`, `delete()`

## Installation et configuration

### 1. Base de données

Exécuter le fichier `PROSPECTS_SCHEMA.sql` dans Supabase :

```bash
# Via l'éditeur SQL de Supabase
# Copier/coller le contenu de PROSPECTS_SCHEMA.sql
```

### 2. Vérifier les types

Les types TypeScript sont déjà mis à jour dans `src/types/database.types.ts`.

### 3. Lancer l'application

```bash
cd /home/ichai/dev/Prosp/prospekt
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Points d'attention

### Permissions

Les permissions par rôle mentionnées (TECH peut éditer potential_need, COMMERCIAL peut éditer confirmed_need) ne sont **pas implémentées** dans le code actuel. Pour les ajouter :

1. Ajouter un champ `role` dans la table users
2. Créer un contexte ou hook pour vérifier le rôle
3. Conditionner l'affichage des boutons d'édition selon le rôle
4. Ajouter des vérifications côté API

### Assistant IA

Le bouton "Assistant IA" est présent mais la fonctionnalité est un placeholder. Pour l'implémenter :

1. Utiliser l'API `/api/assistant` existante
2. Créer un composant de chat
3. Gérer l'historique des conversations
4. Intégrer les données du prospect dans le contexte

### Navigation

Le routing utilise le système App Router de Next.js 15 avec le dossier `(app)` pour grouper les routes authentifiées. Si vous utilisez un layout différent, adaptez les imports.

### Tests

Aucun test n'a été écrit. Pour ajouter des tests :

1. Installer Jest et React Testing Library
2. Tester les composants isolément
3. Tester les interactions utilisateur
4. Mocker les appels API

## Migration depuis l'ancien schéma

Si vous avez déjà une table `prospects` avec l'ancien schéma, voici le script de migration :

```sql
-- Ajouter les nouveaux champs
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS potential_need TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS confirmed_need TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS last_exchange TIMESTAMP WITH TIME ZONE;

-- Migrer les données si nécessaire
UPDATE prospects SET company_name = company WHERE company_name IS NULL;
UPDATE prospects SET contact_name = name WHERE contact_name IS NULL;

-- Supprimer les anciens champs si vous le souhaitez
-- ALTER TABLE prospects DROP COLUMN IF EXISTS company;
-- ALTER TABLE prospects DROP COLUMN IF EXISTS name;

-- Ajouter les contraintes
ALTER TABLE prospects ALTER COLUMN company_name SET NOT NULL;
ALTER TABLE prospects ALTER COLUMN contact_name SET NOT NULL;
ALTER TABLE prospects ADD CONSTRAINT check_priority
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
```

## Support et maintenance

Pour toute question ou problème :

1. Vérifier que le schéma SQL est bien appliqué
2. Vérifier que les variables d'environnement Supabase sont configurées
3. Consulter les logs du serveur de développement
4. Vérifier la console du navigateur pour les erreurs JavaScript

## Améliorations futures

- [ ] Gestion des permissions par rôle
- [ ] Assistant IA fonctionnel
- [ ] Export de la liste en CSV/Excel
- [ ] Import de prospects en masse
- [ ] Gestion des documents/pièces jointes
- [ ] Notifications pour les suivis
- [ ] Calendrier des rendez-vous
- [ ] Statistiques et rapports
- [ ] Recherche avancée avec filtres multiples
- [ ] Vue Kanban pour le pipeline
- [ ] Intégration email (lecture/envoi)
- [ ] Intégration LinkedIn
- [ ] Mobile responsive (à vérifier)
- [ ] Dark mode (si pas déjà géré par le thème)
