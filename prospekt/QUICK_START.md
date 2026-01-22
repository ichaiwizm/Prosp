# Quick Start - Centre de Documentation et Assistant IA

Guide ultra-rapide pour démarrer en 5 minutes.

## Étape 1 : Base de données (2 min)

1. Ouvrez Supabase → SQL Editor
2. Copiez/collez le contenu de `/supabase/migrations/create_knowledge_docs.sql`
3. Cliquez sur "Run"

✅ Vérifiez : Vous devriez voir 4 documents avec `SELECT * FROM knowledge_docs;`

## Étape 2 : Variables d'environnement (1 min)

Ajoutez dans `.env.local` :
```env
ANTHROPIC_API_KEY=sk-ant-votre-cle-ici
```

Obtenez votre clé sur https://console.anthropic.com

## Étape 3 : Redémarrer (30 sec)

```bash
# Arrêter (Ctrl+C)
npm run dev
```

## Étape 4 : Tester (1 min)

### Centre de Documentation
1. Ouvrez http://localhost:3000
2. Cliquez sur "Docs" dans la sidebar
3. Vous devriez voir 4 documents

### Assistant IA
1. Allez dans "Prospects"
2. Cliquez sur un prospect
3. Cliquez sur "Assistant IA"
4. Tapez une question

## C'est tout !

**Problème ?** → Consultez `/INSTALLATION_GUIDE.md`

**Plus de détails ?** → Consultez `/DOCS_ASSISTANT_README.md`

---

## URLs importantes

- Centre de documentation : http://localhost:3000/docs
- Exemple de document : http://localhost:3000/docs/[id]
- Assistant IA : Depuis n'importe quelle fiche prospect

## Fichiers importants

```
Guides :
├── QUICK_START.md          ← Vous êtes ici
├── INSTALLATION_GUIDE.md   ← Guide détaillé
├── DOCS_ASSISTANT_README.md← Documentation complète
├── SUMMARY.md              ← Résumé des fonctionnalités
└── FILES_CREATED.md        ← Liste des fichiers créés

Migration :
└── supabase/migrations/create_knowledge_docs.sql

Code principal :
├── src/app/(app)/docs/     ← Pages documentation
├── src/app/api/knowledge-docs/ ← API documents
├── src/components/features/docs/ ← Composants docs
└── src/components/features/assistant/ ← Composants assistant
```

## Checklist rapide

- [ ] Migration SQL exécutée
- [ ] 4 documents visibles dans Supabase
- [ ] `ANTHROPIC_API_KEY` dans `.env.local`
- [ ] Serveur redémarré
- [ ] Page `/docs` accessible
- [ ] Assistant ouvre depuis un prospect
- [ ] Assistant répond aux questions

## Commandes utiles

```bash
# Vérifier que tout compile
npm run build

# Lancer les tests (si configurés)
npm test

# Vérifier le linting
npm run lint
```

## Prochaines étapes

1. **Personnaliser** : Ajoutez vos propres documents
2. **Ajuster** : Modifiez les couleurs et le design
3. **Étendre** : Ajoutez de nouvelles fonctionnalités
4. **Déployer** : Mettez en production

---

**Besoin d'aide ?**

- Erreur API → Vérifiez la clé Anthropic
- Pas de documents → Vérifiez la migration SQL
- Permission denied → Vérifiez les policies RLS

**Tout fonctionne ?** 🎉

Consultez `SUMMARY.md` pour voir toutes les fonctionnalités disponibles !
