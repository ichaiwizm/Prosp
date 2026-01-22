-- Schéma mis à jour pour les prospects et fonctionnalités associées
-- Ce fichier contient le SQL nécessaire pour créer/mettre à jour les tables

-- Table prospects (mise à jour avec les nouveaux champs)
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  potential_need TEXT,
  confirmed_need TEXT,
  last_exchange TIMESTAMP WITH TIME ZONE,
  source TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table exchanges (échanges avec le prospect)
CREATE TABLE IF NOT EXISTS exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'call' CHECK (type IN ('call', 'email', 'meeting', 'linkedin', 'other')),
  subject TEXT,
  content TEXT,
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('draft', 'sent', 'received', 'completed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table notes (notes sur le prospect)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'call', 'meeting', 'reminder', 'followup')),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table documents (documents liés au prospect)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_priority ON prospects(priority);
CREATE INDEX IF NOT EXISTS idx_prospects_company_name ON prospects(company_name);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects(created_at);

CREATE INDEX IF NOT EXISTS idx_exchanges_prospect_id ON exchanges(prospect_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_created_at ON exchanges(created_at);

CREATE INDEX IF NOT EXISTS idx_notes_prospect_id ON notes(prospect_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

CREATE INDEX IF NOT EXISTS idx_documents_prospect_id ON documents(prospect_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

-- Triggers pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_prospects_updated_at ON prospects;
CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exchanges_updated_at ON exchanges;
CREATE TRIGGER update_exchanges_updated_at
  BEFORE UPDATE ON exchanges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour last_exchange sur prospects
CREATE OR REPLACE FUNCTION update_prospect_last_exchange()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prospects
  SET last_exchange = NEW.created_at
  WHERE id = NEW.prospect_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_prospect_last_exchange_trigger ON exchanges;
CREATE TRIGGER update_prospect_last_exchange_trigger
  AFTER INSERT ON exchanges
  FOR EACH ROW
  EXECUTE FUNCTION update_prospect_last_exchange();

-- RLS (Row Level Security) - À activer selon vos besoins
-- ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Exemple de politique RLS (à adapter selon votre authentification)
-- CREATE POLICY "Users can view their own prospects"
--   ON prospects FOR SELECT
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own prospects"
--   ON prospects FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own prospects"
--   ON prospects FOR UPDATE
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own prospects"
--   ON prospects FOR DELETE
--   USING (auth.uid() = user_id);
