import { NextRequest, NextResponse } from 'next/server';
import { OfflineAction } from '@/types';
import { checkRateLimit, sanitizeInput } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  const rateLimit = checkRateLimit(`sync_${ip}`, 20, 60 * 1000); // Max 20 sync requests per minute

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'تم تجاوز حد طلبات المزامنة؛ برجاء الانتظار.',
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
    const actions: OfflineAction[] = Array.isArray(body.actions) ? body.actions : [];

    // Limit maximum batch size to prevent DoS
    if (actions.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'حجم دفعة المزامنة يتجاوز الحد الأقصى المسموح (٥٠ عملية)',
        },
        { status: 400 }
      );
    }

    // Process & sanitize queued actions
    const processedIds: string[] = [];
    for (const action of actions) {
      if (!action?.id) continue;
      const cleanId = sanitizeInput(action.id, 100);
      processedIds.push(cleanId);
    }

    return NextResponse.json({
      success: true,
      syncedCount: processedIds.length,
      processedIds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync offline queue';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
