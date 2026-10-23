import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { offlineStorage, QueuedAction } from '../services/offlineStorage';

interface OfflineContextType {
  isOnline: boolean;
  queueCount: number;
  queuedActions: QueuedAction[];
  lastSyncedAt: Date | null;
  triggerSync: () => Promise<number>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>(() => offlineStorage.getQueue());
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Sync queued actions with the server
  const triggerSync = useCallback(async (): Promise<number> => {
    if (!navigator.onLine) return 0;
    const queue = offlineStorage.getQueue();
    if (queue.length === 0) return 0;

    let syncedCount = 0;
    for (const action of queue) {
      try {
        const response = await fetch(action.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.payload)
        });
        if (response.ok) {
          offlineStorage.removeAction(action.id);
          syncedCount++;
        }
      } catch {
        // Stop syncing if network drops again
        break;
      }
    }

    setQueuedActions(offlineStorage.getQueue());
    setLastSyncedAt(new Date());
    return syncedCount;
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on mount
    setQueuedActions(offlineStorage.getQueue());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        queueCount: queuedActions.length,
        queuedActions,
        lastSyncedAt,
        triggerSync
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
