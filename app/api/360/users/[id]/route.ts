import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// 1. Cập nhật thông tin User (PATCH)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { email, fullName, department, role } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(fullName && { fullName }),
        ...(department && { department }),
        ...(role && { role }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Lỗi cập nhật user:', error);
    return NextResponse.json(
      { message: 'Không thể cập nhật nhân sự (Email có thể đã tồn tại hoặc ID không đúng).' },
      { status: 500 }
    );
  }
}

// 2. Xóa User theo ID (DELETE)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Tiến hành xóa user trong cơ sở dữ liệu
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa nhân sự thành công.' });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    return NextResponse.json(
      { message: 'Không thể xóa nhân sự này (Có thể đang có dữ liệu phân công liên quan).' },
      { status: 500 }
    );
  }
}