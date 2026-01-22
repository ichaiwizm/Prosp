// Database Types
export interface Database {
  public: {
    Tables: {
      prospects: {
        Row: Prospect;
        Insert: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Prospect, 'id' | 'created_at' | 'updated_at'>>;
      };
      deals: {
        Row: Deal;
        Insert: Omit<Deal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Deal, 'id' | 'created_at' | 'updated_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// Core Entity Types
export interface Prospect {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: ProspectStatus;
  score?: number;
  last_contact?: string;
  next_follow_up?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

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

// Enums
export type ProspectStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export type DealStatus = 'open' | 'won' | 'lost';

export type TaskType = 'call' | 'email' | 'meeting' | 'follow_up' | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

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
export interface ProspectFormData extends Omit<Prospect, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export interface DealFormData extends Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export interface TaskFormData extends Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

// Knowledge Documentation Types
export type KnowledgeDocCategory = 'SITUATION' | 'SERVICE' | 'PROCESS' | 'TEMPLATE';

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
  role: 'user' | 'assistant' | 'system';
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
