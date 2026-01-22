'use client';

import { useState, useCallback } from 'react';
import { AssistantResponse } from '@/types';

export function useAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    prospectId?: string,
    context?: any
  ): Promise<AssistantResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          prospectId,
          context: context ? JSON.stringify(context) : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const data: AssistantResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error calling assistant:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendMessage,
    loading,
    error
  };
}
