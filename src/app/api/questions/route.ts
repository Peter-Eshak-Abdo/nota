import { NextRequest, NextResponse } from 'next/server';
import { HabitType } from '@/types';
import { getQuestionForHabit } from '@/lib/antiCheatEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const habitType = (searchParams.get('type') || 'bible') as HabitType;
  const bookName = searchParams.get('book') || undefined;
  const chapterStr = searchParams.get('chapter');
  const chapterNumber = chapterStr ? parseInt(chapterStr, 10) : undefined;

  try {
    const question = getQuestionForHabit(habitType, bookName, chapterNumber);
    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate situational question',
      },
      { status: 500 }
    );
  }
}
