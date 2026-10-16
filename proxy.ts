import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra nếu truy cập vào các đường dẫn admin nhưng không phải trang login
  if (pathname.startsWith('/360/admin') && pathname !== '/360/admin/login') {
    const adminToken = request.cookies.get('admin_session')?.value;
    console.log('Path:', pathname, '| Token:', adminToken); // Kiểm tra console của terminal

    if (!adminToken) {
      // Dùng dấu gạch chéo '/' ở đầu để đảm bảo đường dẫn tuyệt đối, tránh bị lặp URL
      const loginUrl = new URL('/360/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/360/admin/:path*'],
};