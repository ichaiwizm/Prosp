"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Exchange, ExchangeFormData } from "@/types";

// Note: This hook is for Exchanges (interactions with prospects)
// The term "deals" is kept for backward compatibility but refers to exchanges

export function useDeals() {
  return useQuery({
    queryKey: ["exchanges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exchanges")
        .select("*, prospects(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Exchange[];
    },
  });
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ["exchange", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exchanges")
        .select("*, prospects(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Exchange;
    },
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExchangeFormData) => {
      const { data: exchange, error } = await supabase
        .from("exchanges")
        .insert(data)
        .select("*, prospects(*)")
        .single();

      if (error) throw error;
      return exchange;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ExchangeFormData>;
    }) => {
      const { data: exchange, error } = await supabase
        .from("exchanges")
        .update(data)
        .eq("id", id)
        .select("*, prospects(*)")
        .single();

      if (error) throw error;
      return exchange;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
      queryClient.invalidateQueries({ queryKey: ["exchange", id] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exchanges").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
    },
  });
}
