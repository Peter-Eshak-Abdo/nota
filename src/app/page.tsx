'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { Navbar } from '@/components/layout/Navbar';
import { YouthDashboard } from '@/components/dashboards/YouthDashboard';
import { ServantDashboard } from '@/components/dashboards/ServantDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';

export default function Home() {
  const { currentUser, isMounted } = useApp();

  // Until mounted on client, render a calm neutral placeholder to guarantee 0 SSR hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white font-black text-2xl shadow-md shadow-amber-200 animate-pulse">
          ✝
        </div>
        <p className="mt-3 text-xs font-bold text-slate-500">جاري تحميل النوتة الروحية...</p>
      </div>
    );
  }

  // If not logged in, show clean Auth Screen (without navbar)
  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {currentUser.role === 'youth' && <YouthDashboard />}
        {currentUser.role === 'servant' && <ServantDashboard />}
        {currentUser.role === 'admin' && <AdminDashboard />}
      </main>

      {/* Light Clean Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          تطبيق <strong>Nota</strong> — النوتة الروحية لشباب ثانوي • كنيسة السيدة العذراء مريم بالإسماعيلية
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          «كُلَّ مَا تَفْعَلُونَهُ فَافْعَلُوهُ مِنْ كُلِّ الْقَلْبِ، كَمَا لِلرَّبِّ» (كو ٣: ٢٣)
        </p>
      </footer>
    </div>
  );
}
