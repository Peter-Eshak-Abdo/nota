'use client';

import React, { useState, useEffect } from 'react';
import { HabitType, AntiCheatQuestion } from '@/types';
import { getQuestionForHabit, validateReflectionAnswer } from '@/lib/antiCheatEngine';
import { Timer, AlertTriangle, ShieldCheck, RefreshCw, X, BookOpen } from 'lucide-react';

interface AntiCheatModalProps {
  taskType: HabitType;
  taskTitle: string;
  isOpen: boolean;
  assignedBookName?: string;
  currentChapter?: number;
  onClose: () => void;
  onSubmit: (
    answer: string,
    questionId: string,
    timeSpentSeconds: number,
    questionText: string
  ) => void;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  taskType,
  taskTitle,
  isOpen,
  assignedBookName,
  currentChapter,
  onClose,
  onSubmit,
}) => {
  const [question, setQuestion] = useState<AntiCheatQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(75);
  const [totalTime, setTotalTime] = useState<number>(75);
  const [answer, setAnswer] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pasteBlockedWarning, setPasteBlockedWarning] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  const loadQuestion = () => {
    const q = getQuestionForHabit(taskType, assignedBookName, currentChapter);
    setQuestion(q);
    setTimeLeft(q.timeLimitSeconds);
    setTotalTime(q.timeLimitSeconds);
    setAnswer('');
    setErrorMessage('');
    setIsTimedOut(false);
    setPasteBlockedWarning(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadQuestion();
    }
  }, [isOpen, taskType, assignedBookName, currentChapter]);

  // Countdown timer with generous interval
  useEffect(() => {
    if (!isOpen || isTimedOut || timeLeft <= 0) {
      if (timeLeft <= 0 && !isTimedOut) {
        setIsTimedOut(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isTimedOut]);

  if (!isOpen || !question) return null;

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteBlockedWarning(true);
    setTimeout(() => setPasteBlockedWarning(false), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTimedOut) {
      setErrorMessage('انتهى الوقت المحدد للتأمل؛ اضغط لتوليد سؤال جديد والبدء فوراً.');
      return;
    }

    const validation = validateReflectionAnswer(answer, question.minWordCount);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'برجاء كتابة تأمل روحي صادق وموجز');
      return;
    }

    const timeSpent = totalTime - timeLeft;
    onSubmit(answer, question.id, timeSpent, question.situationalPrompt);
    onClose();
  };

  const timerPercentage = Math.round((timeLeft / totalTime) * 100);
  const isUrgent = timeLeft <= 12;

  // Format minutes & seconds nicely
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 text-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 tracking-wider">
              التحقق الروحي الذكي (Anti-Search / Anti-AI)
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              تأكيد إنجاز: {taskTitle}
            </h2>
          </div>
        </div>

        {/* Dynamic Countdown Bar (Generous 75-90s) */}
        <div className="mb-4 rounded-xl bg-amber-50/50 p-3.5 border border-amber-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 font-bold">
              <Timer className={`h-4 w-4 ${isUrgent ? 'text-rose-500 animate-spin' : 'text-amber-600'}`} />
              <span>الوقت المتاح للتأمل والكتابة:</span>
            </span>
            <span className={`font-mono text-sm font-black ${isUrgent ? 'text-rose-600' : 'text-amber-800'}`}>
              {timeFormatted} دقيقة
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            * تم إعطاء وقت مريح ({totalTime} ثانية) لقراءة السؤال بهدوء وكتابة تأملك الشخصي دون ضغط.
          </p>
        </div>

        {/* Situational Question Card */}
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold mb-1.5">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>سياق السؤال: {question.topic}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            {question.situationalPrompt}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تأملك الصادق والموجز (اكتبه بنفسك من قلبك):
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPaste={handlePaste}
              disabled={isTimedOut}
              rows={3}
              placeholder={question.exampleStarter}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50 resize-none transition-all"
            />
          </div>

          {/* Paste Blocked Warning */}
          {pasteBlockedWarning && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-100 border border-amber-300 p-2.5 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>تم تعطيل خاصية اللصق (Paste) لضمان كتابة تأملك الشخصي الصادق أمام الله.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Timed out notice */}
          {isTimedOut && (
            <div className="mb-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-center text-xs text-rose-800">
              <p className="font-bold mb-1">انتهى الوقت المحدد للسؤال!</p>
              <p className="text-[11px] text-rose-700">
                لا تقلق، اضغط على زر &quot;سؤال بديل&quot; أدناه لتوليد سؤال جديد والبدء فوراً.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={loadQuestion}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>سؤال بديل</span>
            </button>

            <button
              type="submit"
              disabled={isTimedOut || !answer.trim()}
              className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              تأكيد وحفظ البند الروحي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
