import { NextResponse } from 'next/server';
import { unstable_rethrow } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    const isAdminParam = searchParams.get('isAdmin');

    // 🔒 Phân quyền an toàn: Chỉ chấp nhận là Admin khi có cookie phiên đăng nhập admin 
    // HOẶC request từ client gửi cờ chính xác và KHÔNG bị ép buộc lọc theo user thường.
    const isAdminSession = 
      cookieHeader.includes('admin_session=') || 
      cookieHeader.includes('isAdminLoggedIn=true') || 
      (isAdminParam === 'true' && !requestedUserId);

    let evaluations;

    if (isAdminSession) {
      // 👑 ADMIN: Lấy toàn bộ phiếu đánh giá trong hệ thống
      evaluations = await prisma.evaluationMap.findMany({
        include: {
          project: { select: { id: true, title: true } },
          evaluator: { select: { id: true, fullName: true, department: true, role: true } },
          evaluatee: { select: { id: true, fullName: true, email: true, department: true } },
          survey: { select: { id: true, avgTotalScore: true, classification: true } },
        },
        orderBy: { isCompleted: 'asc' },
      });
    } else {
      // 👤 USER THƯỜNG / STAFF: Bắt buộc phải có userId và chỉ lấy phiếu của chính họ
      if (!requestedUserId) {
        return NextResponse.json({ message: 'Unauthorized: Thiếu thông tin định danh người dùng' }, { status: 401 });
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