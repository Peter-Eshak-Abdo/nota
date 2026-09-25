'use client';

import React, { useState } from 'react';
import { Sermon } from '@/types';
import { useApp } from '@/context/AppContext';
import { Headphones, CheckCircle, ExternalLink, Plus, Video, UserCheck, X } from 'lucide-react';

interface SermonsSectionProps {
  sermons: Sermon[];
  onToggleWatched: (id: string) => void;
  canAddSermon?: boolean;
}

export const SermonsSection: React.FC<SermonsSectionProps> = ({
  sermons,
  onToggleWatched,
  canAddSermon = false,
}) => {
  const { currentUser, allUsers, addSermon } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
  const [selectedYouthIds, setSelectedYouthIds] = useState<string[]>([]);

  // Filter sermons relevant to this user (if youth: all or specifically targeted)
  const visibleSermons = sermons.filter((s) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'servant') return true;
    // Youth view:
    if (s.targetType === 'all') return true;
    return s.targetYouthIds?.includes(currentUser.uid);
  });

  const handleCreateSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    addSermon({
      title,
      speaker: speaker || 'خادم الكنيسة',
      description,
      url,
      targetType,
      targetYouthIds: targetType === 'specific' ? selectedYouthIds : undefined,
      addedBy: currentUser.uid,
      addedByName: currentUser.displayName,
    });

    setTitle('');
    setSpeaker('');
    setUrl('');
    setDescription('');
    setSelectedYouthIds([]);
    setShowAddModal(false);
  };

  const youthsList = allUsers.filter((u) => u.role === 'youth');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">
              مكتبة الوعظات والغذاء الروحي (Spiritual Playlist)
            </h3>
            <p className="text-xs text-slate-400">
              قائمة تشغيل روحية مخصصة وموجهة لك من خادمك وأمين الخدمة
            </p>
          </div>
        </div>

        {canAddSermon && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة عظة للشباب</span>
          </button>
        )}
      </div>

      {/* Sermons List */}
      <div className="space-y-3">
        {visibleSermons.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-500">
            لا توجد عظات مضافة حالياً.
          </div>
        ) : (
          visibleSermons.map((sermon) => {
            const isWatched = sermon.watchedByUserIds.includes(currentUser.uid);
            return (
              <div
                key={sermon.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                  isWatched
                    ? 'border-slate-800 bg-slate-950/60 opacity-80'
                    : 'border-purple-500/30 bg-purple-950/15 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-purple-400 border border-slate-700">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-slate-100">
                        {sermon.title}
                      </h4>
                      {sermon.targetType === 'specific' && (
                        <span className="flex items-center gap-1 rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                          <UserCheck className="h-3 w-3" />
                          <span>توجيه خاص</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                      {sermon.speaker} • أضافها {sermon.addedByName}
                    </p>
                    {sermon.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {sermon.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={sermon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>مشاهدة</span>
                  </a>

                  {currentUser.role === 'youth' && (
                    <button
                      onClick={() => onToggleWatched(sermon.id)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        isWatched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{isWatched ? 'تم الاستماع' : 'تحديد كـ مستمع'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Sermon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
          <div className="relative w-full max-w-md rounded-2xl border border-purple-500/40 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 left-4 p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              إضافة عظة أو تسجيل روحي للشباب
            </h3>

            <form onSubmit={handleCreateSermon} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  عنوان العظة:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: كيف تحافظ على صلاتك وسط الامتحانات؟"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  المتكلم / الواعظ:
                </label>
                <input
                  type="text"
                  required
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="مثال: أبونا داود لمعي / قداسة البابا شنودة"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  رابط العظة (YouTube أو صوتي):
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نبذة توضيحية / تدريب روحي مصاحب:
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="اكتب رسالة تشجيع للشباب قبل سماع العظة..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  الفئة المستهدفة:
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="all">كل شباب الخدمة (عامة)</option>
                  <option value="specific">توجيه لمخدومين محددين</option>
                </select>
              </div>

              {targetType === 'specific' && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 max-h-36 overflow-y-auto space-y-1.5">
                  <span className="text-[11px] text-slate-400 block mb-1">اختر المخدومين:</span>
                  {youthsList.map((y) => (
                    <label key={y.uid} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedYouthIds.includes(y.uid)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedYouthIds([...selectedYouthIds, y.uid]);
                          } else {
                            setSelectedYouthIds(selectedYouthIds.filter((id) => id !== y.uid));
                          }
                        }}
                        className="rounded border-slate-700 text-purple-600 focus:ring-0"
                      />
                      <span>{y.displayName}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-md"
                >
                  حفظ ونشر العظة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
