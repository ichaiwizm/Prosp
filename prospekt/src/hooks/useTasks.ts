"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Note, NoteFormData } from "@/types";

// Note: This hook is for Notes (notes about prospects)
// The term "tasks" is kept for backward compatibility but refers to notes

export function useTasks() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*, prospects(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*, prospects(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Note;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NoteFormData) => {
      const { data: note, error } = await supabase
        .from("notes")
        .insert(data)
        .select("*, prospects(*)")
        .single();

      if (error) throw error;
      return note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NoteFormData>;
    }) => {
      const { data: note, error } = await supabase
        .from("notes")
        .update(data)
        .eq("id", id)
        .select("*, prospects(*)")
        .single();

      if (error) throw error;
      return note;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
