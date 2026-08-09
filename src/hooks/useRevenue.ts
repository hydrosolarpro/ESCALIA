import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RevenueEntry, RevenueInsert } from '../types';

export const useRevenue = () => {
  const [entries, setEntries] = useState<RevenueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('revenue')
      .select('*')
      .order('entry_date', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEntries(data as RevenueEntry[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  const addRevenue = async (entry: RevenueInsert) => {
    const { data, error: insertError } = await supabase.from('revenue').insert(entry).select().single();
    if (!insertError && data) {
      setEntries((prev) => [data as RevenueEntry, ...prev]);
    }
    return { error: insertError ? insertError.message : null };
  };

  const updateRevenue = async (id: string, updates: RevenueInsert) => {
    const { data, error: updateError } = await supabase
      .from('revenue')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!updateError && data) {
      setEntries((prev) => prev.map((e) => (e.id === id ? (data as RevenueEntry) : e)));
    }
    return { error: updateError ? updateError.message : null };
  };

  const deleteRevenue = async (id: string) => {
    const { error: deleteError } = await supabase.from('revenue').delete().eq('id', id);
    if (!deleteError) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
    return { error: deleteError ? deleteError.message : null };
  };

  return { entries, loading, error, refetch: fetchRevenue, addRevenue, updateRevenue, deleteRevenue };
};
