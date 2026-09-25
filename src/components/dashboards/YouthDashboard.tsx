'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HabitType, AgpeyaHour } from '@/types';
import { HabitCard } from '@/components/habits/HabitCard';
import { AntiCheatModal } from '@/components/habits/AntiCheatModal';
import { MysteryShapeCanvas } from '@/components/gamification/MysteryShapeCanvas';
import { StreakPuzzle } from '@/components/gamification/StreakPuzzle';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import { ConfessionSacredCard } from '@/components/sacred/ConfessionSacredCard';
import { CommunionSacredCard } from '@/components/sacred/CommunionSacredCard';
import { MonthlyArchiveGallery } from '@/components/sacred/MonthlyArchiveGallery';
import { ServantMessagesBox } from '@/components/notifications/ServantMessagesBox';
import { ErrorReporterModal } from '@/components/common/ErrorReporterModal';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle,
  User,
  AlertTriangle,
} from 'lucide-react';

export const YouthDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    currentDailyLog,
    markTaskComplete,
    sermons,
    toggleSermonWatched,
    servantMessages,
    markMessageAsRead,
    weeklyCommunions,
    recordWeeklyCommunion,
    monthlyConfessions,
    recordMonthlyConfession,
    monthlyArchives,
    reportErrorToAdmin,
  } = useApp();

  const [activeTaskForModal, setActiveTaskForModal] = useState<{
    type: HabitType;
    title: string;
    agpeyaHour?: AgpeyaHour;
  } | null>(null);

  // Error reporter modal state
  const [showErrorReporter, setShowErrorReporter] = useState(false);
  const [errorContext, setErrorContext] = useState({ source: '', message: '' });

  if (!currentUser) return null;

  const assignedServant = allUsers.find(
    (u) => u.uid === currentUser.assignedServantId
  );

  const readingPlan = currentUser.assignedReading;
  const isBibleFinished = readingPlan?.isCompleted;

  // Filter messages for this youth
  const myMessages = servantMessages.filter((m) => m.youthId === currentUser.uid);

  // Month names
  const currentMonthDate = new Date();
  const currentMonthName = currentMonthDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
  const currentMonthKey = currentMonthDate.toISOString().slice(0, 7);

  // Filter communion & confession for current month
  const myCommunionsThisMonth = weeklyCommunions.filter(
    (c) => c.userId === currentUser.uid && c.monthKey === currentMonthKey
  );
  const myConfessionThisMonth = monthlyConfessions.find(
    (c) => c.userId === currentUser.uid && c.monthKey === currentMonthKey
  );

  // Assigned Agpeya Hours
  const assignedHours: AgpeyaHour[] = currentUser.assignedAgpeyaHours || ['baker', 'sleep'];
  const agpeyaHourLabels: Record<AgpeyaHour, string> = {
    baker: 'صلاة باكر',
    third: 'صلاة الساعة الثالثة',
    sixth: 'صلاة الساعة السادسة',
    ninth: 'صلاة الساعة التاسعة',
    sunset: 'صلاة الغروب',
    sleep: 'صلاة النوم',
    midnight: 'صلاة نصف الليل',
  };

  const handleOpenValidation = (type: HabitType, agpeyaHour?: AgpeyaHour) => {
    let title = 'القانون الروحي';
    if (type === 'bible') {
      title = readingPlan ? `قراءة: ${readingPlan.bookName} (أصحاح ${readingPlan.currentChapter})` : 'قراءة الإنجيل اليومية';
    } else if (type === 'prayer') {
      title = agpeyaHour ? `الأجبية: ${agpeyaHourLabels[agpeyaHour]}` : 'صلاة الأجبية والخلوة';
    }
    setActiveTaskForModal({ type, title, agpeyaHour });
  };

  const handleValidationSubmit = (
    answer: string,
    questionId: string,
    timeSpentSeconds: number,
    questionText: string
  ) => {
    if (!activeTaskForModal) return;
    try {
      markTaskComplete(
        activeTaskForModal.type,
        answer,
        questionId,
        timeSpentSeconds,
        questionText,
        activeTaskForModal.agpeyaHour
      );
      setActiveTaskForModal(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ المهمة';
      setErrorContext({ source: 'YouthDashboard:markTaskComplete', message });
      setShowErrorReporter(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Light Welcome Banner */}
      <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50 via-white to-amber-50/60 p-6 shadow-sm">
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

      {/* Messages from Servant */}
      {myMessages.length > 0 && (
        <ServantMessagesBox
          messages={myMessages}
          onMarkAsRead={markMessageAsRead}
        />
      )}

      {/* Assigned Bible Reading Plan Card */}
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
                    ? `أتممت جميع أصحاحات (${readingPlan.totalChapters}) بنجاح!`
                    : `أنت الآن في الأصحاح ${readingPlan.currentChapter} من إجمالي ${readingPlan.totalChapters} أصحاحات.`}
                </p>
              </div>
            </div>

            {isBibleFinished ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-2.5 text-xs font-bold text-emerald-900">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>🎉 مبارك إتمام السفر! تواصل مع خادمك لتحديد سفر جديد.</span>
              </div>
            ) : (
              <div className="text-left font-mono font-black text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                الأصحاح {readingPlan.currentChapter} من {readingPlan.totalChapters}
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
        />
      </div>

      {/* Daily Spiritual Law (القانون الروحي اليومي: إنجيل + صلوات السواعي المحددة) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                قانون اليوم: الكتاب المقدس وصلوات السواعي
              </h2>
              <p className="text-xs text-slate-500">
                حدد خادمك صلوات السواعي اليومية الخاصة بك: {assignedHours.map((h) => agpeyaHourLabels[h]).join(' • ')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Bible Reading Card */}
          <HabitCard
            type="bible"
            title={readingPlan ? `قراءة: ${readingPlan.bookName} (أصحاح ${readingPlan.currentChapter})` : 'قراءة الإنجيل اليومية'}
            subtitle={isBibleFinished ? '🎉 أتممت السفر بالكامل! اطلب من خادمك سفراً جديداً' : 'قراءة وتأمل الإصحاح مع سؤال ظرفي'}
            frequency="يومي"
            record={currentDailyLog.tasks.bible}
            onOpenValidation={() => handleOpenValidation('bible')}
            disabled={isBibleFinished}
          />

          {/* Agpeya Prayers Cards */}
          {assignedHours.map((hourKey) => {
            const hourLabel = agpeyaHourLabels[hourKey];
            const isDone = currentDailyLog.tasks.prayer?.completed && currentDailyLog.tasks.prayer?.agpeyaHour === hourKey;

            return (
              <HabitCard
                key={hourKey}
                type="prayer"
                title={`الأجبية: ${hourLabel}`}
                subtitle={`صلاة الأجبية والخلوة - ${hourLabel}`}
                frequency="يومي"
                record={isDone ? currentDailyLog.tasks.prayer : undefined}
                onOpenValidation={() => handleOpenValidation('prayer', hourKey)}
              />
            );
          })}
        </div>
      </div>

      {/* Distinct Dedicated Sacred Cards for Communion and Confession */}
      <div className="space-y-4">
        {/* Weekly Communion Sacred Card */}
        <CommunionSacredCard
          currentMonthName={currentMonthName}
          weeklyRecords={myCommunionsThisMonth}
          onRecordWeeklyCommunion={recordWeeklyCommunion}
        />

        {/* Monthly Confession Sacred Card */}
        <ConfessionSacredCard
          currentMonthName={currentMonthName}
          record={myConfessionThisMonth}
          onRecordConfession={({ fatherName, reflection }) => recordMonthlyConfession(fatherName, reflection)}
        />
      </div>

      {/* Monthly Sacred Gallery (أرشيف الشهور السابقة) */}
      <MonthlyArchiveGallery archives={monthlyArchives} />

      {/* Sermons Playlist */}
      <SermonsSection
        sermons={sermons}
        onToggleWatched={toggleSermonWatched}
        canAddSermon={false}
      />

      {/* Support / Report Issue to Admin Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            setErrorContext({ source: 'واجهة المخدوم', message: 'تقرير أو ملاحظة مرسلة من المخدوم' });
            setShowErrorReporter(true);
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
          <span>هل تواجه مشكلة؟ أبلغ أمين الخدمة بها فوراً</span>
        </button>
      </div>

      {/* Anti-Cheat Dynamic Verification Modal */}
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

      {/* Error Reporter Modal */}
      <ErrorReporterModal
        isOpen={showErrorReporter}
        errorMessage={errorContext.message}
        errorSource={errorContext.source}
        onClose={() => setShowErrorReporter(false)}
        onSubmitReport={(details) => reportErrorToAdmin(errorContext.source, errorContext.message, details)}
      />
    </div>
  );
};
