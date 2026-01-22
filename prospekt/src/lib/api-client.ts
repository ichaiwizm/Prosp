// Client API pour faciliter les appels aux routes API

import type {
  Prospect,
  Exchange,
  Note,
  Document,
  CreateProspectRequest,
  UpdateProspectRequest,
  CreateExchangeRequest,
  UpdateExchangeRequest,
  CreateNoteRequest,
  UpdateNoteRequest,
  UpdateDocumentRequest,
  AssistantRequest,
  AssistantResponse,
  DownloadUrlResponse,
} from '@/types/database.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper pour les requêtes fetch
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Unknown error',
      details: response.statusText,
    }));
    throw new Error(error.details || error.error);
  }

  return response.json();
}

// === PROSPECTS ===

export const prospectsApi = {
  list: () => fetchApi<Prospect[]>('/api/prospects'),
  get: (id: string) => fetchApi<Prospect>(`/api/prospects/${id}`),
  create: (data: CreateProspectRequest) =>
    fetchApi<Prospect>('/api/prospects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateProspectRequest) =>
    fetchApi<Prospect>(`/api/prospects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/prospects/${id}`, {
      method: 'DELETE',
    }),
  exchanges: (id: string) =>
    fetchApi<Exchange[]>(`/api/prospects/${id}/exchanges`),
  notes: (id: string) => fetchApi<Note[]>(`/api/prospects/${id}/notes`),
  documents: (id: string) => fetchApi<Document[]>(`/api/prospects/${id}/docs`),
};

// === EXCHANGES ===

export const exchangesApi = {
  list: () => fetchApi<Exchange[]>('/api/exchanges'),
  listByProspect: (prospectId: string) =>
    fetchApi<Exchange[]>(`/api/exchanges?prospect_id=${prospectId}`),
  get: (id: string) => fetchApi<Exchange>(`/api/exchanges/${id}`),
  create: (data: CreateExchangeRequest) =>
    fetchApi<Exchange>('/api/exchanges', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateExchangeRequest) =>
    fetchApi<Exchange>(`/api/exchanges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/exchanges/${id}`, {
      method: 'DELETE',
    }),
};

// === NOTES ===

export const notesApi = {
  list: () => fetchApi<Note[]>('/api/notes'),
  listByProspect: (prospectId: string) =>
    fetchApi<Note[]>(`/api/notes?prospect_id=${prospectId}`),
  get: (id: string) => fetchApi<Note>(`/api/notes/${id}`),
  create: (data: CreateNoteRequest) =>
    fetchApi<Note>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateNoteRequest) =>
    fetchApi<Note>(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/notes/${id}`, {
      method: 'DELETE',
    }),
};

// === DOCUMENTS ===

export const documentsApi = {
  list: () => fetchApi<Document[]>('/api/docs'),
  listByProspect: (prospectId: string) =>
    fetchApi<Document[]>(`/api/docs?prospect_id=${prospectId}`),
  get: (id: string) => fetchApi<Document>(`/api/docs/${id}`),
  upload: async (
    file: File,
    prospectId: string,
    title?: string,
    description?: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prospect_id', prospectId);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    const response = await fetch(`${API_BASE_URL}/api/docs`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Unknown error',
        details: response.statusText,
      }));
      throw new Error(error.details || error.error);
    }

    return response.json() as Promise<Document>;
  },
  update: (id: string, data: UpdateDocumentRequest) =>
    fetchApi<Document>(`/api/docs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/docs/${id}`, {
      method: 'DELETE',
    }),
  getDownloadUrl: (id: string) =>
    fetchApi<DownloadUrlResponse>(`/api/docs/${id}/download`),
};

// === ASSISTANT ===

export const assistantApi = {
  chat: (data: AssistantRequest) =>
    fetchApi<AssistantResponse>('/api/assistant', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHistory: (prospectId: string) =>
    fetchApi<any>(`/api/assistant?prospect_id=${prospectId}`),
};

// Export par défaut
export default {
  prospects: prospectsApi,
  exchanges: exchangesApi,
  notes: notesApi,
  documents: documentsApi,
  assistant: assistantApi,
};
