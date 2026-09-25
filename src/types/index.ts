export type UserRole = 'admin' | 'servant' | 'youth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  assignedServantId?: string; // For youth: which servant is currently mentoring them
  assignedYouthIds?: string[]; // For servant: list of youths under their care
  churchGroup?: string;
  currentStreak: number;
  totalTasksCompleted: number;
  createdAt: string;
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
  timeLimitSeconds: number; // Programmatically determined (e.g. 20-35s)
  exampleStarter: string;
  minWordCount: number;
}

export interface TaskCompletionRecord {
  completed: boolean;
  completedAt?: string;
  reflectionAnswer?: string;
  questionId?: string;
  timeSpentSeconds?: number;
  verifiedByServant?: boolean;
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
  type: 'edit_profile' | 'task_adjustment' | 'streak_recovery';
  reason: string;
  suggestedData: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export interface OfflineAction {
  id: string;
  type: 'log_task' | 'submit_reflection' | 'add_note' | 'request_approval';
  payload: any;
  timestamp: number;
}
