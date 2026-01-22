-- Create knowledge_docs table for documentation center
CREATE TABLE IF NOT EXISTS knowledge_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SITUATION', 'SERVICE', 'PROCESS', 'TEMPLATE')),
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_category ON knowledge_docs(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_tags ON knowledge_docs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_title ON knowledge_docs(title);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_updated_at ON knowledge_docs(updated_at DESC);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_search ON knowledge_docs USING gin(to_tsvector('french', title || ' ' || content));

-- Enable Row Level Security (RLS)
ALTER TABLE knowledge_docs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read knowledge docs
CREATE POLICY "Allow authenticated users to read knowledge docs"
  ON knowledge_docs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow admins to insert/update/delete knowledge docs
-- You can adjust this based on your user roles
CREATE POLICY "Allow admins to manage knowledge docs"
  ON knowledge_docs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_docs_updated_at
  BEFORE UPDATE ON knowledge_docs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Comprendre les besoins d''un prospect en phase de découverte',
  'SITUATION',
  '# Phase de découverte

## Objectif
La phase de découverte vise à comprendre en profondeur les besoins, défis et objectifs du prospect.

## Questions clés à poser

### Situation actuelle
- Quelle est votre situation actuelle concernant [domaine] ?
- Quels sont vos principaux défis ?
- Comment gérez-vous actuellement ce problème ?

### Objectifs
- Quels sont vos objectifs à court et long terme ?
- Qu''est-ce qui serait un succès pour vous ?
- Quels résultats espérez-vous obtenir ?

### Budget et décision
- Avez-vous prévu un budget pour cette initiative ?
- Qui sont les décideurs impliqués dans ce projet ?
- Quel est votre calendrier de décision ?

## Bonnes pratiques
- **Écouter activement** : Posez des questions ouvertes et écoutez attentivement
- **Prendre des notes** : Documentez tous les points importants
- **Identifier les pain points** : Comprenez vraiment ce qui pose problème
- **Qualifier le prospect** : Assurez-vous qu''il y a un fit',
  ARRAY['découverte', 'qualification', 'questions']
),
(
  'Présentation de nos services de conseil',
  'SERVICE',
  '# Services de Conseil Stratégique

## Vue d''ensemble
Nous accompagnons les entreprises dans leur transformation digitale et l''optimisation de leurs processus.

## Nos services

### 1. Audit et Diagnostic
- Analyse approfondie de votre situation actuelle
- Identification des opportunités d''amélioration
- Recommandations stratégiques personnalisées

**Durée** : 2-4 semaines
**Livrables** : Rapport d''audit complet, plan d''action

### 2. Accompagnement à la mise en œuvre
- Support dans l''implémentation des solutions
- Formation de vos équipes
- Suivi et optimisation continue

**Durée** : 3-6 mois
**Livrables** : Documentation, formations, support

### 3. Optimisation Continue
- Monitoring des KPIs
- Ajustements et améliorations
- Support technique et stratégique

**Durée** : Contrat annuel
**Livrables** : Rapports mensuels, recommandations

## Bénéfices
- Réduction des coûts opérationnels de 20-30%
- Amélioration de l''efficacité des processus
- ROI mesurable dès 6 mois',
  ARRAY['services', 'conseil', 'offre']
),
(
  'Processus de vente en 5 étapes',
  'PROCESS',
  '# Notre Processus de Vente

## Étape 1 : Qualification initiale
**Durée** : 1 appel (30 min)

**Objectifs** :
- Comprendre le besoin général
- Vérifier le fit avec notre offre
- Planifier la découverte

**Actions** :
- Appel de qualification
- Envoi d''un email de suivi
- Planification de la découverte

## Étape 2 : Découverte approfondie
**Durée** : 1-2 rendez-vous (1h chacun)

**Objectifs** :
- Analyser en détail la situation
- Identifier tous les pain points
- Comprendre les enjeux business

**Actions** :
- Entretien de découverte
- Prise de notes détaillée
- Validation des besoins

## Étape 3 : Proposition commerciale
**Durée** : 1 semaine de préparation + 1h de présentation

**Objectifs** :
- Présenter une solution sur-mesure
- Démontrer la valeur ajoutée
- Répondre aux questions

**Actions** :
- Rédaction de la proposition
- Préparation de la présentation
- Rendez-vous de présentation

## Étape 4 : Négociation
**Durée** : 1-2 semaines

**Objectifs** :
- Traiter les objections
- Ajuster l''offre si nécessaire
- Finaliser les conditions

**Actions** :
- Répondre aux objections
- Négocier les termes
- Préparer le contrat

## Étape 5 : Signature et onboarding
**Durée** : 1-2 semaines

**Objectifs** :
- Signer le contrat
- Lancer le projet
- Assurer une transition fluide

**Actions** :
- Signature du contrat
- Kick-off meeting
- Début de la prestation',
  ARRAY['processus', 'vente', 'méthodologie']
),
(
  'Template d''email de première prise de contact',
  'TEMPLATE',
  '# Email de première prise de contact

## Objet
[Prénom], une solution pour [pain point spécifique] ?

## Corps du message

Bonjour [Prénom],

Je me permets de vous contacter car j''ai remarqué que [Entreprise] [contexte spécifique / actualité de l''entreprise].

Chez [Notre Entreprise], nous aidons des entreprises comme la vôtre à [bénéfice principal] grâce à [solution/approche unique].

**Nos clients ont constaté** :
- [Bénéfice 1 avec chiffre]
- [Bénéfice 2 avec chiffre]
- [Bénéfice 3 avec chiffre]

**Seriez-vous disponible pour un échange de 15 minutes** la semaine prochaine afin de discuter de comment nous pourrions vous aider à [objectif spécifique] ?

Je reste à votre disposition.

Cordialement,
[Signature]

---

## Conseils d''utilisation

1. **Personnalisation** : Toujours personnaliser avec des informations spécifiques sur le prospect
2. **Concision** : Restez bref, l''email ne doit pas dépasser 150 mots
3. **Valeur** : Focus sur les bénéfices, pas sur les features
4. **Call-to-action** : Proposition claire et simple (appel de 15 min)
5. **Timing** : Envoyez entre mardi et jeudi, en milieu de matinée

## Taux de réponse attendu
- Bon ciblage + personnalisation : 15-25%
- Ciblage moyen : 5-10%
- Envoi en masse : <5%',
  ARRAY['template', 'email', 'prospection']
);
