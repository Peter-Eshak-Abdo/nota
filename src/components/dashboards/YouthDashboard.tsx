'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HabitType } from '@/types';
import { HabitCard } from '@/components/habits/HabitCard';
import { AntiCheatModal } from '@/components/habits/AntiCheatModal';
import { MysteryShapeCanvas } from '@/components/gamification/MysteryShapeCanvas';
import { StreakPuzzle } from '@/components/gamification/StreakPuzzle';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import { ShieldCheck, Heart, User, Sparkles } from 'lucide-react';

export const YouthDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    currentDailyLog,
    markTaskComplete,
    sermons,
    toggleSermonWatched,
    setYouthStreakDirectly,
  } = useApp();

  const [activeTaskForModal, setActiveTaskForModal] = useState<{
    type: HabitType;
    title: string;
  } | null>(null);

  const assignedServant = allUsers.find(
    (u) => u.uid === currentUser.assignedServantId
  );

  const habitConfigs: {
    type: HabitType;
    title: string;
    subtitle: string;
    frequency: string;
  }[] = [
    {
      type: 'bible',
      title: 'قراءة الكتاب المقدس وتأمل الإصحاح',
      subtitle: 'قراءة إصحاح يومي مع تأمل في سلوك الشخصيات وتطبيق عملي لحياتك',
      frequency: 'يومي',
    },
    {
      type: 'prayer',
      title: 'صلاة الأجبية والخلوة الشخصية',
      subtitle: 'صلاة باكر أو الغروب والنوم مع وقفة شكر وفحص ذات صادق',
      frequency: 'يومي',
    },
    {
      type: 'communion',
      title: 'التناول من الأسرار المقدسة والقداس',
      subtitle: 'حضور القداس الإلهي بروح التوبة والاشتراك في سر الإفخارستيا',
      frequency: 'أسبوعي / قداس',
    },
    {
      type: 'confession',
      title: 'جلسة الاعتراف والإرشاد الروحي',
      subtitle: 'الجلوس مع أب الاعتراف لنوال الحل ومحاسبة النفس على التداريب',
      frequency: 'شهري / دوري',
    },
  ];

  const handleOpenValidation = (type: HabitType) => {
    const config = habitConfigs.find((h) => h.type === type);
    if (!config) return;
    setActiveTaskForModal({ type, title: config.title });
  };

  const handleValidationSubmit = (
    answer: string,
    questionId: string,
    timeSpentSeconds: number
  ) => {
    if (!activeTaskForModal) return;
    markTaskComplete(activeTaskForModal.type, answer, questionId, timeSpentSeconds);
    setActiveTaskForModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-amber-400">
                قانونك الروحي لليوم • {currentDailyLog.dateString}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              أهلاً بك يا {currentUser.displayName} ✝️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              «أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ» — خطوتك اليومية الصغيرة تصنع بنياناً روحياً لا يتزعزع.
            </p>
          </div>

          {/* Mentor badge */}
          {assignedServant && (
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 self-start sm:self-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <User className="h-4 w-4" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">خادمك المتابع:</span>
                <span className="text-xs font-bold text-slate-200">
                  {assignedServant.displayName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Mystery Shape & Streak Puzzle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mystery Shape Canvas */}
        <MysteryShapeCanvas
          completedCount={currentDailyLog.completedCount}
          totalTarget={currentDailyLog.totalTarget}
          shapeUnlocked={currentDailyLog.shapeUnlocked}
        />

        {/* 30-Day Streak Puzzle */}
        <StreakPuzzle
          currentStreak={currentUser.currentStreak}
          userName={currentUser.displayName}
          onFastForwardStreak={(streak) => setYouthStreakDirectly(streak)}
        />
      </div>

      {/* Daily Spiritual Law (القانون الروحي) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                بنود القانون الروحي والتأمل الذكي
              </h2>
              <p className="text-xs text-slate-400">
                اضغط على أي بند للإجابة على التأمل اللحظي وتأكيد الإنجاز
              </p>
            </div>
          </div>
          <div className="text-left font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {currentDailyLog.completedCount} / 4 مكتمل
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {habitConfigs.map((habit) => (
            <HabitCard
              key={habit.type}
              type={habit.type}
              title={habit.title}
              subtitle={habit.subtitle}
              frequency={habit.frequency}
              record={currentDailyLog.tasks[habit.type]}
              onOpenValidation={handleOpenValidation}
            />
          ))}
        </div>
      </div>

      {/* Sermons Playlist */}
      <SermonsSection
        sermons={sermons}
        onToggleWatched={toggleSermonWatched}
        canAddSermon={false}
      />

      {/* Anti-Cheat Modal */}
      {activeTaskForModal && (
        <AntiCheatModal
          isOpen={!!activeTaskForModal}
          taskType={activeTaskForModal.type}
          taskTitle={activeTaskForModal.title}
          onClose={() => setActiveTaskForModal(null)}
          onSubmit={handleValidationSubmit}
        />
      )}
    </div>
  );
};
