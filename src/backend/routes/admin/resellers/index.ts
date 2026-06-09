import { NextResponse } from 'next/server';
import { getResellers } from '@backend/lib/db';

export async function GET() {
  try {
    const resellers = await getResellers(true);
    return NextResponse.json({ success: true, data: resellers });
  } catch (error) {
    console.error('Admin get resellers error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
