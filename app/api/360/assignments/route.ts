import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Lấy danh sách phân công theo projectId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    const assignments = await prisma.evaluationMap.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        evaluator: true,
        evaluatee: true,
        survey: true,
      },
      orderBy: { evaluator: { fullName: 'asc' } },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy danh sách phân công' }, { status: 500 });
  }
}

// Tạo phân công mới (Ai đánh giá ai trong Project)
export async function POST(request: Request) {
  try {
    const { projectId, evaluatorId, evaluateeId } = await request.json();

    if (!projectId || !evaluatorId || !evaluateeId) {
      return NextResponse.json({ message: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    if (evaluatorId === evaluateeId) {
      return NextResponse.json({ message: 'Không thể tự đánh giá chính mình!' }, { status: 400 });
    }

    const newAssignment = await prisma.evaluationMap.create({
      data: {
        projectId,
        evaluatorId,
        evaluateeId,
      },
      include: {
        evaluator: true,
        evaluatee: true,
      },
    });

    return NextResponse.json(newAssignment);
  } catch (error) {
    return NextResponse.json({ message: 'Phân công này đã tồn tại trong đợt đánh giá.' }, { status: 500 });
  }
}

// Xóa phân công
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ message: 'Thiếu ID phân công' }, { status: 400 });

  try {
    await prisma.evaluationMap.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi xóa phân công' }, { status: 500 });
  }
}