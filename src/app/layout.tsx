import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Namma Sevai — Cooperative Independent Worker Platform',
  description:
    'Connecting Skills with Community Needs. Modern cooperative-powered digital platform for verified independent local workers across household, personal, community and emergency services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-saffron-100 selection:text-saffron-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
