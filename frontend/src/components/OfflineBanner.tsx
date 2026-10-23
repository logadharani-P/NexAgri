import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, CloudLightning } from 'lucide-react';
import { useOffline } from '../context/OfflineContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, queueCount, triggerSync } = useOffline();
  const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowReconnectedAlert(true);
      const timer = setTimeout(() => {
        setShowReconnectedAlert(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSync();
    setIsSyncing(false);
  };

  // 1. Back Online Alert (Temporary 4s banner)
  if (showReconnectedAlert) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-md transition-all duration-300 flex items-center justify-between z-50 sticky top-0">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>🟢 Connection Restored • Synced with live Agmarknet mandi feeds and weather radar.</span>
        </div>
      </div>
    );
  }

  // 2. Offline Mode Active Banner
  if (!isOnline) {
    return (
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-md transition-all duration-300 z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/40 text-amber-200">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold uppercase tracking-wider text-[10px] bg-amber-900/60 px-2 py-0.5 rounded text-amber-200 mr-2 border border-amber-400/30">
                Offline Mode Active
              </span>
              <span>Viewing cached 439+ Indian mandis & farm data. All offline changes are saved locally.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {queueCount > 0 && (
              <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CloudLightning className="w-3 h-3 text-amber-300" />
                {queueCount} action{queueCount > 1 ? 's' : ''} queued to sync
              </span>
            )}

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-white/20 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Checking...' : 'Check Connection'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
