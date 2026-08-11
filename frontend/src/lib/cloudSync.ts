import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { RoadmapResponse } from './types';

export interface CloudCredentials {
  url: string;
  apiKey: string;
  secretKey: string;
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(url: string, apiKey: string) {
  // Normalize URL to remove trailing slashes or subpaths like /rest/v1/
  let normalizedUrl = url.trim();
  if (normalizedUrl.endsWith('/')) {
    normalizedUrl = normalizedUrl.slice(0, -1);
  }
  if (normalizedUrl.endsWith('/rest/v1')) {
    normalizedUrl = normalizedUrl.slice(0, -8);
  }
  
  supabaseInstance = createClient(normalizedUrl, apiKey.trim());
  return supabaseInstance;
}

export async function fetchFromCloud(creds: CloudCredentials): Promise<RoadmapResponse | null> {
  const supabase = initSupabase(creds.url, creds.apiKey);
  const { data, error } = await supabase
    .from('cloud_saves')
    .select('roadmap_data')
    .eq('secret_key', creds.secretKey.trim())
    .maybeSingle();

  if (error) {
    console.error('Error fetching from cloud:', error);
    throw new Error(error.message || 'Failed to fetch from cloud');
  }

  if (!data) {
    return null;
  }

  return data.roadmap_data as RoadmapResponse;
}

export async function saveToCloud(creds: CloudCredentials, roadmapData: RoadmapResponse): Promise<boolean> {
  try {
    const supabase = supabaseInstance || initSupabase(creds.url, creds.apiKey);
    
    const { error } = await supabase
      .from('cloud_saves')
      .upsert(
        { secret_key: creds.secretKey.trim(), roadmap_data: roadmapData },
        { onConflict: 'secret_key' }
      );

    if (error) {
      console.error('Error saving to cloud:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception saving to cloud:', err);
    return false;
  }
}

