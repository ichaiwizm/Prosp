// Database Types
export interface Database {
  public: {
    Tables: {
      prospects: {
        Row: Prospect;
        Insert: Omit<Prospect, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Prospect, "id" | "created_at" | "updated_at">>;
      };
      exchanges: {
        Row: Exchange;
        Insert: Omit<Exchange, "id" | "created_at" | "updated_at" | "prospects">;
        Update: Partial<Omit<Exchange, "id" | "created_at" | "updated_at" | "prospects">>;
      };
      notes: {
        Row: Note;
        Insert: Omit<Note, "id" | "created_at" | "updated_at" | "prospects">;
        Update: Partial<Omit<Note, "id" | "created_at" | "updated_at" | "prospects">>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, "id" | "created_at" | "updated_at" | "prospects">;
        Update: Partial<Omit<Document, "id" | "created_at" | "updated_at" | "prospects">>;
      };
    };
  };
}

// Core Entity Types
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

// Enums - Keep legacy types for backward compatibility
export type ProspectStatus = Prospect["status"];
export type ExchangeType = Exchange["type"];
export type ExchangeDirection = Exchange["direction"];
export type ExchangeStatus = Exchange["status"];
export type NoteType = Note["type"];

// Legacy types for backward compatibility (will be deprecated)
export type DealStage =
  | "prospecting"
  | "qualification"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";
export type DealStatus = "open" | "won" | "lost";
export type TaskType = "call" | "email" | "meeting" | "follow_up" | "other";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";

// Legacy interfaces (will be deprecated - use Prospect and Exchange instead)
export interface Deal {
  id: string;
  user_id: string;
  prospect_id?: string;
  title: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  status: DealStatus;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  prospect_id?: string;
  deal_id?: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Analytics Types
export interface DashboardStats {
  total_prospects: number;
  active_deals: number;
  pending_tasks: number;
  revenue_this_month: number;
  conversion_rate: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// Form Types
export interface ProspectFormData extends Omit<
  Prospect,
  "id" | "created_at" | "updated_at"
> {}

export interface ExchangeFormData extends Omit<
  Exchange,
  "id" | "created_at" | "updated_at" | "prospects"
> {}

export interface NoteFormData extends Omit<
  Note,
  "id" | "created_at" | "updated_at" | "prospects"
> {}

export interface DocumentFormData extends Omit<
  Document,
  "id" | "created_at" | "updated_at" | "prospects"
> {}

// Legacy form types (will be deprecated)
export interface DealFormData extends Omit<
  Deal,
  "id" | "user_id" | "created_at" | "updated_at"
> {}

export interface TaskFormData extends Omit<
  Task,
  "id" | "user_id" | "created_at" | "updated_at"
> {}

// Knowledge Documentation Types
export type KnowledgeDocCategory =
  | "SITUATION"
  | "SERVICE"
  | "PROCESS"
  | "TEMPLATE";

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: KnowledgeDocCategory;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// AI Assistant Types
export interface AssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface AssistantContext {
  prospectId?: string;
  prospect?: Prospect;
  exchanges?: any[];
  notes?: any[];
  callObjective?: string;
  suggestedQuestions?: string[];
  possibleObjections?: string[];
  relevantDocs?: KnowledgeDoc[];
}

export interface AssistantResponse {
  message: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}
