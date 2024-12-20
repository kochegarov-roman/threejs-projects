import './globals.css';

import { Roboto } from 'next/font/google';
import React from 'react';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Three.js projects',
  description: 'Three.js projects collections',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className}  antialiased dark`}>
        {children}
      </body>
    </html>
  );
}
