import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Lấy danh sách dự án / đợt đánh giá
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        evaluations: true, // Bao gồm thông tin liên quan nếu cần thiết
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi lấy danh sách dự án' },
      { status: 500 }
    );
  }
}

// Thêm dự án / đợt đánh giá mới
export async function POST(request: Request) {
  try {
    const { title, startDate, endDate, isActive } = await request.json();

    const newProject = await prisma.project.create({
      data: {
        title,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi tạo dự án mới' },
      { status: 500 }
    );
  }
}