import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useSettings = () => {
  const [usdToPen, setUsdToPen] = useState(3.75);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('app_settings').select('usd_to_pen').eq('id', true).single();
    if (!error && data) {
      setUsdToPen(Number(data.usd_to_pen));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateRate = async (rate: number) => {
    const { error } = await supabase
      .from('app_settings')
      .update({ usd_to_pen: rate, updated_at: new Date().toISOString() })
      .eq('id', true);
    if (!error) {
      setUsdToPen(rate);
    }
    return { error: error ? error.message : null };
  };

  return { usdToPen, loading, updateRate };
};
