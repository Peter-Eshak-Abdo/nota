'use client';

import React from 'react';
import { HabitType, TaskCompletionRecord } from '@/types';
import { BookOpen, HeartHandshake, Sparkles, CheckCircle2, ChevronLeft, Clock } from 'lucide-react';

interface HabitCardProps {
  type: HabitType;
  title: string;
  subtitle: string;
  frequency: string;
  record?: TaskCompletionRecord;
  onOpenValidation: (type: HabitType) => void;
  disabled?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  type,
  title,
  subtitle,
  frequency,
  record,
  onOpenValidation,
  disabled = false,
}) => {
  const isDone = !!record?.completed;

  const getIcon = () => {
    switch (type) {
      case 'bible':
        return <BookOpen className="h-6 w-6 text-amber-600" />;
      case 'prayer':
        return <Sparkles className="h-6 w-6 text-sky-600" />;
      case 'communion':
        return <HeartHandshake className="h-6 w-6 text-rose-600" />;
      case 'confession':
        return <Clock className="h-6 w-6 text-emerald-600" />;
    }
  };

  return (
    <div
      onClick={() => {
        if (!disabled) onOpenValidation(type);
      }}
      className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all ${
        disabled
          ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
          : isDone
          ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer shadow-sm'
          : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-md cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${
            isDone
              ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
              : 'border-slate-100 bg-slate-50'
          }`}
        >
          {getIcon()}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4
              className={`font-bold text-sm sm:text-base ${
                isDone ? 'text-emerald-900 line-through decoration-emerald-400' : 'text-slate-800'
              }`}
            >
              {title}
            </h4>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
              {frequency}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>

          {isDone && record?.reflectionAnswer && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <span>تأملك: &quot;{record.reflectionAnswer.slice(0, 50)}...&quot;</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDone ? (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">تم الإنجاز</span>
          </div>
        ) : disabled ? (
          <span className="text-[11px] text-slate-400">بانتظار سفر جديد</span>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <span>تسجيل وتأمل</span>
            <ChevronLeft className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};
