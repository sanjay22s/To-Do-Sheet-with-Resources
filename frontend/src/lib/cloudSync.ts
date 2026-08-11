import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { RoadmapResponse } from './types';

export interface CloudCredentials {
  url: string;
  apiKey: string;
  secretKey: string;
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(url: string, apiKey: string) {
  supabaseInstance = createClient(url, apiKey);
  return supabaseInstance;
}

export async function fetchFromCloud(creds: CloudCredentials): Promise<RoadmapResponse | null> {
  const supabase = initSupabase(creds.url, creds.apiKey);
  const { data, error } = await supabase
    .from('cloud_saves')
    .select('roadmap_data')
    .eq('secret_key', creds.secretKey)
    .single();

  if (error || !data) {
    console.error('Error fetching from cloud:', error);
    return null;
  }

  return data.roadmap_data as RoadmapResponse;
}

export async function saveToCloud(creds: CloudCredentials, roadmapData: RoadmapResponse): Promise<boolean> {
  const supabase = supabaseInstance || initSupabase(creds.url, creds.apiKey);
  
  const { error } = await supabase
    .from('cloud_saves')
    .upsert(
      { secret_key: creds.secretKey, roadmap_data: roadmapData },
      { onConflict: 'secret_key' }
    );

  if (error) {
    console.error('Error saving to cloud:', error);
    return false;
  }
  return true;
}
