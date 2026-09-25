import { NextRequest, NextResponse } from 'next/server';
import { HabitType } from '@/types';
import { getQuestionForHabit } from '@/lib/antiCheatEngine';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  const rateLimit = checkRateLimit(`questions_${ip}`, 30, 60 * 1000); // Max 30 requests per minute

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'تم تجاوز الحد المسموح به من الطلبات مؤقتاً؛ برجاء الانتظار قليلاً.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimit.retryAfterSeconds.toString(),
        },
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const rawHabitType = searchParams.get('type') || 'bible';
  const rawBookName = searchParams.get('book') || undefined;
  const chapterStr = searchParams.get('chapter');

  const habitType = sanitizeInput(rawHabitType, 30) as HabitType;
  const bookName = rawBookName ? sanitizeInput(rawBookName, 50) : undefined;
  const chapterNumber = chapterStr ? Math.max(1, parseInt(chapterStr, 10) || 1) : undefined;

  try {
    const question = getQuestionForHabit(habitType, bookName, chapterNumber);
    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate situational question';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
