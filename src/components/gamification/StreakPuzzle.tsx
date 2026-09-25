'use client';

import React, { useState, useEffect } from 'react';
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

  // Play synthetic triumphant celebration sound using Web Audio API
  const playCelebrationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Pleasant major chord triumphant arpeggio: C5, E5, G5, C6
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
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    playCelebrationChime();

    // Fire fireworks confetti
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#F59E0B', '#10B981', '#38BDF8'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#F59E0B', '#10B981', '#38BDF8'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Trigger once if streak just reached 30
  useEffect(() => {
    if (currentStreak >= 30) {
      // Only show celebratory modal if reaching 30
    }
  }, [currentStreak]);

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

    // Fallback: clipboard copy
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const totalDays = 30;
  const progressPercent = Math.min(Math.round((currentStreak / totalDays) * 100), 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>سلسلة الـ ٣٠ يوماً الروحية (Atomic Streak)</span>
            </h3>
            <p className="text-xs text-slate-400">
              {currentStreak} من ٣٠ يوماً مكتملة ({progressPercent}%)
            </p>
          </div>
        </div>

        {/* Milestone action */}
        {currentStreak >= 30 ? (
          <button
            onClick={triggerCelebration}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Trophy className="h-4 w-4" />
            <span>عرض الاحتفال!</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span>متبقي {30 - currentStreak} يوم للغلبة</span>
          </div>
        )}
      </div>

      {/* 30-Day Puzzle Matrix (5 rows of 6 or 6 rows of 5) */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNum = i + 1;
          const isDone = dayNum <= currentStreak;
          const isCurrentTarget = dayNum === currentStreak + 1;

          return (
            <div
              key={dayNum}
              className={`relative flex flex-col items-center justify-center aspect-square rounded-lg border text-xs font-bold transition-all ${
                isDone
                  ? 'border-amber-500/60 bg-gradient-to-br from-amber-500/30 to-amber-700/40 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                  : isCurrentTarget
                  ? 'border-dashed border-amber-400/70 bg-amber-500/10 text-amber-300 animate-pulse'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
              title={`اليوم ${dayNum}`}
            >
              <span className="text-[10px] opacity-75">{dayNum}</span>
              {isDone ? (
                <Check className="h-3 w-3 text-amber-300 stroke-[3]" />
              ) : isCurrentTarget ? (
                <span className="text-[9px] text-amber-400">اليوم</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Fast-forward test control */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex-1 mr-3">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Demo trigger helper */}
        {onFastForwardStreak && currentStreak < 30 && (
          <button
            onClick={() => onFastForwardStreak(30)}
            className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-2 transition-colors"
          >
            تجربة ٣٠ يوماً (Demo)
          </button>
        )}
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-sm w-full rounded-3xl border border-amber-500/50 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 text-center shadow-2xl shadow-amber-500/20">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/40 animate-bounce">
              <Award className="h-10 w-10" />
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>إكليل الأمانة الروحية</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              مبارك يا {userName}!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              «كُنْتَ أَمِينًا فِي الْقَلِيلِ فَأُقِيمُكَ عَلَى الْكَثِيرِ» (مت ٢٥: ٢١).
              لقد أتممت ٣٠ يوماً متواصلة في بنيان عاداتك الروحية بنجاح!
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-slate-950 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>{copiedLink ? 'تم نسخ التهنئة للمشاركة!' : 'مشاركة الإنجاز الروحي'}</span>
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full rounded-xl border border-slate-800 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-800/60"
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
