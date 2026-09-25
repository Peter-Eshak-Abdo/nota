'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserProfile,
  DailyHabitLog,
  Sermon,
  ServantPrivateNote,
  ApprovalRequest,
  RegistrationRequest,
  ServantMessage,
  SystemErrorLog,
  MonthlySacredIconArchive,
  WeeklyCommunionRecord,
  MonthlyConfessionRecord,
  HabitType,
  AgpeyaHour,
} from '@/types';
import {
  SEED_PROFILES,
  SEED_REGISTRATIONS,
  SEED_SERMONS,
  SEED_NOTES,
  SEED_APPROVALS,
  SEED_MESSAGES,
  SEED_ERRORS,
  SEED_MONTHLY_ARCHIVES,
  SEED_COMMUNIONS,
  SEED_CONFESSIONS,
  getTodayDateString,
  getCurrentMonthKey,
  getDefaultDailyLog,
} from '@/lib/dataStore';
import {
  generate14DigitCode,
  clean14DigitCode,
  saveBiometricUserLink,
  removeBiometricUserLink,
  getBiometricLinkedUser,
  authenticateWithDeviceBiometrics,
} from '@/lib/biometrics';

interface AppContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  currentDailyLog: DailyHabitLog;
  sermons: Sermon[];
  servantNotes: ServantPrivateNote[];
  approvalRequests: ApprovalRequest[];
  registrationRequests: RegistrationRequest[];
  servantMessages: ServantMessage[];
  systemErrors: SystemErrorLog[];
  monthlyArchives: MonthlySacredIconArchive[];
  weeklyCommunions: WeeklyCommunionRecord[];
  monthlyConfessions: MonthlyConfessionRecord[];
  isOnline: boolean;
  syncStatus: 'synced' | 'pending_sync' | 'offline';
  isMounted: boolean;
  loginWithCode: (code: string) => { success: boolean; message?: string };
  loginWithBiometrics: () => Promise<{ success: boolean; message?: string }>;
  toggleBiometrics: (enabled: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (data: {
    userName: string;
    email: string;
    phone?: string;
    role: 'servant' | 'youth';
    assignedServantId?: string;
    churchGroup?: string;
  }) => { success: boolean; message: string; accessCode?: string };
  handleRegistrationDecision: (
    requestId: string,
    decision: 'approved' | 'rejected'
  ) => void;
  markTaskComplete: (
    taskType: HabitType,
    answer: string,
    questionId: string,
    timeSpentSeconds: number,
    questionText?: string,
    agpeyaHour?: AgpeyaHour
  ) => void;
  assignReadingPlanToYouth: (
    youthId: string,
    bookName: string,
    totalChapters: number
  ) => void;
  updateYouthAgpeyaHours: (youthId: string, hours: AgpeyaHour[]) => void;
  sendMessageToYouth: (
    youthId: string,
    title: string,
    content: string,
    type: 'reminder_bible' | 'reminder_task' | 'encouragement' | 'custom'
  ) => void;
  markMessageAsRead: (messageId: string) => void;
  recordWeeklyCommunion: (weekNumber: number, reflection?: string) => void;
  recordMonthlyConfession: (fatherName: string, reflection?: string) => void;
  reportErrorToAdmin: (source: string, errorMessage: string, details?: string) => void;
  resolveSystemError: (errorId: string) => void;
  getUserDailyLog: (userId: string) => DailyHabitLog;
  addSermon: (sermon: Omit<Sermon, 'id' | 'addedAt' | 'watchedByUserIds'>) => void;
  toggleSermonWatched: (sermonId: string) => void;
  addServantNote: (note: Omit<ServantPrivateNote, 'id' | 'createdAt'>) => void;
  submitApprovalRequest: (
    request: Omit<ApprovalRequest, 'id' | 'createdAt' | 'status'>
  ) => void;
  handleApprovalDecision: (
    requestId: string,
    status: 'approved' | 'rejected',
    reviewComment?: string
  ) => void;
  rotateServantsMonthly: () => void;
  reassignYouth: (youthId: string, servantId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'nota_users_v3',
  CURRENT_USER_ID: 'nota_current_user_id_v3',
  LOGS: 'nota_daily_logs_v3',
  SERMONS: 'nota_sermons_v3',
  NOTES: 'nota_servant_notes_v3',
  APPROVALS: 'nota_approvals_v3',
  REGISTRATIONS: 'nota_registrations_v3',
  MESSAGES: 'nota_messages_v3',
  ERRORS: 'nota_errors_v3',
  ARCHIVES: 'nota_archives_v3',
  COMMUNIONS: 'nota_communions_v3',
  CONFESSIONS: 'nota_confessions_v3',
};

const generateEntityId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending_sync' | 'offline'>('synced');

  // Users State
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_PROFILES;
  });

  // Current User ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Messages
  const [servantMessages, setServantMessages] = useState<ServantMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_MESSAGES;
  });

  // System Errors
  const [systemErrors, setSystemErrors] = useState<SystemErrorLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ERRORS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_ERRORS;
  });

  // Monthly Archives
  const [monthlyArchives] = useState<MonthlySacredIconArchive[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ARCHIVES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_MONTHLY_ARCHIVES;
  });

  // Weekly Communions
  const [weeklyCommunions, setWeeklyCommunions] = useState<WeeklyCommunionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMUNIONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_COMMUNIONS;
  });

  // Monthly Confessions
  const [monthlyConfessions, setMonthlyConfessions] = useState<MonthlyConfessionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFESSIONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_CONFESSIONS;
  });

  // Registration Requests
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_REGISTRATIONS;
  });

  // Daily Logs
  const today = getTodayDateString();
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyHabitLog>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      [`youth-1-${today}`]: getDefaultDailyLog('youth-1', today),
    };
  });

  // Sermons
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SERMONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_SERMONS;
  });

  // Servant Notes
  const [servantNotes, setServantNotes] = useState<ServantPrivateNote[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_NOTES;
  });

  // Approvals
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_APPROVALS;
  });

  // Mount effect to prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const savedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (savedUserId) {
        setCurrentUserId(savedUserId);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentUser = allUsers.find((u) => u.uid === currentUserId && u.status === 'active') || null;

  // Sync to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(servantMessages));
  }, [servantMessages, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.ERRORS, JSON.stringify(systemErrors));
  }, [systemErrors, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.COMMUNIONS, JSON.stringify(weeklyCommunions));
  }, [weeklyCommunions, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.CONFESSIONS, JSON.stringify(monthlyConfessions));
  }, [monthlyConfessions, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.SERMONS, JSON.stringify(sermons));
  }, [sermons, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(servantNotes));
  }, [servantNotes, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvalRequests));
  }, [approvalRequests, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrationRequests));
  }, [registrationRequests, isMounted]);

  // Online / Offline listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 14-Digit Code Login
  const loginWithCode = (rawInputCode: string): { success: boolean; message?: string } => {
    try {
      const cleanInput = clean14DigitCode(rawInputCode);
      if (cleanInput.length < 14) {
        return { success: false, message: 'الكود يجب أن يتكون من ١٤ رقماً.' };
      }

      const user = allUsers.find(
        (u) => clean14DigitCode(u.accessCode) === cleanInput
      );

      if (!user) {
        return { success: false, message: 'كود الدخول غير صحيح، يرجى التأكد من الـ ١٤ رقماً.' };
      }

      if (user.status === 'pending_approval') {
        const target = user.role === 'servant' ? 'أمين الخدمة' : 'خادمك المسؤول';
        return {
          success: false,
          message: `حسابك قيد المراجعة حالياً، بانتظار موافقة ${target} لتفعيل الحساب.`,
        };
      }

      if (user.status === 'rejected') {
        return { success: false, message: 'تم رفض طلب التسجيل من قِبل مسؤول الخدمة.' };
      }

      setCurrentUserId(user.uid);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('loginWithCode', message);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول.' };
    }
  };

  // Biometrics Login
  const loginWithBiometrics = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const linked = getBiometricLinkedUser();
      if (!linked) {
        return {
          success: false,
          message: 'لم يتم ربط البصمة بهذا الجهاز بعد. سجل دخولك بكود الـ ١٤ رقماً أولاً.',
        };
      }

      const authRes = await authenticateWithDeviceBiometrics();
      if (!authRes.success) {
        return { success: false, message: authRes.error || 'فشل التحقق من البصمة.' };
      }

      const user = allUsers.find((u) => u.uid === linked.userId && u.status === 'active');
      if (!user) {
        return { success: false, message: 'الحساب المرتبط بالبصمة غير متاح أو قيد المراجعة.' };
      }

      setCurrentUserId(user.uid);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('loginWithBiometrics', message);
      return { success: false, message: 'تعذر التحقق بالبصمة على هذا الجهاز.' };
    }
  };

  const toggleBiometrics = async (enabled: boolean): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'يجب تسجيل الدخول أولاً' };
    try {
      if (enabled) {
        saveBiometricUserLink(currentUser.uid, currentUser.accessCode);
        setAllUsers((prev) =>
          prev.map((u) => (u.uid === currentUser.uid ? { ...u, biometricEnabled: true } : u))
        );
        return { success: true, message: 'تم تفعيل الدخول ببصمة الهاتف بنجاح!' };
      } else {
        removeBiometricUserLink();
        setAllUsers((prev) =>
          prev.map((u) => (u.uid === currentUser.uid ? { ...u, biometricEnabled: false } : u))
        );
        return { success: true, message: 'تم إلغاء ربط البصمة.' };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('toggleBiometrics', message);
      return { success: false, message: 'تعذر تحديث إعدادات البصمة.' };
    }
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const registerUser = (data: {
    userName: string;
    email: string;
    phone?: string;
    role: 'servant' | 'youth';
    assignedServantId?: string;
    churchGroup?: string;
  }): { success: boolean; message: string; accessCode?: string } => {
    try {
      const generatedCode = generate14DigitCode();
      const newUserId = generateEntityId('user');
      const assignedServant = allUsers.find((u) => u.uid === data.assignedServantId);

      const newUser: UserProfile = {
        uid: newUserId,
        accessCode: generatedCode,
        email: data.email,
        displayName: data.userName,
        phone: data.phone,
        role: data.role,
        status: 'pending_approval',
        currentStreak: 0,
        totalTasksCompleted: 0,
        assignedServantId: data.role === 'youth' ? data.assignedServantId : undefined,
        assignedServantName: data.role === 'youth' ? assignedServant?.displayName : undefined,
        churchGroup: data.churchGroup || 'كنيسة السيدة العذراء بالإسماعيلية',
        assignedAgpeyaHours: ['baker', 'sleep'],
        assignedReading: data.role === 'youth' ? {
          bookId: 'malachi',
          bookName: 'سفر ملاخي',
          testament: 'old',
          totalChapters: 4,
          currentChapter: 1,
          isCompleted: false,
          assignedBy: data.assignedServantId || 'admin-1',
          assignedByName: assignedServant?.displayName || 'أمين الخدمة',
          assignedAt: new Date().toISOString().split('T')[0],
        } : undefined,
        createdAt: new Date().toISOString(),
      };

      const newRegistrationRequest: RegistrationRequest = {
        id: generateEntityId('reg'),
        userId: newUserId,
        accessCode: generatedCode,
        userName: data.userName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        assignedServantId: data.role === 'youth' ? data.assignedServantId : undefined,
        assignedServantName: data.role === 'youth' ? assignedServant?.displayName : undefined,
        targetApproverRole: data.role === 'servant' ? 'admin' : 'servant',
        targetApproverId: data.role === 'youth' ? data.assignedServantId : undefined,
        churchGroup: newUser.churchGroup,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setAllUsers((prev) => [...prev, newUser]);
      setRegistrationRequests((prev) => [newRegistrationRequest, ...prev]);

      const targetNotice = data.role === 'servant'
        ? 'تم إرسال طلبك لأمين الخدمة (Admin) للموافقة على تفعيل حساب الخادم.'
        : `تم إرسال طلبك للخادم المسؤول (${assignedServant?.displayName || 'خادمك'}) للموافقة والاعتماد.`;

      return {
        success: true,
        message: targetNotice,
        accessCode: generatedCode,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('registerUser', message);
      return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب.' };
    }
  };

  const handleRegistrationDecision = (
    requestId: string,
    decision: 'approved' | 'rejected'
  ) => {
    try {
      const req = registrationRequests.find((r) => r.id === requestId);
      if (!req) return;

      setRegistrationRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: decision } : r))
      );

      setAllUsers((prev) =>
        prev.map((u) => {
          if (u.uid === req.userId) {
            return {
              ...u,
              status: decision === 'approved' ? 'active' : 'rejected',
              approvedBy: currentUser?.displayName,
              approvedAt: new Date().toISOString(),
            };
          }
          if (req.role === 'youth' && decision === 'approved' && u.uid === req.assignedServantId) {
            const currentYouths = u.assignedYouthIds || [];
            return {
              ...u,
              assignedYouthIds: Array.from(new Set([...currentYouths, req.userId])),
            };
          }
          return u;
        })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('handleRegistrationDecision', message);
    }
  };

  const getUserDailyLog = (userId: string): DailyHabitLog => {
    const key = `${userId}-${today}`;
    return dailyLogs[key] || getDefaultDailyLog(userId, today);
  };

  const currentDailyLog = currentUser
    ? getUserDailyLog(currentUser.uid)
    : getDefaultDailyLog('anonymous', today);

  const markTaskComplete = (
    taskType: HabitType,
    answer: string,
    questionId: string,
    timeSpentSeconds: number,
    questionText?: string,
    agpeyaHour?: AgpeyaHour
  ) => {
    if (!currentUser) return;
    try {
      const logKey = `${currentUser.uid}-${today}`;
      const prevLog = dailyLogs[logKey] || getDefaultDailyLog(currentUser.uid, today);
      const wasAlreadyCompleted = prevLog.tasks[taskType]?.completed;

      const currentPlan = currentUser.assignedReading;
      const isBible = taskType === 'bible';

      const updatedTasks = {
        ...prevLog.tasks,
        [taskType]: {
          completed: true,
          completedAt: new Date().toISOString(),
          questionText,
          reflectionAnswer: answer,
          questionId,
          timeSpentSeconds,
          agpeyaHour,
          bookName: isBible ? currentPlan?.bookName : undefined,
          chapterNumber: isBible ? currentPlan?.currentChapter : undefined,
        },
      };

      const completedCount = Object.values(updatedTasks).filter((t) => t.completed).length;
      const shapeUnlocked = completedCount >= 4;

      const newLog: DailyHabitLog = {
        ...prevLog,
        tasks: updatedTasks,
        completedCount,
        shapeUnlocked,
        updatedAt: new Date().toISOString(),
      };

      setDailyLogs((prev) => ({
        ...prev,
        [logKey]: newLog,
      }));

      if (!wasAlreadyCompleted) {
        setAllUsers((prevUsers) =>
          prevUsers.map((u) => {
            if (u.uid === currentUser.uid) {
              let updatedPlan = u.assignedReading;

              if (isBible && updatedPlan && !updatedPlan.isCompleted) {
                const nextChapter = updatedPlan.currentChapter + 1;
                const hasFinishedBook = nextChapter > updatedPlan.totalChapters;
                updatedPlan = {
                  ...updatedPlan,
                  currentChapter: hasFinishedBook ? updatedPlan.totalChapters : nextChapter,
                  isCompleted: hasFinishedBook,
                };
              }

              return {
                ...u,
                totalTasksCompleted: u.totalTasksCompleted + 1,
                currentStreak: shapeUnlocked ? u.currentStreak + 1 : u.currentStreak,
                assignedReading: updatedPlan,
              };
            }
            return u;
          })
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('markTaskComplete', message);
    }
  };

  const assignReadingPlanToYouth = (
    youthId: string,
    bookName: string,
    totalChapters: number
  ) => {
    try {
      setAllUsers((prev) =>
        prev.map((u) => {
          if (u.uid === youthId) {
            return {
              ...u,
              assignedReading: {
                bookId: bookName.toLowerCase().replace(/\s+/g, '-'),
                bookName,
                testament: 'old',
                totalChapters,
                currentChapter: 1,
                isCompleted: false,
                assignedBy: currentUser?.uid || 'admin-1',
                assignedByName: currentUser?.displayName || 'الخادم',
                assignedAt: new Date().toISOString().split('T')[0],
              },
            };
          }
          return u;
        })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('assignReadingPlanToYouth', message);
    }
  };

  const updateYouthAgpeyaHours = (youthId: string, hours: AgpeyaHour[]) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === youthId ? { ...u, assignedAgpeyaHours: hours } : u))
    );
  };

  const sendMessageToYouth = (
    youthId: string,
    title: string,
    content: string,
    type: 'reminder_bible' | 'reminder_task' | 'encouragement' | 'custom'
  ) => {
    if (!currentUser) return;
    try {
      const youth = allUsers.find((u) => u.uid === youthId);
      const newMsg: ServantMessage = {
        id: generateEntityId('msg'),
        servantId: currentUser.uid,
        servantName: currentUser.displayName,
        youthId,
        youthName: youth?.displayName || 'المخدوم',
        messageType: type,
        title,
        content,
        sentAt: new Date().toISOString(),
        read: false,
      };
      setServantMessages((prev) => [newMsg, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      reportErrorToAdmin('sendMessageToYouth', message);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    setServantMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
    );
  };

  const recordWeeklyCommunion = (weekNumber: number, reflection?: string) => {
    if (!currentUser) return;
    const currentMonth = getCurrentMonthKey();
    const newRecord: WeeklyCommunionRecord = {
      id: `comm-${currentUser.uid}-${currentMonth}-w${weekNumber}`,
      userId: currentUser.uid,
      monthKey: currentMonth,
      weekNumber,
      completed: true,
      completedAt: new Date().toISOString(),
      churchName: 'كنيسة السيدة العذراء مريم بالإسماعيلية',
      reflection,
    };
    setWeeklyCommunions((prev) => [
      ...prev.filter((r) => !(r.userId === currentUser.uid && r.monthKey === currentMonth && r.weekNumber === weekNumber)),
      newRecord,
    ]);
  };

  const recordMonthlyConfession = (fatherName: string, reflection?: string) => {
    if (!currentUser) return;
    const currentMonth = getCurrentMonthKey();
    const newRecord: MonthlyConfessionRecord = {
      id: `conf-${currentUser.uid}-${currentMonth}`,
      userId: currentUser.uid,
      monthKey: currentMonth,
      completed: true,
      completedAt: new Date().toISOString(),
      fatherOfConfession: fatherName,
      reflection,
    };
    setMonthlyConfessions((prev) => [
      ...prev.filter((r) => !(r.userId === currentUser.uid && r.monthKey === currentMonth)),
      newRecord,
    ]);
  };

  const reportErrorToAdmin = (source: string, errorMessage: string, details?: string) => {
    const newError: SystemErrorLog = {
      id: `err-${Date.now()}`,
      userId: currentUser?.uid,
      userName: currentUser?.displayName || 'مستخدم غير مسجل',
      userRole: currentUser?.role || 'زائر',
      errorMessage: details ? `${errorMessage} - تفاصيل: ${details}` : errorMessage,
      source,
      timestamp: new Date().toISOString(),
      status: 'reported',
    };
    setSystemErrors((prev) => [newError, ...prev]);
  };

  const resolveSystemError = (errorId: string) => {
    setSystemErrors((prev) =>
      prev.map((e) => (e.id === errorId ? { ...e, status: 'resolved' } : e))
    );
  };

  const addSermon = (sermonData: Omit<Sermon, 'id' | 'addedAt' | 'watchedByUserIds'>) => {
    const newSermon: Sermon = {
      ...sermonData,
      id: `sermon-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
      watchedByUserIds: [],
    };
    setSermons((prev) => [newSermon, ...prev]);
  };

  const toggleSermonWatched = (sermonId: string) => {
    if (!currentUser) return;
    setSermons((prev) =>
      prev.map((s) => {
        if (s.id === sermonId) {
          const isWatched = s.watchedByUserIds.includes(currentUser.uid);
          const updatedWatched = isWatched
            ? s.watchedByUserIds.filter((id) => id !== currentUser.uid)
            : [...s.watchedByUserIds, currentUser.uid];
          return { ...s, watchedByUserIds: updatedWatched };
        }
        return s;
      })
    );
  };

  const addServantNote = (noteData: Omit<ServantPrivateNote, 'id' | 'createdAt'>) => {
    const newNote: ServantPrivateNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setServantNotes((prev) => [newNote, ...prev]);
  };

  const submitApprovalRequest = (
    reqData: Omit<ApprovalRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newReq: ApprovalRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setApprovalRequests((prev) => [newReq, ...prev]);
  };

  const handleApprovalDecision = (
    requestId: string,
    status: 'approved' | 'rejected',
    reviewComment?: string
  ) => {
    setApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status,
            reviewedBy: currentUser?.displayName,
            reviewedAt: new Date().toISOString(),
            reviewComment,
          };
        }
        return req;
      })
    );

    const req = approvalRequests.find((r) => r.id === requestId);
    if (req && status === 'approved') {
      if (req.type === 'streak_recovery' && req.suggestedData?.restoreDays) {
        setAllUsers((prevUsers) =>
          prevUsers.map((u) => {
            if (u.uid === req.youthId) {
              return {
                ...u,
                currentStreak: u.currentStreak + Number(req.suggestedData.restoreDays),
              };
            }
            return u;
          })
        );
      }
    }
  };

  const rotateServantsMonthly = () => {
    const servants = allUsers.filter((u) => u.role === 'servant' && u.status === 'active');
    const youths = allUsers.filter((u) => u.role === 'youth' && u.status === 'active');
    if (servants.length === 0 || youths.length === 0) return;

    const updatedYouths = youths.map((youth, idx) => {
      const assignedServant = servants[(idx + 1) % servants.length];
      return {
        ...youth,
        assignedServantId: assignedServant.uid,
        assignedServantName: assignedServant.displayName,
      };
    });

    setAllUsers((prev) =>
      prev.map((u) => {
        const found = updatedYouths.find((y) => y.uid === u.uid);
        if (found) return found;

        if (u.role === 'servant') {
          const youthsForThisServant = updatedYouths
            .filter((y) => y.assignedServantId === u.uid)
            .map((y) => y.uid);
          return {
            ...u,
            assignedYouthIds: youthsForThisServant,
          };
        }
        return u;
      })
    );
  };

  const reassignYouth = (youthId: string, servantId: string) => {
    const targetServant = allUsers.find((u) => u.uid === servantId);
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === youthId) {
          return {
            ...u,
            assignedServantId: servantId,
            assignedServantName: targetServant?.displayName,
          };
        }
        if (u.role === 'servant') {
          const currentYouths = u.assignedYouthIds || [];
          if (u.uid === servantId) {
            return {
              ...u,
              assignedYouthIds: Array.from(new Set([...currentYouths, youthId])),
            };
          } else {
            return {
              ...u,
              assignedYouthIds: currentYouths.filter((id) => id !== youthId),
            };
          }
        }
        return u;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        currentDailyLog,
        sermons,
        servantNotes,
        approvalRequests,
        registrationRequests,
        servantMessages,
        systemErrors,
        monthlyArchives,
        weeklyCommunions,
        monthlyConfessions,
        isOnline,
        syncStatus,
        isMounted,
        loginWithCode,
        loginWithBiometrics,
        toggleBiometrics,
        logout,
        registerUser,
        handleRegistrationDecision,
        markTaskComplete,
        assignReadingPlanToYouth,
        updateYouthAgpeyaHours,
        sendMessageToYouth,
        markMessageAsRead,
        recordWeeklyCommunion,
        recordMonthlyConfession,
        reportErrorToAdmin,
        resolveSystemError,
        getUserDailyLog,
        addSermon,
        toggleSermonWatched,
        addServantNote,
        submitApprovalRequest,
        handleApprovalDecision,
        rotateServantsMonthly,
        reassignYouth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
