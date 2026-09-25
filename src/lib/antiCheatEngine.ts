import { AntiCheatQuestion, HabitType } from '@/types';

export interface BibleBookInfo {
  id: string;
  name: string;
  testament: 'old' | 'new';
  totalChapters: number;
  description: string;
  chapterQuestions: Record<number, { prompt: string; starter: string }>;
}

export const POPULAR_BIBLE_BOOKS: BibleBookInfo[] = [
  {
    id: 'malachi',
    name: 'سفر ملاخي',
    testament: 'old',
    totalChapters: 4,
    description: 'آخر أسفار العهد القديم، يركز على عهد المحبة والأمانة في العشور وتقديم أفضل ما لدينا لله.',
    chapterQuestions: {
      1: {
        prompt: 'في الأصحاح الأول يعاتب الرب شعبه: «إِنْ كُنْتُ أَنَا أَبًا فَأَيْنَ كَرَامَتِي؟» ويذكر تقديم ذبائح معيبة. كيف تقدم اليوم لله في حياتك (وقتك، صلاتك، خدمتك) أفضل ما لديك بدلاً من الفتات؟',
        starter: 'أقدم لله أفضل ما عندي بأن أخصص له...',
      },
      2: {
        prompt: 'في الأصحاح الثاني يدعو النبي للأمانة والصدق في العهود وعدم الغدر بأخيك أو شريكك. ما هو الموقف الذي تحتاج فيه لأمانة وشجاعة مسيحية هذا الأسبوع؟',
        starter: 'الموقف الذي يتطلب أمانتي هو...',
      },
      3: {
        prompt: 'في الأصحاح الثالث يقول الرب: «جَرِّبُونِي بِهذَا... إِنْ كُنْتُ لاَ أَفْتَحُ لَكُمْ كُوَى السَّمَاوَاتِ». متى شعرت ببركة الله الفائضة في حياتك عندما كنت أميناً في وصيته؟',
        starter: 'شعرت ببركة الرب عندما...',
      },
      4: {
        prompt: 'في الأصحاح الرابع يشرق «شَمْسُ الْبِرِّ وَالشِّفَاءُ فِي أَجْنِحَتِهَا». كيف تطلب من المسيح شمس البر أن يطرد أي ظلمة أو خوف أو حزن من قلبك اليوم؟',
        starter: 'أطلب من شمس البر أن يشفي...',
      },
    },
  },
  {
    id: 'jonah',
    name: 'سفر يونان',
    testament: 'old',
    totalChapters: 4,
    description: 'سفر التوبة والمراحم الإلهية الشاملة لجميع النفوس.',
    chapterQuestions: {
      1: {
        prompt: 'يونان هرب إلى ترشيش من وجه الرب. هل هناك أمر تشعر أن الله يطلبه منك وأنت تتهرب منه؟ كيف تتوقف عن الهروب وتعود لحضن الله؟',
        starter: 'أشعر أنني أتهرب أحياناً من... وقراري بالعودة هو...',
      },
      2: {
        prompt: 'صلاة يونان في جوف الحوت كانت مفعمة بالرجاء: «وَلكِنَّنِي بِصَوْتِ الْحَمْدِ أَذْبَحُ لَكَ». كيف تصلي بالشكر وأنت وسط ضيقة أو تجربة قاسية؟',
        starter: 'أشكر الله وسط الضيقة لأنني أعلم أن...',
      },
      3: {
        prompt: 'أهل نينوى تابوا بالمسوح والرماد فرحمهم الله. ما هو التغيير البسيط في سلوكك اليومي الذي تعلنه توبة صادقة أمام الله؟',
        starter: 'التغيير الذي أبدأ به هو...',
      },
      4: {
        prompt: 'عاتب الله يونان على شجرة اليقطين ليعلمه محبة كل إنسان. كيف تتعامل مع أشخاص قد لا تتفق معهم بروح المحبة والرحمة التي يريدها الله؟',
        starter: 'أتعامل مع من أختلف معه بأن...',
      },
    },
  },
  {
    id: 'ephesians',
    name: 'رسالة أفسس',
    testament: 'new',
    totalChapters: 6,
    description: 'رسالة الكنيسة جسد المسيح وسلاح الله الكامل للغلبة الروحية.',
    chapterQuestions: {
      1: {
        prompt: '«بَارَكَنَا بِكُلِّ بَرَكَةٍ رُوحِيَّةٍ فِي السَّمَاوِيَّاتِ». ما هي أعظم بركة روحية تشعر بالامتنان لها في معرفتك للمسيح؟',
        starter: 'أشكر الرب يسوع خاصة على...',
      },
      2: {
        prompt: '«لأَنَّكُمْ بِالنِّعْمَةِ مُخَلَّصُونَ، بِالإِيمَانِ، وَذلِكَ لَيْسَ مِنْكُمْ. هُوَ عَطِيَّةُ اللهِ». كيف يعطيك إدراك مجانية خلاص المسيح طمأنينة وفرحاً حقيقياً؟',
        starter: 'خلاص المسيح بالنعمة يملأني بـ...',
      },
      3: {
        prompt: 'يطلب بولس أن «تَتَأَصَّلُوا وَتَتَأَسَّسُوا فِي الْمَحَبَّةِ». كيف تثبت محبتك لأهل بيتك وأصدقائك عملاً لا قولاً اليوم؟',
        starter: 'سأظهر محبتي العملية اليوم من خلال...',
      },
      4: {
        prompt: '«أَنْ تَسْلُكُوا كَمَا يَحِقُّ لِلدَّعْوَةِ... مُحْتَمِلِينَ بَعْضُكُمْ بَعْضًا فِي الْمَحَبَّةِ». من هو الشخص الذي يحتاج منك لاحتمال وصبر ومغفرة الآن؟',
        starter: 'أطلب معونة الله لأحتمل...',
      },
      5: {
        prompt: '«فَانْظُرُوا كَيْفَ تَسْلُكُونَ بِالتَّدْقِيقِ... مُفْتَدِينَ الْوَقْتَ». كيف ستنظم وقتك غداً لتضع دراستك وصلاتك في المكان الصحيح بعيداً عن تشتت الهاتف؟',
        starter: 'سأفتدي وقتي بأن أحدد...',
      },
      6: {
        prompt: '«الْبَسُوا سِلاَحَ اللهِ الْكَامِلَ لِكَيْ تَقْدِرُوا أَنْ تَثْبُتُوا». ما هو السلاح الروحي (الصلاة، كلمة الله، ترس الإيمان) الذي تحتاجه بشدة في حروبك الحالية؟',
        starter: 'سلاحي الروحي الأهم لمواجهة حروبي هو...',
      },
    },
  },
  {
    id: 'james',
    name: 'رسالة يعقوب',
    testament: 'new',
    totalChapters: 5,
    description: 'رسالة الإيمان الحي العامل بالمحبة وضبط اللسان والحكمة النازلة من فوق.',
    chapterQuestions: {
      1: {
        prompt: '«لِيَكُنْ كُلُّ إِنْسَانٍ مُسْرِعًا فِي الاسْتِمَاعِ، مُبْطِئًا فِي التَّكَلُّمِ، مُبْطِئًا فِي الْغَضَبِ». كيف تطبق هذه الوصية الذهبية في أول حوار مع أسرتك أو أصدقائك؟',
        starter: 'سأحرص على الاستماع والهدوء عندما...',
      },
      2: {
        prompt: '«الإِيمَانُ بِدُونِ أَعْمَال مَيِّتٌ». ما هو العمل الصالح أو المساعدة التي ستقدمها لشخص محتاج هذا الأسبوع دليلاً على إيمانك الحي؟',
        starter: 'عمل المحبة الذي سأقوم به هو...',
      },
      3: {
        prompt: 'يتحدث الأصحاح عن خطورة اللسان الذي كالنار. ما هي الكلمات التي قررت أن تمتنع عنها تماماً لتحفظ طهارة لسانك؟',
        starter: 'أحفظ فمي من... وسأستبدلها بـ...',
      },
      4: {
        prompt: '«اقْتَرِبُوا إِلَى اللهِ فَيَقْتَرِبَ إِلَيْكُمْ». ما هي الخطوة العملية التي تقربك إلى الله وتطرد كبرياء الذات اليوم؟',
        starter: 'أقترب إلى الله من خلال خلوة...',
      },
      5: {
        prompt: '«صَلاَةُ الإِيمَانِ تَشْفِي الْمَرِيضَ... طَلِبَةُ الْبَارِّ تَقْتَدِرُ كَثِيرًا فِي فِعْلِهَا». اذكر اسماً لشخص مريض أو متألم تصلي من أجله الآن بإيمان.',
        starter: 'أرفع صلاتي بلجاجة من أجل...',
      },
    },
  },
];

// Fallback questions for general spiritual law habits
const GENERAL_HABIT_QUESTIONS: Record<HabitType, Array<{ topic: string; prompt: string; starter: string }>> = {
  bible: [
    {
      topic: 'قراءة الإنجيل اليومية',
      prompt: 'ما هي الآية أو العبارة التي لمست قلبك في قراءتك اليوم وشعرت أنها رسالة موجهة لشخصك وتحدياتك؟',
      starter: 'الآية التي استوقفتني هي... لأنها تعلمني أن...',
    },
    {
      topic: 'تطبيق عملي من كلمة الله',
      prompt: 'كيف يمكنك تحويل ما قرأته اليوم إلى سلوك عملي تطبقه في بيتك أو مدرستك خلال الـ 24 ساعة القادمة؟',
      starter: 'سأطبق وصية اليوم عملياً بأن...',
    },
  ],
  prayer: [
    {
      topic: 'صلاة الأجبية والخلوة الشخصية',
      prompt: 'في وقفتك أمام الله، ما هي أكثر طلبة في مزمور أو إنجيل الساعات التي شعرت أنها تعبر عن احتياج قلبك الحقيقي الآن؟',
      starter: 'طلبتي من قلبي في الصلاة كانت...',
    },
    {
      topic: 'فحص الذات والشكر',
      prompt: 'ما هي النعمة البسيطة غير الملحوظة التي شكرت الله عليها في خلوتك اليوم بقلب صادق؟',
      starter: 'أشكر الرب اليوم تحديداً على نعمة...',
    },
  ],
  communion: [
    {
      topic: 'سر الإفخارستيا والتناول المقدس',
      prompt: 'وأنت متقدم للتناول من جسد الرب ودمه الأقدسين، ما هو العهد والوعد الجديد الذي قطعته مع المسيح لحفظ طهارتك وسلامك؟',
      starter: 'عهدي أمام المذبح المقدس هو...',
    },
    {
      topic: 'قراءات القداس والسنكسار',
      prompt: 'ما هي الفضيلة الأساسية التي لمستك في قراءات قداس اليوم (أو سيرة قديس السنكسار) وقررت أن تقتدي بها؟',
      starter: 'الفضيلة التي تأثرت بها هي...',
    },
  ],
  confession: [
    {
      topic: 'جلسة الاعتراف والمحاسبة',
      prompt: 'ما هو التدريب أو الإرشاد الروحي الذي أخذته من أب اعترافك لمساعدتك على الانتصار في حروبك الروحية الحالية؟',
      starter: 'التدريب الروحي الذي أوصاني به أب اعترافي هو...',
    },
    {
      topic: 'بداية صفحة جديدة مع الله',
      prompt: 'بعد نوال التحليل ومغفرة الخطايا، ما هي أول خطوة عملية تبدأ بها لحراسة حواسك وفكرك؟',
      starter: 'خطوتي العملية الأولى هي...',
    },
  ],
};

/**
 * Returns a relaxed, comfortable time limit (60 to 90 seconds)
 * giving the youth sufficient time to read, digest the question, and type their answer peacefully.
 */
export function getGenerousTimeLimit(prompt: string): number {
  // Base generous time: 70 seconds. If prompt is long, extend up to 90 seconds.
  const extra = Math.min(20, Math.floor(prompt.length / 15));
  return 70 + extra; // 70s - 90s
}

/**
 * Gets anti-cheat reflection question. If reading plan is active for Bible,
 * it returns the EXACT chapter situational question!
 */
export function getQuestionForHabit(
  habitType: HabitType,
  assignedBookName?: string,
  chapterNumber?: number
): AntiCheatQuestion {
  if (habitType === 'bible' && assignedBookName && chapterNumber) {
    const matchedBook = POPULAR_BIBLE_BOOKS.find(
      (b) => b.name === assignedBookName || b.id === assignedBookName.toLowerCase()
    );

    if (matchedBook && matchedBook.chapterQuestions[chapterNumber]) {
      const q = matchedBook.chapterQuestions[chapterNumber];
      return {
        id: `bible_${matchedBook.id}_ch${chapterNumber}`,
        habitType: 'bible',
        topic: `${matchedBook.name} - الأصحاح ${chapterNumber}`,
        situationalPrompt: q.prompt,
        exampleStarter: q.starter,
        timeLimitSeconds: getGenerousTimeLimit(q.prompt),
        minWordCount: 4,
        bookName: matchedBook.name,
        chapter: chapterNumber,
      };
    }
  }

  // Fallback to library of rich situational questions
  const list = GENERAL_HABIT_QUESTIONS[habitType] || GENERAL_HABIT_QUESTIONS.bible;
  const picked = list[Math.floor(Math.random() * list.length)];

  return {
    id: `${habitType}_${Date.now()}`,
    habitType,
    topic: picked.topic,
    situationalPrompt: picked.prompt,
    exampleStarter: picked.starter,
    timeLimitSeconds: getGenerousTimeLimit(picked.prompt),
    minWordCount: 4,
  };
}

export function validateReflectionAnswer(
  answer: string,
  minWordCount: number
): { isValid: boolean; error?: string } {
  const trimmed = answer.trim();
  if (!trimmed) {
    return { isValid: false, error: 'برجاء كتابة تأملك الشخصي لتأكيد الإنجاز' };
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < minWordCount) {
    return {
      isValid: false,
      error: `التأمل قصير؛ اكتب على الأقل ${minWordCount} كلمات تعبر عن فكرك الروحي الصادق`,
    };
  }
  return { isValid: true };
}
