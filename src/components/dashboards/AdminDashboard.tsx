'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import { POPULAR_BIBLE_BOOKS } from '@/lib/antiCheatEngine';
import {
  ShieldAlert,
  Users,
  RotateCw,
  CheckCircle2,
  XCircle,
  FileCheck,
  TrendingUp,
  Award,
  Lock,
  ArrowRightLeft,
  Sparkles,
  UserCheck,
  BookOpen,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    approvalRequests,
    handleApprovalDecision,
    registrationRequests,
    handleRegistrationDecision,
    rotateServantsMonthly,
    reassignYouth,
    assignReadingPlanToYouth,
    servantNotes,
    sermons,
    toggleSermonWatched,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'registrations' | 'approvals' | 'assignments' | 'notes' | 'sermons'>('registrations');
  const [rotationNotice, setRotationNotice] = useState(false);

  // Modal to assign book to any youth as admin
  const [selectedYouthForBook, setSelectedYouthForBook] = useState<string | null>(null);
  const [bookName, setBookName] = useState(POPULAR_BIBLE_BOOKS[0].name);
  const [bookChapters, setBookChapters] = useState(POPULAR_BIBLE_BOOKS[0].totalChapters);

  if (!currentUser) return null;

  const youths = allUsers.filter((u) => u.role === 'youth' && u.status === 'active');
  const servants = allUsers.filter((u) => u.role === 'servant' && u.status === 'active');
  const pendingRequests = approvalRequests.filter((r) => r.status === 'pending');

  // Pending servant registrations waiting for admin approval
  const pendingServantRegistrations = registrationRequests.filter(
    (r) => r.role === 'servant' && r.status === 'pending'
  );

  const handleRotate = () => {
    rotateServantsMonthly();
    setRotationNotice(true);
    setTimeout(() => setRotationNotice(false), 5000);
  };

  const handleAdminAssignBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYouthForBook) return;
    assignReadingPlanToYouth(selectedYouthForBook, bookName, bookChapters);
    setSelectedYouthForBook(null);
  };

  const totalTasks = youths.reduce((acc, y) => acc + y.totalTasksCompleted, 0);

  return (
    <div className="space-y-6">
      {/* Light Top Banner */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-800">
                لوحة أمين الخدمة والإدارة الشاملة (Admin RBAC)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              أهلاً بك يا {currentUser.displayName} 👑
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              إدارة الخدمة الشاملة: اعتماد تسجيل الخدام الجدد، تدوير الخدمة شهرياً، ومتابعة الخطط الروحية لجميع المخدومين.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-200 active:scale-95 transition-all"
            >
              <RotateCw className="h-4 w-4" />
              <span>التدوير الشهري للخدام (Monthly Rotation)</span>
            </button>
          </div>
        </div>
      </div>

      {rotationNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-800">
          <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
          <span>تم بنجاح تدوير وتوزيع المخدومين على الخدام للشهر الجديد بنظام التدوير المنظم!</span>
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">المخدومين النشطين</span>
            <Users className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{youths.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">شباب ثانوي مسجلين</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">خدام المتابعة</span>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{servants.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">خدام ثانوي نشطين</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">مهام روحية منجزة</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTasks}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">تأمل وقراءة وصلاة</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">خدام بانتظار الاعتماد</span>
            <UserCheck className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingServantRegistrations.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">طلبات تسجيل جديدة</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'registrations'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>طلبات تسجيل الخدام الجدد ({pendingServantRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'approvals'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>تعديلات الخدام المعلقة ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'assignments'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>توزيع المخدومين والأسفار</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>سجل الملاحظات السرية ({servantNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sermons')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'sermons'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>مكتبة العظات العامة</span>
        </button>
      </div>

      {/* Tab 1: New Servants Registration Requests */}
      {activeTab === 'registrations' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                طلبات تسجيل الخدام الجدد بانتظار موافقة أمين الخدمة
              </h3>
              <p className="text-xs text-slate-500">
                لا يستطيع الخادم الدخول للنظام إلا بعد موافقة واعتماد أمين الخدمة هنا
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {pendingServantRegistrations.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{req.userName}</h4>
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                      طلب حساب خادم جديد
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    البريد: {req.email} • الهاتف: {req.phone || 'غير مسجل'} • الأسرة: {req.churchGroup}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRegistrationDecision(req.id, 'approved')}
                    className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>موافقة واعتماد الخادم</span>
                  </button>
                  <button
                    onClick={() => handleRegistrationDecision(req.id, 'rejected')}
                    className="flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>رفض</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingServantRegistrations.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">
                لا توجد طلبات تسجيل معلقة لخدام جدد حالياً.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Approval Requests Queue */}
      {activeTab === 'approvals' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            صندوق مراجعة واعتماد طلبات الخدام (Approval Queue)
          </h3>

          <div className="space-y-3">
            {approvalRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-slate-900 text-sm">{req.servantName}</span>
                    <span className="text-xs text-slate-400">بشأن المخدوم:</span>
                    <span className="font-bold text-amber-800 text-xs">{req.youthName}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {req.status === 'pending'
                        ? 'قيد الانتظار'
                        : req.status === 'approved'
                        ? 'تمت الموافقة'
                        : 'مرفوض'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong>السبب والمبرر:</strong> {req.reason}
                  </p>

                  {req.suggestedData?.restoreDays && (
                    <p className="text-[11px] text-amber-700 mt-1 font-bold">
                      المطلوب: استعادة {req.suggestedData.restoreDays} أيام في السلسلة
                    </p>
                  )}
                </div>

                {req.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprovalDecision(req.id, 'approved', 'تم الاعتماد')}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>موافقة واعتماد</span>
                    </button>
                    <button
                      onClick={() => handleApprovalDecision(req.id, 'rejected', 'مرفوض')}
                      className="flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>رفض</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-left text-xs text-slate-500 font-semibold">
                    تم المراجعة بواسطة {req.reviewedBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Assignments & Bible Plans */}
      {activeTab === 'assignments' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="mb-2">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              توزيع المخدومين والخدام وتعيين أسفار الإنجيل
            </h3>
            <p className="text-xs text-slate-500">
              يمكنك تخصيص أي مخدوم لخادم محدد، أو تحديد السفر الذي يقراه المخدوم مباشرة
            </p>
          </div>

          <div className="space-y-2.5">
            {youths.map((youth) => {
              return (
                <div
                  key={youth.uid}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{youth.displayName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      السلسلة: <strong className="text-amber-700">{youth.currentStreak} يوم</strong> • السفر الحالي:{' '}
                      <span className="font-bold text-slate-800">
                        {youth.assignedReading ? `${youth.assignedReading.bookName} (${youth.assignedReading.currentChapter}/${youth.assignedReading.totalChapters})` : 'لم يُحدد'}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedYouthForBook(youth.uid)}
                      className="flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>تغيير السفر</span>
                    </button>

                    <span className="text-xs text-slate-500">الخادم:</span>
                    <select
                      value={youth.assignedServantId || ''}
                      onChange={(e) => reassignYouth(youth.uid, e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">غير مخصص</option>
                      {servants.map((s) => (
                        <option key={s.uid} value={s.uid}>
                          {s.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Supervisory Notes */}
      {activeTab === 'notes' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            سجل الملاحظات السرية الشامل لجميع الخدام
          </h3>
          <p className="text-xs text-slate-500 mb-2">
            لأمين الخدمة صلاحية كاملة للاطلاع على كافة الملاحظات الرعوية المدونة بواسطة الخدام
          </p>

          <div className="space-y-2.5">
            {servantNotes.map((note) => (
              <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-800">الخادم: {note.servantName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-amber-800">المخدوم: {note.youthName}</span>
                  </div>
                  <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600">
                    {note.category}
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Sermons */}
      {activeTab === 'sermons' && (
        <SermonsSection
          sermons={sermons}
          onToggleWatched={toggleSermonWatched}
          canAddSermon={true}
        />
      )}

      {/* Assign Book Modal for Admin */}
      {selectedYouthForBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-300 bg-white p-6 text-slate-800 shadow-2xl">
            <button
              onClick={() => setSelectedYouthForBook(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-3">
              تعيين سفر الإنجيل للمخدوم
            </h3>

            <form onSubmit={handleAdminAssignBook} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_BIBLE_BOOKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBookName(b.name);
                      setBookChapters(b.totalChapters);
                    }}
                    className={`p-2 rounded-xl border text-right text-xs ${
                      bookName === b.name
                        ? 'border-amber-500 bg-amber-50 font-bold text-amber-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold">{b.name}</span>
                    <span className="text-[10px] text-slate-500">{b.totalChapters} أصحاح</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم السفر وعدد الأصحاحات:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    className="col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                  <input
                    type="number"
                    min={1}
                    required
                    value={bookChapters}
                    onChange={(e) => setBookChapters(Number(e.target.value))}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedYouthForBook(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-sm"
                >
                  حفظ وتعيين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
