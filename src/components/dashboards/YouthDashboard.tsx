'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HabitType } from '@/types';
import { HabitCard } from '@/components/habits/HabitCard';
import { AntiCheatModal } from '@/components/habits/AntiCheatModal';
import { MysteryShapeCanvas } from '@/components/gamification/MysteryShapeCanvas';
import { StreakPuzzle } from '@/components/gamification/StreakPuzzle';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import { ShieldCheck, BookOpen, CheckCircle, User, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

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

  if (!currentUser) return null;

  const assignedServant = allUsers.find(
    (u) => u.uid === currentUser.assignedServantId
  );

  const readingPlan = currentUser.assignedReading;
  const isBibleFinished = readingPlan?.isCompleted;

  const habitConfigs: {
    type: HabitType;
    title: string;
    subtitle: string;
    frequency: string;
  }[] = [
    {
      type: 'bible',
      title: readingPlan
        ? `قراءة الإنجيل: ${readingPlan.bookName} (الأصحاح ${readingPlan.currentChapter} من ${readingPlan.totalChapters})`
        : 'قراءة الكتاب المقدس وتأمل الإصحاح',
      subtitle: isBibleFinished
        ? `🎉 أتممت قراءة ${readingPlan?.bookName} بالكامل! اطلب سفراً جديداً.`
        : readingPlan
        ? `تأمل يومي في الأصحاح ${readingPlan.currentChapter} من ${readingPlan.bookName}`
        : 'لم يحدد لك خادمك سفراً بعد؛ اضغط للتأمل اليومي العام',
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
    timeSpentSeconds: number,
    questionText: string
  ) => {
    if (!activeTaskForModal) return;
    markTaskComplete(
      activeTaskForModal.type,
      answer,
      questionId,
      timeSpentSeconds,
      questionText
    );
    setActiveTaskForModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Light Welcome Banner */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-amber-800">
                قانونك الروحي لليوم • {currentDailyLog.dateString}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              أهلاً بك يا {currentUser.displayName} ✝️
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              «أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ» — خطوتك اليومية الصغيرة تصنع بنياناً روحياً لا يتزعزع.
            </p>
          </div>

          {/* Assigned Servant Badge */}
          {assignedServant && (
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-white px-4 py-2.5 shadow-sm self-start sm:self-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <User className="h-5 w-5" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">خادمك المتابع:</span>
                <span className="text-xs font-bold text-slate-800">
                  {assignedServant.displayName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bible Reading Plan Alert Banner */}
      {readingPlan && (
        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    خطة قراءة الكتاب المقدس: {readingPlan.bookName}
                  </h3>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    محدد بواسطة {readingPlan.assignedByName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBibleFinished
                    ? 'أتممت جميع أصحاحات السفر بنجاح!'
                    : `أنت الآن في الأصحاح ${readingPlan.currentChapter} من إجمالي ${readingPlan.totalChapters} أصحاحات.`}
                </p>
              </div>
            </div>

            {/* If finished: Show call-to-action message to request a new book */}
            {isBibleFinished ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-2.5 text-xs font-bold text-emerald-900">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>🎉 مبارك إتمام السفر! تواصل مع خادمك لتحديد سفر جديد.</span>
              </div>
            ) : (
              <div className="text-left">
                <span className="text-xs font-black text-amber-700">
                  الأصحاح {readingPlan.currentChapter} / {readingPlan.totalChapters}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Orthodox Monthly Mystery Icon & 30-Day Streak Puzzle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orthodox Icon Canvas */}
        <MysteryShapeCanvas
          currentStreakDays={currentUser.currentStreak}
          totalMonthDays={30}
        />

        {/* 30-Day Streak Puzzle */}
        <StreakPuzzle
          currentStreak={currentUser.currentStreak}
          userName={currentUser.displayName}
          onFastForwardStreak={(streak) => setYouthStreakDirectly(streak)}
        />
      </div>

      {/* The Spiritual Law Tasks (بنود القانون الروحي) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                بنود القانون الروحي اليومي
              </h2>
              <p className="text-xs text-slate-500">
                اضغط على أي بند للإجابة على التأمل اللحظي المريح وتأكيد إنجازك
              </p>
            </div>
          </div>
          <div className="text-left font-mono text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {currentDailyLog.completedCount} / 4 مكتمل اليوم
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
              disabled={habit.type === 'bible' && isBibleFinished}
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
          assignedBookName={readingPlan?.bookName}
          currentChapter={readingPlan?.currentChapter}
          onClose={() => setActiveTaskForModal(null)}
          onSubmit={handleValidationSubmit}
        />
      )}
    </div>
  );
};
