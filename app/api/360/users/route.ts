import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

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

    // BẮT BUỘC: Băm (hash) mật khẩu bằng bcryptjs trước khi lưu vào DB
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword, // Lưu chuỗi đã mã hóa
        department: department || 'Khoa Cấp Cứu',
        role: role || 'STAFF',
      },
    });

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