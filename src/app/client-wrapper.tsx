'use client';

import { useEffect } from 'react';
import '@/shared/lib/i18n';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  useEffect(() => {
    // Initialize i18n on client side
    import('@/shared/lib/i18n');
  }, []);

  return <>{children}</>;
}
