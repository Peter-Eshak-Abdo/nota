'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalledJustNow, setIsInstalledJustNow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isStandalone = isMounted && typeof window !== 'undefined'
    ? window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://')
    : false;

  const isIos = isMounted && typeof window !== 'undefined'
    ? /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    : false;

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    // 1. Register Service Worker for PWA Offline & Native App capabilities
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Nota PWA Service Worker Registered successfully:', reg.scope);
          })
          .catch((err) => {
            console.warn('Nota PWA Service Worker registration note:', err);
          });
      });
    }

    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandaloneMode) return; // Already running as an app!

    // 4. Capture native browser install prompt (Android / Chrome / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed it previously in this session
      const dismissed = sessionStorage.getItem('nota_pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Detect app installed event
    const handleAppInstalled = () => {
      setIsInstalledJustNow(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setTimeout(() => setIsInstalledJustNow(false), 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. For iOS Safari or if prompt doesn't fire immediately, show prompt after a short moment
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('nota_pwa_dismissed');
      if (!dismissed && !isStandaloneMode) {
        setShowPrompt(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
      clearTimeout(mountTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setShowPrompt(false);
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalledJustNow(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // General instructions for browsers that don't support automated prompt
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('nota_pwa_dismissed', 'true');
  };

  if (!isMounted || isStandalone) {
    return null;
  }

  return (
    <>
      {/* Success Notification after install */}
      {isInstalledJustNow && (
        <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md animate-bounce">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-200" />
            <div className="text-xs">
              <p className="font-extrabold text-sm">تم تثبيت النوتة الروحية بنجاح! 🎉</p>
              <p className="text-emerald-100">ستجد أيقونة التطبيق الآن على شاشة هاتفك الرئيسية.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating PWA Install Banner (Shown on entry) */}
      {showPrompt && !isInstalledJustNow && (
        <div className="fixed bottom-4 left-3 right-3 z-50 mx-auto max-w-lg animate-fade-in" dir="rtl">
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* App Icon */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-md border border-amber-300">
                  <Image
                    src="/icon-192.png"
                    alt="Nota Icon"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      تطبيق النوتة الروحية (Nota)
                    </h3>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      PWA هاتف
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                    نزّل النوتة كبرنامج كامل وسريع على هاتفك لتجربة أفضل وتعمل بدون إنترنت 📱
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="إغلاق التنبيه"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>شاشة كاملة بدون متصفح</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>يعمل بدون إنترنت (Offline)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>حماية مشفرة وبصمة يد</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>فتح فوري بلمسة واحدة</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-300 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] transition-all"
              >
                <Download className="h-4 w-4" />
                <span>تثبيت البرنامج على الموبايل الآن</span>
              </button>

              <button
                onClick={handleDismiss}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                لاحقاً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari / Universal Installation Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-300 bg-white p-6 text-slate-800 shadow-2xl">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute left-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-5">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                طريقة تثبيت النوتة على هاتف {isIos ? 'الآيفون (iPhone)' : 'الموبايل'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اتبع الخطوات البسيطة التالية لإضافة التطبيق كبرنامج أصلي على شاشة هاتفك:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-xs">
                  ١
                </div>
                <div className="text-xs text-slate-700">
                  <span>اضغط على زر المشاركة </span>
                  <strong className="inline-flex items-center gap-1 font-bold text-amber-800">
                    <Share className="h-3.5 w-3.5 inline text-amber-600" /> (Share)
                  </strong>
                  <span> في شريط المتصفح أسفل الشاشة.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-xs">
                  ٢
                </div>
                <div className="text-xs text-slate-700">
                  <span>مرر القائمة لأسفل واختر </span>
                  <strong className="inline-flex items-center gap-1 font-bold text-amber-800">
                    <PlusSquare className="h-3.5 w-3.5 inline text-amber-600" /> إضافة إلى الشاشة الرئيسية (Add to Home Screen)
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-xs">
                  ٣
                </div>
                <div className="text-xs text-slate-700">
                  <span>اضغط على كلمة </span>
                  <strong className="font-bold text-amber-800">«إضافة» (Add)</strong>
                  <span> أعلى اليمين. وسيظهر التطبيق فوراً بين برامج هاتفك كبرنامج مستقل!</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full rounded-xl bg-amber-500 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-200 hover:bg-amber-600 transition-all"
            >
              فهمت، شكراً لك
            </button>
          </div>
        </div>
      )}

      {/* Persistent Tiny Install Badge in Bottom Corner if banner was dismissed */}
      {!showPrompt && (
        <button
          onClick={() => {
            if (deferredPrompt) {
              handleInstallClick();
            } else {
              setShowIosGuide(true);
            }
          }}
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-amber-300 bg-white/95 px-3 py-2 text-xs font-bold text-amber-800 shadow-lg backdrop-blur-md hover:bg-amber-50 active:scale-95 transition-all"
          title="تثبيت التطبيق على الموبايل"
        >
          <Smartphone className="h-4 w-4 text-amber-600" />
          <span>📱 تثبيت كبرنامج</span>
        </button>
      )}
    </>
  );
};
