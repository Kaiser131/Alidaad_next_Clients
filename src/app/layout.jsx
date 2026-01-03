'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnheadProvider, createHead } from '@unhead/react/client';
import { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/Providers/AuthProvider';
import { NotificationProvider } from '@/Providers/NotificationProvider';
import MainLayoutWrapper from '@/components/layouts/MainLayoutWrapper';
import '@/index.css';

const head = createHead();

if (process.env.NODE_ENV === 'development') {
  console.log(
    "%c Developed by Kaiser ",
    "background: linear-gradient(to right, #ff7eb3, #65c7f7); color:white; padding:4px 12px; border-radius:9999px; font-size:14px; font-weight:600;",
  );
}

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UnheadProvider head={head}>
              <NotificationProvider user={null}>
                <Toaster position="top-right" toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }} />
                <MainLayoutWrapper>
                  {children}
                </MainLayoutWrapper>
              </NotificationProvider>
            </UnheadProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
