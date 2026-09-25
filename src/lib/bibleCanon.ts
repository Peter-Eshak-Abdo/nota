export interface BibleBookCanonical {
  id: string;
  name: string;
  testament: 'old' | 'new';
  category: 'law' | 'history' | 'poetry' | 'prophets_major' | 'prophets_minor' | 'deuterocanon' | 'gospels' | 'acts' | 'epistles_paul' | 'epistles_general' | 'revelation';
  categoryName: string;
  totalChapters: number;
}

export const ALL_CANONICAL_BIBLE_BOOKS: BibleBookCanonical[] = [
  // --- العهد القديم: أسفار الشريعة (التوراة) ---
  { id: 'genesis', name: 'سفر التكوين', testament: 'old', category: 'law', categoryName: 'أسفار الشريعة', totalChapters: 50 },
  { id: 'exodus', name: 'سفر الخروج', testament: 'old', category: 'law', categoryName: 'أسفار الشريعة', totalChapters: 40 },
  { id: 'leviticus', name: 'سفر اللاويين', testament: 'old', category: 'law', categoryName: 'أسفار الشريعة', totalChapters: 27 },
  { id: 'numbers', name: 'سفر العدد', testament: 'old', category: 'law', categoryName: 'أسفار الشريعة', totalChapters: 36 },
  { id: 'deuteronomy', name: 'سفر التثنية', testament: 'old', category: 'law', categoryName: 'أسفار الشريعة', totalChapters: 34 },

  // --- الأسفار التاريخية ---
  { id: 'joshua', name: 'سفر يشوع', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 24 },
  { id: 'judges', name: 'سفر القضاة', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 21 },
  { id: 'ruth', name: 'سفر راعوث', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 4 },
  { id: '1samuel', name: 'سفر صموئيل الأول', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 31 },
  { id: '2samuel', name: 'سفر صموئيل الثاني', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 24 },
  { id: '1kings', name: 'سفر الملوك الأول', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 22 },
  { id: '2kings', name: 'سفر الملوك الثاني', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 25 },
  { id: '1chronicles', name: 'سفر أخبار الأيام الأول', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 29 },
  { id: '2chronicles', name: 'سفر أخبار الأيام الثاني', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 36 },
  { id: 'ezra', name: 'سفر عزرا', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 10 },
  { id: 'nehemiah', name: 'سفر نحميا', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 13 },
  { id: 'tobit', name: 'سفر طوبيا', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 14 },
  { id: 'judith', name: 'سفر يهوديت', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 16 },
  { id: 'esther', name: 'سفر أستير (مع التتمة)', testament: 'old', category: 'history', categoryName: 'الأسفار التاريخية', totalChapters: 16 },
  { id: '1maccabees', name: 'سفر المكابيين الأول', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 16 },
  { id: '2maccabees', name: 'سفر المكابيين الثاني', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 15 },

  // --- الأسفار الشعرية والحكمية ---
  { id: 'job', name: 'سفر أيوب', testament: 'old', category: 'poetry', categoryName: 'الأسفار التعليمية والشعرية', totalChapters: 42 },
  { id: 'psalms', name: 'سفر المزامير', testament: 'old', category: 'poetry', categoryName: 'الأسفار التعليمية والشعرية', totalChapters: 151 },
  { id: 'proverbs', name: 'سفر الأمثال', testament: 'old', category: 'poetry', categoryName: 'الأسفار التعليمية والشعرية', totalChapters: 31 },
  { id: 'ecclesiastes', name: 'سفر الجامعة', testament: 'old', category: 'poetry', categoryName: 'الأسفار التعليمية والشعرية', totalChapters: 12 },
  { id: 'songofsongs', name: 'سفر نشيد الأنشاد', testament: 'old', category: 'poetry', categoryName: 'الأسفار التعليمية والشعرية', totalChapters: 8 },
  { id: 'wisdom', name: 'سفر حكمة سليمان', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 19 },
  { id: 'sirach', name: 'سفر يشوع بن سيراخ', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 51 },

  // --- الأنبياء الكبار ---
  { id: 'isaiah', name: 'سفر إشعياء', testament: 'old', category: 'prophets_major', categoryName: 'الأنبياء الكبار', totalChapters: 66 },
  { id: 'jeremiah', name: 'سفر إرميا', testament: 'old', category: 'prophets_major', categoryName: 'الأنبياء الكبار', totalChapters: 52 },
  { id: 'lamentations', name: 'سفر مراثي إرميا', testament: 'old', category: 'prophets_major', categoryName: 'الأنبياء الكبار', totalChapters: 5 },
  { id: 'baruch', name: 'سفر باروخ', testament: 'old', category: 'deuterocanon', categoryName: 'الأسفار القانونية الثانية', totalChapters: 6 },
  { id: 'ezekiel', name: 'سفر حزقيال', testament: 'old', category: 'prophets_major', categoryName: 'الأنبياء الكبار', totalChapters: 48 },
  { id: 'daniel', name: 'سفر دانيال (مع التتمة)', testament: 'old', category: 'prophets_major', categoryName: 'الأنبياء الكبار', totalChapters: 14 },

  // --- الأنبياء الصغار ---
  { id: 'hosea', name: 'سفر هوشع', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 14 },
  { id: 'joel', name: 'سفر يوئيل', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 3 },
  { id: 'amos', name: 'سفر عاموس', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 9 },
  { id: 'obadiah', name: 'سفر عوبديا', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 1 },
  { id: 'jonah', name: 'سفر يونان', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 4 },
  { id: 'micah', name: 'سفر ميخا', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 7 },
  { id: 'nahum', name: 'سفر ناحوم', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 3 },
  { id: 'habakkuk', name: 'سفر حبقوق', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 3 },
  { id: 'zephaniah', name: 'سفر صفنيا', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 3 },
  { id: 'haggai', name: 'سفر حجي', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 2 },
  { id: 'zechariah', name: 'سفر زكريا', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 14 },
  { id: 'malachi', name: 'سفر ملاخي', testament: 'old', category: 'prophets_minor', categoryName: 'الأنبياء الصغار', totalChapters: 4 },

  // --- العهد الجديد: الأناجيل الأربعة ---
  { id: 'matthew', name: 'إنجيل متى', testament: 'new', category: 'gospels', categoryName: 'الأناجيل المقدسة', totalChapters: 28 },
  { id: 'mark', name: 'إنجيل مرقس', testament: 'new', category: 'gospels', categoryName: 'الأناجيل المقدسة', totalChapters: 16 },
  { id: 'luke', name: 'إنجيل لوقا', testament: 'new', category: 'gospels', categoryName: 'الأناجيل المقدسة', totalChapters: 24 },
  { id: 'john', name: 'إنجيل يوحنا', testament: 'new', category: 'gospels', categoryName: 'الأناجيل المقدسة', totalChapters: 21 },

  // --- سفر أعمال الرسل ---
  { id: 'acts', name: 'سفر أعمال الرسل', testament: 'new', category: 'acts', categoryName: 'أعمال الرسل', totalChapters: 28 },

  // --- رسائل القديس بولس الرسول ---
  { id: 'romans', name: 'رسالة رومية', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 16 },
  { id: '1corinthians', name: 'رسالة كورنثوس الأولى', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 16 },
  { id: '2corinthians', name: 'رسالة كورنثوس الثانية', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 13 },
  { id: 'galatians', name: 'رسالة غلاطية', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 6 },
  { id: 'ephesians', name: 'رسالة أفسس', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 6 },
  { id: 'philippians', name: 'رسالة فيلبي', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 4 },
  { id: 'colossians', name: 'رسالة كولوسي', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 4 },
  { id: '1thessalonians', name: 'رسالة تسالونيكي الأولى', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 5 },
  { id: '2thessalonians', name: 'رسالة تسالونيكي الثانية', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 3 },
  { id: '1timothy', name: 'رسالة تيموثاوس الأولى', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 6 },
  { id: '2timothy', name: 'رسالة تيموثاوس الثانية', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 4 },
  { id: 'titus', name: 'رسالة تيطس', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 3 },
  { id: 'philemon', name: 'رسالة فليمون', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 1 },
  { id: 'hebrews', name: 'رسالة العبرانيين', testament: 'new', category: 'epistles_paul', categoryName: 'رسائل بولس الرسول', totalChapters: 13 },

  // --- رسائل الكاثوليكون (الرسائل العامة) ---
  { id: 'james', name: 'رسالة يعقوب', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 5 },
  { id: '1peter', name: 'رسالة بطرس الأولى', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 5 },
  { id: '2peter', name: 'رسالة بطرس الثانية', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 3 },
  { id: '1john', name: 'رسالة يوحنا الأولى', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 5 },
  { id: '2john', name: 'رسالة يوحنا الثانية', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 1 },
  { id: '3john', name: 'رسالة يوحنا الثالثة', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 1 },
  { id: 'jude', name: 'رسالة يهوذا', testament: 'new', category: 'epistles_general', categoryName: 'رسائل الكاثوليكون', totalChapters: 1 },

  // --- سفر الرؤيا ---
  { id: 'revelation', name: 'سفر الرؤيا', testament: 'new', category: 'revelation', categoryName: 'سفر الرؤيا النبوي', totalChapters: 22 },
];
