'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserProfile, ServantPrivateNote } from '@/types';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import {
  Users,
  Flame,
  FileText,
  Send,
  Lock,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
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
  } = useApp();

  // Filter only youths assigned to this servant
  const myYouths = allUsers.filter(
    (u) => u.role === 'youth' && u.assignedServantId === currentUser.uid
  );

  const [selectedYouth, setSelectedYouth] = useState<UserProfile | null>(
    myYouths[0] || null
  );

  // Private note state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'spiritual' | 'social' | 'academic' | 'urgent'>('spiritual');

  // Approval request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<'edit_profile' | 'task_adjustment' | 'streak_recovery'>('streak_recovery');
  const [requestReason, setRequestReason] = useState('');
  const [recoveryDays, setRecoveryDays] = useState(1);
  const [requestSentNotice, setRequestSentNotice] = useState(false);

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

  // Notes visible for this youth (visible only to this servant & admin)
  const youthNotes = selectedYouth
    ? servantNotes.filter((n) => n.youthId === selectedYouth.uid)
    : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-sky-400" />
              <span className="text-xs font-semibold text-sky-400">
                لوحة الخادم ومتابعة الرعاية الفردية
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              سلام ونعمة، {currentUser.displayName} 🕊️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              تتابع هنا مخدوميك المسندين إليك. يمكنك تدوين الملاحظات السرية، إرسال عظات خاصة، أو رفع طلب تعديل لأمين الخدمة.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2">
            <Users className="h-5 w-5 text-sky-400" />
            <span className="text-xs text-slate-300 font-bold">
              {myYouths.length} مخدومين تحت رعايتك
            </span>
          </div>
        </div>
      </div>

      {requestSentNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-200 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            تم إرسال طلب التعديل بنجاح إلى أمين الخدمة (Admin) للمراجعة والاعتماد.
          </span>
        </div>
      )}

      {/* Main Grid: Youths List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Assigned Youths List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
          <h3 className="font-bold text-slate-100 mb-3 flex items-center justify-between">
            <span>المخدومين المسندين إليك</span>
            <span className="text-xs text-slate-400 font-normal">{myYouths.length} شباب</span>
          </h3>

          <div className="space-y-2.5">
            {myYouths.map((youth) => {
              const isSelected = selectedYouth?.uid === youth.uid;
              return (
                <div
                  key={youth.uid}
                  onClick={() => setSelectedYouth(youth)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-950/30 shadow-md shadow-sky-950/50'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">
                      {youth.displayName}
                    </h4>
                    <p className="text-[11px] text-slate-400">{youth.churchGroup}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
                      <Flame className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{youth.currentStreak} يوم</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {myYouths.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                لا يوجد مخدومين مسندين إليك حالياً. يقوم أمين الخدمة بتوزيع المخدومين شهرياً.
              </p>
            )}
          </div>
        </div>

        {/* Right Col (2 spans): Selected Youth Detail & Private Notes */}
        <div className="lg:col-span-2 space-y-6">
          {selectedYouth ? (
            <>
              {/* Selected Youth Profile Bar */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">
                        {selectedYouth.displayName}
                      </h2>
                      <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[11px] font-medium text-sky-300">
                        {selectedYouth.churchGroup}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      البريد الإلكتروني: {selectedYouth.email} • المهام الروحية المنجزة:{' '}
                      <strong className="text-amber-400">{selectedYouth.totalTasksCompleted}</strong>
                    </p>
                  </div>

                  {/* Actions for this youth */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>طلب تعديل بيانات / استعادة سلسلة</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Private Notes Section (Visible only to servant & admin) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 flex items-center gap-2">
                        <span>الملاحظات الروحية السرية (Private Notes)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        مرئية لك ولأمين الخدمة فقط — لن يراها المخدوم حفاظاً على الخصوصية والرعاية.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">تدوين ملاحظة جديدة:</span>
                    <select
                      value={newNoteCategory}
                      onChange={(e) => setNewNoteCategory(e.target.value as any)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none mb-2"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteContent.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-sky-500 transition-colors disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>حفظ الملاحظة السرية</span>
                    </button>
                  </div>
                </form>

                {/* Existing notes list */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {youthNotes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sky-300">
                          {note.servantName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                            {note.category}
                          </span>
                          <span>{new Date(note.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{note.content}</p>
                    </div>
                  ))}

                  {youthNotes.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">
                      لا توجد ملاحظات سرية مسجلة بعد لهذا المخدوم.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500">
              اختر مخدوماً من القائمة الجانبية لعرض ملفه وملاحظاته.
            </div>
          )}
        </div>
      </div>

      {/* Sermons Section (Servant can add sermons) */}
      <SermonsSection
        sermons={sermons}
        onToggleWatched={toggleSermonWatched}
        canAddSermon={true}
      />

      {/* Servant Request Modal (Cannot edit directly, goes to Admin) */}
      {showRequestModal && selectedYouth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 left-4 p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">
              طلب تعديل بيانات / استعادة سلسلة
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              وفقاً لصلاحيات النظام، التعديلات المباشرة على بيانات المخدوم وسلسلته الروحية تتطلب موافقة أمين الخدمة.
            </p>

            <form onSubmit={handleSendApprovalRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  المخدوم المعني:
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedYouth.displayName}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نوع الطلب:
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="streak_recovery">استعادة أيام في السلسلة (Streak Recovery)</option>
                  <option value="task_adjustment">تعديل سجل مهام سابقة</option>
                  <option value="edit_profile">تعديل بيانات الحساب أو الأسرة</option>
                </select>
              </div>

              {requestType === 'streak_recovery' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    عدد الأيام المطلوب استعادتها:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={recoveryDays}
                    onChange={(e) => setRecoveryDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  مبرر وسبب الطلب لأمين الخدمة:
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="مثال: كان مسافراً في معسكر كنسي دون اتصال وقام بأداء القراءات ورقياً..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md"
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
