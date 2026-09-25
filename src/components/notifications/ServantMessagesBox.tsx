'use client';

import React from 'react';
import { ServantMessage } from '@/types';
import { Bell, CheckCheck, Clock } from 'lucide-react';

interface ServantMessagesBoxProps {
  messages: ServantMessage[];
  onMarkAsRead: (messageId: string) => void;
}

export const ServantMessagesBox: React.FC<ServantMessagesBoxProps> = ({
  messages,
  onMarkAsRead,
}) => {
  if (messages.length === 0) return null;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                رسائل وتنبيهات خادمك المتابع
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.2 text-[10px] font-black text-white animate-pulse">
                  {unreadCount} جديدة
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              توجيهات ورسائل تشجيع وتذكير مباشرة من خادمك المسؤول
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl border p-3.5 transition-all ${
              msg.read
                ? 'border-slate-200 bg-white/80 opacity-80'
                : 'border-sky-300 bg-white shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-sky-950">
                  {msg.title}
                </span>
                <span className="text-[10px] text-slate-400">
                  من: {msg.servantName}
                </span>
              </div>

              {!msg.read && (
                <button
                  onClick={() => onMarkAsRead(msg.id)}
                  className="flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 hover:bg-sky-100"
                >
                  <CheckCheck className="h-3 w-3" />
                  <span>تحديد كمقروءة</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {msg.content}
            </p>

            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(msg.sentAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
