import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUsers, saveUser } from '@backend/lib/db';

const shortDelay = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
};

export async function GET(_request: NextRequest) {
  try {
    await shortDelay();
    const { searchParams } = new URL(_request.url);
    const email = searchParams.get('email');

    if (email) {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: user,
        message: 'User retrieved successfully',
      });
    }

    const users = await getUsers();
    return NextResponse.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await shortDelay();
    const body = await request.json();
    const { username, mobile, email, password, address } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);

    const userData = existingUser
      ? {
          id: existingUser.id,
          email,
          firstName: username || existingUser.firstName || email.split('@')[0],
          lastName: existingUser.lastName || '',
          phone: mobile || existingUser.phone,
          address: address || existingUser.address,
          role: existingUser.role || 'client',
          password: password || (existingUser as any).password,
        }
      : {
          email,
          firstName: username || email.split('@')[0],
          lastName: '',
          role: 'client' as const,
          phone: mobile || undefined,
          address: address || undefined,
          isEmailVerified: false,
          password,
        };

    const savedUser = await saveUser(userData as any);

    return NextResponse.json(
      {
        success: true,
        data: savedUser,
        message: existingUser ? 'User updated successfully' : 'User created successfully',
      },
      { status: existingUser ? 200 : 201 }
    );
  } catch (error: any) {
    console.error('Save user error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
