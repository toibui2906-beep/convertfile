import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ message: 'Thiếu mã token đánh giá' }, { status: 400 });
    }

    // Sử dụng đúng tên quan hệ trong Prisma Schema: evaluatee và survey
    const evaluationMap = await prisma.evaluationMap.findUnique({
      where: { token: token },
      include: {
        evaluator: true, 
        evaluatee: true, // Đúng tên theo model Prisma của bạn
        project: true,   
        survey: true,    // Đúng tên theo model Prisma của bạn
      },
    });

    if (!evaluationMap) {
      return NextResponse.json({ message: 'Không tìm thấy thông tin đánh giá' }, { status: 404 });
    }

    // Chuẩn hóa cấu trúc trả về để phía Frontend (page.tsx) dễ dàng map lại
    return NextResponse.json({
      ...evaluationMap,
      targetUser: evaluationMap.evaluatee, // Map sang targetUser cho khớp với giao diện frontend
      surveyResponse: evaluationMap.survey, // Map sang surveyResponse cho khớp với giao diện frontend
    });
  } catch (error) {
    console.error('Lỗi API GET Survey theo token:', error);
    return NextResponse.json({ message: 'Lỗi lấy thông tin lượt đánh giá' }, { status: 500 });
  }
}