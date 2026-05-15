'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        duration: 2600,
        style: {
          borderRadius: '10px',
          background: '#111827',
          color: '#fff',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
