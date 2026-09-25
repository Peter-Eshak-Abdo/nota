'use client';

import React from 'react';
import { MonthlySacredIconArchive } from '@/types';
import { Image as ImageIcon, Calendar, CheckCircle2 } from 'lucide-react';

interface MonthlyArchiveGalleryProps {
  archives: MonthlySacredIconArchive[];
}

export const MonthlyArchiveGallery: React.FC<MonthlyArchiveGalleryProps> = ({ archives }) => {
  if (archives.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              أرشيف الأيقونات الروحية الشهرية (Sacred Gallery)
            </h3>
            <p className="text-xs text-slate-500">
              الأيقونات المقدسة المكتملة والمحفوظة في رصيدك الروحي عبر الشهور
            </p>
          </div>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
          {archives.length} أيقونة مكتملة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {archives.map((arch) => (
          <div
            key={arch.id}
            className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-4 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                <span>{arch.monthNameArabic}</span>
              </span>
              <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                <span>مكتملة ٣٠/٣٠</span>
              </span>
            </div>

            <div className="flex items-center gap-3 my-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 text-2xl shadow-xs">
                ✝
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                  {arch.iconTitle}
                </h4>
                <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                  «أمين إلى المنتهى» • أمانة الشهر
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>تاريخ التتويج:</span>
              <span className="font-semibold text-slate-700">
                {new Date(arch.archivedAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
