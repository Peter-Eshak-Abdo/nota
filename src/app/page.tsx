'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { YouthDashboard } from '@/components/dashboards/YouthDashboard';
import { ServantDashboard } from '@/components/dashboards/ServantDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';

export default function Home() {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" dir="rtl">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {currentUser.role === 'youth' && <YouthDashboard />}
        {currentUser.role === 'servant' && <ServantDashboard />}
        {currentUser.role === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          تطبيق <strong>Nota</strong> — النوتة الروحية لشباب ثانوي • كنيسة السيدة العذراء والشهيد مارجرجس
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          «كُلَّ مَا تَفْعَلُونَهُ فَافْعَلُوهُ مِنْ كُلِّ الْقَلْبِ، كَمَا لِلرَّبِّ» (كو ٣: ٢٣)
        </p>
      </footer>
    </div>
  );
}
