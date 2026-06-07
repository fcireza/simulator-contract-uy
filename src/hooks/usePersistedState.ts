import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

// ── Batch write scheduler ──
// All usePersistedState instances share a single debounced flush,
// so changing N fields within 500ms produces only ONE localStorage write cycle.

const pendingBatch = new Map<string, string>();
let batchTimer: ReturnType<typeof setTimeout> | null = null;

function flushBatch(): void {
  for (const [key, value] of pendingBatch) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Quota exceeded or localStorage unavailable — silently ignore
    }
  }
  pendingBatch.clear();
  batchTimer = null;
}

/** Exposed for testing — reset the batch scheduler between tests. */
export function __resetBatch(): void {
  if (batchTimer !== null) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  pendingBatch.clear();
}

function scheduleWrite(key: string, value: string): void {
  const wasEmpty = pendingBatch.size === 0;
  pendingBatch.set(key, value);
  // Only start a timer if one isn't already pending.
  // This batches all writes within the same 500ms window into a single flush.
  if (wasEmpty) {
    batchTimer = setTimeout(flushBatch, 500);
  }
}

/**
 * Generic hook that persists state to localStorage.
 * On mount: reads from localStorage, falls back to defaultValue.
 * On change: writes to localStorage (debounced ~500ms, batched across all instances).
 * Handles errors gracefully (localStorage unavailable, quota exceeded, corrupt data).
 */
export default function usePersistedState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // Corrupt data or localStorage unavailable — fall back to default
    }
    return defaultValue;
  });

  // Schedule a batched write to localStorage on state change
  useEffect(() => {
    scheduleWrite(key, JSON.stringify(state));
  }, [key, state]);

  // Flush pending writes immediately on unmount to prevent data loss
  useEffect(() => {
    return () => {
      if (batchTimer !== null) {
        clearTimeout(batchTimer);
      }
      flushBatch();
    };
  }, []);

  return [state, setState];
}

/**
 * Clear a specific key from localStorage.
 */
export function clearPersistedKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}

/**
 * Clear all simulator-persisted keys (prefixed with "simulator-").
 */
export function clearAllPersisted(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('simulator-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Silently ignore
  }
}
