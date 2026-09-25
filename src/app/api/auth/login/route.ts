import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, sanitizeInput } from '@/lib/security';
import { clean14DigitCode } from '@/lib/biometrics';
import { UserProfile } from '@/types';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  
  // Strict Rate Limiting on Authentication: max 6 attempts per minute per IP
  const rateLimit = checkRateLimit(`auth_login_${ip}`, 6, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `تم تجاوز الحد المسموح لمحاولات تسجيل الدخول لحماية الأمان. يرجى الانتظار ${rateLimit.retryAfterSeconds} ثانية.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimit.retryAfterSeconds.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const rawCode = typeof body.code === 'string' ? body.code : '';
    const cleanCode = clean14DigitCode(rawCode);

    if (cleanCode.length !== 14) {
      return NextResponse.json(
        {
          success: false,
          error: 'كود الدخول يجب أن يتكون من ١٤ رقماً بالضبط.',
        },
        { status: 400 }
      );
    }

    // Backend-Only Admin Verification
    // ADMIN_ACCESS_CODE is loaded from process.env (e.g. .env.local on server, never exposed in client bundle or Git)
    const serverAdminCode = process.env.ADMIN_ACCESS_CODE
      ? clean14DigitCode(process.env.ADMIN_ACCESS_CODE)
      : '';

    if (serverAdminCode && cleanCode === serverAdminCode) {
      const adminUser: UserProfile = {
        uid: 'admin-1',
        accessCode: cleanCode, // Retained in session memory for active session validation
        displayName: sanitizeInput(process.env.ADMIN_NAME || 'أ. بيتر إسحاق', 100),
        email: sanitizeInput(process.env.ADMIN_EMAIL || 'admin@nota.church', 100),
        phone: sanitizeInput(process.env.ADMIN_PHONE || '01220000001', 20),
        role: 'admin',
        status: 'active',
        currentStreak: 0,
        totalTasksCompleted: 0,
        churchGroup: sanitizeInput(
          process.env.ADMIN_CHURCH_GROUP || 'أمانة الخدمة - كنيسة السيدة العذراء مريم بالإسماعيلية',
          150
        ),
        createdAt: '2026-09-25',
      };

      return NextResponse.json({
        success: true,
        isAdmin: true,
        user: adminUser,
      });
    }

    // Not the server admin code - return status so client can check database/imported users
    return NextResponse.json({
      success: false,
      isAdmin: false,
      message: 'not_admin_code',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication verification failed';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
