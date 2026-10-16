import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Lấy danh sách nhân sự
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { fullName: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy danh sách user' }, { status: 500 });
  }
}

// Thêm nhân sự mới
export async function POST(request: Request) {
  try {
    const { email, fullName, department, role } = await request.json();
    const newUser = await prisma.user.create({
      data: { email, fullName, department, role: role || 'STAFF' },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tạo user (Email có thể đã tồn tại)' }, { status: 500 });
  }
}