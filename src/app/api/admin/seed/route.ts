import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DatabaseSchema } from '@backend/schemas/database';
import { writeJsonStore } from '@backend/lib/jsonStore';

const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'backend', 'database', 'database.json');

function unauthorized(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const seedToken = process.env.DB_SEED_TOKEN;
  if (!seedToken) {
    return NextResponse.json(
      { success: false, error: 'DB_SEED_TOKEN is not configured on the server' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized('Missing Authorization header');
  }
  const providedToken = authHeader.slice('Bearer '.length).trim();
  if (providedToken !== seedToken) {
    return unauthorized('Invalid token');
  }

  try {
    const body = await request.json().catch(() => null);
    let payload = body?.data;

    if (!payload) {
      const fileContents = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
      payload = JSON.parse(fileContents);
    }

    const parsed = DatabaseSchema.parse(payload);
    await writeJsonStore('database', parsed, { fileName: 'database' });

    return NextResponse.json({
      success: true,
      message: 'Database seed completed',
      data: {
        products: parsed.products.length,
        categories: parsed.categories.length,
        colors: parsed.colors.length,
        orders: parsed.orders.length,
        users: parsed.users.length,
      },
    });
  } catch (error) {
    console.error('Database seed error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Use POST with the proper Authorization header to seed the database' },
    { status: 405 }
  );
}

