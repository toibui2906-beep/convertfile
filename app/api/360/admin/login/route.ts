// app/api/360/admin/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs'; // Cài đặt: npm i bcryptjs && npm i -D @types/bcryptjs

export async function POST(request: Request) {
  try {
    const { account, password } = await request.json();

    if (!account || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu' },
        { status: 400 }
      );
    }

    // 1. Tìm user theo email/tài khoản
    const user = await prisma.user.findUnique({
      where: { email: account },
    });

    // Kiểm tra tài khoản có tồn tại và đúng role được phép đăng nhập không (ADMIN hoặc STAFF)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // 2. Kiểm tra mật khẩu mã hóa
    const passwordHash = (user as unknown as { password?: string }).password;
    const isPasswordValid =
      typeof passwordHash === 'string' && (await bcrypt.compare(password, passwordHash));
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // 3. Đăng nhập thành công -> Trả về thông tin user (gồm id, fullName, role để client lưu trữ)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role, // 'ADMIN' hoặc 'STAFF'
      },
    });

    // 4. Thiết lập cookie phiên làm việc chung cho hệ thống
    response.cookies.set('admin_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // Hạn dùng 1 ngày
    });

    // Nếu là ADMIN, bổ sung thêm cờ phụ (tùy chọn) để dễ nhận diện ở một số nơi nếu cần
    if (user.role === 'ADMIN') {
      response.cookies.set('isAdminLoggedIn', 'true', {
        httpOnly: false, // Cho phép client đọc nếu cần
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch (error) {
    console.error('Lỗi đăng nhập hệ thống:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi hệ thống' },
      { status: 500 }
    );
  }
}