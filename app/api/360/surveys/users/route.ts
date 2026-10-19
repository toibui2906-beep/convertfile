import { NextResponse } from 'next/server';
import { unstable_rethrow } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    const userRole = searchParams.get('role'); // Nhận role từ client gửi lên (hoặc lấy từ session/cookie)

    let evaluations;

    // 👑 Nếu role là ADMIN -> Lấy toàn bộ phiếu trong hệ thống
    if (userRole === 'ADMIN') {
      evaluations = await prisma.evaluationMap.findMany({
        include: {
          project: { select: { id: true, title: true } },
          evaluator: { select: { id: true, fullName: true, department: true, role: true } },
          evaluatee: { select: { id: true, fullName: true, email: true, department: true } },
          survey: { select: { id: true, avgTotalScore: true, classification: true } },
        },
        orderBy: { isCompleted: 'asc' },
      });
    } 
    // 👤 Nếu role là STAFF (hoặc không phải admin) -> Bắt buộc phải có userId và chỉ lấy phiếu của đúng user đó
    else {
      if (!requestedUserId) {
        return NextResponse.json(
          { message: 'Unauthorized: Thiếu thông tin định danh người dùng (userId)' }, 
          { status: 401 }
        );
      }

      evaluations = await prisma.evaluationMap.findMany({
        where: { 
          evaluatorId: requestedUserId // Chỉ lấy đúng các phiếu mà user này phải đi đánh giá
        },
        include: {
          project: { select: { id: true, title: true } },
          evaluatee: { select: { id: true, fullName: true, email: true, department: true } },
          survey: { select: { id: true, avgTotalScore: true, classification: true } },
        },
        orderBy: { isCompleted: 'asc' },
      });
    }

    const formatted = evaluations.map((item: any) => ({
      id: item.id,
      projectId: item.projectId,
      project: item.project,
      evaluatee: item.evaluatee,
      isCompleted: item.isCompleted,
      survey: item.survey,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    unstable_rethrow(error);
    console.error('Lỗi API surveys/users:', error);
    return NextResponse.json({ message: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}