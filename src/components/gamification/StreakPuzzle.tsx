'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, Share2, Sparkles, Check, X, Award } from 'lucide-react';

interface StreakPuzzleProps {
  currentStreak: number;
  userName: string;
  onFastForwardStreak?: (streak: number) => void;
}

export const StreakPuzzle: React.FC<StreakPuzzleProps> = ({
  currentStreak,
  userName,
  onFastForwardStreak,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const playCelebrationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.15;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch {}
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    playCelebrationChime();
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D97706', '#F59E0B', '#10B981', '#3B82F6'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D97706', '#F59E0B', '#10B981', '#3B82F6'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleShare = async () => {
    const shareText = `🕊️ بنعمة ربنا أتممت ٣٠ يوماً متواصلة في النوتة الروحية (Nota) لبناء عادات روحية مقدسة لا تنكسر! ✝️✨`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'إنجاز النوتة الروحية ٣٠ يوماً',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const totalDays = 30;
  const progressPercent = Math.min(Math.round((currentStreak / totalDays) * 100), 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Flame className="h-5 w-5 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              سلسلة الـ ٣٠ يوماً الروحية (Streak)
            </h3>
            <p className="text-xs text-slate-500">
              {currentStreak} من ٣٠ يوماً مكتملة ({progressPercent}%)
            </p>
          </div>
        </div>

        {currentStreak >= 30 ? (
          <button
            onClick={triggerCelebration}
            className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-amber-200 hover:bg-amber-600 active:scale-95 transition-all"
          >
            <Trophy className="h-4 w-4" />
            <span>عرض الاحتفال!</span>
          </button>
        ) : (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            متبقي {30 - currentStreak} يوم للغلبة
          </span>
        )}
      </div>

      {/* 30-Day Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNum = i + 1;
          const isDone = dayNum <= currentStreak;
          const isCurrentTarget = dayNum === currentStreak + 1;

          return (
            <div
              key={dayNum}
              className={`relative flex flex-col items-center justify-center aspect-square rounded-lg border text-xs font-bold transition-all ${
                isDone
                  ? 'border-amber-300 bg-amber-50 text-amber-900 shadow-sm'
                  : isCurrentTarget
                  ? 'border-dashed border-amber-500 bg-amber-100/50 text-amber-800 animate-pulse'
                  : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              <span className="text-[10px] opacity-75">{dayNum}</span>
              {isDone ? (
                <Check className="h-3 w-3 text-amber-600 stroke-[3]" />
              ) : isCurrentTarget ? (
                <span className="text-[9px] text-amber-700">اليوم</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Demo trigger */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex-1 mr-3">
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {onFastForwardStreak && currentStreak < 30 && (
          <button
            onClick={() => onFastForwardStreak(30)}
            className="text-[11px] text-amber-700 hover:text-amber-800 underline underline-offset-2"
          >
            تجربة ٣٠ يوماً (Demo)
          </button>
        )}
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative max-w-sm w-full rounded-2xl border border-amber-300 bg-white p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200 animate-bounce">
              <Award className="h-8 w-8" />
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>إكليل الأمانة الروحية</span>
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-2">
              مبارك يا {userName}!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              «كُنْتَ أَمِينًا فِي الْقَلِيلِ فَأُقِيمُكَ عَلَى الْكَثِيرِ» (مت ٢٥: ٢١).
              لقد أتممت ٣٠ يوماً متواصلة في بنيان عاداتك الروحية بنجاح!
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-200 active:scale-[0.98] transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>{copiedLink ? 'تم نسخ التهنئة للمشاركة!' : 'مشاركة الإنجاز الروحي'}</span>
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                متابعة المسيرة الروحية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
