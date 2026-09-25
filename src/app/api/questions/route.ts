import { NextRequest, NextResponse } from 'next/server';
import { HabitType } from '@/types';
import { getRandomAntiCheatQuestion } from '@/lib/antiCheatEngine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const habitType = (searchParams.get('type') || 'bible') as HabitType;

  try {
    const question = getRandomAntiCheatQuestion(habitType);
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
