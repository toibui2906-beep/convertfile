// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  // So sánh với Mật khẩu Admin trong biến môi trường (.env)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    // Thiết lập Cookie phiên làm việc (HTTP-only)
    response.cookies.set('admin_session', 'authenticated_admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // Hạn dùng 1 ngày
    });
    return response;
  }

  return NextResponse.json({ message: 'Mật khẩu không đúng' }, { status: 401 });
}