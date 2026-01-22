-- ============================================================================
-- PROSPEKT - Migration SQL Complete
-- ============================================================================
-- Ce fichier cree toutes les tables necessaires pour l'application Prospekt
-- (sauf knowledge_docs qui existe deja dans create_knowledge_docs.sql)
-- ============================================================================

-- ============================================================================
-- 1. FONCTION TRIGGER POUR updated_at
-- ============================================================================
-- Cette fonction est utilisee par tous les triggers updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. TYPES ENUM
-- ============================================================================

-- Type pour les roles utilisateur
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('TECH', 'COMMERCIAL');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type pour les statuts de prospect
DO $$ BEGIN
  CREATE TYPE prospect_status AS ENUM (
    'lead',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'won',
    'lost'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type pour les priorites
DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type pour les types d'echanges
DO $$ BEGIN
  CREATE TYPE exchange_type AS ENUM ('CALL', 'EMAIL', 'MEETING', 'MESSAGE', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. TABLE PROFILES
-- ============================================================================
-- Extension de auth.users avec informations supplementaires
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role user_role DEFAULT 'COMMERCIAL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS pour profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs authentifies peuvent voir tous les profils
CREATE POLICY "profiles_select_authenticated"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Les utilisateurs peuvent inserer leur propre profil
CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trigger updated_at pour profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. TABLE TAGS
-- ============================================================================
-- Tags pour categoriser les prospects
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour tags
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- RLS pour tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Policy: Tous les utilisateurs authentifies peuvent gerer les tags
CREATE POLICY "tags_all_authenticated"
  ON tags
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger updated_at pour tags
DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. TABLE PROSPECTS
-- ============================================================================
-- Table principale pour la gestion des prospects
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informations de base
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,

  -- Statut et priorite
  status prospect_status DEFAULT 'lead' NOT NULL,
  priority priority_level DEFAULT 'medium' NOT NULL,
  source TEXT,

  -- Besoins potentiels (phase de decouverte)
  potential_need TEXT,
  potential_budget TEXT,
  potential_timeline TEXT,
  potential_tech_stack TEXT[],

  -- Besoins confirmes (apres qualification)
  confirmed_need TEXT,
  confirmed_budget TEXT,
  confirmed_timeline TEXT,
  confirmed_scope TEXT,

  -- Tags (stockes comme array de noms pour simplicite)
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour prospects
CREATE INDEX IF NOT EXISTS idx_prospects_company_name ON prospects(company_name);
CREATE INDEX IF NOT EXISTS idx_prospects_contact_name ON prospects(contact_name);
CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_priority ON prospects(priority);
CREATE INDEX IF NOT EXISTS idx_prospects_source ON prospects(source);
CREATE INDEX IF NOT EXISTS idx_prospects_tags ON prospects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_updated_at ON prospects(updated_at DESC);

-- Index de recherche full-text francais
CREATE INDEX IF NOT EXISTS idx_prospects_search ON prospects
  USING gin(to_tsvector('french',
    coalesce(company_name, '') || ' ' ||
    coalesce(contact_name, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(potential_need, '') || ' ' ||
    coalesce(confirmed_need, '')
  ));

-- RLS pour prospects
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- Policy: Tous les utilisateurs authentifies peuvent gerer les prospects
CREATE POLICY "prospects_all_authenticated"
  ON prospects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger updated_at pour prospects
DROP TRIGGER IF EXISTS update_prospects_updated_at ON prospects;
CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. TABLE EXCHANGES
-- ============================================================================
-- Historique des echanges avec les prospects
CREATE TABLE IF NOT EXISTS exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Type d'echange
  type exchange_type NOT NULL DEFAULT 'OTHER',

  -- Contenu
  subject TEXT,
  content TEXT,
  summary TEXT,
  details TEXT,
  outcome TEXT,

  -- Direction et statut
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  status TEXT CHECK (status IN ('draft', 'sent', 'received', 'completed')),

  -- Planification
  scheduled_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour exchanges
CREATE INDEX IF NOT EXISTS idx_exchanges_prospect_id ON exchanges(prospect_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_user_id ON exchanges(user_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_type ON exchanges(type);
CREATE INDEX IF NOT EXISTS idx_exchanges_status ON exchanges(status);
CREATE INDEX IF NOT EXISTS idx_exchanges_scheduled_at ON exchanges(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_exchanges_created_at ON exchanges(created_at DESC);

-- Index de recherche full-text francais pour exchanges
CREATE INDEX IF NOT EXISTS idx_exchanges_search ON exchanges
  USING gin(to_tsvector('french',
    coalesce(subject, '') || ' ' ||
    coalesce(content, '') || ' ' ||
    coalesce(summary, '') || ' ' ||
    coalesce(details, '') || ' ' ||
    coalesce(outcome, '')
  ));

-- RLS pour exchanges
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;

-- Policy: Tous les utilisateurs authentifies peuvent gerer les echanges
CREATE POLICY "exchanges_all_authenticated"
  ON exchanges
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger updated_at pour exchanges
DROP TRIGGER IF EXISTS update_exchanges_updated_at ON exchanges;
CREATE TRIGGER update_exchanges_updated_at
  BEFORE UPDATE ON exchanges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. TABLE ATTACHMENTS
-- ============================================================================
-- Fichiers joints aux echanges
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relation avec exchange
  exchange_id UUID NOT NULL REFERENCES exchanges(id) ON DELETE CASCADE,

  -- Informations sur le fichier
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  mimetype TEXT,
  size INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour attachments
CREATE INDEX IF NOT EXISTS idx_attachments_exchange_id ON attachments(exchange_id);
CREATE INDEX IF NOT EXISTS idx_attachments_filename ON attachments(filename);
CREATE INDEX IF NOT EXISTS idx_attachments_mimetype ON attachments(mimetype);
CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at DESC);

-- RLS pour attachments
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Policy: Tous les utilisateurs authentifies peuvent gerer les attachments
CREATE POLICY "attachments_all_authenticated"
  ON attachments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger updated_at pour attachments
DROP TRIGGER IF EXISTS update_attachments_updated_at ON attachments;
CREATE TRIGGER update_attachments_updated_at
  BEFORE UPDATE ON attachments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. TABLE NOTES
-- ============================================================================
-- Notes internes sur les prospects
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Contenu
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'call', 'meeting', 'reminder', 'followup')),

  -- Visibilite
  is_private BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour notes
CREATE INDEX IF NOT EXISTS idx_notes_prospect_id ON notes(prospect_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
CREATE INDEX IF NOT EXISTS idx_notes_is_private ON notes(is_private);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Index de recherche full-text francais pour notes
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes
  USING gin(to_tsvector('french', coalesce(content, '')));

-- RLS pour notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir les notes non-privees ou leurs propres notes
CREATE POLICY "notes_select_policy"
  ON notes
  FOR SELECT
  TO authenticated
  USING (
    is_private = false
    OR user_id = auth.uid()
  );

-- Policy: Les utilisateurs peuvent inserer des notes
CREATE POLICY "notes_insert_authenticated"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Les utilisateurs peuvent modifier leurs propres notes
CREATE POLICY "notes_update_own"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Policy: Les utilisateurs peuvent supprimer leurs propres notes
CREATE POLICY "notes_delete_own"
  ON notes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Trigger updated_at pour notes
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. TABLE DOCUMENTS (pour les fichiers lies aux prospects)
-- ============================================================================
-- Documents/fichiers lies directement aux prospects
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relation avec prospect
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,

  -- Informations sur le document
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content_type TEXT,
  file_size INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour documents
CREATE INDEX IF NOT EXISTS idx_documents_prospect_id ON documents(prospect_id);
CREATE INDEX IF NOT EXISTS idx_documents_title ON documents(title);
CREATE INDEX IF NOT EXISTS idx_documents_filename ON documents(filename);
CREATE INDEX IF NOT EXISTS idx_documents_content_type ON documents(content_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Index de recherche full-text francais pour documents
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents
  USING gin(to_tsvector('french',
    coalesce(title, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(filename, '')
  ));

-- RLS pour documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Tous les utilisateurs authentifies peuvent gerer les documents
CREATE POLICY "documents_all_authenticated"
  ON documents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger updated_at pour documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. FONCTION POUR CREER AUTOMATIQUEMENT UN PROFIL
-- ============================================================================
-- Cette fonction cree automatiquement un profil quand un utilisateur s'inscrit
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'COMMERCIAL'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger pour creer un profil a l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 11. VUES UTILES
-- ============================================================================

-- Vue pour les prospects avec le dernier echange
CREATE OR REPLACE VIEW prospects_with_last_exchange AS
SELECT
  p.*,
  e.id AS last_exchange_id,
  e.type AS last_exchange_type,
  e.subject AS last_exchange_subject,
  e.created_at AS last_exchange_date
FROM prospects p
LEFT JOIN LATERAL (
  SELECT id, type, subject, created_at
  FROM exchanges
  WHERE prospect_id = p.id
  ORDER BY created_at DESC
  LIMIT 1
) e ON true;

-- Vue pour les statistiques des prospects par statut
CREATE OR REPLACE VIEW prospect_stats_by_status AS
SELECT
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_count,
  COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_count
FROM prospects
GROUP BY status;

-- ============================================================================
-- 12. INSERTION DE DONNEES DE TEST (OPTIONNEL)
-- ============================================================================
-- Decommenter pour inserer des donnees de test

/*
-- Tags de test
INSERT INTO tags (name, color) VALUES
  ('Startup', '#10b981'),
  ('Enterprise', '#6366f1'),
  ('PME', '#f59e0b'),
  ('Tech', '#3b82f6'),
  ('E-commerce', '#ec4899')
ON CONFLICT (name) DO NOTHING;

-- Prospect de test
INSERT INTO prospects (company_name, contact_name, email, phone, website, status, priority, source, potential_need, tags)
VALUES (
  'Entreprise Demo',
  'Jean Dupont',
  'jean.dupont@demo.fr',
  '+33 1 23 45 67 89',
  'https://demo.fr',
  'lead',
  'medium',
  'Site web',
  'Besoin d''une application web moderne',
  ARRAY['PME', 'Tech']
);
*/

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
