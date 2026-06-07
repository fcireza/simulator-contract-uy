import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePersistedState, { clearPersistedKey, clearAllPersisted, __resetBatch } from '../usePersistedState';

describe('usePersistedState', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetBatch();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return default value when nothing is stored', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should restore value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should save to localStorage on state change (after debounce)', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    // Before debounce, value should not be in localStorage yet
    expect(localStorage.getItem('test-key')).toBe(null);

    // After debounce
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });

  it('should handle complex objects', () => {
    const complexValue = { name: 'test', count: 42, nested: { a: 1 } };
    const { result } = renderHook(() => usePersistedState('complex-key', complexValue));

    const newValue = { name: 'updated', count: 100, nested: { a: 2, b: 3 } };
    act(() => {
      result.current[1](newValue);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(JSON.parse(localStorage.getItem('complex-key')!)).toEqual(newValue);
  });

  it('should handle corrupt JSON in localStorage gracefully', () => {
    localStorage.setItem('corrupt-key', 'not valid json{{{');
    const { result } = renderHook(() => usePersistedState('corrupt-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('should handle localStorage unavailable on read', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('localStorage unavailable');
    });

    const { result } = renderHook(() => usePersistedState('unavailable-key', 'default'));
    expect(result.current[0]).toBe('default');

    Storage.prototype.getItem = originalGetItem;
  });

  it('should handle localStorage unavailable on write', () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('localStorage unavailable');
    });

    const { result } = renderHook(() => usePersistedState('write-key', 'initial'));
    act(() => {
      result.current[1]('new-value');
    });

    // Should not throw
    act(() => {
      vi.advanceTimersByTime(500);
    });

    Storage.prototype.setItem = originalSetItem;
  });

  it('should handle quota exceeded on write', () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      const error = new Error('Quota exceeded');
      (error as any).name = 'QuotaExceededError';
      throw error;
    });

    const { result } = renderHook(() => usePersistedState('quota-key', 'initial'));
    act(() => {
      result.current[1]('new-value');
    });

    // Should not throw
    act(() => {
      vi.advanceTimersByTime(500);
    });

    Storage.prototype.setItem = originalSetItem;
  });
});

describe('clearPersistedKey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should remove a specific key', () => {
    localStorage.setItem('simulator-test', 'value');
    clearPersistedKey('simulator-test');
    expect(localStorage.getItem('simulator-test')).toBe(null);
  });

  it('should not throw if key does not exist', () => {
    expect(() => clearPersistedKey('nonexistent')).not.toThrow();
  });
});

describe('clearAllPersisted', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should remove all simulator-prefixed keys', () => {
    localStorage.setItem('simulator-incomeUsd', '3000');
    localStorage.setItem('simulator-bpc', '');
    localStorage.setItem('other-key', 'should-stay');

    clearAllPersisted();

    expect(localStorage.getItem('simulator-incomeUsd')).toBe(null);
    expect(localStorage.getItem('simulator-bpc')).toBe(null);
    expect(localStorage.getItem('other-key')).toBe('should-stay');
  });

  it('should not throw if localStorage is unavailable', () => {
    const originalLength = Object.getOwnPropertyDescriptor(Storage.prototype, 'length');
    Object.defineProperty(Storage.prototype, 'length', {
      get: () => {
        throw new Error('unavailable');
      },
      configurable: true,
    });

    expect(() => clearAllPersisted()).not.toThrow();

    if (originalLength) {
      Object.defineProperty(Storage.prototype, 'length', originalLength);
    }
  });
});
