// Types pour les tables Supabase

export interface Prospect {
  id: string;
  company_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  website?: string;
  status:
    | "lead"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost";
  priority: "low" | "medium" | "high" | "urgent";
  potential_need?: string;
  confirmed_need?: string;
  last_exchange?: string;
  source?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Exchange {
  id: string;
  prospect_id: string;
  type: "email" | "call" | "meeting" | "linkedin" | "other";
  subject?: string;
  content?: string;
  direction?: "inbound" | "outbound";
  status?: "draft" | "sent" | "received" | "completed";
  scheduled_at?: string;
  created_at?: string;
  updated_at?: string;
  prospects?: Prospect;
}

export interface Note {
  id: string;
  prospect_id: string;
  content: string;
  type?: "general" | "call" | "meeting" | "reminder" | "followup";
  is_pinned?: boolean;
  created_at?: string;
  updated_at?: string;
  prospects?: Prospect;
}

export interface Document {
  id: string;
  prospect_id: string;
  title: string;
  description?: string;
  filename: string;
  file_path: string;
  content_type: string;
  file_size: number;
  created_at?: string;
  updated_at?: string;
  prospects?: Prospect;
}

// Types pour les requêtes API
export interface CreateProspectRequest {
  company_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  website?: string;
  status?: Prospect["status"];
  priority?: Prospect["priority"];
  potential_need?: string;
  confirmed_need?: string;
  source?: string;
  tags?: string[];
}

export interface UpdateProspectRequest {
  company_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  status?: Prospect["status"];
  priority?: Prospect["priority"];
  potential_need?: string;
  confirmed_need?: string;
  source?: string;
  tags?: string[];
}

export interface CreateExchangeRequest {
  prospect_id: string;
  type: Exchange["type"];
  subject?: string;
  content?: string;
  direction?: Exchange["direction"];
  status?: Exchange["status"];
  scheduled_at?: string;
}

export interface UpdateExchangeRequest {
  type?: Exchange["type"];
  subject?: string;
  content?: string;
  direction?: Exchange["direction"];
  status?: Exchange["status"];
  scheduled_at?: string;
}

export interface CreateNoteRequest {
  prospect_id: string;
  content: string;
  type?: Note["type"];
  is_pinned?: boolean;
}

export interface UpdateNoteRequest {
  content?: string;
  type?: Note["type"];
  is_pinned?: boolean;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
}

// Types pour l'Assistant IA
export interface AssistantRequest {
  message: string;
  prospectId?: string;
  context?: string;
}

export interface AssistantResponse {
  message: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Types pour les erreurs
export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}

// Types pour les réponses de succès
export interface SuccessResponse {
  success: boolean;
  message?: string;
}

export interface DownloadUrlResponse {
  url: string;
  filename: string;
  content_type: string;
}
