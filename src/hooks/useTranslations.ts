import { useCallback } from 'react';

export function useTranslations(namespace?: string) {
  const t = useCallback((key: string) => {
    if (typeof window === 'undefined') return key;
    
    const messages = (window as any).__MESSAGES__ || {};
    const keys = namespace ? `${namespace}.${key}` : key;
    const parts = keys.split('.');
    
    let value = messages;
    for (const part of parts) {
      value = value?.[part];
      if (!value) return key;
    }
    
    return value || key;
  }, [namespace]);

  return t;
}
