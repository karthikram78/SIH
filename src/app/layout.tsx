import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SplashScreen } from '@/components/common/SplashScreen';
import { AIChatbot } from '@/components/common/AIChatbot';

export const metadata: Metadata = {
  title: 'Avadi Connect — Connecting Skills with Community Needs | Ministry of Cooperation (SIH 2026)',
  description:
    'Cooperative-owned digital service marketplace connecting customers with verified independent local workers for household, personal, community, and emergency services.',
  manifest: '/manifest.json',
  themeColor: '#d97706',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Avadi Connect',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <LanguageProvider>
          <AppProvider>
            <SplashScreen />
            {children}
            <AIChatbot />
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
