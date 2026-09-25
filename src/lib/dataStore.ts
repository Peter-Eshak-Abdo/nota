import {
  UserProfile,
  DailyHabitLog,
  Sermon,
  ServantPrivateNote,
  ApprovalRequest,
  RegistrationRequest,
} from '@/types';

export const SEED_PROFILES: UserProfile[] = [
  {
    uid: 'admin-1',
    email: 'admin@nota.church',
    displayName: 'أ. بيتر إسحق',
    role: 'admin',
    status: 'active',
    currentStreak: 45,
    totalTasksCompleted: 180,
    churchGroup: 'أمانة الخدمة - كنيسة العذراء بالإسماعيلية',
    createdAt: '2026-01-01',
  },
  {
    uid: 'servant-1',
    email: 'mina.servant@nota.church',
    displayName: 'الخادم مينا أشرف',
    role: 'servant',
    status: 'active',
    assignedYouthIds: ['youth-1', 'youth-2'],
    currentStreak: 28,
    totalTasksCompleted: 112,
    churchGroup: 'فصل أولى ثانوي بنين',
    createdAt: '2026-01-15',
  },
  {
    uid: 'servant-2',
    email: 'david.servant@nota.church',
    displayName: 'الخادم ديفيد يوسف',
    role: 'servant',
    status: 'active',
    assignedYouthIds: ['youth-3'],
    currentStreak: 19,
    totalTasksCompleted: 76,
    churchGroup: 'فصل ثانية ثانوي بنين',
    createdAt: '2026-02-01',
  },
  {
    uid: 'youth-1',
    email: 'fady.youth@nota.church',
    displayName: 'فادي جورج',
    role: 'youth',
    status: 'active',
    assignedServantId: 'servant-1',
    assignedServantName: 'الخادم مينا أشرف',
    currentStreak: 24, // 24 days streak
    totalTasksCompleted: 87,
    churchGroup: 'أولى ثانوي ب',
    assignedReading: {
      bookId: 'malachi',
      bookName: 'سفر ملاخي',
      testament: 'old',
      totalChapters: 4,
      currentChapter: 1, // Currently on chapter 1
      isCompleted: false,
      assignedBy: 'servant-1',
      assignedByName: 'الخادم مينا أشرف',
      assignedAt: '2026-09-20',
    },
    createdAt: '2026-02-10',
  },
  {
    uid: 'youth-2',
    email: 'kirollos.youth@nota.church',
    displayName: 'كيرلس عادل',
    role: 'youth',
    status: 'active',
    assignedServantId: 'servant-1',
    assignedServantName: 'الخادم مينا أشرف',
    currentStreak: 12,
    totalTasksCompleted: 48,
    churchGroup: 'أولى ثانوي ب',
    assignedReading: {
      bookId: 'jonah',
      bookName: 'سفر يونان',
      testament: 'old',
      totalChapters: 4,
      currentChapter: 4,
      isCompleted: true, // Completed! Needs a new book assignment!
      assignedBy: 'servant-1',
      assignedByName: 'الخادم مينا أشرف',
      assignedAt: '2026-09-15',
    },
    createdAt: '2026-02-12',
  },
  {
    uid: 'youth-3',
    email: 'mariam.youth@nota.church',
    displayName: 'مريم سامح',
    role: 'youth',
    status: 'active',
    assignedServantId: 'servant-2',
    assignedServantName: 'الخادم ديفيد يوسف',
    currentStreak: 21,
    totalTasksCompleted: 65,
    churchGroup: 'ثانية ثانوي بنات',
    assignedReading: {
      bookId: 'ephesians',
      bookName: 'رسالة أفسس',
      testament: 'new',
      totalChapters: 6,
      currentChapter: 3,
      isCompleted: false,
      assignedBy: 'servant-2',
      assignedByName: 'الخادم ديفيد يوسف',
      assignedAt: '2026-09-18',
    },
    createdAt: '2026-02-14',
  },
];

export const SEED_REGISTRATIONS: RegistrationRequest[] = [
  {
    id: 'reg-servant-1',
    userId: 'pending-servant-1',
    userName: 'بيشوي كمال',
    email: 'bishoy.k@gmail.com',
    phone: '01223344556',
    role: 'servant',
    targetApproverRole: 'admin',
    churchGroup: 'خدمة ثانوي - بنين',
    status: 'pending',
    createdAt: '2026-09-25T14:00:00Z',
  },
  {
    id: 'reg-youth-1',
    userId: 'pending-youth-1',
    userName: 'يوحنا مجدي',
    email: 'yohanna.m@gmail.com',
    phone: '01011223344',
    role: 'youth',
    assignedServantId: 'servant-1',
    assignedServantName: 'الخادم مينا أشرف',
    targetApproverRole: 'servant',
    targetApproverId: 'servant-1',
    churchGroup: 'أولى ثانوي',
    status: 'pending',
    createdAt: '2026-09-25T16:30:00Z',
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
    content: 'فادي منتظم جداً في قراءة سفر ملاخي لكن يحتاج تشجيع في حضور القداسات المبكرة.',
    createdAt: '2026-09-23T14:30:00Z',
  },
  {
    id: 'note-2',
    youthId: 'youth-2',
    youthName: 'كيرلس عادل',
    servantId: 'servant-1',
    servantName: 'الخادم مينا أشرف',
    category: 'academic',
    content: 'أتم قراءة سفر يونان بنجاح، يحتاج تحديد سفر جديد مثل رسالة يعقوب وتخفيف وقت الهاتف.',
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
  const isFady = userId === 'youth-1';
  return {
    id: `log-${userId}-${dateString}`,
    userId,
    dateString,
    tasks: {
      bible: {
        completed: isFady,
        completedAt: isFady ? `${dateString}T08:30:00Z` : undefined,
        bookName: isFady ? 'سفر ملاخي' : undefined,
        chapterNumber: isFady ? 1 : undefined,
        questionText: isFady
          ? 'في الأصحاح الأول يعاتب الرب شعبه: «إِنْ كُنْتُ أَنَا أَبًا فَأَيْنَ كَرَامَتِي؟» ويذكر تقديم ذبائح معيبة. كيف تقدم اليوم لله في حياتك أفضل ما لديك؟'
          : undefined,
        reflectionAnswer: isFady
          ? 'أقدم لله أفضل ما عندي بأن أخصص له أول نصف ساعة من يومي بكامل نشاطي قبل فتح مواقع التواصل.'
          : undefined,
        timeSpentSeconds: isFady ? 42 : undefined,
      },
      prayer: {
        completed: isFady,
        completedAt: isFady ? `${dateString}T08:45:00Z` : undefined,
        questionText: isFady ? 'في وقفتك أمام الله، ما هي أكثر طلبة في مزمور الساعات التي لمست قلبك؟' : undefined,
        reflectionAnswer: isFady ? 'طلبت من قلبي السلام في الامتحانات وأن يعطيني الرب حكمة في دراستي.' : undefined,
        timeSpentSeconds: isFady ? 35 : undefined,
      },
      communion: { completed: false },
      confession: { completed: false },
    },
    shapeUnlocked: false,
    completedCount: isFady ? 2 : 0,
    totalTarget: 4,
    updatedAt: new Date().toISOString(),
  };
}
