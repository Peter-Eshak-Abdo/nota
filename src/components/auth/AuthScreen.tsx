'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  ShieldCheck,
  User,
  Users,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Church,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { allUsers, login, quickDemoLogin, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'youth' | 'servant'>('youth');
  const [regServantId, setRegServantId] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');
  const [regErrorMessage, setRegErrorMessage] = useState('');

  const activeServants = allUsers.filter(
    (u) => u.role === 'servant' && u.status === 'active'
  );

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    const result = login(loginEmail);
    if (!result.success) {
      setLoginError(result.message || 'فشل تسجيل الدخول.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMessage('');
    setRegSuccessMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegErrorMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (regRole === 'youth' && !regServantId) {
      setRegErrorMessage('يرجى اختيار الخادم المسؤول عن متابعتك');
      return;
    }

    const result = registerUser({
      userName: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: regRole,
      assignedServantId: regRole === 'youth' ? regServantId : undefined,
    });

    if (result.success) {
      setRegSuccessMessage(result.message);
      setRegName('');
      setRegEmail('');
      setRegPhone('');
    } else {
      setRegErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col justify-center items-center px-4 py-8" dir="rtl">
      {/* Brand Header */}
      <div className="text-center mb-6 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200 text-3xl font-black mb-3">
          ✝
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          نظام النوتة الروحية (Nota)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          كنيسة السيدة العذراء مريم بالإسماعيلية • بناء العادات الروحية لشباب ثانوي
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md rounded-2xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-amber-100/50">
        {/* Toggle Login / Register */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            حساب جديد (مخدوم / خادم)
          </button>
        </div>

        {/* Mode 1: Login */}
        {mode === 'login' && (
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="مثال: fady.youth@nota.church"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-md shadow-amber-200 hover:bg-amber-600 active:scale-[0.99] transition-all"
              >
                دخول إلى النوتة الروحية
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">
                الدخول السريع الفوري للمعاينة والتجربة:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => quickDemoLogin('youth')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 transition-colors"
                >
                  <User className="h-4 w-4 text-amber-600 mb-1" />
                  <span className="text-xs font-bold">المخدوم</span>
                  <span className="text-[10px] text-amber-700">فادي جورج</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickDemoLogin('servant')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100/70 text-sky-900 transition-colors"
                >
                  <Users className="h-4 w-4 text-sky-600 mb-1" />
                  <span className="text-xs font-bold">الخادم</span>
                  <span className="text-[10px] text-sky-700">مينا أشرف</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickDemoLogin('admin')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold">أمين الخدمة</span>
                  <span className="text-[10px] text-emerald-700">أ. بيتر</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {regSuccessMessage ? (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-emerald-900">
                  تم استلام طلب التسجيل بنجاح!
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {regSuccessMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <span>العودة لصفحة الدخول</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الاسم ثلاثي:
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: يوحنا مجدي كمال"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    البريد الإلكتروني:
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yohanna@gmail.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    رقم الهاتف / واتساب:
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="012xxxxxxxx"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الصفة في الخدمة:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('youth')}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        regRole === 'youth'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      مخدوم (طالب ثانوي)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('servant')}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        regRole === 'servant'
                          ? 'border-sky-500 bg-sky-50 text-sky-900 font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      خادم ثانوي
                    </button>
                  </div>
                </div>

                {regRole === 'youth' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      الخادم المسؤول عنك:
                    </label>
                    <select
                      required
                      value={regServantId}
                      onChange={(e) => setRegServantId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">اختر خادمك لمتابعة التسجيل...</option>
                      {activeServants.map((s) => (
                        <option key={s.uid} value={s.uid}>
                          {s.displayName} ({s.churchGroup || 'خدمة ثانوي'})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      * ستصل رسالة للخادم بالموافقة والاعتماد قبل تفعيل حسابك مباشرة.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-sky-800 bg-sky-50 p-2.5 rounded-lg border border-sky-200 leading-relaxed">
                    * كخادم جديد، ستصل رسالة لأمين الخدمة (Admin) للموافقة على إضافتك لفريق الخدام وتوزيع المخدومين.
                  </p>
                )}

                {regErrorMessage && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{regErrorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-md shadow-amber-200 hover:bg-amber-600 active:scale-[0.99] transition-all"
                >
                  إرسال طلب التسجيل للاعتماد
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
