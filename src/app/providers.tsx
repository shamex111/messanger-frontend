'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const Providers: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false
        }
      }
    })
  );

  return (
    <QueryClientProvider client={client}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: '#1b2332',
            color: '#fff'
          },
          success: {
            iconTheme: {
              primary: '#8069ef',  // Цвет галочки
              secondary: '#fff'    // Цвет фона иконки
            },
          }
        }}
      />
      {children}
    </QueryClientProvider>
  );
};
export default Providers;
