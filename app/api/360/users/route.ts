import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

// 1. Phương thức GET: Lấy danh sách nhân sự
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        department: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    return NextResponse.json(
      { message: 'Không thể tải danh sách nhân sự.', error: String(error) },
      { status: 500 }
    );
  }
}

// 2. Phương thức POST: Tạo nhân sự mới (giữ nguyên logic của bạn)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, department, role } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ các trường bắt buộc.' },
        { status: 400 }
      );
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email này đã tồn tại trong hệ thống.' },
        { status: 400 }
      );
    }

    // Băm (hash) mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        department: department || 'Khoa Cấp Cứu',
        role: role || 'STAFF',
      },
    });

    // Loại bỏ password trước khi trả về client
    const { password: _, ...userWithoutPassword } = newUser as any;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Lỗi tạo user:', error);
    return NextResponse.json(
      { message: 'Không thể tạo nhân sự mới.' },
      { status: 500 }
    );
  }
}