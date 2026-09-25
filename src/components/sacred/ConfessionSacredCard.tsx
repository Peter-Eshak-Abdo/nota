'use client';

import React, { useState } from 'react';
import { MonthlyConfessionRecord } from '@/types';
import { CheckCircle2, Plus } from 'lucide-react';

interface ConfessionSacredCardProps {
  currentMonthName: string;
  record?: MonthlyConfessionRecord;
  onRecordConfession: (data: { fatherName: string; reflection: string }) => void;
}

export const ConfessionSacredCard: React.FC<ConfessionSacredCardProps> = ({
  currentMonthName,
  record,
  onRecordConfession,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [reflection, setReflection] = useState('');

  const isDone = !!record?.completed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fatherName.trim()) return;
    onRecordConfession({ fatherName: fatherName.trim(), reflection: reflection.trim() });
    setShowModal(false);
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Sacred Repentance Emblem */}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
              isDone
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <span className="text-2xl font-black">{isDone ? '🕊️' : '✝'}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                سر التوبة والاعتراف (مرة شهرياً)
              </h3>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                {currentMonthName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              «إِنِ اعْتَرَفْنَا بِخَطَايَانَا فَهُوَ أَمِينٌ وَعَادِلٌ، حَتَّى يَغْفِرَ لَنَا» — جلسة محاسبة شهرية لنوال الحل
            </p>

            {isDone && record && (
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  تم الجلوس مع {record.fatherOfConfession || 'أب الاعتراف'} بنعمة ربنا في هذا الشهر المبارك.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="self-end sm:self-center">
          {isDone ? (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-900 border border-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>مكتمل لشهر {currentMonthName}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>تسجيل جلسة الاعتراف</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 text-slate-800 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1">
              تسجيل جلسة سر التوبة والاعتراف
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              تسجيلك لأمانتك الروحية لنوال الحل وتجديد العهد مع الله
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  أب الاعتراف:
                </label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="مثال: أبونا بولس / أبونا داود"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تدريب روحي أو وصية أخذتها (اختياري لنفسك):
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={2}
                  placeholder="مثال: تدريب عن الصلاة بلجاجة ومحاربة فتور الصباح..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  تأكيد وحفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
