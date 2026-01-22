-- ============================================================================
-- PROSPEKT - Seed Data
-- ============================================================================
-- Ce fichier insere toutes les donnees de test pour l'application Prospekt
-- ============================================================================

-- ============================================================================
-- 1. TAGS DE BASE
-- ============================================================================
-- Tags utiles pour categoriser les prospects

INSERT INTO tags (name, color) VALUES
  ('CRM', '#6366f1'),
  ('Automatisation', '#8b5cf6'),
  ('PME', '#f59e0b'),
  ('Dashboard', '#3b82f6'),
  ('App interne', '#10b981'),
  ('Site vitrine', '#ec4899'),
  ('Reservation', '#14b8a6'),
  ('Agenda', '#f97316'),
  ('Portail client', '#0ea5e9'),
  ('Securite', '#ef4444'),
  ('Documents', '#84cc16'),
  ('E-commerce', '#d946ef'),
  ('Mode', '#f472b6'),
  ('App mobile', '#22c55e'),
  ('Sante', '#06b6d4'),
  ('RDV', '#a855f7'),
  ('Site web', '#2563eb'),
  ('Immobilier', '#eab308')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 2. PROSPECTS DE TEST
-- ============================================================================
-- 8 prospects representatifs pour tester l'application

-- Mapping des statuts du plan vers les enums de la DB:
-- NEW -> lead
-- TO_CONTACT -> lead
-- IN_DISCUSSION -> contacted
-- NEED_CONFIRMED -> qualified
-- IN_PROGRESS -> proposal
-- ON_HOLD -> negotiation
-- LOST -> lost

-- Prospect 1: Acme Corp
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  tags
) VALUES (
  'Acme Corp',
  'Jean Dupont',
  'jean.dupont@acme-corp.fr',
  '+33 1 23 45 67 89',
  'https://acme-corp.fr',
  'contacted',
  'high',
  'LinkedIn',
  'CRM sur mesure pour gerer leur portefeuille clients. Besoin de suivi des interactions et reporting.',
  '15000-25000 EUR',
  '3-4 mois',
  ARRAY['CRM', 'PME', 'Dashboard']
);

-- Prospect 2: Tech Startup
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  confirmed_need, confirmed_budget, confirmed_timeline, confirmed_scope,
  tags
) VALUES (
  'Tech Startup',
  'Alice Bernard',
  'alice@techstartup.io',
  '+33 6 12 34 56 78',
  'https://techstartup.io',
  'qualified',
  'urgent',
  'Recommandation',
  'Dashboard interne pour suivre les KPIs de l equipe et les metriques produit.',
  '10000-20000 EUR',
  '2 mois',
  'Dashboard temps reel avec integration API (Stripe, Mixpanel, Slack). 5 utilisateurs. Authentification SSO.',
  '18000 EUR',
  'Livraison fin mars',
  'Phase 1: Dashboard KPIs (6 semaines) | Phase 2: Alertes et notifications (2 semaines) | Phase 3: Export et reporting (2 semaines)',
  ARRAY['Dashboard', 'App interne', 'Automatisation']
);

-- Prospect 3: Restaurant Le Bon
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  tags
) VALUES (
  'Restaurant Le Bon',
  'Marc Petit',
  'contact@restaurant-lebon.fr',
  '+33 4 56 78 90 12',
  'https://restaurant-lebon.fr',
  'lead',
  'medium',
  'Google',
  'Site vitrine avec systeme de reservation en ligne. Presentation du menu et des evenements.',
  '3000-5000 EUR',
  '1-2 mois',
  ARRAY['Site vitrine', 'Reservation', 'PME']
);

-- Prospect 4: Garage Martin
INSERT INTO prospects (
  company_name, contact_name, email, phone,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  tags
) VALUES (
  'Garage Martin',
  'Pierre Martin',
  'garage.martin@gmail.com',
  '+33 3 21 43 65 87',
  'lead',
  'low',
  'Bouche a oreille',
  'Application de gestion des RDV clients. Rappels automatiques par SMS.',
  '2000-4000 EUR',
  '2-3 mois',
  ARRAY['RDV', 'Agenda', 'Automatisation', 'PME']
);

-- Prospect 5: Cabinet Avocat Durand
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  tags
) VALUES (
  'Cabinet Avocat Durand',
  'Sophie Durand',
  'sophie.durand@cabinet-durand.fr',
  '+33 1 98 76 54 32',
  'https://cabinet-durand.fr',
  'contacted',
  'high',
  'LinkedIn',
  'Portail client securise pour partage de documents confidentiels. Suivi des dossiers en temps reel.',
  '20000-35000 EUR',
  '4-6 mois',
  ARRAY['Portail client', 'Securite', 'Documents']
);

-- Prospect 6: Boutique Mode Paris
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  tags
) VALUES (
  'Boutique Mode Paris',
  'Claire Fashion',
  'claire@boutique-mode-paris.fr',
  '+33 6 55 44 33 22',
  'https://boutique-mode-paris.fr',
  'lost',
  'medium',
  'Instagram',
  'Site e-commerce avec gestion des stocks et integration paiement.',
  '8000-12000 EUR',
  '2-3 mois',
  ARRAY['E-commerce', 'Mode', 'Site web']
);

-- Prospect 7: Clinique Sante+
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  confirmed_need, confirmed_budget, confirmed_timeline, confirmed_scope,
  tags
) VALUES (
  'Clinique Sante+',
  'Dr. Martin',
  'dr.martin@clinique-santeplus.fr',
  '+33 1 11 22 33 44',
  'https://clinique-santeplus.fr',
  'proposal',
  'high',
  'Recommandation',
  'Application mobile pour prise de RDV patients. Rappels automatiques et teleconsultation.',
  '30000-50000 EUR',
  '4-6 mois',
  'App mobile iOS/Android pour prise de RDV. Integration avec le logiciel medical existant. Module teleconsultation video.',
  '42000 EUR',
  'MVP en 3 mois, version complete en 5 mois',
  'Phase 1: App RDV basique (8 semaines) | Phase 2: Integration logiciel medical (4 semaines) | Phase 3: Teleconsultation (6 semaines)',
  ARRAY['App mobile', 'Sante', 'RDV', 'Automatisation']
);

-- Prospect 8: Agence Immobiliere Centrale
INSERT INTO prospects (
  company_name, contact_name, email, phone, website,
  status, priority, source,
  potential_need, potential_budget, potential_timeline,
  tags
) VALUES (
  'Agence Immobiliere Centrale',
  'Francois Immo',
  'f.immo@agence-centrale.fr',
  '+33 5 66 77 88 99',
  'https://agence-immobiliere-centrale.fr',
  'negotiation',
  'medium',
  'Site web',
  'Refonte complete du site avec CRM integre pour suivi des mandats et des clients.',
  '25000-40000 EUR',
  '4-5 mois',
  ARRAY['Site web', 'CRM', 'Immobilier']
);

-- ============================================================================
-- 3. EXCHANGES (ECHANGES DE TEST)
-- ============================================================================
-- Historique des echanges avec les prospects

-- Echanges pour Acme Corp (3 echanges)
INSERT INTO exchanges (prospect_id, type, subject, content, summary, direction, status, created_at)
SELECT
  p.id,
  'EMAIL'::exchange_type,
  'Premier contact LinkedIn',
  'Bonjour Jean, suite a notre connexion sur LinkedIn, je me permets de vous contacter concernant vos besoins en CRM...',
  'Premier contact suite a une connexion LinkedIn. Jean interesse par une solution CRM.',
  'outbound',
  'sent',
  NOW() - INTERVAL '14 days'
FROM prospects p WHERE p.company_name = 'Acme Corp';

INSERT INTO exchanges (prospect_id, type, subject, content, summary, outcome, direction, status, created_at)
SELECT
  p.id,
  'CALL'::exchange_type,
  'Appel decouverte',
  'Appel de 30 minutes pour comprendre les besoins. Jean a explique qu ils utilisent actuellement Excel pour gerer leurs clients.',
  'Decouverte des besoins: ~200 clients, 3 commerciaux, besoin de suivi des interactions.',
  'Jean va en parler a son associe. Relance prevue dans 1 semaine.',
  'outbound',
  'completed',
  NOW() - INTERVAL '10 days'
FROM prospects p WHERE p.company_name = 'Acme Corp';

INSERT INTO exchanges (prospect_id, type, subject, content, summary, direction, status, created_at)
SELECT
  p.id,
  'EMAIL'::exchange_type,
  'Envoi documentation CRM',
  'Suite a notre appel, voici la documentation sur notre solution CRM personnalisee...',
  'Envoi de la documentation technique et des cas clients similaires.',
  'outbound',
  'sent',
  NOW() - INTERVAL '7 days'
FROM prospects p WHERE p.company_name = 'Acme Corp';

-- Echanges pour Tech Startup (2 echanges)
INSERT INTO exchanges (prospect_id, type, subject, content, summary, outcome, direction, status, created_at)
SELECT
  p.id,
  'MEETING'::exchange_type,
  'RDV presentation besoins',
  'Meeting avec Alice et son CTO pour definir les besoins du dashboard. Discussion sur les integrations necessaires.',
  'Presentation detaillee des besoins. Dashboard KPIs temps reel avec 5 sources de donnees.',
  'Besoin confirme. Alice demande un devis detaille pour la semaine prochaine.',
  'outbound',
  'completed',
  NOW() - INTERVAL '5 days'
FROM prospects p WHERE p.company_name = 'Tech Startup';

INSERT INTO exchanges (prospect_id, type, subject, content, summary, direction, status, created_at)
SELECT
  p.id,
  'EMAIL'::exchange_type,
  'Devis Dashboard Tech Startup',
  'Bonjour Alice, suite a notre meeting, voici le devis detaille pour votre dashboard...',
  'Envoi du devis de 18000 EUR avec planning detaille en 3 phases.',
  'outbound',
  'sent',
  NOW() - INTERVAL '2 days'
FROM prospects p WHERE p.company_name = 'Tech Startup';

-- Echange pour Restaurant Le Bon (1 echange)
INSERT INTO exchanges (prospect_id, type, subject, content, summary, outcome, direction, status, created_at)
SELECT
  p.id,
  'CALL'::exchange_type,
  'Premier appel de qualification',
  'Appel entrant de Marc suite a une recherche Google. Il cherche un site vitrine simple avec reservation.',
  'Prospect qualifie. Restaurant de 40 couverts, besoin simple mais budget limite.',
  'Marc doit verifier son budget avec son comptable. Rappel prevu dans 10 jours.',
  'inbound',
  'completed',
  NOW() - INTERVAL '3 days'
FROM prospects p WHERE p.company_name = 'Restaurant Le Bon';

-- ============================================================================
-- 4. NOTES DE TEST
-- ============================================================================
-- Notes internes sur les prospects

-- Notes pour Acme Corp (2 notes)
INSERT INTO notes (prospect_id, content, type, is_pinned, created_at)
SELECT
  p.id,
  'Jean semble tres interesse mais doit convaincre son associe qui est plus conservateur. Mettre en avant le ROI et la facilite d utilisation.',
  'general',
  true,
  NOW() - INTERVAL '10 days'
FROM prospects p WHERE p.company_name = 'Acme Corp';

INSERT INTO notes (prospect_id, content, type, created_at)
SELECT
  p.id,
  'Attention: Jean part en vacances du 15 au 30 du mois. Prevoir relance avant ou apres cette periode.',
  'reminder',
  NOW() - INTERVAL '5 days'
FROM prospects p WHERE p.company_name = 'Acme Corp';

-- Note pour Tech Startup (1 note)
INSERT INTO notes (prospect_id, content, type, is_pinned, created_at)
SELECT
  p.id,
  'Prospect tres chaud! Alice a le budget valide et veut demarrer rapidement. Priorite haute pour le devis.',
  'general',
  true,
  NOW() - INTERVAL '4 days'
FROM prospects p WHERE p.company_name = 'Tech Startup';

-- ============================================================================
-- 5. DOCUMENTATION (KNOWLEDGE_DOCS)
-- ============================================================================
-- Documentation complete pour le centre de connaissances

-- Note: On utilise une contrainte unique sur le titre pour eviter les doublons
-- Si le titre existe deja, on ne fait rien (DO NOTHING)

-- D'abord, ajoutons une contrainte unique sur le titre si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'knowledge_docs_title_key'
  ) THEN
    ALTER TABLE knowledge_docs ADD CONSTRAINT knowledge_docs_title_key UNIQUE (title);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- ============================================================================
-- 5.1 SITUATIONS (6 documents)
-- ============================================================================

-- Situation 1: Client vague sur ses besoins
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Client vague sur ses besoins',
  'SITUATION',
  '# Client vague sur ses besoins

## Le probleme
Le prospect ne sait pas exactement ce qu il veut. Il utilise des termes flous comme "je veux quelque chose de moderne" ou "il me faut un truc pour gerer mes clients".

## Pourquoi ca arrive
- Le prospect n est pas technique et ne connait pas les possibilites
- Il n a jamais travaille avec un developpeur
- Il a une douleur mais n a pas identifie la solution
- Il a vu des concurrents faire "quelque chose" et veut pareil

## Comment reagir

### 1. Poser des questions sur le PROBLEME, pas la solution
Au lieu de demander "Quel type de site voulez-vous?", demandez:
- "Qu est-ce qui vous fait perdre du temps aujourd hui?"
- "Quel est le probleme que vous essayez de resoudre?"
- "Comment gerez-vous ca actuellement?"

### 2. Utiliser des exemples concrets
Montrez des realisations similaires pour aider le prospect a visualiser:
- "Pour un client dans votre secteur, on a fait X, ca vous parle?"
- "Imaginez que demain vous puissiez faire Y, ca resoudrait votre probleme?"

### 3. Reformuler et valider
Apres chaque echange, reformulez ce que vous avez compris:
- "Si je comprends bien, votre probleme principal c est... Est-ce correct?"

### 4. Ne pas sur-promettre
Evitez de proposer une solution trop tot. Prenez le temps de bien comprendre avant de vous engager.

## Red flags
- Le prospect ne peut pas expliquer son probleme en termes simples
- Il change d avis a chaque appel
- Il ne peut pas donner d exemples de ce qu il aimerait

## Phrases utiles
- "Parlez-moi d une journee type dans votre activite"
- "Qu est-ce qui vous frustre le plus dans votre organisation actuelle?"
- "Si vous aviez une baguette magique, que changeriez-vous?"',
  ARRAY['decouverte', 'qualification', 'besoins', 'communication']
)
ON CONFLICT (title) DO NOTHING;

-- Situation 2: Client qui hesite sur le budget
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Client qui hesite sur le budget',
  'SITUATION',
  '# Client qui hesite sur le budget

## Le probleme
Le prospect trouve le prix trop eleve, demande des remises, ou compare avec des solutions moins cheres.

## Pourquoi ca arrive
- Il n a pas compris la valeur de ce que vous proposez
- Son budget est reellement limite
- Il teste pour voir si vous baissez vos prix
- Il compare des pommes et des oranges (freelance vs agence, template vs sur-mesure)

## Comment reagir

### 1. Ne jamais baisser son prix immediatement
Baisser son prix sans contrepartie = perte de credibilite. Le prospect pensera que vous etiez sur-facture.

### 2. Comprendre l objection reelle
Posez des questions:
- "Qu est-ce qui vous semble trop cher exactement?"
- "A quoi comparez-vous ce prix?"
- "Quel budget aviez-vous en tete?"

### 3. Reexpliquer la valeur
Ramenez toujours au ROI et au probleme resolu:
- "Ce CRM va vous faire gagner 2h par jour. Sur un an, ca represente X euros de temps recupere."
- "Combien vous coute actuellement le probleme que vous avez?"

### 4. Proposer des alternatives (sans baisser la qualite)
- Reduire le scope initial et proposer des phases
- Proposer un paiement echelonne
- Retirer des fonctionnalites non essentielles

### 5. Savoir dire non
Si le budget est vraiment trop bas, soyez honnete:
- "Je comprends vos contraintes. Malheureusement, pour ce budget, je ne peux pas vous garantir un resultat de qualite. Je prefere etre honnete plutot que de vous decevoir."

## Ce qu il ne faut PAS faire
- Baisser le prix sans rien retirer du scope
- Accepter un projet sous-paye (frustration garantie)
- Denigrer la concurrence moins chere
- Etre sur la defensive

## Phrases utiles
- "Mon prix reflete la qualite et le temps necessaire pour bien faire les choses"
- "Je comprends que c est un investissement. Voyons ensemble comment le rentabiliser"
- "Qu est-ce qui serait un bon retour sur investissement pour vous?"',
  ARRAY['prix', 'budget', 'negociation', 'objections']
)
ON CONFLICT (title) DO NOTHING;

-- Situation 3: Client echauade par un dev precedent
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Client echauade par un developpeur precedent',
  'SITUATION',
  '# Client echauade par un developpeur precedent

## Le probleme
Le prospect a eu une mauvaise experience avec un prestataire (projet non livre, mauvaise qualite, depassement de budget, ghosting...).

## Pourquoi c est une opportunite
- Ce prospect SAIT qu il a besoin de vous (il a deja essaye)
- Il est pret a payer plus pour de la qualite
- Il appreciera votre professionnalisme par contraste

## Comment reagir

### 1. Ecouter son histoire
Laissez-le raconter sa mauvaise experience. C est therapeutique et ca vous donne des infos precieuses:
- "Qu est-ce qui s est mal passe exactement?"
- "A quel moment avez-vous senti que ca allait mal?"
- "Qu est-ce que vous auriez aime qu il fasse differemment?"

### 2. Ne pas critiquer le prestataire precedent
Meme si c est tentant. Restez professionnel:
- "Je comprends, c est une situation frustrante"
- "Ce n est malheureusement pas rare dans notre industrie"

### 3. Expliquer votre methode de travail
Montrez en quoi vous etes different:
- Points reguliers et transparence
- Livrables intermediaires
- Documentation
- Contrat clair avec jalons

### 4. Proposer des garanties
- Paiement par phase/jalon
- Periode de garantie post-livraison
- Acces au code source des le debut
- Documentation complete

### 5. Commencer petit
- Proposez un petit projet pilote pour etablir la confiance
- "Commencons par la phase 1, et vous verrez comment je travaille"

## Red flags
- Le prospect a eu des problemes avec PLUSIEURS prestataires -> le probleme vient peut-etre de lui
- Il refuse tout engagement meme minimal
- Il vous demande de finir le travail d un autre gratuitement

## Phrases utiles
- "Je comprends votre mefiance, c est normal apres ce que vous avez vecu"
- "Voici comment je travaille pour eviter ce genre de situation"
- "Je prefere qu on avance par etapes pour que vous puissiez valider au fur et a mesure"',
  ARRAY['confiance', 'mauvaise experience', 'relation client', 'garanties']
)
ON CONFLICT (title) DO NOTHING;

-- Situation 4: Client qui veut tout tout de suite
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Client qui veut tout tout de suite',
  'SITUATION',
  '# Client qui veut tout tout de suite

## Le probleme
Le prospect veut un projet complexe livre dans un delai irrealiste. "J en ai besoin pour la semaine prochaine" ou "On lance dans 1 mois, il me faut le site complet".

## Pourquoi ca arrive
- Il n a pas conscience du travail necessaire
- Il a une deadline business reelle (salon, lancement...)
- Il a procrastine et c est maintenant urgent
- Il teste votre flexibilite

## Comment reagir

### 1. Ne pas dire oui pour faire plaisir
Accepter un delai impossible = projet rate garanti. C est pire que de refuser.

### 2. Comprendre la vraie deadline
- "Pourquoi cette date specifique?"
- "Qu est-ce qui se passe si on depasse d une semaine?"
- "Y a-t-il une date butoir absolue?"

### 3. Expliquer le processus
Decomposez le travail pour montrer pourquoi ca prend du temps:
- "Pour ce projet, il faut: design (1 semaine), dev (3 semaines), tests (1 semaine)..."
- "Chaque etape depend de la precedente"

### 4. Proposer un MVP
Identifiez ce qui est VRAIMENT necessaire pour la deadline:
- "Qu est-ce qui doit ABSOLUMENT etre pret pour cette date?"
- "On peut livrer une V1 avec les fonctionnalites essentielles, puis completer apres"

### 5. Etre transparent sur les risques
Si le client insiste:
- "Je peux essayer, mais je dois etre honnete: a ce rythme, la qualite va en souffrir"
- "Un projet rushed a plus de chances de bugs et de problemes post-lancement"

## Le triangle projet
Rappelez le triangle: Rapide / Pas cher / Qualite -> On ne peut en avoir que 2:
- Rapide + Qualite = Cher (heures sup, ressources supplementaires)
- Rapide + Pas cher = Qualite reduite
- Qualite + Pas cher = Lent

## Ce qu il ne faut PAS faire
- Promettre l impossible
- Sacrifier la qualite en silence
- Travailler 20h/jour pour tenir un delai absurde
- Blamer le client apres coup si ca n a pas marche

## Phrases utiles
- "Je prefere vous dire la verite maintenant plutot que vous decevoir plus tard"
- "Voyons ce qu on peut livrer de facon realiste pour cette date"
- "Quelle est la fonctionnalite numero 1 dont vous avez besoin?"',
  ARRAY['deadline', 'urgence', 'gestion projet', 'MVP', 'priorites']
)
ON CONFLICT (title) DO NOTHING;

-- Situation 5: Client qui veut ajouter des fonctionnalites en cours de projet
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Client qui veut ajouter des fonctionnalites en cours de projet',
  'SITUATION',
  '# Client qui veut ajouter des fonctionnalites en cours de projet

## Le probleme
Le fameux "scope creep". Le client demande des ajouts qui n etaient pas prevus: "Au fait, est-ce qu on pourrait aussi ajouter..." ou "J ai pense a une nouvelle fonctionnalite...".

## Pourquoi ca arrive
- Le client decouvre ses vrais besoins en voyant le projet avancer
- Il a eu de nouvelles idees
- Il n avait pas bien defini ses besoins au depart
- Il pense que c est "juste un petit truc"

## Comment reagir

### 1. Ne pas dire oui reflexivement
Meme si ca semble simple. Prenez le temps d evaluer l impact.

### 2. Accuser reception positivement
- "C est une bonne idee!"
- "Je note ca"
- "Interessant, on peut en discuter"

### 3. Evaluer et communiquer l impact
Expliquez ce que ca implique:
- "Pour ajouter ca, il faudrait X jours de plus"
- "Ca impacte le planning de Y jours et le budget de Z euros"
- "Ca necessite de revoir la partie W qu on a deja faite"

### 4. Proposer des options
- Ajouter au projet actuel (avec avenant au contrat)
- Faire en phase 2 apres le lancement
- Remplacer une autre fonctionnalite moins prioritaire

### 5. Documenter par ecrit
Chaque changement doit etre trace:
- Email de confirmation avec impact sur delai/budget
- Avenant au contrat si necessaire
- Mise a jour du cahier des charges

## Prevention
Le meilleur moment pour gerer le scope creep, c est AVANT qu il arrive:
- Cahier des charges detaille et signe
- Clause "hors scope" dans le contrat
- Processus de demande de changement defini

## Ce qu il ne faut PAS faire
- Accepter des ajouts gratuits (ca ne s arrete jamais)
- S enerver contre le client (c est normal d avoir de nouvelles idees)
- Faire les ajouts sans rien dire puis se plaindre

## Le scope creep positif
Parfois, les ajouts sont une opportunite:
- Plus de facturation
- Relation client renforcee
- Meilleur produit final

La cle: les gerer professionnellement, pas les subir.

## Phrases utiles
- "Bonne idee! Laissez-moi evaluer l impact et je reviens vers vous"
- "On peut tout a fait ajouter ca. Voici ce que ca implique..."
- "Pour rester dans le budget initial, on pourrait remplacer X par Y"',
  ARRAY['scope creep', 'gestion projet', 'changements', 'contrat', 'facturation']
)
ON CONFLICT (title) DO NOTHING;

-- Situation 6: Client qui ne repond plus
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Client qui ne repond plus',
  'SITUATION',
  '# Client qui ne repond plus

## Le probleme
Le prospect etait interesse, vous avez eu des echanges positifs, et soudain... plus de reponse. Emails ignores, appels sans suite.

## Pourquoi ca arrive
- Il est deborde et votre projet n est pas prioritaire
- Il a eu un imprevcu (budget coupe, reorganisation...)
- Il a choisi un concurrent mais n ose pas vous le dire
- Votre offre ne correspondait pas (prix, delai...)
- Il attend une validation interne

## Comment reagir

### 1. Ne pas harceler
3 relances maximum, espacees de plusieurs jours. Au-dela, vous passez pour un desespere.

### 2. Varier les canaux
Si l email ne fonctionne pas:
- Essayez LinkedIn
- Un SMS court
- Un appel (une seule tentative)

### 3. Relances progressives

**Relance 1 (J+3/4)** - Friendly reminder:
"Bonjour [Prenom], je reviens vers vous concernant notre echange sur [projet]. Avez-vous eu le temps d y reflechir?"

**Relance 2 (J+7/10)** - Apporter de la valeur:
"Bonjour [Prenom], j ai pense a vous en voyant [article/ressource pertinente]. Ca pourrait vous interesser pour [projet]."

**Relance 3 (J+14)** - Closing:
"Bonjour [Prenom], je comprends que vous etes probablement tres occupe. Je vais considerer que ce n est pas le bon moment. N hesitez pas a me recontacter quand vous serez pret."

### 4. La technique du "breakup email"
Le dernier email qui assume la fin:
- "Je suppose que vos priorites ont change..."
- "Je ne vais plus vous relancer..."
- Souvent, ca provoque une reponse!

### 5. Savoir quand abandonner
Apres 3 relances sans reponse, passez a autre chose. Mettez le prospect en "On Hold" et revenez dans 3-6 mois.

## Ce qu il ne faut PAS faire
- Envoyer 10 relances
- Etre passif-agressif ("Vous pourriez au moins repondre...")
- Prendre ca personnellement
- Bruler les ponts

## Analyser pour s ameliorer
Quand ca arrive souvent, demandez-vous:
- Mon offre est-elle claire?
- Mon prix est-il en ligne avec le marche?
- Est-ce que je qualifie bien mes prospects?

## Phrases utiles
- "Je comprends que ce n est peut-etre pas le bon moment"
- "N hesitez pas a me recontacter quand vous serez pret"
- "Si vous avez choisi une autre solution, pas de souci, juste curieux de savoir ce qui a fait la difference"',
  ARRAY['relance', 'ghosting', 'suivi', 'communication', 'prospection']
)
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- 5.2 SERVICES (4 documents)
-- ============================================================================

-- Service 1: C'est quoi un CRM
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'C est quoi un CRM sur mesure',
  'SERVICE',
  '# C est quoi un CRM sur mesure

## Definition simple
Un CRM (Customer Relationship Management) est un outil pour gerer vos relations clients. Un CRM **sur mesure** est developpe specifiquement pour VOTRE activite, contrairement aux solutions generiques (Salesforce, HubSpot...).

## A quoi ca sert

### Centraliser les informations
- Toutes les infos clients au meme endroit
- Historique des echanges (emails, appels, RDV)
- Documents et devis associes

### Suivre le pipeline commercial
- Ou en est chaque prospect
- Prochaines actions a faire
- Previsions de chiffre d affaires

### Automatiser les taches repetitives
- Relances automatiques
- Emails de suivi
- Rappels de RDV

### Analyser la performance
- Taux de conversion
- Temps moyen de closing
- Sources de leads les plus efficaces

## Pourquoi sur mesure vs generique

### Avantages du sur-mesure
- Adapte a VOTRE processus de vente
- Pas de fonctionnalites inutiles
- Integration avec vos outils existants
- Vous etes proprietaire du code
- Pas d abonnement mensuel

### Inconvenients du generique
- Processus rigide a adapter
- Fonctionnalites payantes dont vous n avez pas besoin
- Abonnement mensuel qui s accumule
- Dependance a un editeur

## Pour qui

### CRM sur mesure ideal pour:
- PME avec processus de vente specifique
- Activite necessitant des integrations particulieres
- Entreprise qui veut maitriser ses donnees
- Budget initial disponible (vs abonnement)

### CRM generique suffit pour:
- Startup qui demarre et doit valider son process
- Processus de vente tres standard
- Pas de budget initial

## Exemples concrets de fonctionnalites
- Fiche prospect avec champs personnalises
- Pipeline visuel (kanban) des opportunites
- Historique des echanges (emails synchronises)
- Rappels et taches automatiques
- Tableaux de bord personnalises
- Export de donnees et reporting
- Gestion des documents et devis

## Budget indicatif
- CRM simple (gestion contacts + pipeline): 8 000 - 15 000 EUR
- CRM complet (+ automatisations + reporting): 15 000 - 30 000 EUR
- CRM avance (+ integrations + mobile): 30 000 - 50 000 EUR

Compare a un abonnement Salesforce/HubSpot: rentabilise en 12-24 mois.',
  ARRAY['CRM', 'services', 'sur-mesure', 'clients', 'commercial']
)
ON CONFLICT (title) DO NOTHING;

-- Service 2: Automatisation
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Automatisation - Gagnez du temps',
  'SERVICE',
  '# Automatisation - Gagnez du temps

## C est quoi l automatisation
L automatisation consiste a faire executer par un programme des taches repetitives que vous faites manuellement aujourd hui.

## Exemples concrets

### Automatisation administrative
- Generer des factures automatiquement
- Envoyer des rappels de paiement
- Creer des rapports hebdomadaires
- Archiver des documents

### Automatisation commerciale
- Envoyer un email de bienvenue aux nouveaux contacts
- Relancer les devis non signes apres X jours
- Notifier quand un prospect visite votre site
- Scorer les leads automatiquement

### Automatisation operationnelle
- Synchroniser des donnees entre outils
- Generer des documents a partir de templates
- Mettre a jour des tableaux de bord
- Declencher des workflows selon des conditions

## Benefices

### Gain de temps
Une tache de 15 min/jour = 60h/an. Automatisee, ca vous coute 0.

### Reduction des erreurs
Un programme ne fait pas de fautes de frappe, n oublie pas, ne se trompe pas.

### Scalabilite
Que vous ayez 10 ou 1000 clients, le temps passe est le meme.

### Disponibilite
Ca fonctionne 24/7, meme pendant vos vacances.

## Comment ca marche

### 1. Analyse de vos processus
On identifie les taches repetitives et chronophages.

### 2. Definition des regles
"Quand X arrive, faire Y". Ex: "Quand un devis n est pas signe apres 7 jours, envoyer un email de relance."

### 3. Developpement
On cree les scripts/workflows qui executent ces regles.

### 4. Tests et ajustements
On verifie que tout fonctionne comme prevu.

### 5. Mise en production
On deploie et on supervise.

## Technologies utilisees
- **n8n / Zapier**: pour connecter des outils entre eux
- **Scripts Python/Node.js**: pour des automatisations personnalisees
- **API**: pour communiquer avec vos outils existants
- **Cron jobs**: pour executer des taches a heures fixes

## Budget indicatif
- Automatisation simple (1-2 workflows): 1 000 - 3 000 EUR
- Pack automatisation (5-10 workflows): 5 000 - 10 000 EUR
- Automatisation complete metier: 10 000 - 25 000 EUR

## ROI typique
- Tache de 30min/jour automatisee = 125h/an economisees
- A 50 EUR/h de cout horaire = 6 250 EUR/an
- Automatisation a 3 000 EUR = rentabilisee en 6 mois',
  ARRAY['automatisation', 'services', 'productivite', 'workflow', 'integration']
)
ON CONFLICT (title) DO NOTHING;

-- Service 3: Site vitrine vs App web
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Site vitrine vs Application web - Quelle difference',
  'SERVICE',
  '# Site vitrine vs Application web

## Site vitrine

### Definition
Un site vitrine presente votre entreprise, vos services, vos realisations. C est une **brochure en ligne**.

### Caracteristiques
- Contenu principalement statique
- Navigation simple
- Peu ou pas d interaction utilisateur
- Souvent base sur un CMS (WordPress, etc.)

### Exemples
- Site de restaurant avec menu et horaires
- Site de cabinet d avocat avec prestations
- Portfolio de photographe
- Site corporate d entreprise

### Budget typique
- Template personnalise: 1 500 - 4 000 EUR
- Sur-mesure simple: 4 000 - 8 000 EUR
- Sur-mesure premium: 8 000 - 15 000 EUR

## Application web

### Definition
Une application web permet aux utilisateurs d **interagir** avec votre systeme. C est un **outil**.

### Caracteristiques
- Contenu dynamique
- Authentification utilisateurs
- Base de donnees
- Logique metier complexe

### Exemples
- Plateforme de reservation en ligne
- Espace client avec documents
- Dashboard de reporting
- CRM personnalise
- Plateforme e-commerce avancee

### Budget typique
- App simple (1-2 fonctionnalites): 8 000 - 15 000 EUR
- App moyenne (3-5 fonctionnalites): 15 000 - 35 000 EUR
- App complexe (plateforme complete): 35 000 - 80 000+ EUR

## Comment choisir

### Vous avez besoin d un site vitrine si:
- Objectif principal: etre trouve en ligne
- Pas besoin de compte utilisateur
- Contenu change rarement
- Budget limite
- Besoin de SEO avant tout

### Vous avez besoin d une application web si:
- Utilisateurs doivent se connecter
- Donnees a stocker et manipuler
- Workflows a automatiser
- Interactions complexes
- Integration avec d autres systemes

## Le combo gagnant
Souvent, la meilleure solution est: **Site vitrine + Mini-app**

Exemple pour un restaurant:
- Site vitrine pour presenter l etablissement (SEO)
- Module de reservation integre (fonctionnalite app)

Exemple pour un avocat:
- Site vitrine pour les services
- Espace client securise pour les documents

## Questions a se poser
1. Mes visiteurs ont-ils besoin de se connecter?
2. Dois-je stocker des donnees de mes utilisateurs?
3. Y a-t-il des calculs ou traitements a faire?
4. Dois-je integrer des outils externes?

Si vous repondez OUI a une de ces questions, vous avez probablement besoin d elements d application web.',
  ARRAY['site vitrine', 'application web', 'services', 'comparatif', 'budget']
)
ON CONFLICT (title) DO NOTHING;

-- Service 4: Nos tarifs
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Nos tarifs et methodes de facturation',
  'SERVICE',
  '# Nos tarifs et methodes de facturation

## Philosophie tarifaire
Nos prix refletent la qualite du travail fourni et l accompagnement. Nous preferons faire moins de projets mais les faire bien.

## Taux journalier
**500 - 700 EUR HT / jour** selon la complexite

Ce taux inclut:
- Developpement
- Tests
- Documentation
- Support technique pendant le projet
- Revisions incluses dans le scope

## Forfaits types

### Site vitrine
| Offre | Description | Prix |
|-------|-------------|------|
| Essentiel | 5 pages, responsive, SEO de base | 3 000 - 5 000 EUR |
| Business | 10 pages, blog, formulaires avances | 5 000 - 8 000 EUR |
| Premium | Sur-mesure complet, animations | 8 000 - 15 000 EUR |

### Application web
| Offre | Description | Prix |
|-------|-------------|------|
| MVP | 1-2 fonctionnalites cles | 10 000 - 20 000 EUR |
| Standard | 3-5 fonctionnalites, admin | 20 000 - 40 000 EUR |
| Avance | Plateforme complete | 40 000 - 80 000+ EUR |

### Automatisation
| Offre | Description | Prix |
|-------|-------------|------|
| Starter | 1-2 workflows simples | 1 500 - 3 000 EUR |
| Business | 5-10 workflows | 5 000 - 10 000 EUR |
| Enterprise | Automatisation complete | 10 000 - 25 000 EUR |

## Modalites de paiement

### Echelonnement standard
- **30%** a la signature (acompte)
- **40%** a la validation du design / milestone intermediaire
- **30%** a la livraison finale

### Pour les gros projets (>30K)
- Paiement mensuel possible
- Jalons intermediaires tous les mois
- Facturation au reel possible

## Ce qui est inclus

### Dans tous nos forfaits
- Reunion de kick-off
- Maquettes / wireframes
- Developpement complet
- Tests sur differents appareils
- 2 cycles de revisions
- Formation a l utilisation
- Documentation technique
- 30 jours de support post-livraison

### Ce qui n est PAS inclus
- Hebergement (on peut conseiller)
- Nom de domaine
- Contenu (textes, photos) sauf mention contraire
- Modifications hors scope initial
- Maintenance apres les 30 jours

## Maintenance
Forfaits de maintenance optionnels:
- **Basic**: 200 EUR/mois (mises a jour securite + 2h support)
- **Standard**: 400 EUR/mois (+ evolutions mineures + 5h support)
- **Premium**: 800 EUR/mois (+ evolutions majeures + 10h support + priorite)

## Pourquoi ces prix

### Ce que vous payez
- 10+ ans d experience
- Code propre et maintenable
- Respect des delais
- Communication transparente
- Pas de mauvaises surprises

### Ce que vous evitez
- Projets abandonnes
- Code spaghetti impossible a maintenir
- Freelance qui disparait
- Depassements de budget non prevus',
  ARRAY['tarifs', 'prix', 'facturation', 'budget', 'forfaits']
)
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- 5.3 PROCESS (3 documents)
-- ============================================================================

-- Process 1: Appel decouverte
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Comment mener un appel decouverte',
  'PROCESS',
  '# Comment mener un appel decouverte

## Objectif de l appel
Comprendre le besoin du prospect pour determiner si on peut l aider et comment.

## Duree ideale
**30-45 minutes**

## Structure de l appel

### 1. Introduction (5 min)
- Se presenter brievement
- Remercier pour le temps accorde
- Expliquer le deroulement de l appel
- Demander combien de temps il a

**Script**:
"Bonjour [Prenom], merci de prendre ce temps. Aujourd hui, j aimerais comprendre votre situation pour voir comment je pourrais vous aider. Ca prendra environ 30 minutes. Ca vous va?"

### 2. Decouverte du contexte (10 min)
Questions a poser:
- "Parlez-moi de votre activite en quelques mots"
- "Comment gerez-vous [sujet] aujourd hui?"
- "Qu est-ce qui fonctionne bien? Moins bien?"
- "Depuis combien de temps avez-vous ce probleme?"

**Objectif**: Comprendre la situation actuelle

### 3. Exploration du besoin (10 min)
Questions a poser:
- "Qu est-ce qui vous a pousse a chercher une solution maintenant?"
- "A quoi ressemblerait la situation ideale pour vous?"
- "Qu est-ce qui serait un succes?"
- "Qui utilisera cette solution au quotidien?"

**Objectif**: Comprendre le besoin profond

### 4. Qualification (10 min)
Questions a poser:
- "Avez-vous une idee de budget pour ce projet?"
- "Y a-t-il une deadline particuliere?"
- "Qui d autre est implique dans cette decision?"
- "Avez-vous deja contacte d autres prestataires?"

**Objectif**: Qualifier le prospect (BANT: Budget, Authority, Need, Timeline)

### 5. Conclusion (5 min)
- Reformuler ce que vous avez compris
- Expliquer les prochaines etapes
- Proposer un second RDV si pertinent
- Remercier

**Script**:
"Si je resume: vous avez besoin de [X] parce que [Y], avec un budget autour de [Z] et une deadline vers [date]. C est bien ca? [...] Voici ce que je propose: je vous envoie [doc/devis] d ici [date], et on se rappelle [quand] pour en discuter."

## Bonnes pratiques

### DO
- Ecouter plus que parler (ratio 70/30)
- Prendre des notes
- Poser des questions ouvertes
- Reformuler pour valider
- Etre honnete si pas le bon fit

### DON T
- Parler de solution trop tot
- Couper la parole
- Faire un monologue sur vos services
- Promettre sans reflexion
- Oublier de conclure sur les prochaines etapes

## Apres l appel
- Envoyer un email recapitulatif dans l heure
- Mettre a jour le CRM
- Planifier les actions suivantes
- Preparer la proposition si qualifie',
  ARRAY['appel', 'decouverte', 'qualification', 'processus', 'commercial']
)
ON CONFLICT (title) DO NOTHING;

-- Process 2: Annoncer un prix
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Comment annoncer un prix',
  'PROCESS',
  '# Comment annoncer un prix

## Le moment cle
L annonce du prix est souvent le moment de verite. Bien geree, elle mene a la vente. Mal geree, elle tue l affaire.

## Principes fondamentaux

### 1. Ne jamais annoncer un prix sans contexte
Avant de donner un chiffre, le prospect doit comprendre la VALEUR de ce qu il va recevoir.

### 2. Ne pas s excuser pour son prix
Votre prix reflete votre valeur. L annoncer avec hesitation cree du doute.

### 3. Le prix est une information, pas une negociation
Annoncez-le factuellement, puis laissez le silence faire son travail.

## La methode "Sandwich"

### Couche 1: Rappel de la valeur
Resumez ce que le prospect va obtenir et les benefices.

### Couche 2: Le prix
Annoncez le prix clairement et faites une pause.

### Couche 3: Justification / ROI
Expliquez pourquoi ce prix est justifie.

## Script exemple

"Donc, pour recapituler, vous allez avoir:
- [Benefice 1]
- [Benefice 2]
- [Benefice 3]

Le tout avec [garantie/support/etc.].

L investissement pour ce projet est de **X euros**.

[PAUSE - laissez le silence]

Ce prix inclut [details]. Et quand on regarde le ROI, vu que ca va vous permettre de [gain], l investissement sera rentabilise en [duree]."

## Gerer les reactions

### Silence
C est normal. Ne le comblez pas. Attendez que le prospect reagisse.

### "C est cher"
- "Par rapport a quoi?" (comprendre la reference)
- "Qu est-ce qui vous semble cher exactement?"
- Puis reexpliquer la valeur

### "Je dois reflechir"
- "Bien sur. Qu est-ce qui vous ferait hesiter?"
- "Y a-t-il des points que je peux clarifier?"
- Proposer un delai: "Je vous laisse jusqu a [date]?"

### "Pouvez-vous faire un geste?"
- Ne jamais baisser sans contrepartie
- "Qu est-ce qu on pourrait retirer pour baisser le prix?"
- "Si on fait X, je peux proposer Y"

## Erreurs a eviter

### L autodestruction
"Ca fait 15 000 euros... mais bon, on peut discuter..."
-> Vous venez de dire que votre prix est negociable.

### La justification excessive
"C est 15 000 parce que bon, il y a beaucoup de travail, et puis les charges, et puis..."
-> Vous avez l air de vous excuser.

### L anticipation
"Je sais que ca peut paraitre cher mais..."
-> Vous mettez l idee dans sa tete.

## Techniques avancees

### L ancrage
Mentionnez d abord un prix plus eleve:
"Des projets similaires chez [concurrent/autre client] coutent souvent 25-30K. Grace a notre approche, on arrive a 18K."

### Les options
Proposez 3 options (bronze/argent/or). La plupart choisiront le milieu.

### Le fractionnement
"Ca fait 500 euros par mois sur 12 mois" semble plus accessible que "6000 euros".

## A retenir
- Valeur avant prix
- Confiance dans l annonce
- Silence apres l annonce
- Ne jamais negocier contre soi-meme',
  ARRAY['prix', 'tarif', 'negociation', 'vente', 'processus']
)
ON CONFLICT (title) DO NOTHING;

-- Process 3: Relancer sans etre lourd
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Comment relancer un prospect sans etre lourd',
  'PROCESS',
  '# Comment relancer un prospect sans etre lourd

## Le dilemme
Trop relancer = passer pour un harceleur
Pas assez relancer = perdre des ventes

La cle: apporter de la VALEUR a chaque relance.

## Les regles d or

### 1. Chaque relance doit avoir une raison
Pas de "Je me permets de vous relancer...". Ca ne sert a rien.

### 2. Espacer intelligemment
- 1ere relance: J+3 a J+5
- 2eme relance: J+10 a J+14
- 3eme relance: J+21 a J+30
- Au-dela: mensuel ou trimestriel

### 3. Maximum 3-4 relances "actives"
Apres, passez en mode "nurturing" (newsletter, contenu...).

### 4. Varier les canaux
Email, LinkedIn, telephone, SMS... Ne pas toujours utiliser le meme.

## Types de relances qui fonctionnent

### La relance "valeur ajoutee"
Partagez quelque chose d utile:
"J ai pense a vous en voyant cet article sur [sujet]. Ca pourrait vous interesser pour [projet]."

### La relance "actualite"
Rebondissez sur une news de l entreprise:
"J ai vu que vous veniez de [actualite]. Felicitations! Ca change quelque chose pour [projet]?"

### La relance "nouveau"
Annoncez une nouveaute de votre cote:
"On vient de lancer [nouvelle offre/fonctionnalite]. Ca pourrait repondre a [besoin evoque]."

### La relance "temoignage"
Partagez un cas client similaire:
"On vient de terminer un projet similaire pour [client]. Les resultats: [chiffres]. Ca vous parle?"

### La relance "deadline"
Creez une urgence legitime:
"Notre planning se remplit pour [mois]. Si vous voulez demarrer avant [date], il faudrait qu on se recontacte cette semaine."

### La relance "permission"
Demandez si vous devez arreter:
"Je ne veux pas vous embeter. Est-ce que ce projet est toujours d actualite ou je dois fermer le dossier?"

## Templates de relances

### Relance 1 (J+4) - Le check-in
Objet: [Projet] - Des questions?

"Bonjour [Prenom],

Je reviens vers vous suite a notre [appel/email] de [jour].

Avez-vous eu le temps de reflechir a [sujet]? Je reste disponible si vous avez des questions.

Bonne journee,
[Signature]"

### Relance 2 (J+12) - La valeur
Objet: [Sujet pertinent] - Ca pourrait vous interesser

"Bonjour [Prenom],

J ai pense a vous en [contexte].

[Partage d un article/ressource/cas client pertinent]

Ca fait echo a ce dont on avait discute concernant [projet].

On en parle?
[Signature]"

### Relance 3 (J+25) - Le closing
Objet: [Projet] - On fait le point?

"Bonjour [Prenom],

Je comprends que vous etes probablement deborde.

Pour etre transparent: je vais bientot devoir passer a d autres projets. Avant de fermer ce dossier, je voulais m assurer que vous n aviez pas de questions en suspens.

Si le timing n est pas bon maintenant, pas de souci - on peut en reparler dans quelques mois.

Qu en pensez-vous?
[Signature]"

## Ce qui tue les relances

- "Je me permets de vous relancer" (on sait)
- "Avez-vous recu mon email?" (oui, il l a ignore)
- Relances trop frequentes (J+1, J+2, J+3...)
- Copier-coller evident
- Ton culpabilisant

## Mesurer l efficacite
Tracez vos relances et leurs resultats:
- Taux d ouverture (si vous avez l info)
- Taux de reponse
- Conversion finale

Ajustez votre approche selon les donnees.',
  ARRAY['relance', 'suivi', 'email', 'prospection', 'communication']
)
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- 5.4 TEMPLATES (3 documents)
-- ============================================================================

-- Template 1: Email premier contact
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Template email premier contact',
  'TEMPLATE',
  '# Template email premier contact

## Objectif
Obtenir un premier echange (appel ou RDV) avec un prospect froid ou tiede.

## Principes
- Court (max 150 mots)
- Personnalise
- Centree sur le prospect, pas sur vous
- Un seul CTA clair

---

## Template 1: Approche directe

**Objet**: [Prenom], une question rapide sur [sujet]

Bonjour [Prenom],

Je suis [Votre prenom], [votre role] chez [Votre entreprise].

J ai remarque que [observation specifique sur l entreprise/le prospect - montrer que vous avez fait vos recherches].

Nous aidons des [type d entreprise] comme [Nom entreprise] a [benefice principal] grace a [votre solution/approche].

Par exemple, [Nom client] a pu [resultat concret avec chiffre si possible].

**Seriez-vous disponible pour un echange de 15 minutes** cette semaine ou la prochaine?

Bien cordialement,
[Signature]

---

## Template 2: Approche probleme

**Objet**: [Probleme courant dans leur industrie]?

Bonjour [Prenom],

Beaucoup de [type d entreprise] que je rencontre me disent avoir du mal a [probleme commun].

Ca se traduit souvent par [consequence negative].

Si c est votre cas, je serais ravi d echanger 15 minutes pour voir si je peux vous aider.

Pas de pitch commercial, juste une discussion pour comprendre votre situation.

Ca vous dit?

[Signature]

---

## Template 3: Approche recommandation

**Objet**: [Nom du referent] m a suggere de vous contacter

Bonjour [Prenom],

[Nom du referent] m a parle de [Entreprise] et m a suggere de vous contacter.

Il/Elle m a dit que vous cherchiez a [besoin/objectif].

C est exactement ce qu on fait chez [Votre entreprise] - on a d ailleurs aide [Client similaire] a [resultat].

Est-ce qu on pourrait en discuter cette semaine?

[Signature]

---

## Template 4: Approche actualite

**Objet**: Felicitations pour [actualite]!

Bonjour [Prenom],

Je viens de voir que [Entreprise] [actualite: levee de fonds, nouveau produit, expansion...]. Felicitations!

Ce type de croissance amene souvent des defis en termes de [domaine ou vous pouvez aider].

Si c est votre cas, je serais ravi d echanger sur comment on pourrait vous accompagner.

15 minutes cette semaine?

[Signature]

---

## Conseils d utilisation

### Personnalisation obligatoire
- Nom de l entreprise
- Prenom du contact
- Une observation specifique (site, LinkedIn, actualite)

### Timing d envoi
- Mardi a jeudi
- 9h-10h ou 14h-15h
- Eviter lundi matin et vendredi apres-midi

### A/B testing
Testez differents objets pour voir ce qui fonctionne le mieux.

### Suivi
Si pas de reponse sous 4-5 jours, relancer avec un autre angle.',
  ARRAY['template', 'email', 'premier contact', 'prospection', 'outreach']
)
ON CONFLICT (title) DO NOTHING;

-- Template 2: Email relance
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Templates email de relance',
  'TEMPLATE',
  '# Templates email de relance

## Contexte
Ces templates servent a relancer des prospects qui n ont pas repondu ou qui ont demande du temps pour reflechir.

---

## Relance apres envoi de devis (J+5)

**Objet**: Re: Devis [Projet] - Des questions?

Bonjour [Prenom],

Je reviens vers vous concernant le devis envoye [jour].

Avez-vous eu le temps de le parcourir? Je reste disponible pour clarifier tout point ou ajuster la proposition si necessaire.

On peut en discuter rapidement par telephone si vous preferez.

[Signature]

---

## Relance apres appel sans reponse (J+4)

**Objet**: Suite a notre echange de [jour]

Bonjour [Prenom],

Merci encore pour notre echange de [jour].

Comme convenu, je voulais faire un point sur [sujet]. Avez-vous eu le temps d en discuter en interne?

Je suis disponible cette semaine pour un nouvel echange si vous avez des questions.

[Signature]

---

## Relance "valeur ajoutee" (J+10)

**Objet**: [Ressource utile] - Ca devrait vous plaire

Bonjour [Prenom],

J ai pense a vous en tombant sur [article/etude/cas client].

[Lien ou resume de la ressource]

Ca fait echo a [sujet dont vous avez discute]. Qu en pensez-vous?

[Signature]

---

## Relance "cas client" (J+14)

**Objet**: Comment [Client] a resolu [probleme similaire]

Bonjour [Prenom],

Je voulais vous partager un cas qui pourrait vous interesser.

[Client] avait le meme defi que vous: [probleme]. Apres avoir mis en place [solution], ils ont [resultat avec chiffres].

Ca vous parle pour [votre projet]?

[Signature]

---

## Relance "deadline" (J+20)

**Objet**: [Projet] - Mise a jour planning

Bonjour [Prenom],

Je voulais vous informer que notre planning se remplit pour les prochaines semaines.

Si vous souhaitez demarrer [projet] avant [date], il faudrait qu on confirme d ici [deadline].

On fait le point rapidement?

[Signature]

---

## Relance "breakup" (J+30)

**Objet**: [Projet] - Je ferme le dossier?

Bonjour [Prenom],

Je n ai pas eu de retour de votre part depuis notre dernier echange.

Je comprends que vos priorites ont peut-etre change, pas de souci.

Dois-je considerer que ce projet n est plus d actualite? Je prefere etre fixe plutot que de vous relancer inutilement.

Si les choses evoluent de votre cote, vous savez ou me trouver.

[Signature]

---

## Relance "back from the dead" (M+3)

**Objet**: [Projet] - Toujours d actualite?

Bonjour [Prenom],

On s etait parle il y a quelques mois concernant [projet].

Je me demandais si c etait toujours dans vos plans ou si la situation avait evolue.

Je serais ravi d en rediscuter si c est le cas.

[Signature]

---

## Bonnes pratiques

### Objet
- Garder le fil de discussion si possible (Re:)
- Court et specifique
- Eviter les objets "putaclic"

### Corps
- Court (5-7 lignes max)
- Une seule question ou CTA
- Ton professionnel mais humain

### Frequence
- Pas plus d une relance par semaine
- Espacer de plus en plus
- Arreter apres 4-5 relances sans reponse',
  ARRAY['template', 'email', 'relance', 'suivi', 'prospection']
)
ON CONFLICT (title) DO NOTHING;

-- Template 3: Script appel decouverte
INSERT INTO knowledge_docs (title, category, content, tags) VALUES
(
  'Script appel decouverte',
  'TEMPLATE',
  '# Script appel decouverte

## Preparation avant l appel
- [ ] Consulter le site web du prospect
- [ ] Checker LinkedIn du contact
- [ ] Relire les notes des echanges precedents
- [ ] Preparer 3 questions specifiques

---

## PHASE 1: OUVERTURE (2-3 min)

### Salutation
"Bonjour [Prenom], c est [Votre prenom] de [Entreprise]. Comment allez-vous?"

### Cadrage
"Merci de prendre ce temps. L objectif de cet appel est de comprendre votre situation pour voir si et comment je pourrais vous aider. Ca prendra environ 30 minutes. Ca vous convient?"

### Transition
"Parfait. Avant de commencer, est-ce que vous avez des questions ou des points que vous aimeriez aborder?"

---

## PHASE 2: CONTEXTE (5-7 min)

### Questions sur l activite
- "Pour commencer, pouvez-vous me parler de [Entreprise] en quelques mots?"
- "Quel est votre role exactement?"
- "Combien de personnes travaillent chez vous?"

### Questions sur la situation actuelle
- "Comment gerez-vous [sujet du projet] aujourd hui?"
- "Quels outils utilisez-vous actuellement?"
- "Qu est-ce qui fonctionne bien? Qu est-ce qui est frustrant?"

### Ecoute active
- Prendre des notes
- Reformuler: "Si je comprends bien, [resume]..."
- Creuser: "Pouvez-vous m en dire plus sur...?"

---

## PHASE 3: BESOINS (7-10 min)

### Questions sur le probleme
- "Qu est-ce qui vous a pousse a chercher une solution maintenant?"
- "Depuis combien de temps avez-vous ce probleme?"
- "Quel impact ca a sur votre activite?"

### Questions sur les objectifs
- "Dans un monde ideal, a quoi ressemblerait la situation?"
- "Qu est-ce qui serait un succes pour vous?"
- "Quels resultats concrets attendez-vous?"

### Questions sur les utilisateurs
- "Qui utilisera cette solution au quotidien?"
- "Combien de personnes sont concernees?"
- "Quel est leur niveau technique?"

---

## PHASE 4: QUALIFICATION - BANT (5-7 min)

### Budget
- "Avez-vous une enveloppe budgetaire prevue pour ce projet?"
- "Avez-vous une idee de fourchette?"
- Si resistance: "Je pose la question pour m assurer de vous proposer quelque chose d adapte."

### Authority (Autorite de decision)
- "Qui d autre est implique dans cette decision?"
- "Comment se passe le processus de decision chez vous?"
- "Y a-t-il d autres parties prenantes que je devrais rencontrer?"

### Need (Besoin confirme)
- "Sur une echelle de 1 a 10, a quel point ce projet est-il prioritaire?"
- "Qu est-ce qui se passe si vous ne faites rien?"

### Timeline (Delai)
- "Y a-t-il une deadline particuliere?"
- "Quand aimeriez-vous que ce soit operationnel?"
- "Qu est-ce qui drive cette timeline?"

---

## PHASE 5: CONCURRENCE (2-3 min)

- "Avez-vous deja contacte d autres prestataires?"
- "Qu est-ce qui vous a plu / deplu dans leurs approches?"
- "Qu est-ce qui fera la difference dans votre choix?"

---

## PHASE 6: CLOSING (3-5 min)

### Recapitulatif
"Si je resume: vous avez besoin de [X] pour resoudre [Y]. Votre budget est autour de [Z] et vous aimeriez que ce soit pret pour [date]. C est bien ca?"

### Prochaines etapes
"Voici ce que je propose:
1. Je vous envoie un email recapitulatif aujourd hui
2. Je prepare une proposition detaillee d ici [date]
3. On se rappelle [date] pour en discuter

Ca vous va?"

### Questions finales
"Avant de conclure, y a-t-il quelque chose qu on n a pas aborde et qui est important pour vous?"

### Cloture
"Parfait, merci pour cet echange [Prenom]. Je vous envoie le recap dans l heure. A [date prochain RDV]!"

---

## NOTES POST-APPEL

### A remplir immediatement apres
- [ ] Besoin principal:
- [ ] Budget:
- [ ] Timeline:
- [ ] Decideurs:
- [ ] Points de friction:
- [ ] Prochaine action:
- [ ] Score qualification (1-10):

### A faire
- [ ] Envoyer email recap (dans l heure)
- [ ] Mettre a jour CRM
- [ ] Planifier la prochaine action',
  ARRAY['template', 'script', 'appel', 'decouverte', 'qualification']
)
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- FIN DU FICHIER DE SEED DATA
-- ============================================================================
