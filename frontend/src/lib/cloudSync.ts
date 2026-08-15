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

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadFileToStorage(creds: CloudCredentials, file: File): Promise<string> {
  const supabase = supabaseInstance || initSupabase(creds.url, creds.apiKey);
  
  const fileExt = file.name.split('.').pop();
  const randomId = Math.random().toString(36).substring(2, 9);
  const fileName = `${Date.now()}-${randomId}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('resources')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(error.message + '. Please ensure you have created a public bucket named "resources" in your Supabase storage.');
  }

  const { data: urlData } = supabase.storage
    .from('resources')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}


