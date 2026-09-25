'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wifi,
  WifiOff,
  Flame,
  UserCheck,
  Shield,
  Sparkles,
  CloudUpload,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, allUsers, switchUser, isOnline, syncStatus } = useApp();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
              ✝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Nota
                </span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  النوتة الروحية
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                بناء العادات الروحية لشباب ثانوي • Atomic Habits
              </p>
            </div>
          </div>

          {/* Right Controls: Role Switcher & Status */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            {currentUser.role === 'youth' && (
              <div className="hidden sm:flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                <span>{currentUser.currentStreak} يوم</span>
              </div>
            )}

            {/* Online / Offline / Sync Status */}
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                !isOnline
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : syncStatus === 'pending_sync'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 animate-pulse'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              {!isOnline ? (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">وضع عدم الاتصال</span>
                </>
              ) : syncStatus === 'pending_sync' ? (
                <>
                  <CloudUpload className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">جاري المزامنة...</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">متصل بالسحابة</span>
                </>
              )}
            </div>

            {/* Quick Role Switcher for Demo & Testing */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
              <span className="text-[10px] text-slate-400 hidden lg:inline">الحساب النشط:</span>
              <select
                value={currentUser.uid}
                onChange={(e) => switchUser(e.target.value)}
                aria-label="الحساب النشط"
                className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
              >
                <optgroup label="المخدومين (Youths)">
                  {allUsers
                    .filter((u) => u.role === 'youth')
                    .map((u) => (
                      <option key={u.uid} value={u.uid} className="bg-slate-900 text-white">
                        {u.displayName} (مخدوم)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="الخدام (Servants)">
                  {allUsers
                    .filter((u) => u.role === 'servant')
                    .map((u) => (
                      <option key={u.uid} value={u.uid} className="bg-slate-900 text-white">
                        {u.displayName} (خادم)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="أمين الخدمة (Admin)">
                  {allUsers
                    .filter((u) => u.role === 'admin')
                    .map((u) => (
                      <option key={u.uid} value={u.uid} className="bg-slate-900 text-white">
                        {u.displayName} (أمين الخدمة)
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Alert Banner (Requested in prompt) */}
      {(!isOnline || syncStatus === 'pending_sync') && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong>تنبيه العمل دون اتصال:</strong> تم حفظ التعديلات محلياً على جهازك وستتم المزامنة تلقائياً فور عودة الاتصال بالإنترنت.
          </span>
        </div>
      )}
    </>
  );
};
