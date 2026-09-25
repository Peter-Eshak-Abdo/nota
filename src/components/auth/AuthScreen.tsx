'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { format14DigitCode, clean14DigitCode } from '@/lib/biometrics';
import {
  KeyRound,
  Fingerprint,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { allUsers, loginWithCode, loginWithBiometrics, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [rawCode, setRawCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'youth' | 'servant'>('youth');
  const [regServantId, setRegServantId] = useState('');
  const [regSuccessCode, setRegSuccessCode] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState('');
  const [regErrorMessage, setRegErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeServants = allUsers.filter(
    (u) => u.role === 'servant' && u.status === 'active'
  );

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = format14DigitCode(e.target.value);
    setRawCode(formatted);
    setLoginError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const clean = clean14DigitCode(rawCode);
    if (clean.length < 14) {
      setLoginError('يرجى إدخال كود الدخول كاملاً (١٤ رقماً)');
      return;
    }

    const res = loginWithCode(clean);
    if (!res.success) {
      setLoginError(res.message || 'كود الدخول غير صحيح.');
    }
  };

  const handleBiometricClick = async () => {
    setIsBiometricLoading(true);
    setLoginError('');
    const res = await loginWithBiometrics();
    setIsBiometricLoading(false);
    if (!res.success) {
      setLoginError(res.message || 'تعذر تسجيل الدخول بالبصمة.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMessage('');
    setRegSuccessMessage('');
    setRegSuccessCode(null);

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

    if (result.success && result.accessCode) {
      setRegSuccessCode(result.accessCode);
      setRegSuccessMessage(result.message);
      setRegName('');
      setRegEmail('');
      setRegPhone('');
    } else {
      setRegErrorMessage(result.message);
    }
  };

  const handleCopyCode = () => {
    if (!regSuccessCode) return;
    navigator.clipboard.writeText(regSuccessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
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

      {/* Main Container Card */}
      <div className="w-full max-w-md rounded-2xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-amber-100/50">
        {/* Toggle Login / Register */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegSuccessCode(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            تسجيل الدخول بالكود
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegSuccessCode(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            طلب حساب جديد
          </button>
        </div>

        {/* Mode 1: Code & Biometric Login */}
        {mode === 'login' && (
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  كود الدخول المكون من ١٤ رقماً:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={rawCode}
                    onChange={handleCodeChange}
                    placeholder="xxxx xxxx xxxx xx"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base sm:text-lg font-mono font-bold tracking-wider text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-center"
                    maxLength={17}
                  />
                  <KeyRound className="h-5 w-5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-500">
                  <span>تم إدخال {clean14DigitCode(rawCode).length} من ١٤ رقماً</span>
                  <span>الكود فريد وخاص بك</span>
                </div>
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

            {/* Quick Biometrics Authentication Button */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400">أو</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={handleBiometricClick}
                disabled={isBiometricLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all shadow-xs"
              >
                <Fingerprint className="h-5 w-5 text-amber-600" />
                <span>
                  {isBiometricLoading ? 'جاري التحقق...' : 'تسجيل الدخول ببصمة الهاتف أو Face ID'}
                </span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-400 pt-2">
              * في حال فقدان كودك، يرجى مراجعة خادم فصلك أو أمين الخدمة للاطلاع على كودك المسجل.
            </p>
          </div>
        )}

        {/* Mode 2: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {regSuccessCode ? (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white mx-auto shadow-md">
                  <KeyRound className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-emerald-950">
                    تم إنشاء طلبك وتوليد كودك بنجاح!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    {regSuccessMessage}
                  </p>
                </div>

                {/* 14-Digit Access Code Box */}
                <div className="rounded-xl border border-emerald-400 bg-white p-3.5 text-center shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    كود الدخول المكون من ١٤ رقماً (احفظه جيداً):
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-700 tracking-widest my-1 select-all">
                    {format14DigitCode(regSuccessCode)}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-900 transition-colors mt-1"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? 'تم نسخ الكود!' : 'نسخ الكود'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRawCode(format14DigitCode(regSuccessCode));
                    setMode('login');
                    setRegSuccessCode(null);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  <span>الانتقال لصفحة تسجيل الدخول</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم ثلاثي:
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: يوحنا مجدي كمال"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني:
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yohanna@gmail.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف / واتساب:
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="012xxxxxxxx"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">
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
                      * سيتم توليد كود دخول ١٤ رقماً لك وستصل رسالة لخادمك بالموافقة على تفعيل حسابك.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-sky-800 bg-sky-50 p-2.5 rounded-lg border border-sky-200 leading-relaxed">
                    * كخادم جديد، سيتم توليد كود ١٤ رقماً لك وستصل رسالة لأمين الخدمة (Admin) للموافقة.
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
                  إنشاء الكود وإرسال طلب التسجيل
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
