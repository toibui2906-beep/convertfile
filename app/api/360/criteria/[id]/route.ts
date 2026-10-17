import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT: Cập nhật tiêu chí theo ID
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stt, category, title, description, weight, projectId } = body;

    // Kiểm tra xem tiêu chí có tồn tại trong Database không trước khi cập nhật
    const existingCriteria = await prisma.criteria.findUnique({
      where: { id },
    });

    if (!existingCriteria) {
      return NextResponse.json(
        { message: 'Không tìm thấy tiêu chí cần cập nhật' },
        { status: 404 }
      );
    }

    // Thực hiện cập nhật bằng Prisma
    const updated = await prisma.criteria.update({
      where: { id },
      data: {
        ...(stt !== undefined && { stt: Number(stt) }),
        ...(category !== undefined && { category }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(weight !== undefined && { weight: Number(weight) }),
        ...(projectId !== undefined && { projectId }),
      },
    });

    return NextResponse.json(
      { message: 'Cập nhật tiêu chí thành công', data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi cập nhật tiêu chí:', error);
    return NextResponse.json(
      { message: 'Lỗi cập nhật tiêu chí', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Xóa tiêu chí theo ID
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Kiểm tra xem tiêu chí có tồn tại trong Database không trước khi xóa
    const existingCriteria = await prisma.criteria.findUnique({
      where: { id },
    });

    if (!existingCriteria) {
      return NextResponse.json(
        { message: 'Không tìm thấy tiêu chí cần xóa' },
        { status: 404 }
      );
    }

    // Thực hiện xóa bằng Prisma
    await prisma.criteria.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Xóa tiêu chí thành công', id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi khi xóa tiêu chí:', error);
    return NextResponse.json(
      { message: 'Lỗi khi xóa tiêu chí', error: (error as Error).message },
      { status: 500 }
    );
  }
}