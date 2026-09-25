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
} from '@/types';

export const SEED_PROFILES: UserProfile[] = [
  {
    uid: 'admin-1',
    accessCode: '',
    email: 'admin@nota.church',
    displayName: 'أ. بيتر إسحاق',
    role: 'admin',
    status: 'active',
    currentStreak: 0,
    totalTasksCompleted: 0,
    churchGroup: 'أمانة الخدمة - كنيسة السيدة العذراء مريم بالإسماعيلية',
    createdAt: '2026-09-25',
  },
];

export const SEED_SERMONS: Sermon[] = [];
export const SEED_NOTES: ServantPrivateNote[] = [];
export const SEED_MESSAGES: ServantMessage[] = [];
export const SEED_ERRORS: SystemErrorLog[] = [];
export const SEED_MONTHLY_ARCHIVES: MonthlySacredIconArchive[] = [];
export const SEED_COMMUNIONS: WeeklyCommunionRecord[] = [];
export const SEED_CONFESSIONS: MonthlyConfessionRecord[] = [];
export const SEED_REGISTRATIONS: RegistrationRequest[] = [];
export const SEED_APPROVALS: ApprovalRequest[] = [];

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return now.toISOString().slice(0, 7); // YYYY-MM
}

export function getDefaultDailyLog(userId: string, dateString: string): DailyHabitLog {
  return {
    id: `log-${userId}-${dateString}`,
    userId,
    dateString,
    tasks: {
      bible: { completed: false },
      prayer: { completed: false },
      communion: { completed: false },
      confession: { completed: false },
    },
    shapeUnlocked: false,
    completedCount: 0,
    totalTarget: 4,
    updatedAt: new Date().toISOString(),
  };
}
