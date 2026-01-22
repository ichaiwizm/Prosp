# Démarrage Rapide - Pages Prospects

## 1. Configuration de la base de données (OBLIGATOIRE)

### Étape 1.1 : Ouvrir Supabase
1. Aller sur https://supabase.com
2. Se connecter à votre projet
3. Ouvrir le SQL Editor

### Étape 1.2 : Exécuter le schéma SQL
1. Copier le contenu de `PROSPECTS_SCHEMA.sql`
2. Le coller dans l'éditeur SQL
3. Cliquer sur "Run" ou Ctrl+Enter
4. Vérifier qu'il n'y a pas d'erreurs

### Étape 1.3 : Vérifier les tables créées
Les tables suivantes doivent apparaître dans votre base :
- `prospects`
- `exchanges`
- `notes`
- `documents`

## 2. Lancer l'application

```bash
cd /home/ichai/dev/Prosp/prospekt
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 3. Tester les fonctionnalités

### 3.1 Créer un premier prospect
1. Aller sur `/prospects`
2. Cliquer sur "Nouveau prospect"
3. Remplir les champs obligatoires :
   - Entreprise : "Acme Corp"
   - Contact : "John Doe"
4. Optionnel : ajouter email, téléphone, site web
5. Choisir un status et une priorité
6. Cliquer sur "Créer"

### 3.2 Tester la liste
✅ Le tableau doit afficher votre prospect
✅ Tester la recherche : taper "Acme"
✅ Tester les filtres status et priorité
✅ Tester le tri en cliquant sur les colonnes
✅ Cliquer sur la ligne pour aller vers la fiche

### 3.3 Tester la fiche détaillée
1. Vous devriez voir toutes les infos du prospect
2. Tester l'édition :
   - Cliquer sur le badge Status
   - Choisir un nouveau status
   - Vérifier qu'il est mis à jour
3. Tester les besoins :
   - Cliquer sur le bouton d'édition à côté de "Besoin potentiel"
   - Saisir du texte
   - Enregistrer
   - Vérifier l'affichage

### 3.4 Tester les échanges
1. Aller sur l'onglet "Échanges"
2. Cliquer sur "Nouvel échange"
3. Choisir un type (ex: Appel)
4. Remplir l'objet et les notes
5. Cliquer sur "Ajouter"
6. Vérifier que l'échange apparaît dans la timeline

### 3.5 Tester les notes
1. Aller sur l'onglet "Notes"
2. Cliquer sur "Nouvelle note"
3. Choisir un type
4. Cocher "Épingler cette note"
5. Saisir du contenu
6. Cliquer sur "Ajouter"
7. Vérifier que la note apparaît en haut (épinglée)
8. Tester l'épinglage/désépinglage avec l'icône

### 3.6 Tester l'Assistant IA
1. Cliquer sur "Assistant IA"
2. Poser une question sur le prospect
3. Attendre la réponse
4. Continuer la conversation

## 4. Créer des données de test

Pour tester la pagination et les filtres, créez plusieurs prospects :

```sql
-- Exécuter dans le SQL Editor de Supabase
INSERT INTO prospects (company_name, contact_name, email, phone, status, priority, potential_need)
VALUES
  ('TechCorp', 'Alice Martin', 'alice@techcorp.com', '+33612345678', 'lead', 'high', 'Besoin d''automatisation'),
  ('DataCo', 'Bob Dupont', 'bob@dataco.fr', '+33698765432', 'contacted', 'medium', 'Analyse de données'),
  ('StartupXYZ', 'Claire Dubois', 'claire@startupxyz.com', NULL, 'qualified', 'urgent', 'Solution CRM'),
  ('MegaEnterprise', 'David Bernard', 'david@mega.com', '+33601020304', 'proposal', 'low', 'Consulting IT'),
  ('InnovCorp', 'Emma Rousseau', 'emma@innovcorp.fr', '+33655443322', 'negotiation', 'high', 'Cloud migration');
```

Après avoir inséré ces données, retournez sur `/prospects` et :
- Testez le tri par priorité
- Filtrez par status "lead"
- Recherchez "Tech"
- Vérifiez que tout fonctionne

## 5. Vérifications finales

### ✅ Checklist complète

**Liste prospects**
- [ ] Le tableau affiche tous les prospects
- [ ] La recherche fonctionne
- [ ] Les filtres status fonctionnent
- [ ] Les filtres priorité fonctionnent
- [ ] Le tri par colonne fonctionne
- [ ] La pagination apparaît (si plus de 20 prospects)
- [ ] Le clic sur une ligne navigue vers la fiche
- [ ] Le bouton "Nouveau prospect" ouvre le modal
- [ ] Le formulaire de création fonctionne
- [ ] Les badges status sont colorés
- [ ] Les badges priorité sont colorés

**Fiche prospect**
- [ ] Toutes les informations s'affichent
- [ ] Le bouton retour fonctionne
- [ ] Le bouton "Modifier" ouvre le formulaire
- [ ] Le clic sur le badge status ouvre le dialog
- [ ] Le clic sur le badge priorité ouvre le dialog
- [ ] L'édition du besoin potentiel fonctionne
- [ ] L'édition du besoin confirmé fonctionne
- [ ] Les liens email/téléphone/site web sont cliquables

**Échanges**
- [ ] L'onglet "Échanges" affiche la timeline
- [ ] Le bouton "Nouvel échange" ouvre le dialog
- [ ] Le formulaire d'ajout fonctionne
- [ ] Les icônes sont correctes selon le type
- [ ] Les couleurs sont différentes par type
- [ ] Les échanges sont triés par date

**Notes**
- [ ] L'onglet "Notes" affiche la liste
- [ ] Le bouton "Nouvelle note" ouvre le dialog
- [ ] Le formulaire d'ajout fonctionne
- [ ] Les notes épinglées sont en haut
- [ ] Le bouton épingler fonctionne
- [ ] Le bouton supprimer fonctionne (avec confirmation)
- [ ] Les badges de type sont colorés

**Assistant IA**
- [ ] Le bouton "Assistant IA" ouvre le panel
- [ ] Le chat fonctionne
- [ ] L'historique des messages s'affiche
- [ ] Le contexte du prospect est inclus
- [ ] Le bouton fermer fonctionne

## 6. Problèmes courants

### Erreur : "Table prospects doesn't exist"
**Solution :** Vous n'avez pas exécuté le fichier PROSPECTS_SCHEMA.sql dans Supabase. Retournez à l'étape 1.

### Erreur : "Column company_name doesn't exist"
**Solution :** Votre table prospects utilise l'ancien schéma. Soit :
- Supprimer la table et recréer avec le nouveau schéma
- Ou exécuter le script de migration dans PROSPECTS_IMPLEMENTATION.md

### Les prospects ne s'affichent pas
**Solution :** Vérifier :
1. Les credentials Supabase dans `.env.local`
2. Les logs de la console navigateur (F12)
3. Les logs du serveur de développement
4. Que RLS n'est pas activé (ou que les policies sont correctes)

### L'Assistant IA ne répond pas
**Solution :** Vérifier :
1. Que l'API Anthropic est configurée dans les variables d'environnement
2. Les logs de la route `/api/assistant`
3. Qu'il y a des crédits API disponibles

### Le formulaire ne se soumet pas
**Solution :** Vérifier :
1. La console navigateur pour les erreurs JavaScript
2. Que les champs obligatoires sont remplis
3. Les logs réseau (onglet Network dans F12)

## 7. Prochaines étapes

Une fois que tout fonctionne :

1. **Personnaliser le design**
   - Ajuster les couleurs des badges si nécessaire
   - Modifier les espacements
   - Adapter le responsive mobile

2. **Ajouter des fonctionnalités**
   - Export CSV de la liste
   - Import de prospects en masse
   - Gestion des documents
   - Calendrier des rendez-vous

3. **Optimiser les performances**
   - Ajouter du caching
   - Optimiser les requêtes SQL
   - Implémenter le lazy loading

4. **Sécurité**
   - Activer RLS sur les tables
   - Ajouter les permissions par rôle
   - Implémenter l'audit trail

## Support

Pour toute question :
1. Consulter `PROSPECTS_IMPLEMENTATION.md` pour plus de détails
2. Vérifier les logs du serveur et de la console
3. Consulter la documentation Supabase : https://supabase.com/docs
4. Consulter la documentation Next.js : https://nextjs.org/docs

## Résumé

**Temps estimé pour la mise en route : 10-15 minutes**

1. ⏱️ 5 min - Exécuter le SQL dans Supabase
2. ⏱️ 2 min - Lancer l'application
3. ⏱️ 5 min - Créer un prospect et tester
4. ⏱️ 3 min - Créer des données de test

**Vous êtes prêt !** 🎉

Toutes les pages prospects sont maintenant opérationnelles et prêtes à être utilisées.
