import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Lumina Design System',
  description: 'Enterprise apps workspace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
