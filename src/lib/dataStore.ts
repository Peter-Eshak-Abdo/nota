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
    accessCode: '99018421736510',
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
    accessCode: '77235190448231',
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
    accessCode: '88346201559342',
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
    accessCode: '10482951830492',
    email: 'fady.youth@nota.church',
    displayName: 'فادي جورج',
    role: 'youth',
    status: 'active',
    assignedServantId: 'servant-1',
    assignedServantName: 'الخادم مينا أشرف',
    currentStreak: 24,
    totalTasksCompleted: 87,
    churchGroup: 'أولى ثانوي ب',
    assignedAgpeyaHours: ['baker', 'sunset', 'sleep'],
    assignedReading: {
      bookId: 'malachi',
      bookName: 'سفر ملاخي',
      testament: 'old',
      totalChapters: 4,
      currentChapter: 1,
      isCompleted: false,
      assignedBy: 'servant-1',
      assignedByName: 'الخادم مينا أشرف',
      assignedAt: '2026-09-20',
    },
    createdAt: '2026-02-10',
  },
  {
    uid: 'youth-2',
    accessCode: '20394810572988',
    email: 'kirollos.youth@nota.church',
    displayName: 'كيرلس عادل',
    role: 'youth',
    status: 'active',
    assignedServantId: 'servant-1',
    assignedServantName: 'الخادم مينا أشرف',
    currentStreak: 12,
    totalTasksCompleted: 48,
    churchGroup: 'أولى ثانوي ب',
    assignedAgpeyaHours: ['baker', 'sleep'],
    assignedReading: {
      bookId: 'jonah',
      bookName: 'سفر يونان',
      testament: 'old',
      totalChapters: 4,
      currentChapter: 4,
      isCompleted: true,
      assignedBy: 'servant-1',
      assignedByName: 'الخادم مينا أشرف',
      assignedAt: '2026-09-15',
    },
    createdAt: '2026-02-12',
  },
  {
    uid: 'youth-3',
    accessCode: '30495821683077',
    email: 'mariam.youth@nota.church',
    displayName: 'مريم سامح',
    role: 'youth',
    status: 'active',
    assignedServantId: 'servant-2',
    assignedServantName: 'الخادم ديفيد يوسف',
    currentStreak: 21,
    totalTasksCompleted: 65,
    churchGroup: 'ثانية ثانوي بنات',
    assignedAgpeyaHours: ['baker', 'sunset'],
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

export const SEED_MESSAGES: ServantMessage[] = [
  {
    id: 'msg-1',
    servantId: 'servant-1',
    servantName: 'الخادم مينا أشرف',
    youthId: 'youth-1',
    youthName: 'فادي جورج',
    messageType: 'reminder_bible',
    title: 'تذكير بقراءة سفر ملاخي 📖',
    content: 'سلام يا فادي، إصحاح اليوم من سفر ملاخي مليان رسائل عتاب محبة من ربنا، مستني أشوف تأملك في النوتة!',
    sentAt: '2026-09-25T11:00:00Z',
    read: false,
  },
  {
    id: 'msg-2',
    servantId: 'servant-1',
    servantName: 'الخادم مينا أشرف',
    youthId: 'youth-1',
    youthName: 'فادي جورج',
    messageType: 'encouragement',
    title: 'عاش يا بطل! سلسلة ٢٤ يوماً 🌟',
    content: 'فرحان بالتزامك جداً، متبقي ٦ أيام وتكتمل أيقونة الشهر الأرثوذكسية وسلسلة الـ ٣٠ يوماً بالكامل.',
    sentAt: '2026-09-24T18:00:00Z',
    read: true,
  },
];

export const SEED_ERRORS: SystemErrorLog[] = [];

export const SEED_MONTHLY_ARCHIVES: MonthlySacredIconArchive[] = [
  {
    id: 'arch-2026-08',
    userId: 'youth-1',
    monthKey: '2026-08',
    monthNameArabic: 'أغسطس ٢٠٢٦ (صوم العذراء مريم)',
    iconTitle: 'أيقونة والدة الإله القديسة مريم العذراء',
    iconType: 'pantocrator',
    completedDays: 30,
    totalDays: 30,
    isFullyRevealed: true,
    archivedAt: '2026-08-31T23:59:59Z',
  },
  {
    id: 'arch-2026-07',
    userId: 'youth-1',
    monthKey: '2026-07',
    monthNameArabic: 'يوليو ٢٠٢٦ (عيد الرسل الأطهار)',
    iconTitle: 'أيقونة صليب النور والرسل القديسين',
    iconType: 'coptic_cross',
    completedDays: 28,
    totalDays: 30,
    isFullyRevealed: true,
    archivedAt: '2026-07-31T23:59:59Z',
  },
];

export const SEED_COMMUNIONS: WeeklyCommunionRecord[] = [
  {
    id: 'comm-w1',
    userId: 'youth-1',
    monthKey: '2026-09',
    weekNumber: 1,
    completed: true,
    completedAt: '2026-09-06T10:30:00Z',
    churchName: 'كنيسة السيدة العذراء بالإسماعيلية',
    reflection: 'شعرت بسلام فائق وحضور إلهي عظيم أمام المذبح.',
  },
  {
    id: 'comm-w2',
    userId: 'youth-1',
    monthKey: '2026-09',
    weekNumber: 2,
    completed: true,
    completedAt: '2026-09-13T10:15:00Z',
    churchName: 'كنيسة السيدة العذراء بالإسماعيلية',
    reflection: 'تأملت في ذبيحة الصليب والمحبة غير المشروطة.',
  },
  {
    id: 'comm-w3',
    userId: 'youth-1',
    monthKey: '2026-09',
    weekNumber: 3,
    completed: true,
    completedAt: '2026-09-20T10:45:00Z',
    churchName: 'كنيسة السيدة العذراء بالإسماعيلية',
    reflection: 'قراءات القداس عن مثل الزارع لمست قلبي بشدة.',
  },
];

export const SEED_CONFESSIONS: MonthlyConfessionRecord[] = [
  {
    id: 'conf-2026-08',
    userId: 'youth-1',
    monthKey: '2026-08',
    completed: true,
    completedAt: '2026-08-22T17:00:00Z',
    fatherOfConfession: 'أبونا بولس',
    reflection: 'أخذت تدريب عن حفظ اللسان وضبط استخدام الهاتف.',
  },
];

export const SEED_REGISTRATIONS: RegistrationRequest[] = [
  {
    id: 'reg-servant-1',
    userId: 'pending-servant-1',
    accessCode: '66129841029384',
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
    accessCode: '55018730918273',
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
          ? 'أقدم لله أفضل ما عندي بأن أخصص له أول نصف ساعة من يومي بكامل نشاطي قبل فتح أي إشعارات.'
          : undefined,
        timeSpentSeconds: isFady ? 42 : undefined,
      },
      prayer: {
        completed: isFady,
        completedAt: isFady ? `${dateString}T08:45:00Z` : undefined,
        agpeyaHour: 'baker',
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
