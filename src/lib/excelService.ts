import * as XLSX from 'xlsx';
import { UserProfile, UserRole } from '@/types';
import { generate14DigitCode, clean14DigitCode } from '@/lib/biometrics';

export interface ExcelUserRow {
  'الاسم الثلاثي': string;
  'البريد الإلكتروني': string;
  'رقم الهاتف'?: string;
  'الرتبة / الدور (خادم أو مخدوم)': string;
  'كود الدخول (١٤ رقم)'?: string;
  'الخادم المسؤول (للمخدومين)'?: string;
  'الفصل / المجموعة الكنسية'?: string;
}

export interface ImportResult {
  success: boolean;
  totalParsed: number;
  servantsCount: number;
  youthCount: number;
  users: UserProfile[];
  errors: string[];
}

/**
 * Downloads a pre-formatted Excel template with 3 Servants and 5 Youths
 */
export function downloadExcelTemplate() {
  const sampleData: ExcelUserRow[] = [
    // 3 Servants
    {
      'الاسم الثلاثي': 'الخادم مينا أشرف',
      'البريد الإلكتروني': 'mina.servant@nota.church',
      'رقم الهاتف': '01223344551',
      'الرتبة / الدور (خادم أو مخدوم)': 'خادم',
      'كود الدخول (١٤ رقم)': '77235190448231',
      'الخادم المسؤول (للمخدومين)': '',
      'الفصل / المجموعة الكنسية': 'فصل أولى ثانوي بنين',
    },
    {
      'الاسم الثلاثي': 'الخادم ديفيد يوسف',
      'البريد الإلكتروني': 'david.servant@nota.church',
      'رقم الهاتف': '01223344552',
      'الرتبة / الدور (خادم أو مخدوم)': 'خادم',
      'كود الدخول (١٤ رقم)': '88346201559342',
      'الخادم المسؤول (للمخدومين)': '',
      'الفصل / المجموعة الكنسية': 'فصل ثانية ثانوي بنين',
    },
    {
      'الاسم الثلاثي': 'الخادم يوحنا عماد',
      'البريد الإلكتروني': 'youhanna.servant@nota.church',
      'رقم الهاتف': '01223344553',
      'الرتبة / الدور (خادم أو مخدوم)': 'خادم',
      'كود الدخول (١٤ رقم)': '66457312660453',
      'الخادم المسؤول (للمخدومين)': '',
      'الفصل / المجموعة الكنسية': 'فصل ثالثة ثانوي بنين',
    },
    // 5 Youths
    {
      'الاسم الثلاثي': 'فادي جورج مرقص',
      'البريد الإلكتروني': 'fady.youth@nota.church',
      'رقم الهاتف': '01011223341',
      'الرتبة / الدور (خادم أو مخدوم)': 'مخدوم',
      'كود الدخول (١٤ رقم)': '10482951830492',
      'الخادم المسؤول (للمخدومين)': 'الخادم مينا أشرف',
      'الفصل / المجموعة الكنسية': 'أولى ثانوي ب',
    },
    {
      'الاسم الثلاثي': 'كيرلس سمير حليم',
      'البريد الإلكتروني': 'kyrollos.youth@nota.church',
      'رقم الهاتف': '01011223342',
      'الرتبة / الدور (خادم أو مخدوم)': 'مخدوم',
      'كود الدخول (١٤ رقم)': '21593062941503',
      'الخادم المسؤول (للمخدومين)': 'الخادم مينا أشرف',
      'الفصل / المجموعة الكنسية': 'أولى ثانوي ب',
    },
    {
      'الاسم الثلاثي': 'مارك هاني رمسيس',
      'البريد الإلكتروني': 'mark.youth@nota.church',
      'رقم الهاتف': '01011223343',
      'الرتبة / الدور (خادم أو مخدوم)': 'مخدوم',
      'كود الدخول (١٤ رقم)': '32604173052614',
      'الخادم المسؤول (للمخدومين)': 'الخادم ديفيد يوسف',
      'الفصل / المجموعة الكنسية': 'ثانية ثانوي أ',
    },
    {
      'الاسم الثلاثي': 'أبانوب رضا فوزي',
      'البريد الإلكتروني': 'abanoub.youth@nota.church',
      'رقم الهاتف': '01011223344',
      'الرتبة / الدور (خادم أو مخدوم)': 'مخدوم',
      'كود الدخول (١٤ رقم)': '43715284163725',
      'الخادم المسؤول (للمخدومين)': 'الخادم ديفيد يوسف',
      'الفصل / المجموعة الكنسية': 'ثانية ثانوي أ',
    },
    {
      'الاسم الثلاثي': 'توماس أيمن صبحي',
      'البريد الإلكتروني': 'thomas.youth@nota.church',
      'رقم الهاتف': '01011223345',
      'الرتبة / الدور (خادم أو مخدوم)': 'مخدوم',
      'كود الدخول (١٤ رقم)': '54826395274836',
      'الخادم المسؤول (للمخدومين)': 'الخادم يوحنا عماد',
      'الفصل / المجموعة الكنسية': 'ثالثة ثانوي ج',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths for comfortable reading
  worksheet['!cols'] = [
    { wch: 24 }, // الاسم
    { wch: 30 }, // البريد
    { wch: 16 }, // الهاتف
    { wch: 28 }, // الدور
    { wch: 22 }, // الكود
    { wch: 24 }, // الخادم المسؤول
    { wch: 24 }, // الفصل
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب الخدمة والشباب');
  XLSX.writeFile(workbook, 'قالب_بيانات_الخدمة_نوتا.xlsx');
}

/**
 * Exports current database profiles into an Excel file
 */
export function exportUsersToExcel(users: UserProfile[]) {
  const exportData = users.map((u) => ({
    'المعرف UID': u.uid,
    'الاسم الثلاثي': u.displayName,
    'البريد الإلكتروني': u.email,
    'رقم الهاتف': u.phone || 'غير مسجل',
    'الرتبة': u.role === 'admin' ? 'أمين خدمة (Admin)' : u.role === 'servant' ? 'خادم' : 'مخدوم',
    'كود الدخول (١٤ رقم)': u.accessCode,
    'الحالة': u.status === 'active' ? 'نشط' : u.status === 'pending_approval' ? 'قيد المراجعة' : 'مرفوض',
    'الخادم المسؤول': u.assignedServantName || '—',
    'المجموعة / الفصل': u.churchGroup || '—',
    'أيام الالتزام (Streak)': u.currentStreak,
    'المهام الروحية المنجزة': u.totalTasksCompleted,
    'تاريخ التسجيل': u.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 24 },
    { wch: 30 },
    { wch: 16 },
    { wch: 18 },
    { wch: 22 },
    { wch: 14 },
    { wch: 22 },
    { wch: 24 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'سجل بيانات نوتا');
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `بيانات_نظام_نوتا_${dateStr}.xlsx`);
}

/**
 * Parses and validates an uploaded Excel file
 */
export async function parseUsersFromExcel(
  file: File,
  existingUsers: UserProfile[]
): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          resolve({
            success: false,
            totalParsed: 0,
            servantsCount: 0,
            youthCount: 0,
            users: [],
            errors: ['ملف Excel فارغ أو لا يحتوي على صفوف بيانات صالحة.'],
          });
          return;
        }

        const errors: string[] = [];
        const newUsers: UserProfile[] = [];
        const existingCodes = new Set(existingUsers.map((u) => u.accessCode));
        const now = new Date().toISOString();

        // Pass 1: Parse all servants first so youths can link to them
        const parsedServants: { name: string; user: UserProfile }[] = [];

        rawJson.forEach((row, idx) => {
          const rowNum = idx + 2;
          const name = String(row['الاسم الثلاثي'] || row['الاسم'] || row['Name'] || '').trim();
          const email = String(row['البريد الإلكتروني'] || row['البريد'] || row['Email'] || '').trim();
          const phone = String(row['رقم الهاتف'] || row['الموبايل'] || row['Phone'] || '').trim();
          const roleStr = String(row['الرتبة / الدور (خادم أو مخدوم)'] || row['الدور'] || row['الرتبة'] || row['Role'] || '').trim();
          const rawCode = String(row['كود الدخول (١٤ رقم)'] || row['الكود'] || row['Code'] || '').trim();
          const group = String(row['الفصل / المجموعة الكنسية'] || row['المجموعة'] || row['الفصل'] || '').trim();

          if (!name) {
            errors.push(`صف ${rowNum}: تم تجاهله لعدم وجود اسم ثلاثي.`);
            return;
          }

          const isServant = roleStr.includes('خادم') || roleStr.toLowerCase() === 'servant';
          const role: UserRole = isServant ? 'servant' : 'youth';

          // Clean or generate 14-digit code
          let accessCode = clean14DigitCode(rawCode);
          if (accessCode.length !== 14 || existingCodes.has(accessCode)) {
            accessCode = generate14DigitCode();
          }
          existingCodes.add(accessCode);

          const uid = `${role}-${Date.now()}-${Math.floor(Math.random() * 10000)}-${idx}`;

          const userProfile: UserProfile = {
            uid,
            accessCode,
            email: email || `${uid}@nota.church`,
            phone: phone || undefined,
            displayName: name,
            role,
            status: 'active',
            currentStreak: 0,
            totalTasksCompleted: 0,
            churchGroup: group || (isServant ? 'خدمة ثانوي' : 'شباب ثانوي'),
            assignedYouthIds: isServant ? [] : undefined,
            createdAt: now,
          };

          if (isServant) {
            parsedServants.push({ name, user: userProfile });
            newUsers.push(userProfile);
          }
        });

        // Pass 2: Parse Youths and link to Servants
        rawJson.forEach((row) => {
          const name = String(row['الاسم الثلاثي'] || row['الاسم'] || row['Name'] || '').trim();
          const roleStr = String(row['الرتبة / الدور (خادم أو مخدوم)'] || row['الدور'] || row['الرتبة'] || row['Role'] || '').trim();
          const servantNameInput = String(row['الخادم المسؤول (للمخدومين)'] || row['الخادم'] || row['الخادم المسؤول'] || '').trim();
          const isServant = roleStr.includes('خادم') || roleStr.toLowerCase() === 'servant';

          if (!name || isServant) return;

          const email = String(row['البريد الإلكتروني'] || row['البريد'] || row['Email'] || '').trim();
          const phone = String(row['رقم الهاتف'] || row['الموبايل'] || row['Phone'] || '').trim();
          const rawCode = String(row['كود الدخول (١٤ رقم)'] || row['الكود'] || row['Code'] || '').trim();
          const group = (row['الفصل / المجموعة الكنسية'] || row['المجموعة'] || row['الفصل'] || '').toString().trim();

          let accessCode = clean14DigitCode(rawCode);
          if (accessCode.length !== 14 || existingCodes.has(accessCode)) {
            accessCode = generate14DigitCode();
          }
          existingCodes.add(accessCode);

          const uid = `youth-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

          // Find assigned servant
          let assignedServantId: string | undefined = undefined;
          let assignedServantName: string | undefined = undefined;

          if (servantNameInput) {
            const foundServant =
              parsedServants.find((s) => s.name.includes(servantNameInput) || servantNameInput.includes(s.name)) ||
              existingUsers.find(
                (u) => u.role === 'servant' && (u.displayName.includes(servantNameInput) || servantNameInput.includes(u.displayName))
              );

            if (foundServant) {
              const sUser = 'user' in foundServant ? foundServant.user : foundServant;
              assignedServantId = sUser.uid;
              assignedServantName = sUser.displayName;
              if (sUser.assignedYouthIds) {
                sUser.assignedYouthIds.push(uid);
              }
            }
          }

          const youthProfile: UserProfile = {
            uid,
            accessCode,
            email: email || `${uid}@nota.church`,
            phone: phone || undefined,
            displayName: name,
            role: 'youth',
            status: 'active',
            assignedServantId,
            assignedServantName,
            currentStreak: 0,
            totalTasksCompleted: 0,
            churchGroup: group || 'شباب ثانوي',
            assignedAgpeyaHours: ['baker', 'sunset', 'sleep'],
            createdAt: now,
          };

          newUsers.push(youthProfile);
        });

        const servantsCount = newUsers.filter((u) => u.role === 'servant').length;
        const youthCount = newUsers.filter((u) => u.role === 'youth').length;

        resolve({
          success: true,
          totalParsed: newUsers.length,
          servantsCount,
          youthCount,
          users: newUsers,
          errors,
        });
      } catch (err) {
        const error = err as Error;
        resolve({
          success: false,
          totalParsed: 0,
          servantsCount: 0,
          youthCount: 0,
          users: [],
          errors: [`حدث خطأ أثناء قراءة ملف Excel: ${error?.message || 'تنسيق غير مدعوم'}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        totalParsed: 0,
        servantsCount: 0,
        youthCount: 0,
        users: [],
        errors: ['تعذر قراءة محتوى الملف من الجهاز.'],
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
