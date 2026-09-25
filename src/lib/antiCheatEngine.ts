import { AntiCheatQuestion, HabitType } from '@/types';

// Library of rich situational, personal reflection questions that cannot be trivially Googled
const SITUATIONAL_QUESTIONS: Omit<AntiCheatQuestion, 'timeLimitSeconds'>[] = [
  // Bible Questions
  {
    id: 'bible_1',
    habitType: 'bible',
    topic: 'مثل الابن الضال (لوقا ١٥)',
    situationalPrompt: 'لو كنت مكان الأخ الأكبر ووجدت أباك يحتفل بعودة أخيك الذي أضاع ماله، ما هو أول شعور بشري يدور في قلبك وكيف تحوله لصلاة تسامح في جملتين؟',
    exampleStarter: 'شعوري الصادق هو... وأحوله لصلاة بأن أقول...',
    minWordCount: 5,
  },
  {
    id: 'bible_2',
    habitType: 'bible',
    topic: 'داود وجليات (صموئيل الأول ١٧)',
    situationalPrompt: 'في تحدياتك الحالية (دراسة، ضغوط نفسية، تجارب)، ما هو "جليات" الخاص بك اليوم وما هي "الحصاة" الروحية التي تضعها في يد الله لمواجهته؟',
    exampleStarter: 'التحدي هو... وحصاتي الروحية هي...',
    minWordCount: 5,
  },
  {
    id: 'bible_3',
    habitType: 'bible',
    topic: 'السيد المسيح والمرأة السامرية (يوحنا ٤)',
    situationalPrompt: 'ما هو "البئر" الذي تبحث فيه أحياناً عن شبع مزيف، وما الآية أو الوعد الذي يمنحك ماء الحياة الأبدية اليوم؟',
    exampleStarter: 'أحياناً أطلب الشبع في... ولكن المسيح يرويني بـ...',
    minWordCount: 5,
  },
  {
    id: 'bible_4',
    habitType: 'bible',
    topic: 'بطرس وسط الرياح والأمواج (متى ١٤)',
    situationalPrompt: 'عندما بدأت تغرق بسبب شكوكك أو ضعفاتك في موقف حدث معك مؤخراً، كيف مددت يدك وناديت "يا رب نجني"؟',
    exampleStarter: 'في موقف... شعرت بالخوف وناديت...',
    minWordCount: 5,
  },
  {
    id: 'bible_5',
    habitType: 'bible',
    topic: 'تطويبات الموعظة على الجبل (متى ٥)',
    situationalPrompt: 'اختر تطويبة واحدة من الموعظة (كالأنقياء القلب أو صانعي السلام) واذكر كيف يمكنك تطبيقها تحديداً غداً مع شخص يزعجك؟',
    exampleStarter: 'أختار تطويبة... وسأطبقها مع...',
    minWordCount: 5,
  },

  // Prayer / Agpeya Questions
  {
    id: 'prayer_1',
    habitType: 'prayer',
    topic: 'صلاة الساعة الثالثة / حلول الروح القدس',
    situationalPrompt: 'أثناء صلاتك، ما هي الكلمة أو الطلبة في المزمور أو الإنجيل التي لمست قلبك وشعرت أنها رسالة موجهة لشخصك اليوم؟',
    exampleStarter: 'الكلمة التي استوقفتني كانت... لأنها تمس...',
    minWordCount: 4,
  },
  {
    id: 'prayer_2',
    habitType: 'prayer',
    topic: 'صلاة الغروب والنوم / فحص الذات',
    situationalPrompt: 'قبل أن تغلق عينيك، ما هو الفعل أو الفكر الذي تطلب عنه رحمة الله وغفرانه الآن بقلب منكسر وصادق؟',
    exampleStarter: 'أطلب الغفران عن... وأشكر الله على...',
    minWordCount: 4,
  },
  {
    id: 'prayer_3',
    habitType: 'prayer',
    topic: 'صلاة باكر / شكر وبدء يوم جديد',
    situationalPrompt: 'ما هي النعمة البسيطة غير الملحوظة التي شكرت الله عليها في خلوتك هذا الصباح قبل بدء يومك؟',
    exampleStarter: 'شكرت الله اليوم تحديداً على...',
    minWordCount: 4,
  },

  // Communion Questions
  {
    id: 'communion_1',
    habitType: 'communion',
    topic: 'سر الإفخارستيا وروح التوبة',
    situationalPrompt: 'وأنت واقف أمام المذبح للتناول، ما هي المعاهدة أو العهد الجديد الذي قطعته بينك وبين الرب يسوع لحفظ جسدك وفكرك طاهراً؟',
    exampleStarter: 'عهدي أمام المذبح هو...',
    minWordCount: 5,
  },
  {
    id: 'communion_2',
    habitType: 'communion',
    topic: 'قراءات القداس والسنكسار اليوم',
    situationalPrompt: 'ما الفضيلة الأساسية التي لمستك في قراءات قداس اليوم (أو سنكسار اليوم) والتي قررت أن تسلك بها طوال الأسبوع؟',
    exampleStarter: 'الفضيلة التي أثرت بي هي...',
    minWordCount: 5,
  },

  // Confession Questions
  {
    id: 'confession_1',
    habitType: 'confession',
    topic: 'جلسة الاعتراف والإرشاد الروحي',
    situationalPrompt: 'ما هو التدريب أو الوصية التي أخذتها من أب اعترافك لمساعدتك في محاربة خطيتك السائدة خلال هذه الفترة؟',
    exampleStarter: 'التدريب الروحي الذي أعطاني إياه أب اعترافي هو...',
    minWordCount: 4,
  },
  {
    id: 'confession_2',
    habitType: 'confession',
    topic: 'المحاسبة وبداية صفحة جديدة',
    situationalPrompt: 'كيف شعرت بعد صلاة التحليل من فم الأب الكاهن، وما هو أول تغيير عملي ستبدأ به فوراً؟',
    exampleStarter: 'شعرت بسلام عظيم وخطوتي العملية الأولى هي...',
    minWordCount: 4,
  },
];

/**
 * Programmatically calculates strict countdown timer (in seconds)
 * based on question prompt length and cognitive complexity to prevent
 * AI querying or web searching while giving enough time for a human to type a brief response.
 */
export function calculateDynamicTimeLimit(prompt: string, minWords: number): number {
  const charLength = prompt.length;
  // Baseline time: 15 seconds
  // Add 1 second per ~25 characters of reading
  // Add 1.5 seconds per expected minimum word
  const calculated = Math.round(14 + (charLength / 25) + (minWords * 1.5));
  // Clamp between 20 seconds and 35 seconds
  return Math.min(38, Math.max(20, calculated));
}

/**
 * Returns a randomized situational question for the given habit type
 */
export function getRandomAntiCheatQuestion(habitType: HabitType): AntiCheatQuestion {
  const filtered = SITUATIONAL_QUESTIONS.filter((q) => q.habitType === habitType);
  const selected = filtered[Math.floor(Math.random() * filtered.length)] || SITUATIONAL_QUESTIONS[0];
  
  const timeLimitSeconds = calculateDynamicTimeLimit(selected.situationalPrompt, selected.minWordCount);
  return {
    ...selected,
    timeLimitSeconds,
  };
}

/**
 * Validates reflection answer to ensure authenticity (anti-spam / anti-empty)
 */
export function validateReflectionAnswer(
  answer: string,
  minWordCount: number
): { isValid: boolean; error?: string } {
  const trimmed = answer.trim();
  if (!trimmed) {
    return { isValid: false, error: 'برجاء كتابة إجابتك للتأكيد الروحي' };
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < minWordCount) {
    return {
      isValid: false,
      error: `الإجابة قصيرة جداً؛ اكتب على الأقل ${minWordCount} كلمات تعبر عن فكرك الروحي الصادق`,
    };
  }
  return { isValid: true };
}
