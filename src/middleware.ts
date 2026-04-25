import { NextRequest, NextResponse } from 'next/server';

type RateState = { count: number; windowStart: number };

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 120;

const rateStore: Map<string, RateState> =
  (globalThis as any).__dreamshopRateStore || new Map<string, RateState>();

if (!(globalThis as any).__dreamshopRateStore) {
  (globalThis as any).__dreamshopRateStore = rateStore;
}

function getClientKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const key = getClientKey(request);
  const now = Date.now();
  const current = rateStore.get(key);

  if (!current || now - current.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateStore.set(key, { count: 1, windowStart: now });
    return NextResponse.next();
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      }
    );
  }

  current.count += 1;
  rateStore.set(key, current);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

