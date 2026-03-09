import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calm Task Manager',
  description: 'Focused task management with private contextual estimates.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
