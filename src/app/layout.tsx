import type { Metadata, Viewport } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nota | النوتة الروحية - كنيسة العذراء بالإسماعيلية',
  description:
    'نظام النوتة الروحية الذكية وبناء العادات لشباب ثانوي - كنيسة السيدة العذراء مريم بالإسماعيلية',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nota',
  },
};

export const viewport: Viewport = {
  themeColor: '#D97706',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans antialiased selection:bg-amber-500 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
