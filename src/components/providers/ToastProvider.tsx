"use client";

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000, 
        style: {
          background: '#363636',
          color: '#fff',
        },

        success: {
          duration: 2500, 
          style: {
            background: '#f3c9c2ff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#EF4444',
          },
        },
      }}
    />
  );
}
