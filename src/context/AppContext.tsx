'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserProfile,
  DailyHabitLog,
  Sermon,
  ServantPrivateNote,
  ApprovalRequest,
  HabitType,
  OfflineAction,
  UserRole,
} from '@/types';
import {
  SEED_PROFILES,
  SEED_SERMONS,
  SEED_NOTES,
  SEED_APPROVALS,
  getTodayDateString,
  getDefaultDailyLog,
} from '@/lib/dataStore';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  currentDailyLog: DailyHabitLog;
  sermons: Sermon[];
  servantNotes: ServantPrivateNote[];
  approvalRequests: ApprovalRequest[];
  isOnline: boolean;
  syncStatus: 'synced' | 'pending_sync' | 'offline';
  switchUser: (uid: string) => void;
  markTaskComplete: (
    taskType: HabitType,
    answer: string,
    questionId: string,
    timeSpentSeconds: number
  ) => void;
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
  USERS: 'nota_users_v1',
  CURRENT_USER_ID: 'nota_current_user_id_v1',
  LOGS: 'nota_daily_logs_v1',
  SERMONS: 'nota_sermons_v1',
  NOTES: 'nota_servant_notes_v1',
  APPROVALS: 'nota_approvals_v1',
  OFFLINE_QUEUE: 'nota_offline_queue_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending_sync' | 'offline'>('synced');
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);

  // Users state
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return SEED_PROFILES;
  });

  // Current active user (default is youth-1 to experience the youth PWA immediately)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (saved) return saved;
    }
    return 'youth-1';
  });

  const currentUser = allUsers.find((u) => u.uid === currentUserId) || allUsers[0];

  // Daily Logs
  const today = getTodayDateString();
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyHabitLog>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      [`youth-1-${today}`]: getDefaultDailyLog('youth-1', today),
    };
  });

  const logKey = `${currentUser.uid}-${today}`;
  const currentDailyLog = dailyLogs[logKey] || getDefaultDailyLog(currentUser.uid, today);

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

  // Network listener & offline queue processing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      // Simulate sync with cloud / Firebase
      if (offlineQueue.length > 0) {
        setSyncStatus('pending_sync');
        setTimeout(() => {
          setOfflineQueue([]);
          localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
          setSyncStatus('synced');
        }, 1200);
      } else {
        setSyncStatus('synced');
      }
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
  }, [offlineQueue]);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
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

  const recordOfflineAction = (action: OfflineAction) => {
    const updated = [...offlineQueue, action];
    setOfflineQueue(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(updated));
    }
    if (!isOnline) {
      setSyncStatus('offline');
    }
  };

  const switchUser = (uid: string) => {
    setCurrentUserId(uid);
  };

  const markTaskComplete = (
    taskType: HabitType,
    answer: string,
    questionId: string,
    timeSpentSeconds: number
  ) => {
    const prevLog = dailyLogs[logKey] || getDefaultDailyLog(currentUser.uid, today);
    const wasAlreadyCompleted = prevLog.tasks[taskType]?.completed;

    const updatedTasks = {
      ...prevLog.tasks,
      [taskType]: {
        completed: true,
        completedAt: new Date().toISOString(),
        reflectionAnswer: answer,
        questionId,
        timeSpentSeconds,
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

    // Update user stats and streak if newly completed all 4 tasks
    if (!wasAlreadyCompleted) {
      setAllUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.uid === currentUser.uid) {
            const newTasksTotal = u.totalTasksCompleted + 1;
            const newStreak = shapeUnlocked ? u.currentStreak + 1 : u.currentStreak;
            return {
              ...u,
              totalTasksCompleted: newTasksTotal,
              currentStreak: newStreak,
            };
          }
          return u;
        })
      );
    }

    recordOfflineAction({
      id: `act-${Date.now()}`,
      type: 'log_task',
      payload: { userId: currentUser.uid, date: today, taskType, answer },
      timestamp: Date.now(),
    });
  };

  const addSermon = (sermonData: Omit<Sermon, 'id' | 'addedAt' | 'watchedByUserIds'>) => {
    const newSermon: Sermon = {
      ...sermonData,
      id: `sermon-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
      watchedByUserIds: [],
    };
    setSermons((prev) => [newSermon, ...prev]);

    recordOfflineAction({
      id: `act-${Date.now()}`,
      type: 'add_note',
      payload: newSermon,
      timestamp: Date.now(),
    });
  };

  const toggleSermonWatched = (sermonId: string) => {
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

    recordOfflineAction({
      id: `act-${Date.now()}`,
      type: 'add_note',
      payload: newNote,
      timestamp: Date.now(),
    });
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

    recordOfflineAction({
      id: `act-${Date.now()}`,
      type: 'request_approval',
      payload: newReq,
      timestamp: Date.now(),
    });
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
            reviewedBy: currentUser.displayName,
            reviewedAt: new Date().toISOString(),
            reviewComment,
          };
        }
        return req;
      })
    );

    // If approved, apply the suggested action
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

  // Monthly Servant Rotation Feature (Admin capability)
  const rotateServantsMonthly = () => {
    const servants = allUsers.filter((u) => u.role === 'servant');
    const youths = allUsers.filter((u) => u.role === 'youth');
    if (servants.length === 0 || youths.length === 0) return;

    // Shift rotation: reassign each youth to the next servant in round-robin fashion
    const updatedYouths = youths.map((youth, idx) => {
      const assignedServant = servants[(idx + 1) % servants.length];
      return {
        ...youth,
        assignedServantId: assignedServant.uid,
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
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === youthId) {
          return { ...u, assignedServantId: servantId };
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
        isOnline,
        syncStatus,
        switchUser,
        markTaskComplete,
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
