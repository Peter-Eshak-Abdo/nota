export type UserRole = 'admin' | 'servant' | 'youth';
export type UserStatus = 'active' | 'pending_approval' | 'rejected';

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
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  assignedServantId?: string; // For youth: which servant is currently mentoring them
  assignedServantName?: string;
  assignedYouthIds?: string[]; // For servant: list of youths under their care
  churchGroup?: string;
  currentStreak: number;
  totalTasksCompleted: number;
  assignedReading?: AssignedReadingPlan;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export type HabitType = 'bible' | 'prayer' | 'communion' | 'confession';

export interface HabitTaskConfig {
  id: HabitType;
  title: string;
  subtitle: string;
  iconName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  requiredReflection: boolean;
  color: string;
}

export interface AntiCheatQuestion {
  id: string;
  habitType: HabitType;
  topic: string;
  situationalPrompt: string;
  timeLimitSeconds: number; // 60 to 90 seconds comfortable grace period
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
  suggestedData: Record<string, any>;
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
  role: 'servant' | 'youth';
  assignedServantId?: string;
  assignedServantName?: string;
  targetApproverRole: 'admin' | 'servant';
  targetApproverId?: string; // specific servant uid for youth, or null for admin
  churchGroup?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface OfflineAction {
  id: string;
  type: 'log_task' | 'submit_reflection' | 'add_note' | 'request_approval';
  payload: any;
  timestamp: number;
}
