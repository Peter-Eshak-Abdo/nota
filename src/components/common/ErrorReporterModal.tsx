'use client';

import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, X } from 'lucide-react';

interface ErrorReporterModalProps {
  isOpen: boolean;
  errorMessage: string;
  errorSource: string;
  onClose: () => void;
  onSubmitReport: (details: string) => void;
}

export const ErrorReporterModal: React.FC<ErrorReporterModalProps> = ({
  isOpen,
  errorMessage,
  errorSource,
  onClose,
  onSubmitReport,
}) => {
  const [details, setDetails] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(details);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        {isSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">
              تم إرسال تقرير الخطأ لأمين الخدمة بنجاح
            </h3>
            <p className="text-xs text-slate-500">
              شكراً لأمانتك؛ سيقوم مسؤول النظام بمراجعة المشكلة وحلها فوراً.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  مشاركة الخطأ مع أمين الخدمة (الدعم الفني)
                </h3>
                <p className="text-xs text-slate-500">
                  إبلاغ فوري لمسؤول النظام مع توثيق المصدر والتفاصيل
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-rose-50 p-3 border border-rose-200 text-xs">
              <span className="font-bold text-rose-900 block mb-0.5">
                مصدر الخطأ: {errorSource}
              </span>
              <p className="text-rose-700 font-mono text-[11px] break-all">
                {errorMessage}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ماذا كنت تحاول أن تفعل عند حدوث الخطأ؟ (اختياري):
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  placeholder="مثال: حاولت تسجيل قراءة الأصحاح وظهر لي خطأ في الاتصال..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>إرسال التقرير للأدمن</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
