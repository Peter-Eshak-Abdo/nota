'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserProfile,
  DailyHabitLog,
  Sermon,
  ServantPrivateNote,
  ApprovalRequest,
  RegistrationRequest,
  HabitType,
  UserRole,
} from '@/types';
import {
  SEED_PROFILES,
  SEED_REGISTRATIONS,
  SEED_SERMONS,
  SEED_NOTES,
  SEED_APPROVALS,
  getTodayDateString,
  getDefaultDailyLog,
} from '@/lib/dataStore';

interface AppContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  currentDailyLog: DailyHabitLog;
  sermons: Sermon[];
  servantNotes: ServantPrivateNote[];
  approvalRequests: ApprovalRequest[];
  registrationRequests: RegistrationRequest[];
  isOnline: boolean;
  syncStatus: 'synced' | 'pending_sync' | 'offline';
  login: (email: string) => { success: boolean; message?: string };
  quickDemoLogin: (role: UserRole, uid?: string) => void;
  switchUser: (uid: string) => void;
  logout: () => void;
  registerUser: (data: {
    userName: string;
    email: string;
    phone?: string;
    role: 'servant' | 'youth';
    assignedServantId?: string;
    churchGroup?: string;
  }) => { success: boolean; message: string };
  handleRegistrationDecision: (
    requestId: string,
    decision: 'approved' | 'rejected'
  ) => void;
  markTaskComplete: (
    taskType: HabitType,
    answer: string,
    questionId: string,
    timeSpentSeconds: number,
    questionText?: string
  ) => void;
  assignReadingPlanToYouth: (
    youthId: string,
    bookName: string,
    totalChapters: number
  ) => void;
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
  setYouthStreakDirectly: (streakCount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'nota_users_v2',
  CURRENT_USER_ID: 'nota_current_user_id_v2',
  LOGS: 'nota_daily_logs_v2',
  SERMONS: 'nota_sermons_v2',
  NOTES: 'nota_servant_notes_v2',
  APPROVALS: 'nota_approvals_v2',
  REGISTRATIONS: 'nota_registrations_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending_sync' | 'offline'>('synced');

  // All Users
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

  // Current Logged in User ID (null means auth screen is shown)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (saved) return saved;
    }
    return null; // Require login upon entry!
  });

  const currentUser = allUsers.find((u) => u.uid === currentUserId && u.status === 'active') || null;

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

  // Persistence effects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SERMONS, JSON.stringify(sermons));
  }, [sermons]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(servantNotes));
  }, [servantNotes]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvalRequests));
  }, [approvalRequests]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrationRequests));
  }, [registrationRequests]);

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
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const login = (email: string): { success: boolean; message?: string } => {
    const user = allUsers.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (!user) {
      return { success: false, message: 'البريد الإلكتروني غير مسجل بالنظام.' };
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
  };

  const quickDemoLogin = (role: UserRole, uid?: string) => {
    if (uid) {
      setCurrentUserId(uid);
      return;
    }
    const defaultForRole: Record<UserRole, string> = {
      youth: 'youth-1',
      servant: 'servant-1',
      admin: 'admin-1',
    };
    setCurrentUserId(defaultForRole[role]);
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
  }): { success: boolean; message: string } => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'البريد الإلكتروني مسجل بالفعل!' };
    }

    const newUserId = `user-${Date.now()}`;
    const assignedServant = allUsers.find((u) => u.uid === data.assignedServantId);

    const newUser: UserProfile = {
      uid: newUserId,
      email: data.email,
      displayName: data.userName,
      phone: data.phone,
      role: data.role,
      status: 'pending_approval',
      currentStreak: 0,
      totalTasksCompleted: 0,
      assignedServantId: data.role === 'youth' ? data.assignedServantId : undefined,
      assignedServantName: data.role === 'youth' ? assignedServant?.displayName : undefined,
      churchGroup: data.churchGroup || 'شباب كنيسة العذراء بالإسماعيلية',
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
      id: `reg-${Date.now()}`,
      userId: newUserId,
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
    };
  };

  const handleRegistrationDecision = (
    requestId: string,
    decision: 'approved' | 'rejected'
  ) => {
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
        // If approved youth, add to servant's assignedYouthIds
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
    questionText?: string
  ) => {
    if (!currentUser) return;
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

    // Update user stats, reading progress & streak
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
  };

  const assignReadingPlanToYouth = (
    youthId: string,
    bookName: string,
    totalChapters: number
  ) => {
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

  const setYouthStreakDirectly = (streakCount: number) => {
    if (!currentUser) return;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === currentUser.uid) {
          return { ...u, currentStreak: streakCount };
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
        isOnline,
        syncStatus,
        login,
        quickDemoLogin,
        switchUser: (uid: string) => setCurrentUserId(uid),
        logout,
        registerUser,
        handleRegistrationDecision,
        markTaskComplete,
        assignReadingPlanToYouth,
        getUserDailyLog,
        addSermon,
        toggleSermonWatched,
        addServantNote,
        submitApprovalRequest,
        handleApprovalDecision,
        rotateServantsMonthly,
        reassignYouth,
        setYouthStreakDirectly,
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
