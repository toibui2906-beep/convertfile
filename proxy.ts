import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. KIỂM TRA QUYỀN TRUY CẬP ADMIN (/360/admin)
  if (pathname.startsWith('/360/admin') && pathname !== '/360/admin/login') {
    const adminToken = request.cookies.get('admin_session')?.value;
    console.log('Admin Path:', pathname, '| Token:', adminToken);

    if (!adminToken) {
      const loginUrl = new URL('/360', request.url);
      loginUrl.searchParams.set('openLoginModal', 'true');
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. BẮT BUỘC ĐĂNG NHẬP CHO PHÂN HỆ ĐÁNH GIÁ (/360/evaluate HOẶC /evaluations)
  if (pathname.startsWith('/360/evaluate') || pathname.startsWith('/evaluations')) {
    const userToken = request.cookies.get('user_session')?.value || request.cookies.get('admin_session')?.value;
    console.log('Evaluate Path:', pathname, '| User Token:', userToken);

    if (!userToken) {
      const loginUrl = new URL('/360', request.url);
      loginUrl.searchParams.set('openLoginModal', 'true');
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Cập nhật matcher để middleware áp dụng cho cả /360/admin, /360/evaluate và /evaluations
export const config = {
  matcher: [
    '/360/admin/:path*',
    '/360/evaluate/:path*',
    '/evaluations/:path*',
  ],
};