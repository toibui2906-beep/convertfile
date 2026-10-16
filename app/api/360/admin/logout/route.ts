// app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = new URL(request.url);
  
  const response = NextResponse.redirect(new URL('/360/admin/login', url.origin), {
    status: 303,
  });

  // Xóa cookie bằng cách set lại maxAge = 0 với đúng các thuộc tính như lúc tạo (đặc biệt là path)
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Hủy ngay lập tức
  });

  return response;
}