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
}

export const HabitCard: React.FC<HabitCardProps> = ({
  type,
  title,
  subtitle,
  frequency,
  record,
  onOpenValidation,
}) => {
  const isDone = !!record?.completed;

  const getIcon = () => {
    switch (type) {
      case 'bible':
        return <BookOpen className="h-6 w-6 text-amber-400" />;
      case 'prayer':
        return <Sparkles className="h-6 w-6 text-sky-400" />;
      case 'communion':
        return <HeartHandshake className="h-6 w-6 text-rose-400" />;
      case 'confession':
        return <Clock className="h-6 w-6 text-emerald-400" />;
    }
  };

  return (
    <div
      onClick={() => onOpenValidation(type)}
      className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer ${
        isDone
          ? 'border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/30 shadow-md shadow-emerald-900/10'
          : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:bg-slate-800/80 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${
            isDone
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-slate-700 bg-slate-800/60'
          }`}
        >
          {getIcon()}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4
              className={`font-bold text-sm sm:text-base ${
                isDone ? 'text-emerald-200 line-through decoration-emerald-500/40' : 'text-slate-100'
              }`}
            >
              {title}
            </h4>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700">
              {frequency}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>

          {/* If completed, show excerpt of reflection */}
          {isDone && record?.reflectionAnswer && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
              <span>تأملك: &quot;{record.reflectionAnswer.slice(0, 45)}...&quot;</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDone ? (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">تم الإنجاز</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <span>تسجيل وتأمل</span>
            <ChevronLeft className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};
