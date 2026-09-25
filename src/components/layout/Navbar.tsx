'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wifi,
  WifiOff,
  Flame,
  LogOut,
  UserCheck,
  Shield,
  Sparkles,
  CloudUpload,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, allUsers, switchUser, logout, isOnline, syncStatus } = useApp();

  if (!currentUser) return null;

  const roleLabels: Record<string, { name: string; color: string }> = {
    youth: { name: 'مخدوم', color: 'bg-amber-100 text-amber-800' },
    servant: { name: 'خادم', color: 'bg-sky-100 text-sky-800' },
    admin: { name: 'أمين الخدمة', color: 'bg-emerald-100 text-emerald-800' },
  };

  const currentRoleInfo = roleLabels[currentUser.role] || roleLabels.youth;

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
                كنيسة العذراء بالإسماعيلية • بناء العادات لشباب ثانوي
              </p>
            </div>
          </div>

          {/* Right Controls: Role & User & Logout */}
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

            {/* Current User & Role Switcher */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentRoleInfo.color}`}>
                {currentRoleInfo.name}
              </span>
              <span className="font-bold text-slate-900 hidden sm:inline">
                {currentUser.displayName}
              </span>
              {/* Demo Switcher */}
              <select
                value={currentUser.uid}
                onChange={(e) => switchUser(e.target.value)}
                aria-label="التبديل بين الحسابات"
                className="bg-transparent text-xs font-bold text-amber-700 focus:outline-none cursor-pointer border-r border-slate-200 pr-1.5 mr-1"
                title="تبديل الحساب للتجربة السريعة"
              >
                <optgroup label="المخدومين (Youths)">
                  {allUsers
                    .filter((u) => u.role === 'youth' && u.status === 'active')
                    .map((u) => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName} (مخدوم)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="الخدام (Servants)">
                  {allUsers
                    .filter((u) => u.role === 'servant' && u.status === 'active')
                    .map((u) => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName} (خادم)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="أمين الخدمة (Admin)">
                  {allUsers
                    .filter((u) => u.role === 'admin' && u.status === 'active')
                    .map((u) => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName} (أمين الخدمة)
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

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

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-700" />
          <span>
            <strong>تنبيه العمل دون اتصال:</strong> تم حفظ التعديلات محلياً على جهازك وستتم المزامنة تلقائياً فور عودة الاتصال بالإنترنت.
          </span>
        </div>
      )}
    </>
  );
};
