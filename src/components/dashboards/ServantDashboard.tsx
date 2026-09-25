'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserProfile, HabitType, AgpeyaHour } from '@/types';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import { ALL_CANONICAL_BIBLE_BOOKS } from '@/lib/bibleCanon';
import {
  Users,
  Flame,
  Send,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  MessageSquare,
  UserCheck,
  Bell,
} from 'lucide-react';

export const ServantDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    servantNotes,
    addServantNote,
    submitApprovalRequest,
    sermons,
    toggleSermonWatched,
    registrationRequests,
    handleRegistrationDecision,
    assignReadingPlanToYouth,
    updateYouthAgpeyaHours,
    sendMessageToYouth,
    getUserDailyLog,
  } = useApp();

  const myYouths = allUsers.filter(
    (u) => u.role === 'youth' && u.assignedServantId === currentUser?.uid && u.status === 'active'
  );

  const pendingYouthRegistrations = registrationRequests.filter(
    (r) =>
      r.role === 'youth' &&
      r.status === 'pending' &&
      (r.assignedServantId === currentUser?.uid || r.targetApproverId === currentUser?.uid)
  );

  const [selectedYouth, setSelectedYouth] = useState<UserProfile | null>(() => myYouths[0] || null);

  const [activeTab, setActiveTab] = useState<'daily_followup' | 'agpeya_setup' | 'bible_plans' | 'private_notes' | 'registrations'>('daily_followup');

  // Private note state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'spiritual' | 'social' | 'academic' | 'urgent'>('spiritual');

  // Assign reading modal state with full canonical books
  const [showAssignBookModal, setShowAssignBookModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(ALL_CANONICAL_BIBLE_BOOKS[0].id);

  // Message to Youth state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState<'reminder_bible' | 'reminder_task' | 'encouragement' | 'custom'>('reminder_bible');
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  // Approval request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<'edit_profile' | 'task_adjustment' | 'streak_recovery'>('streak_recovery');
  const [requestReason, setRequestReason] = useState('');
  const [recoveryDays, setRecoveryDays] = useState(1);
  const [requestSentNotice, setRequestSentNotice] = useState(false);

  const allAgpeyaHours: { key: AgpeyaHour; name: string }[] = [
    { key: 'baker', name: 'صلاة باكر' },
    { key: 'third', name: 'صلاة الساعة الثالثة' },
    { key: 'sixth', name: 'صلاة الساعة السادسة' },
    { key: 'ninth', name: 'صلاة الساعة التاسعة' },
    { key: 'sunset', name: 'صلاة الغروب' },
    { key: 'sleep', name: 'صلاة النوم' },
    { key: 'midnight', name: 'صلاة نصف الليل' },
  ];

  if (!currentUser) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYouth || !newNoteContent.trim()) return;

    addServantNote({
      youthId: selectedYouth.uid,
      youthName: selectedYouth.displayName,
      servantId: currentUser.uid,
      servantName: currentUser.displayName,
      category: newNoteCategory,
      content: newNoteContent.trim(),
    });

    setNewNoteContent('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYouth || !messageContent.trim()) return;

    sendMessageToYouth(
      selectedYouth.uid,
      messageTitle || 'رسالة من خادمك',
      messageContent.trim(),
      messageType
    );

    setMessageContent('');
    setShowMessageModal(false);
    setMessageSentSuccess(true);
    setTimeout(() => setMessageSentSuccess(false), 4000);
  };

  const handleSendApprovalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYouth || !requestReason.trim()) return;

    submitApprovalRequest({
      servantId: currentUser.uid,
      servantName: currentUser.displayName,
      youthId: selectedYouth.uid,
      youthName: selectedYouth.displayName,
      type: requestType,
      reason: requestReason,
      suggestedData: requestType === 'streak_recovery' ? { restoreDays: recoveryDays } : {},
    });

    setRequestReason('');
    setShowRequestModal(false);
    setRequestSentNotice(true);
    setTimeout(() => setRequestSentNotice(false), 5000);
  };

  const handleAssignBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYouth) return;
    const foundBook = ALL_CANONICAL_BIBLE_BOOKS.find((b) => b.id === selectedBookId);
    if (!foundBook) return;

    assignReadingPlanToYouth(selectedYouth.uid, foundBook.name, foundBook.totalChapters);
    setShowAssignBookModal(false);
  };

  const toggleAgpeyaHourForYouth = (hourKey: AgpeyaHour) => {
    if (!selectedYouth) return;
    const currentHours = selectedYouth.assignedAgpeyaHours || ['baker', 'sleep'];
    const exists = currentHours.includes(hourKey);
    const updated = exists
      ? currentHours.filter((h) => h !== hourKey)
      : [...currentHours, hourKey];

    updateYouthAgpeyaHours(selectedYouth.uid, updated);
  };

  // Selected youth status
  const selectedYouthLog = selectedYouth ? getUserDailyLog(selectedYouth.uid) : null;
  const youthNotes = selectedYouth
    ? servantNotes.filter((n) => n.youthId === selectedYouth.uid)
    : [];

  const habitLabels: Record<HabitType, { name: string; icon: string }> = {
    bible: { name: 'قراءة الكتاب المقدس', icon: '📖' },
    prayer: { name: 'صلاة الأجبية والخلوة', icon: '✨' },
    communion: { name: 'التناول من الأسرار', icon: '🍷' },
    confession: { name: 'جلسة الاعتراف', icon: '🕊️' },
  };

  return (
    <div className="space-y-6">
      {/* Light Header Banner */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span className="text-xs font-bold text-sky-800">
                لوحة الخادم ومتابعة الرعاية الفردية
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              سلام ونعمة، {currentUser.displayName} 🕊️
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              تتابع هنا مخدوميك يومياً بالتفصيل: ما تم إنجازه، الأسئلة والإجابات، إرسال التنبيهات، وتحديد صلوات السواعي والأسفار.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingYouthRegistrations.length > 0 && (
              <button
                onClick={() => setActiveTab('registrations')}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm"
              >
                <UserCheck className="h-4 w-4" />
                <span>{pendingYouthRegistrations.length} طلب انضمام جديد!</span>
              </button>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3.5 py-2 shadow-sm">
              <Users className="h-5 w-5 text-sky-600" />
              <span className="text-xs text-slate-700 font-bold">
                {myYouths.length} مخدومين تحت رعايتك
              </span>
            </div>
          </div>
        </div>
      </div>

      {messageSentSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>تم إرسال الرسالة والتنبيه بنجاح للمخدوم وسيظهر في لوحته فوراً!</span>
        </div>
      )}

      {requestSentNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>تم إرسال طلب التعديل بنجاح إلى أمين الخدمة (Admin) للمراجعة والاعتماد.</span>
        </div>
      )}

      {/* Main Grid: Youths List & Inspection Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Youths List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              المخدومين المسندين إليك
            </h3>
            <span className="text-xs text-slate-400">{myYouths.length} شباب</span>
          </div>

          <div className="space-y-2">
            {myYouths.map((youth) => {
              const isSelected = selectedYouth?.uid === youth.uid;
              const youthLog = getUserDailyLog(youth.uid);

              return (
                <div
                  key={youth.uid}
                  onClick={() => setSelectedYouth(youth)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 shadow-sm'
                      : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {youth.displayName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {youth.assignedReading
                        ? `${youth.assignedReading.bookName} (${youth.assignedReading.currentChapter}/${youth.assignedReading.totalChapters})`
                        : 'لم يُحدد سفر'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                      <Flame className="h-3 w-3 fill-amber-500" />
                      <span>{youth.currentStreak} يوم</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      اليوم: {youthLog.completedCount}/4
                    </span>
                  </div>
                </div>
              );
            })}

            {myYouths.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                لا يوجد مخدومين مسندين إليك حالياً.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (2 spans): Followup & Inspection Tabs */}
        <div className="lg:col-span-2 space-y-5">
          {selectedYouth ? (
            <>
              {/* Youth Profile Bar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">
                        {selectedYouth.displayName}
                      </h2>
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">
                        {selectedYouth.churchGroup}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      البريد: {selectedYouth.email} • كود الدخول المسجل: <span className="font-mono font-bold text-slate-800">{selectedYouth.accessCode}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Send Message Button */}
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-sm"
                    >
                      <Bell className="h-4 w-4" />
                      <span>إرسال تنبيه / رسالة</span>
                    </button>

                    <button
                      onClick={() => setShowAssignBookModal(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>تحديد السفر</span>
                    </button>

                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span>طلب تعديل بيانات</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveTab('daily_followup')}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'daily_followup'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>متابعة مهام اليوم وإجابات الأسئلة</span>
                </button>

                <button
                  onClick={() => setActiveTab('agpeya_setup')}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'agpeya_setup'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>تحديد صلوات السواعي للمخدوم</span>
                </button>

                <button
                  onClick={() => setActiveTab('private_notes')}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'private_notes'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>الملاحظات السرية ({youthNotes.length})</span>
                </button>

                {pendingYouthRegistrations.length > 0 && (
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      activeTab === 'registrations'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>طلبات التسجيل ({pendingYouthRegistrations.length})</span>
                  </button>
                )}
              </div>

              {/* Tab 1: Detailed Daily Followup with exact Questions & Youth Answers */}
              {activeTab === 'daily_followup' && selectedYouthLog && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                        تقرير إنجاز اليوم ({selectedYouthLog.dateString})
                      </h3>
                      <p className="text-xs text-slate-500">
                        المهام المنجزة وغير المنجزة، ونص السؤال التأكيدي وإجابة المخدوم الكاملة
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      أنجز {selectedYouthLog.completedCount} من 4 بنود
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(['bible', 'prayer', 'communion', 'confession'] as HabitType[]).map((taskType) => {
                      const record = selectedYouthLog.tasks[taskType];
                      const isDone = !!record?.completed;
                      const info = habitLabels[taskType];

                      return (
                        <div
                          key={taskType}
                          className={`rounded-xl border p-4 transition-all ${
                            isDone
                              ? 'border-emerald-200 bg-emerald-50/40'
                              : 'border-slate-200 bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{info.icon}</span>
                              <h4 className="font-bold text-sm text-slate-900">
                                {info.name}
                              </h4>
                              {taskType === 'bible' && record?.bookName && (
                                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                  {record.bookName} • الأصحاح {record.chapterNumber}
                                </span>
                              )}
                              {taskType === 'prayer' && record?.agpeyaHour && (
                                <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                                  {record.agpeyaHour}
                                </span>
                              )}
                            </div>

                            {isDone ? (
                              <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                <span>تم الإنجاز</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                <Clock className="h-3.5 w-3.5" />
                                <span>لم يُنجز اليوم بعد</span>
                              </div>
                            )}
                          </div>

                          {/* Completed Details: Question Text + Youth Reflection Answer */}
                          {isDone ? (
                            <div className="mt-3 space-y-2 text-xs border-t border-emerald-100 pt-2.5">
                              {record.questionText && (
                                <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
                                  <span className="font-bold text-slate-700 block mb-0.5 flex items-center gap-1">
                                    <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                                    <span>سؤال التأمل الذي عُرض عليه:</span>
                                  </span>
                                  <p className="text-slate-600 leading-relaxed font-medium">
                                    {record.questionText}
                                  </p>
                                </div>
                              )}

                              {record.reflectionAnswer && (
                                <div className="rounded-lg bg-emerald-100/60 p-2.5 border border-emerald-200">
                                  <span className="font-bold text-emerald-900 block mb-0.5 flex items-center gap-1">
                                    <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
                                    <span>إجابة وتأمل المخدوم:</span>
                                  </span>
                                  <p className="text-emerald-950 font-semibold leading-relaxed">
                                    &quot;{record.reflectionAnswer}&quot;
                                  </p>
                                  {record.timeSpentSeconds && (
                                    <span className="text-[10px] text-emerald-700 block mt-1">
                                      استغرق في الإجابة: {record.timeSpentSeconds} ثانية
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 mt-1">
                              في انتظار قيام المخدوم بتسجيل هذا البند وكتابة تأمله اليومي.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Agpeya Hours Setup for Youth */}
              {activeTab === 'agpeya_setup' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                      تحديد صلوات السواعي المطلوبة من المخدوم
                    </h3>
                    <p className="text-xs text-slate-500">
                      يمكنك تحديد صلاة واحدة أو صلاتين أو أكثر (كالباكر والغروب والنوم) لتظهر في قانون المخدوم اليومي
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {allAgpeyaHours.map((h) => {
                      const isAssigned = (selectedYouth.assignedAgpeyaHours || ['baker', 'sleep']).includes(h.key);

                      return (
                        <div
                          key={h.key}
                          onClick={() => toggleAgpeyaHourForYouth(h.key)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isAssigned
                              ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold shadow-xs'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs">{h.name}</span>
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                              isAssigned
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isAssigned ? 'مفعلة في قانونه' : 'غير مفعلة'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Private Notes */}
              {activeTab === 'private_notes' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        الملاحظات السرية للرعاية (Private Notes)
                      </h3>
                      <p className="text-xs text-slate-500">
                        مرئية لك ولأمين الخدمة فقط — لن يراها المخدوم حفاظاً على سرية المتابعة
                      </p>
                    </div>
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">تدوين ملاحظة جديدة:</span>
                      <select
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value as 'spiritual' | 'social' | 'academic' | 'urgent')}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                      >
                        <option value="spiritual">روحيّة</option>
                        <option value="social">اجتماعية / أسرية</option>
                        <option value="academic">دراسية</option>
                        <option value="urgent">متابعة هامة</option>
                      </select>
                    </div>

                    <textarea
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      rows={2}
                      placeholder="اكتب ملاحظة متابعة أو موضوع يحتاج صلاة ومتابعة شخصية..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none resize-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNoteContent.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>حفظ الملاحظة السرية</span>
                      </button>
                    </div>
                  </form>

                  {/* Notes list */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {youthNotes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sky-800">{note.servantName}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-slate-600">
                              {note.category}
                            </span>
                            <span>{new Date(note.createdAt).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Registrations Awaiting this Servant */}
              {activeTab === 'registrations' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    طلبات انضمام المخدومين الجدد بانتظار موافقتك
                  </h3>
                  {pendingYouthRegistrations.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/50"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{req.userName}</h4>
                        <p className="text-xs text-slate-500">
                          البريد: {req.email} • الهاتف: {req.phone || 'غير مسجل'} • كود المخدوم:{' '}
                          <span className="font-mono font-bold text-amber-800">{req.accessCode}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegistrationDecision(req.id, 'approved')}
                          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>قبول وإضافة لمخدوميك</span>
                        </button>
                        <button
                          onClick={() => handleRegistrationDecision(req.id, 'rejected')}
                          className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>رفض</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
              اختر مخدوماً من القائمة لعرض تقريره ومتابعته اليومية.
            </div>
          )}
        </div>
      </div>

      {/* Sermons Section */}
      <SermonsSection
        sermons={sermons}
        onToggleWatched={toggleSermonWatched}
        canAddSermon={true}
      />

      {/* Send Message to Youth Modal */}
      {showMessageModal && selectedYouth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-sky-300 bg-white p-6 text-slate-800 shadow-2xl">
            <button
              onClick={() => setShowMessageModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-1">
              إرسال رسالة أو تنبيه للمخدوم: {selectedYouth.displayName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ستصل الرسالة مباشرة في لوحة المخدوم كتنبيه تشجيع أو تذكير بالمهمات
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  قوالب رسائل جاهزة سريعة:
                </label>
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMessageType('reminder_bible');
                      setMessageTitle('تذكير بقراءة الإنجيل اليومية 📖');
                      setMessageContent('سلام ونعمة يا بطل، لا تنس قراءة إصحاح اليوم والتأمل في وصية ربنا!');
                    }}
                    className="p-2 text-right rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-semibold text-slate-800"
                  >
                    📖 تذكير بقراءة إصحاح الإنجيل
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessageType('reminder_task');
                      setMessageTitle('تذكير بمهمة قديمة لم تُسجل ⏳');
                      setMessageContent('لاحظت أن هناك بنداً لم تقم بتسجيله اليوم، شجع نفسك وأتمم قانونك الروحي قبل النوم.');
                    }}
                    className="p-2 text-right rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-semibold text-slate-800"
                  >
                    ⏳ تذكير بمهمة قديمة لم تكتمل
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessageType('encouragement');
                      setMessageTitle('تشجيع: عاش يا بطل! 🌟');
                      setMessageContent('فرحان بأمانتك والتزامك في النوتة الروحية، استمر بنفس الحماس وربنا يباركك!');
                    }}
                    className="p-2 text-right rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 text-xs font-semibold text-slate-800"
                  >
                    🌟 رسالة تشجيع على الالتزام
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الرسالة:
                </label>
                <input
                  type="text"
                  required
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  placeholder="عنوان التنبيه"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نص الرسالة:
                </label>
                <textarea
                  required
                  rows={3}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="اكتب رسالتك للمخدوم..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-sm"
                >
                  إرسال التنبيه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Canonical Bible Book Modal (All 73 books ordered canonically) */}
      {showAssignBookModal && selectedYouth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-300 bg-white p-6 text-slate-800 shadow-2xl">
            <button
              onClick={() => setShowAssignBookModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-1">
              تحديد سفر الإنجيل من الكتاب المقدس بالترتيب الكنسي
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              اختر السفر المطلوب للمخدوم ({selectedYouth.displayName})؛ مرتبة بحسب الترتيب الكنسي الأرثوذكسي
            </p>

            <form onSubmit={handleAssignBookSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر السفر (العهد القديم والجديد مرتبة كنسياً):
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  size={8}
                >
                  <optgroup label="--- العهد الجديد (الأناجيل والرسائل والرؤيا) ---">
                    {ALL_CANONICAL_BIBLE_BOOKS.filter((b) => b.testament === 'new').map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.totalChapters} أصحاح) — {b.categoryName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="--- العهد القديم (الشريعة والتاريخ والأنبياء) ---">
                    {ALL_CANONICAL_BIBLE_BOOKS.filter((b) => b.testament === 'old').map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.totalChapters} أصحاح) — {b.categoryName}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Selected book info banner */}
              {(() => {
                const book = ALL_CANONICAL_BIBLE_BOOKS.find((b) => b.id === selectedBookId);
                return book ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-950 block">{book.name}</span>
                      <span className="text-[11px] text-amber-800">{book.categoryName}</span>
                    </div>
                    <span className="font-black text-amber-900 bg-white border border-amber-200 px-2.5 py-1 rounded-lg">
                      {book.totalChapters} أصحاحات
                    </span>
                  </div>
                ) : null;
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignBookModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-200"
                >
                  حفظ وتعيين السفر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedYouth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-300 bg-white p-6 text-slate-800 shadow-2xl">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-1">
              طلب تعديل بيانات / استعادة سلسلة
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              التعديل على بيانات المخدوم وسلسلته الروحية يرسل لأمين الخدمة للاعتماد.
            </p>

            <form onSubmit={handleSendApprovalRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نوع الطلب:
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as 'edit_profile' | 'task_adjustment' | 'streak_recovery')}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="streak_recovery">استعادة أيام في السلسلة (Streak Recovery)</option>
                  <option value="task_adjustment">تعديل سجل مهام سابقة</option>
                  <option value="edit_profile">تعديل بيانات الحساب أو الأسرة</option>
                </select>
              </div>

              {requestType === 'streak_recovery' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عدد الأيام المطلوب استعادتها:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={recoveryDays}
                    onChange={(e) => setRecoveryDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مبرر الطلب لأمين الخدمة:
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="مثال: كان مسافراً في معسكر كنسي دون إنترنت وقام بالقراءات ورقياً..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-200"
                >
                  إرسال الطلب للاعتماد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
