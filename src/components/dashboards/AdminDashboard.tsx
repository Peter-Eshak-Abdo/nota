'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SermonsSection } from '@/components/sermons/SermonsSection';
import { ALL_CANONICAL_BIBLE_BOOKS } from '@/lib/bibleCanon';
import { format14DigitCode } from '@/lib/biometrics';
import {
  ShieldAlert,
  Users,
  RotateCw,
  CheckCircle2,
  XCircle,
  FileCheck,
  Lock,
  ArrowRightLeft,
  Sparkles,
  UserCheck,
  BookOpen,
  KeyRound,
  AlertTriangle,
  Copy,
  Check,
  X,
  FileSpreadsheet,
  Download,
  Upload,
  Trash2,
} from 'lucide-react';
import {
  downloadExcelTemplate,
  exportUsersToExcel,
  parseUsersFromExcel,
  ImportResult,
} from '@/lib/excelService';

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
    systemErrors,
    resolveSystemError,
    importUsers,
    resetToProductionAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'registrations' | 'excel_hub' | 'approvals' | 'assignments' | 'user_codes' | 'errors' | 'notes' | 'sermons'>('registrations');
  const [rotationNotice, setRotationNotice] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Excel state
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showConfirmResetModal, setShowConfirmResetModal] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);

  // Modal to assign book to any youth as admin
  const [selectedYouthForBook, setSelectedYouthForBook] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState(ALL_CANONICAL_BIBLE_BOOKS[0].id);

  if (!currentUser) return null;

  const youths = allUsers.filter((u) => u.role === 'youth' && u.status === 'active');
  const servants = allUsers.filter((u) => u.role === 'servant' && u.status === 'active');
  const pendingRequests = approvalRequests.filter((r) => r.status === 'pending');

  const pendingServantRegistrations = registrationRequests.filter(
    (r) => r.role === 'servant' && r.status === 'pending'
  );

  const pendingErrors = systemErrors.filter((e) => e.status === 'reported');

  const handleRotate = () => {
    rotateServantsMonthly();
    setRotationNotice(true);
    setTimeout(() => setRotationNotice(false), 5000);
  };

  const handleAdminAssignBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYouthForBook) return;
    const foundBook = ALL_CANONICAL_BIBLE_BOOKS.find((b) => b.id === selectedBookId);
    if (!foundBook) return;

    assignReadingPlanToYouth(selectedYouthForBook, foundBook.name, foundBook.totalChapters);
    setSelectedYouthForBook(null);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleExportExcel = () => {
    exportUsersToExcel(allUsers);
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    const result = await parseUsersFromExcel(file, allUsers);
    setImportResult(result);
    setImportLoading(false);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!importResult || !importResult.success) return;
    importUsers(importResult.users);
    setImportResult(null);
  };

  const handleConfirmReset = () => {
    resetToProductionAdmin();
    setShowConfirmResetModal(false);
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Light Top Banner */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
              إدارة الخدمة الشاملة: اعتماد تسجيل الخدام، تصدير واستيراد شيتات Excel، تدوير الخدمة، ومتابعة الأداء.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              title="تحميل قالب شيت إكسيل جاهز يحتوي على 3 خدام و 5 مخدومين بكامل بياناتهم"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
              <span>تحميل قالب Excel (٣ خدام + ٥ مخدومين)</span>
            </button>

            <button
              onClick={handleExportExcel}
              title="تصدير كافة المستخدمين والبيانات الحالية إلى ملف Excel"
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Download className="h-4 w-4 text-slate-600" />
              <span>تصدير الكل لـ Excel</span>
            </button>

            <button
              onClick={handleRotate}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-200 active:scale-95 transition-all"
            >
              <RotateCw className="h-4 w-4" />
              <span>تدوير الخدام</span>
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
            <span className="text-xs font-semibold">خدام بانتظار الاعتماد</span>
            <UserCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingServantRegistrations.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">طلبات تسجيل جديدة</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">بلاغات الأخطاء</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingErrors.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">تقارير من المستخدمين</p>
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
          onClick={() => setActiveTab('excel_hub')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'excel_hub'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>إدارة وتصدير واستيراد Excel 📊</span>
        </button>

        <button
          onClick={() => setActiveTab('user_codes')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'user_codes'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>أكواد الدخول (١٤ رقماً)</span>
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
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'approvals'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>تعديلات الخدام ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('errors')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'errors'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>بلاغات الأخطاء ({pendingErrors.length})</span>
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
          <span>الملاحظات السرية ({servantNotes.length})</span>
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
          <span>مكتبة العظات</span>
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
                    البريد: {req.email} • الهاتف: {req.phone || 'غير مسجل'} • كود الخادم المسجل:{' '}
                    <span className="font-mono font-bold text-amber-900">{req.accessCode}</span>
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

      {/* Tab: Excel Hub */}
      {activeTab === 'excel_hub' && (
        <div className="space-y-5">
          {/* Success Banner */}
          {resetSuccessNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>تم بنجاح تصفير قاعدة البيانات وضبطها على الإنتاج النظيف (بيتر إسحاق فقط كأمين خدمة)!</span>
            </div>
          )}

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download Template Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-1.5">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-700" />
                  <span>تحميل قالب Excel الجاهز (Template)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  شيت Excel نموذجي بصيغة <strong>.xlsx</strong> يحتوي مسبقاً على بيانات <strong>٣ خدام</strong> و <strong>٥ مخدومين</strong> نموذجية بأسمائهم وأرقامهم وأكواد دخولهم الـ ١٤ رقماً والربط بينهم. يمكنك استخدامه كمرجع أو ملئه ورفعه مباشرة.
                </p>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all"
              >
                <Download className="h-4 w-4" />
                <span>تحميل قالب Excel الجاهز (.xlsx)</span>
              </button>
            </div>

            {/* Export Current Data Card */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm mb-1.5">
                  <Download className="h-5 w-5 text-sky-700" />
                  <span>تصدير البيانات الحالية لقاعدة البيانات</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  تصدير جميع الحسابات المسجلة حالياً ({allUsers.length} مستخدم) شاملاً أكواد الدخول، الأدوار، أرقام الهواتف، وسلاسل الالتزام، للنسخ الاحتياطي أو الطباعة.
                </p>
              </div>
              <button
                onClick={handleExportExcel}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white hover:bg-sky-700 shadow-sm transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>تصدير الكل إلى Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Import Upload Zone Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  استيراد بيانات الخدام والمخدومين من ملف Excel
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  يدعم صيغ (.xlsx, .xls, .csv). يقوم النظام بقراءة الصفوف تلقائياً، وتوليد أكواد ١٤ رقماً لأي شخص ليس لديه كود، وربط المخدومين بخدامهم.
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800 border border-amber-200">
                استيراد ذكي وفوري
              </span>
            </div>

            {/* Drop / Upload Box */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/60 rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                disabled={importLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-2">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1">
                  {importLoading ? 'جاري قراءة وفحص ملف Excel...' : 'اضغط هنا أو اسحب ملف Excel لرفعه وفحصه'}
                </p>
                <p className="text-[11px] text-slate-500">
                  يدعم شيتات Excel باللغة العربية مع مطابقة الأعمدة تلقائياً
                </p>
              </div>
            </div>

            {/* Import Preview Results */}
            {importResult && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-extrabold text-sm text-slate-900">
                      معاينة البيانات المقروءة: تم العثور على {importResult.totalParsed} حساب
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                      {importResult.servantsCount} خدام
                    </span>
                    <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                      {importResult.youthCount} مخدومين
                    </span>
                  </div>
                </div>

                {/* Errors if any */}
                {importResult.errors.length > 0 && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 space-y-1">
                    <p className="font-bold">تنبيهات أثناء القراءة:</p>
                    {importResult.errors.map((err, i) => (
                      <p key={i}>• {err}</p>
                    ))}
                  </div>
                )}

                {/* Preview Table */}
                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="p-2.5">الاسم</th>
                        <th className="p-2.5">الرتبة</th>
                        <th className="p-2.5">البريد</th>
                        <th className="p-2.5">الهاتف</th>
                        <th className="p-2.5">كود الدخول (١٤ رقماً)</th>
                        <th className="p-2.5">الخادم المسؤول</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {importResult.users.map((u) => (
                        <tr key={u.uid} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{u.displayName}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'servant' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {u.role === 'servant' ? 'خادم' : 'مخدوم'}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{u.email}</td>
                          <td className="p-2.5 text-slate-600">{u.phone || '—'}</td>
                          <td className="p-2.5 font-mono font-bold text-amber-800">
                            {format14DigitCode(u.accessCode)}
                          </td>
                          <td className="p-2.5 text-slate-700">{u.assignedServantName || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Confirm Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setImportResult(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>تأكيد واعتماد استيراد ({importResult.totalParsed}) حساب الآن</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clean Production Reset Danger Card */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm mb-1">
                <Trash2 className="h-4 w-4 text-rose-600" />
                <span>تصفير وإعادة تعيين لقاعدة بيانات الإنتاج النظيفة (بيتر إسحاق فقط)</span>
              </div>
              <p className="text-xs text-slate-600">
                يقوم بحذف كافة البيانات القديمة والمخزنة محلياً والإبقاء حصرياً على حسابك (أ. بيتر إسحاق - Admin) لبدء الخدمة من الصفر.
              </p>
            </div>
            <button
              onClick={() => setShowConfirmResetModal(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm shrink-0 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>تصفير البيانات (بيتر إسحاق فقط)</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: 14-Digit Access Codes Manager */}
      {activeTab === 'user_codes' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              سجل أكواد الدخول (١٤ رقماً) لجميع المخدومين والخدام
            </h3>
            <p className="text-xs text-slate-500">
              يمكن لأمين الخدمة تزويد أي مخدوم أو خادم بكوده في حال نسيانه أو تسليمه ورقياً
            </p>
          </div>

          <div className="space-y-2">
            {allUsers.map((u) => (
              <div
                key={u.uid}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/60"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{u.displayName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.role === 'servant'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.role === 'admin' ? 'أمين الخدمة' : u.role === 'servant' ? 'خادم' : 'مخدوم'}
                    </span>
                    <span className="text-xs text-slate-400">({u.email})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs sm:text-sm font-black text-amber-800 bg-white border border-amber-300 px-3 py-1 rounded-lg">
                    {format14DigitCode(u.accessCode)}
                  </div>
                  <button
                    onClick={() => handleCopyCode(u.uid, u.accessCode)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    title="نسخ الكود"
                  >
                    {copiedCodeId === u.uid ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Canonical Assignments */}
      {activeTab === 'assignments' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="mb-2">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              توزيع المخدومين والخدام وتعيين أسفار الإنجيل
            </h3>
            <p className="text-xs text-slate-500">
              يمكنك تخصيص أي مخدوم لخادم محدد، أو تحديد السفر الذي يقراه المخدوم مباشرة من الأسفار القانونية
            </p>
          </div>

          <div className="space-y-2.5">
            {youths.map((youth) => (
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
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Errors Reports */}
      {activeTab === 'errors' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              سجل بلاغات الأخطاء ومشاكل المستخدمين
            </h3>
            <p className="text-xs text-slate-500">
              متابعة الأعطال المبلغ عنها من قِبل المخدومين والخدام وحلها
            </p>
          </div>

          <div className="space-y-2.5">
            {systemErrors.map((err) => (
              <div
                key={err.id}
                className={`p-4 rounded-xl border text-xs ${
                  err.status === 'resolved'
                    ? 'border-slate-200 bg-slate-50 opacity-60'
                    : 'border-rose-200 bg-rose-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-950">
                      المبلغ: {err.userName} ({err.userRole})
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">المصدر: {err.source}</span>
                  </div>

                  {err.status === 'reported' ? (
                    <button
                      onClick={() => resolveSystemError(err.id)}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                    >
                      تحديد كتم الحل
                    </button>
                  ) : (
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      تم الحل
                    </span>
                  )}
                </div>

                <p className="font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 break-all">
                  {err.errorMessage}
                </p>

                <div className="mt-1.5 text-[10px] text-slate-400 text-left">
                  {new Date(err.timestamp).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {systemErrors.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                لا توجد أي بلاغات أخطاء مسجلة؛ النظام يعمل بكفاءة تامة.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Approvals */}
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
                      {req.status === 'pending' ? 'قيد الانتظار' : req.status === 'approved' ? 'تمت الموافقة' : 'مرفوض'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong>السبب والمبرر:</strong> {req.reason}
                  </p>

                  {Boolean(req.suggestedData && 'restoreDays' in req.suggestedData) && (
                    <p className="text-[11px] text-amber-700 mt-1 font-bold">
                      المطلوب: استعادة {String(req.suggestedData.restoreDays)} أيام في السلسلة
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

      {/* Tab 6: Notes */}
      {activeTab === 'notes' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            سجل الملاحظات السرية الشامل لجميع الخدام
          </h3>

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

      {/* Tab 7: Sermons */}
      {activeTab === 'sermons' && (
        <SermonsSection
          sermons={sermons}
          onToggleWatched={toggleSermonWatched}
          canAddSermon={true}
        />
      )}

      {/* Admin Assign Canonical Book Modal */}
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
              تعيين سفر الإنجيل بالترتيب الكنسي
            </h3>

            <form onSubmit={handleAdminAssignBook} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اختر السفر من الكتاب المقدس:
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
                  size={6}
                >
                  <optgroup label="--- العهد الجديد ---">
                    {ALL_CANONICAL_BIBLE_BOOKS.filter((b) => b.testament === 'new').map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.totalChapters} أصحاح)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="--- العهد القديم ---">
                    {ALL_CANONICAL_BIBLE_BOOKS.filter((b) => b.testament === 'old').map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.totalChapters} أصحاح)
                      </option>
                    ))}
                  </optgroup>
                </select>
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

      {/* Confirm Production Reset Modal */}
      {showConfirmResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-rose-300 bg-white p-6 text-slate-800 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="font-extrabold text-base text-slate-900 mb-2">
              تأكيد تصفير البيانات والبدء كنسخة إنتاج نظيفة؟
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              سيتم مسح أي بيانات تجريبية سابقة فوراً وضبط النظام على حساب <strong>أ. بيتر إسحاق (Admin)</strong> فقط بكود دخوله (99018421736510). يمكنك بعد ذلك استيراد بيانات الخدام والمخدومين الحقيقيين عبر شيت Excel.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmReset}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
              >
                نعم، تصفير الآن
              </button>
              <button
                onClick={() => setShowConfirmResetModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
