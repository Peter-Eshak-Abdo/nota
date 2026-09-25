'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import {
  ShieldAlert,
  Users,
  RotateCw,
  CheckCircle,
  XCircle,
  FileCheck,
  TrendingUp,
  Award,
  Lock,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    allUsers,
    approvalRequests,
    handleApprovalDecision,
    rotateServantsMonthly,
    reassignYouth,
    servantNotes,
    sermons,
    toggleSermonWatched,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'assignments' | 'notes' | 'sermons'>('approvals');
  const [rotationNotice, setRotationNotice] = useState(false);

  const youths = allUsers.filter((u) => u.role === 'youth');
  const servants = allUsers.filter((u) => u.role === 'servant');
  const pendingRequests = approvalRequests.filter((r) => r.status === 'pending');

  const handleRotate = () => {
    rotateServantsMonthly();
    setRotationNotice(true);
    setTimeout(() => setRotationNotice(false), 5000);
  };

  // Aggregated analytics
  const totalTasks = youths.reduce((acc, y) => acc + y.totalTasksCompleted, 0);
  const activeStreakYouths = youths.filter((y) => y.currentStreak >= 10).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-400">
                لوحة أمين الخدمة والإدارة الشاملة (Admin RBAC)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              أهلاً بك يا {currentUser.displayName} 👑
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              إدارة توزيع الخدام على المخدومين، تدوير الخدمة شهرياً، اعتماد طلبات تعديل البيانات، ونشر العظات الموجهة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <RotateCw className="h-4 w-4" />
              <span>تدوير الخدام شهرياً (Monthly Rotation)</span>
            </button>
          </div>
        </div>
      </div>

      {rotationNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3.5 text-xs text-amber-200 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            تم بنجاح تدوير وتوزيع المخدومين على الخدام للشهر الجديد بنظام التدوير الدوري المنظم!
          </span>
        </div>
      )}

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">إجمالي المخدومين</span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{youths.length}</div>
          <p className="text-[10px] text-slate-500 mt-1">شباب ثانوي مسجلين</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">الخدام القائمين</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{servants.length}</div>
          <p className="text-[10px] text-slate-500 mt-1">خدام متابعة ورعاية</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">المهام الروحية المنفذة</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalTasks}</div>
          <p className="text-[10px] text-slate-500 mt-1">تأمل وقراءة وصلاة</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">طلبات قيد المراجعة</span>
            <FileCheck className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {pendingRequests.length}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">تحتاج قرار اعتماد</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'approvals'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>طلبات الاعتماد من الخدام ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'assignments'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>توزيع المخدومين على الخدام</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>الملاحظات السرية للخدمة ({servantNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sermons')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'sermons'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>مكتبة العظات العامة</span>
        </button>
      </div>

      {/* Tab 1: Approval Requests Queue */}
      {activeTab === 'approvals' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <h3 className="font-bold text-slate-100 mb-4">
            صندوق مراجعة واعتماد طلبات الخدام (Approval Queue)
          </h3>

          <div className="space-y-3">
            {approvalRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-white text-sm">
                      {req.servantName}
                    </span>
                    <span className="text-xs text-slate-400">بشأن المخدوم:</span>
                    <span className="font-semibold text-amber-300 text-xs">
                      {req.youthName}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        req.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {req.status === 'pending'
                        ? 'قيد الانتظار'
                        : req.status === 'approved'
                        ? 'تمت الموافقة'
                        : 'مرفوض'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>السبب والمبرر:</strong> {req.reason}
                  </p>

                  {req.suggestedData?.restoreDays && (
                    <p className="text-[11px] text-amber-400 mt-1 font-medium">
                      المطلوب: استعادة {req.suggestedData.restoreDays} أيام في السلسلة
                    </p>
                  )}
                </div>

                {req.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprovalDecision(req.id, 'approved', 'تم الاعتماد')}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>موافقة واعتماد</span>
                    </button>

                    <button
                      onClick={() => handleApprovalDecision(req.id, 'rejected', 'مرفوض لعدم اكتمال الشروط')}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>رفض</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-left text-xs text-slate-500">
                    تم المراجعة بواسطة {req.reviewedBy}
                  </div>
                )}
              </div>
            ))}

            {approvalRequests.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">
                لا توجد طلبات معلقة من الخدام حالياً.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Servant Assignments & Monthly Rotation */}
      {activeTab === 'assignments' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-100">
                تخصيص الخدام للمخدومين (Assignment Matrix)
              </h3>
              <p className="text-xs text-slate-400">
                يمكنك إعادة تخصيص أي مخدوم لخادم محدد، أو استخدام التدوير الشهري التلقائي.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {youths.map((youth) => {
              const currentServant = servants.find((s) => s.uid === youth.assignedServantId);

              return (
                <div
                  key={youth.uid}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {youth.displayName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {youth.churchGroup} • السلسلة الحالية:{' '}
                      <strong className="text-amber-400">{youth.currentStreak} يوم</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">الخادم المسؤول:</span>
                    <select
                      value={youth.assignedServantId || ''}
                      onChange={(e) => reassignYouth(youth.uid, e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-amber-300 focus:border-amber-400 focus:outline-none"
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

      {/* Tab 3: All Servant Private Notes (Supervisory view) */}
      {activeTab === 'notes' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <h3 className="font-bold text-slate-100 mb-2">
            سجل الملاحظات السرية الشامل للخدام
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            لأمين الخدمة صلاحية كاملة للاطلاع على كافة الملاحظات الرعوية المدونة بواسطة الخدام.
          </p>

          <div className="space-y-3">
            {servantNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-400">
                      الخادم: {note.servantName}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-semibold text-amber-300">
                      المخدوم: {note.youthName}
                    </span>
                  </div>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    {note.category}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Sermons publisher */}
      {activeTab === 'sermons' && (
        <SermonsSection
          sermons={sermons}
          onToggleWatched={toggleSermonWatched}
          canAddSermon={true}
        />
      )}
    </div>
  );
};
