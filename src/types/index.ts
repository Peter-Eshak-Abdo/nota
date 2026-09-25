export type UserRole = 'admin' | 'servant' | 'youth';
export type UserStatus = 'active' | 'pending_approval' | 'rejected';

export type AgpeyaHour =
  | 'baker'       // صلاة باكر
  | 'third'       // صلاة الساعة الثالثة
  | 'sixth'       // صلاة الساعة السادسة
  | 'ninth'       // صلاة الساعة التاسعة
  | 'sunset'      // صلاة الغروب
  | 'sleep'       // صلاة النوم
  | 'midnight';   // صلاة نصف الليل

export interface AssignedReadingPlan {
  bookId: string;
  bookName: string; // e.g. "سفر ملاخي"
  testament: 'old' | 'new';
  totalChapters: number;
  currentChapter: number;
  isCompleted: boolean;
  assignedBy: string;
  assignedByName: string;
  assignedAt: string;
}

export interface UserProfile {
  uid: string;
  accessCode: string; // 14-digit secure code
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  biometricEnabled?: boolean;
  assignedServantId?: string; // For youth
  assignedServantName?: string;
  assignedYouthIds?: string[]; // For servant
  churchGroup?: string;
  currentStreak: number;
  totalTasksCompleted: number;
  assignedReading?: AssignedReadingPlan;
  assignedAgpeyaHours?: AgpeyaHour[]; // Specific hours assigned (e.g. baker + sleep)
  confessionMonthlyTarget?: number; // 1 per month
  communionWeeklyTarget?: number; // 1 per week
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export type HabitType = 'bible' | 'prayer' | 'communion' | 'confession';

export interface AntiCheatQuestion {
  id: string;
  habitType: HabitType;
  topic: string;
  situationalPrompt: string;
  timeLimitSeconds: number; // 75 to 90 seconds
  exampleStarter: string;
  minWordCount: number;
  bookName?: string;
  chapter?: number;
}

export interface TaskCompletionRecord {
  completed: boolean;
  completedAt?: string;
  questionText?: string;
  reflectionAnswer?: string;
  questionId?: string;
  timeSpentSeconds?: number;
  chapterNumber?: number;
  bookName?: string;
  agpeyaHour?: AgpeyaHour;
  servantFeedback?: string;
}

export interface DailyHabitLog {
  id: string;
  userId: string;
  dateString: string; // YYYY-MM-DD
  tasks: Record<HabitType, TaskCompletionRecord>;
  shapeUnlocked: boolean;
  completedCount: number;
  totalTarget: number;
  updatedAt: string;
}

export interface WeeklyCommunionRecord {
  id: string;
  userId: string;
  monthKey: string; // YYYY-MM
  weekNumber: number; // 1 to 5
  completed: boolean;
  completedAt?: string;
  churchName?: string;
  reflection?: string;
}

export interface MonthlyConfessionRecord {
  id: string;
  userId: string;
  monthKey: string; // YYYY-MM
  completed: boolean;
  completedAt?: string;
  fatherOfConfession?: string;
  reflection?: string;
}

export interface MonthlySacredIconArchive {
  id: string;
  userId: string;
  monthKey: string; // YYYY-MM
  monthNameArabic: string; // "سبتمبر ٢٠٢٦"
  iconTitle: string;
  iconType: 'coptic_cross' | 'eucharist_chalice' | 'repentance_dove' | 'pantocrator';
  completedDays: number;
  totalDays: number;
  isFullyRevealed: boolean;
  archivedAt: string;
}

export interface ServantMessage {
  id: string;
  servantId: string;
  servantName: string;
  youthId: string;
  youthName: string;
  messageType: 'reminder_bible' | 'reminder_task' | 'encouragement' | 'custom';
  title: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface SystemErrorLog {
  id: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  errorMessage: string;
  errorStack?: string;
  source: string;
  contextData?: Record<string, unknown>;
  timestamp: string;
  status: 'reported' | 'investigating' | 'resolved';
}

export interface OfflineAction {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  targetType: 'all' | 'specific';
  targetYouthIds?: string[];
  addedBy: string;
  addedByName: string;
  addedAt: string;
  watchedByUserIds: string[];
}

export interface ServantPrivateNote {
  id: string;
  youthId: string;
  youthName: string;
  servantId: string;
  servantName: string;
  category: 'spiritual' | 'social' | 'academic' | 'urgent';
  content: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  servantId: string;
  servantName: string;
  youthId: string;
  youthName: string;
  type: 'edit_profile' | 'task_adjustment' | 'streak_recovery' | 'user_registration';
  reason: string;
  suggestedData: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export interface RegistrationRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  accessCode: string;
  role: 'servant' | 'youth';
  assignedServantId?: string;
  assignedServantName?: string;
  targetApproverRole: 'admin' | 'servant';
  targetApproverId?: string;
  churchGroup?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
