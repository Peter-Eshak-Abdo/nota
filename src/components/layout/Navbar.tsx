'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format14DigitCode } from '@/lib/biometrics';
import {
  Wifi,
  WifiOff,
  Flame,
  LogOut,
  Fingerprint,
  KeyRound,
  Check,
  Copy,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, toggleBiometrics, isOnline, syncStatus } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [biometricNotice, setBiometricNotice] = useState<string | null>(null);

  if (!currentUser) return null;

  const roleLabels: Record<string, { name: string; color: string }> = {
    youth: { name: 'مخدوم', color: 'bg-amber-100 text-amber-900 border border-amber-200' },
    servant: { name: 'خادم', color: 'bg-sky-100 text-sky-900 border border-sky-200' },
    admin: { name: 'أمين الخدمة', color: 'bg-emerald-100 text-emerald-900 border border-emerald-200' },
  };

  const currentRoleInfo = roleLabels[currentUser.role] || roleLabels.youth;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.accessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleToggleBiometrics = async () => {
    const willEnable = !currentUser.biometricEnabled;
    const res = await toggleBiometrics(willEnable);
    setBiometricNotice(res.message || null);
    setTimeout(() => setBiometricNotice(null), 3500);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-200 font-black text-xl">
              ✝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900">
                  Nota
                </span>
                <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 border border-amber-200">
                  النوتة الروحية
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                كنيسة السيدة العذراء بالإسماعيلية
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Streak Badge */}
            {currentUser.role === 'youth' && (
              <div className="hidden sm:flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                <Flame className="h-3.5 w-3.5 fill-amber-500" />
                <span>{currentUser.currentStreak} يوم</span>
              </div>
            )}

            {/* Online / Offline Status */}
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                !isOnline
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : syncStatus === 'pending_sync'
                  ? 'border-amber-200 bg-amber-50 text-amber-800 animate-pulse'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              }`}
            >
              {!isOnline ? (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">غير متصل</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">متصل</span>
                </>
              )}
            </div>

            {/* User Info Bar */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${currentRoleInfo.color}`}>
                {currentRoleInfo.name}
              </span>
              <span className="font-extrabold text-slate-900 hidden sm:inline">
                {currentUser.displayName}
              </span>
            </div>

            {/* My 14-Digit Code Button */}
            <button
              onClick={() => setShowCodeModal(true)}
              title="عرض كود الدخول الخاص بي (١٤ رقماً)"
              className="flex items-center gap-1 p-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors text-xs font-bold"
            >
              <KeyRound className="h-4 w-4 text-amber-700" />
              <span className="hidden md:inline">كودي</span>
            </button>

            {/* Biometric Toggle Button */}
            <button
              onClick={handleToggleBiometrics}
              title={currentUser.biometricEnabled ? 'إلغاء ربط بصمة الهاتف' : 'تفعيل الدخول ببصمة الهاتف أو Face ID'}
              className={`p-2 rounded-xl border transition-colors ${
                currentUser.biometricEnabled
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Fingerprint className="h-4 w-4" />
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="تسجيل الخروج"
              className="flex items-center gap-1 p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Biometric Notice Banner */}
      {biometricNotice && (
        <div className="bg-emerald-100 border-b border-emerald-300 px-4 py-2 text-center text-xs font-bold text-emerald-900 animate-fade-in">
          {biometricNotice}
        </div>
      )}

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-700" />
          <span>
            <strong>تنبيه العمل دون اتصال:</strong> تم حفظ التعديلات محلياً وستتم المزامنة تلقائياً فور عودة الاتصال.
          </span>
        </div>
      )}

      {/* 14-Digit Access Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-sm rounded-2xl border border-amber-300 bg-white p-6 text-slate-800 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-200">
              <KeyRound className="h-6 w-6" />
            </div>

            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              كود الدخول الخاص بك (١٤ رقماً)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              يمكنك استخدام هذا الكود لتسجيل الدخول في أي وقت على أي جهاز
            </p>

            <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-4 mb-4">
              <div className="font-mono text-xl sm:text-2xl font-black text-amber-800 tracking-wider select-all">
                {format14DigitCode(currentUser.accessCode)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600 shadow-sm"
              >
                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedCode ? 'تم نسخ الكود!' : 'نسخ الكود'}</span>
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
