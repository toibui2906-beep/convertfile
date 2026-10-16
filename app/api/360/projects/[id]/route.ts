import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Định nghĩa params là một Promise theo chuẩn Next.js 15+
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Lấy chi tiết một dự án
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // Thêm await ở đây
    const project = await prisma.project.findUnique({
      where: { id },
      include: { evaluations: true },
    });

    if (!project) {
      return NextResponse.json({ message: 'Không tìm thấy dự án' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy thông tin dự án' }, { status: 500 });
  }
}

// Cập nhật dự án
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // Thêm await ở đây
    const body = await request.json();

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi cập nhật dự án' }, { status: 500 });
  }
}

// Xóa dự án
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // Thêm await ở đây
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Xóa dự án thành công' });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi khi xóa dự án' }, { status: 500 });
  }
}