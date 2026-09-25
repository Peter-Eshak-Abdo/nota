'use client';

import React, { useState } from 'react';
import { WeeklyCommunionRecord } from '@/types';
import { Sparkles, Check, Church } from 'lucide-react';

interface CommunionSacredCardProps {
  currentMonthName: string;
  weeklyRecords: WeeklyCommunionRecord[];
  onRecordWeeklyCommunion: (weekNumber: number, reflection?: string) => void;
}

export const CommunionSacredCard: React.FC<CommunionSacredCardProps> = ({
  currentMonthName,
  weeklyRecords,
  onRecordWeeklyCommunion,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');

  const totalWeeks = 4;
  const completedCount = weeklyRecords.filter((r) => r.completed).length;

  const handleOpenRecordModal = (weekNum: number) => {
    setSelectedWeek(weekNum);
    setReflection('');
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWeek === null) return;
    onRecordWeeklyCommunion(selectedWeek, reflection);
    setSelectedWeek(null);
  };

  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <span className="text-xl">🍷</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                سر التناول المقدس والإفخارستيا (أسبوعياً)
              </h3>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
                {completedCount} من {totalWeeks} أسابيع مكتملة
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              «مَنْ يَأْكُلْ جَسَدِي وَيَشْرَبْ دَمِي يَثْبُتْ فِيَّ وَأَنَا فِيهِ» — حضور القداس والتناول مرة كل أسبوع
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 font-bold text-xs text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-center">
          <Sparkles className="h-3.5 w-3.5 text-rose-600" />
          <span>أيقونة الكأس المقدسة لشهر {currentMonthName}</span>
        </div>
      </div>

      {/* 4 Weekly Communion Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: totalWeeks }, (_, idx) => {
          const weekNum = idx + 1;
          const record = weeklyRecords.find((r) => r.weekNumber === weekNum);
          const isDone = !!record?.completed;

          return (
            <div
              key={weekNum}
              onClick={() => {
                if (!isDone) handleOpenRecordModal(weekNum);
              }}
              className={`rounded-xl border p-3.5 flex flex-col items-center justify-center text-center transition-all ${
                isDone
                  ? 'border-rose-300 bg-rose-50/70 shadow-sm'
                  : 'border-slate-200 bg-slate-50/70 hover:border-rose-400 hover:bg-white cursor-pointer'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 transition-transform ${
                  isDone
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {isDone ? <Check className="h-5 w-5 stroke-3" /> : <Church className="h-5 w-5" />}
              </div>

              <span className="font-bold text-xs text-slate-900 block">
                الأسبوع {weekNum}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {isDone ? 'تم التناول بنعمة الله' : 'اضغط للتسجيل'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedWeek !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-slate-800 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1">
              تسجيل التناول المقدس للأسبوع {selectedWeek}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              طوبى لمن يتناول باستحقاق وتوبة مقدسة
            </p>

            <form onSubmit={handleConfirm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تأمل أو آية لمستك في قداس اليوم (اختياري):
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={2}
                  placeholder="مثال: تأملت في عظمة محبة الرب يسوع وعهدي بحفظ طهارة جسدي وفكري..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWeek(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  تأكيد وحفظ التناول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
