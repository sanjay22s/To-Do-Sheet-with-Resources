import { useState, useEffect } from 'react';
import { X, Cloud, Key, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CloudCredentials } from '../lib/cloudSync';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (creds: CloudCredentials) => Promise<boolean>;
  onDisconnect: () => void;
  currentCreds: CloudCredentials | null;
}

export function CloudSyncModal({ isOpen, onClose, onConnect, onDisconnect, currentCreds }: CloudSyncModalProps) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentCreds) {
      setUrl(currentCreds.url);
      setApiKey(currentCreds.apiKey);
      setSecretKey(currentCreds.secretKey);
    }
  }, [currentCreds, isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !apiKey.trim() || !secretKey.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    const success = await onConnect({
      url: url.trim(),
      apiKey: apiKey.trim(),
      secretKey: secretKey.trim(),
    });
    
    if (!success) {
      setError('Connection failed. Please check your URL and API Key.');
    } else {
      onClose();
    }
    setIsConnecting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#0b0f17] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <Cloud className="text-mint" size={20} />
            <h2 className="text-lg font-semibold text-white">Cloud Sync</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {currentCreds ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 rounded-lg border border-mint/20 bg-mint/10 p-4">
                <CheckCircle2 className="text-mint" size={24} />
                <div>
                  <p className="font-semibold text-mint">Connected & Syncing</p>
                  <p className="text-sm text-mint/80">Your data is safely backed up to the cloud.</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Secret Key ID</p>
                <p className="font-mono text-sm text-white">{currentCreds.secretKey}</p>
              </div>

              <button
                onClick={onDisconnect}
                className="w-full rounded-md border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              <p className="text-sm text-slate-300">
                Link this device to your free Supabase database to automatically sync your progress anywhere.
              </p>

              {error && (
                <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Supabase Project URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full rounded-md border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-mint"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Supabase Anon Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="password"
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                    className="w-full rounded-md border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-mint"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Your Secret Key (Choose a unique ID)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="e.g. sanjay-macbook-123"
                    className="w-full rounded-md border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-mint"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="mt-2 w-full rounded-md bg-mint py-2.5 text-sm font-bold text-slate-900 transition hover:bg-mint/90 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect & Sync'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
