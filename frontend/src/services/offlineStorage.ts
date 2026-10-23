/**
 * NEXAGRI Offline Storage & Action Sync Engine
 * Manages local persistence for mandi prices, farm data, and queues offline actions.
 */

export interface QueuedAction {
  id: string;
  type: 'CREATE_LOT' | 'SEND_SMS' | 'UPDATE_UPI' | 'SUBMIT_INSURANCE' | 'LOG_DISPUTE';
  endpoint: string;
  payload: any;
  timestamp: string;
  retryCount: number;
}

const CACHE_PREFIX = 'nexagri_offline_cache_';
const QUEUE_KEY = 'nexagri_offline_action_queue';

export const offlineStorage = {
  // Save any API dataset to offline storage
  set: <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({
        timestamp: new Date().toISOString(),
        data
      }));
    } catch {
      // ignore storage quota exceeded
    }
  },

  // Get cached dataset from offline storage
  get: <T>(key: string): { data: T; timestamp: string } | null => {
    try {
      const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!item) return null;
      return JSON.parse(item);
    } catch {
      return null;
    }
  },

  // Check if specific cache exists
  has: (key: string): boolean => {
    return localStorage.getItem(`${CACHE_PREFIX}${key}`) !== null;
  },

  // Queue an action to be executed when back online
  queueAction: (type: QueuedAction['type'], endpoint: string, payload: any): QueuedAction => {
    const queue = offlineStorage.getQueue();
    const newAction: QueuedAction = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      endpoint,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    queue.push(newAction);
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // ignore
    }
    return newAction;
  },

  // Get all queued actions
  getQueue: (): QueuedAction[] => {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Remove action from queue by ID
  removeAction: (id: string): void => {
    const queue = offlineStorage.getQueue().filter(a => a.id !== id);
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // ignore
    }
  },

  // Clear all queued actions
  clearQueue: (): void => {
    localStorage.removeItem(QUEUE_KEY);
  },

  // Device online check helper
  isOnline: (): boolean => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
};
