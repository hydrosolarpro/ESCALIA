import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lead, LeadInsert, LeadStatus } from '../types';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setLeads(data as Lead[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (lead: LeadInsert) => {
    const { data, error: insertError } = await supabase.from('leads').insert(lead).select().single();
    if (!insertError && data) {
      setLeads((prev) => [data as Lead, ...prev]);
    }
    return { error: insertError ? insertError.message : null };
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    const { error: updateError } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!updateError) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
    return { error: updateError ? updateError.message : null };
  };

  const deleteLead = async (id: string) => {
    const { error: deleteError } = await supabase.from('leads').delete().eq('id', id);
    if (!deleteError) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
    return { error: deleteError ? deleteError.message : null };
  };

  return { leads, loading, error, refetch: fetchLeads, addLead, updateLeadStatus, deleteLead };
};
