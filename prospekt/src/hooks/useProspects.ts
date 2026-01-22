'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Prospect, ProspectFormData } from '@/types';

export function useProspects() {
  return useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Prospect[];
    },
  });
}

export function useProspect(id: string) {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Prospect;
    },
    enabled: !!id,
  });
}

export function useCreateProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProspectFormData) => {
      const { data: prospect, error } = await supabase
        .from('prospects')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return prospect;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
  });
}

export function useUpdateProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProspectFormData> }) => {
      const { data: prospect, error } = await supabase
        .from('prospects')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return prospect;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospect', id] });
    },
  });
}

export function useDeleteProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
    },
  });
}
