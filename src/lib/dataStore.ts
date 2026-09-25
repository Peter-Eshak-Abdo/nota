import {
  UserProfile,
  DailyHabitLog,
  Sermon,
  ServantPrivateNote,
  ApprovalRequest,
  HabitType,
  OfflineAction,
} from '@/types';

export const SEED_PROFILES: UserProfile[] = [
  {
    uid: 'admin-1',
    email: 'admin@nota.church',
    displayName: 'أ. بيتر إسحق (أمين الخدمة)',
    role: 'admin',
    currentStreak: 45,
    totalTasksCompleted: 180,
    churchGroup: 'أسرة القديس أثناسيوس الرسولي',
    createdAt: '2026-01-01',
  },
  {
    uid: 'servant-1',
    email: 'mina.servant@nota.church',
    displayName: 'الخادم مينا أشرف',
    role: 'servant',
    assignedYouthIds: ['youth-1', 'youth-2'],
    currentStreak: 28,
    totalTasksCompleted: 112,
    churchGroup: 'فصل أولى وثانية ثانوي',
    createdAt: '2026-01-15',
  },
  {
    uid: 'servant-2',
    email: 'david.servant@nota.church',
    displayName: 'الخادم ديفيد يوسف',
    role: 'servant',
    assignedYouthIds: ['youth-3'],
    currentStreak: 19,
    totalTasksCompleted: 76,
    churchGroup: 'فصل ثالثة ثانوي',
    createdAt: '2026-02-01',
  },
  {
    uid: 'youth-1',
    email: 'fady.youth@nota.church',
    displayName: 'فادي جورج',
    role: 'youth',
    assignedServantId: 'servant-1',
    currentStreak: 29, // One day away from the 30-day milestone!
    totalTasksCompleted: 87,
    churchGroup: 'أولى ثانوي ب',
    createdAt: '2026-02-10',
  },
  {
    uid: 'youth-2',
    email: 'kirollos.youth@nota.church',
    displayName: 'كيرلس عادل',
    role: 'youth',
    assignedServantId: 'servant-1',
    currentStreak: 12,
    totalTasksCompleted: 48,
    churchGroup: 'أولى ثانوي ب',
    createdAt: '2026-02-12',
  },
  {
    uid: 'youth-3',
    email: 'mariam.youth@nota.church',
    displayName: 'مريم سامح',
    role: 'youth',
    assignedServantId: 'servant-2',
    currentStreak: 21,
    totalTasksCompleted: 65,
    churchGroup: 'ثانية ثانوي بنات',
    createdAt: '2026-02-14',
  },
];

export const SEED_SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
    title: 'كيف تبني عادة روحية لا تنكسر؟ (العادات الذرية والروحية)',
    speaker: 'أبونا داود لمعي',
    description: 'عظة عملية عن خطوات اكتساب وتثبيت عادة الصلاة وقراءة الكتاب المقدس اليومية.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    targetType: 'all',
    addedBy: 'admin-1',
    addedByName: 'أ. بيتر إسحق',
    addedAt: '2026-09-20',
    watchedByUserIds: ['youth-1'],
  },
  {
    id: 'sermon-2',
    title: 'الانتصار على فتور الصلاة والتشويش',
    speaker: 'أبونا بولس جورج',
    description: 'كيف تحافظ على تركيزك أثناء الأجبية ومحاربة الأفكار الغريبة والكسل.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    targetType: 'all',
    addedBy: 'servant-1',
    addedByName: 'الخادم مينا أشرف',
    addedAt: '2026-09-22',
    watchedByUserIds: [],
  },
  {
    id: 'sermon-3',
    title: 'تداريب مقدسة لشباب ثانوي في مواجهة الضغوط',
    speaker: 'قداسة البابا شنودة الثالث',
    description: 'توجيهات روحية وإرشادات لتنظيم الوقت والسلام الداخلي وسط الامتحانات.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    targetType: 'specific',
    targetYouthIds: ['youth-1', 'youth-2'],
    addedBy: 'servant-1',
    addedByName: 'الخادم مينا أشرف',
    addedAt: '2026-09-24',
    watchedByUserIds: [],
  },
];

export const SEED_NOTES: ServantPrivateNote[] = [
  {
    id: 'note-1',
    youthId: 'youth-1',
    youthName: 'فادي جورج',
    servantId: 'servant-1',
    servantName: 'الخادم مينا أشرف',
    category: 'spiritual',
    content: 'فادي منتظم جداً في قراءة الإنجيل لكن يحتاج تشجيع في حضور القداسات المبكرة.',
    createdAt: '2026-09-23T14:30:00Z',
  },
  {
    id: 'note-2',
    youthId: 'youth-2',
    youthName: 'كيرلس عادل',
    servantId: 'servant-1',
    servantName: 'الخادم مينا أشرف',
    category: 'academic',
    content: 'لديه ضغط امتحانات فيزياء، اتفقنا على صلاة باكر ٥ دقائق فقط لتخفيف العبء.',
    createdAt: '2026-09-24T18:00:00Z',
  },
];

export const SEED_APPROVALS: ApprovalRequest[] = [
  {
    id: 'req-1',
    servantId: 'servant-1',
    servantName: 'الخادم مينا أشرف',
    youthId: 'youth-2',
    youthName: 'كيرلس عادل',
    type: 'streak_recovery',
    reason: 'كان مسافراً مع أسرته دون إنترنت ويرغب في استعادة يومين بالسلسلة بعد أداء التدريب التعويضي.',
    suggestedData: { restoreDays: 2 },
    status: 'pending',
    createdAt: '2026-09-24T19:30:00Z',
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
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
