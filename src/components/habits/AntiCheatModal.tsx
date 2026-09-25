'use client';

import React, { useState, useEffect } from 'react';
import { HabitType, AntiCheatQuestion } from '@/types';
import { getRandomAntiCheatQuestion, validateReflectionAnswer } from '@/lib/antiCheatEngine';
import { Timer, AlertTriangle, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface AntiCheatModalProps {
  taskType: HabitType;
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answer: string, questionId: string, timeSpentSeconds: number) => void;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  taskType,
  taskTitle,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [question, setQuestion] = useState<AntiCheatQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [totalTime, setTotalTime] = useState<number>(30);
  const [answer, setAnswer] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pasteBlockedWarning, setPasteBlockedWarning] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  // Initialize or reload new question
  const loadNewQuestion = () => {
    const q = getRandomAntiCheatQuestion(taskType);
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
      loadNewQuestion();
    }
  }, [isOpen, taskType]);

  // Countdown timer effect
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
      setErrorMessage('انتهى الوقت المحدد للسؤال لمنع البحث الخارجي! برجاء تجربة سؤال جديد.');
      return;
    }

    const validation = validateReflectionAnswer(answer, question.minWordCount);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'برجاء كتابة تأمل روحي صادق وموجز');
      return;
    }

    const timeSpent = totalTime - timeLeft;
    onSubmit(answer, question.id, timeSpent);
    onClose();
  };

  const timerPercentage = Math.round((timeLeft / totalTime) * 100);
  const isUrgent = timeLeft <= 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 text-slate-100 shadow-2xl shadow-amber-500/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider">
              التحقق الروحي الذكي (Anti-Search / Anti-AI)
            </span>
            <h2 className="text-lg font-bold text-white">
              تأكيد إنجاز: {taskTitle}
            </h2>
          </div>
        </div>

        {/* Dynamic Countdown Bar */}
        <div className="mb-5 rounded-xl bg-slate-950 p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Timer className={`h-4 w-4 ${isUrgent ? 'text-rose-500 animate-spin' : 'text-amber-400'}`} />
              <span>الوقت المتاح للتأمل التلقائي:</span>
            </span>
            <span className={`font-mono text-sm font-bold ${isUrgent ? 'text-rose-400' : 'text-amber-300'}`}>
              {timeLeft} ثانية
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">
            * تم احتساب المدة بدقة ({totalTime} ث) بناءً على عمق السؤال لمنع البحث عبر الإنترنت أو الاستعانة بالذكاء الاصطناعي.
          </p>
        </div>

        {/* Situational Question Card */}
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300 mb-1.5">
            سياق السؤال: {question.topic}
          </span>
          <p className="text-sm font-medium text-amber-100 leading-relaxed">
            {question.situationalPrompt}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              إجابتك الصادقة والموجزة (اكتبها بنفسك دون نسخ):
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPaste={handlePaste}
              disabled={isTimedOut}
              rows={3}
              placeholder={question.exampleStarter}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50 resize-none"
            />
          </div>

          {/* Paste Blocked Warning */}
          {pasteBlockedWarning && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/40 p-2.5 text-xs text-amber-200 animate-pulse">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>تم تعطيل خاصية اللصق (Paste) لضمان كتابة تأملك الشخصي الحقيقي بصدق أمام الله.</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-rose-500/20 border border-rose-500/40 p-2 text-xs text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Timed out notice */}
          {isTimedOut && (
            <div className="mb-3 rounded-lg bg-rose-950/80 border border-rose-800 p-3 text-center text-xs text-rose-200">
              <p className="font-semibold mb-1">انتهى الوقت المحدد للسؤال!</p>
              <p className="text-[11px] text-rose-300">
                لا بأس، الهدف هو التأمل السريع. اضغط أدناه لتوليد سؤال جديد والبدء فوراً.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={loadNewQuestion}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>سؤال بديل</span>
            </button>

            <button
              type="submit"
              disabled={isTimedOut || !answer.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-sm font-bold text-slate-950 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              تأكيد وحفظ البند الروحي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
