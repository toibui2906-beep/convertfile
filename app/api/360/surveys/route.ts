import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CRITERIA_WEIGHTS: Record<string, number> = {
  TC1: 1.5, TC2: 2, TC3: 2, TC4: 1.5, TC5: 1.5,
  TC6: 2, TC7: 2, TC8: 1.5, TC9: 1.5, TC10: 1.5,
  TC11: 1.5, TC12: 2, TC13: 2, TC14: 1.5, TC15: 2,
  TC16: 2, TC17: 1.5, TC18: 1.5, TC19: 1, TC20: 1,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { evaluationMapId, scores } = body;

    // 1. Tìm EvaluationMap kèm theo thông tin Project
    const evaluationMap = await prisma.evaluationMap.findUnique({
      where: { token: evaluationMapId },
      include: { project: true }, // Lấy thêm thông tin dự án để check trạng thái đóng/mở
    });

    if (!evaluationMap) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thông tin đánh giá!' }, { status: 404 });
    }

    // 2. Chặn nếu dự án đã bị Admin đóng (isActive = false)
    if (evaluationMap.project && !evaluationMap.project.isActive) {
      return NextResponse.json({ 
        success: false, 
        message: 'Đợt đánh giá này đã bị đóng và chốt sổ. Bạn không thể nộp hoặc chỉnh sửa phiếu nữa!' 
      }, { status: 400 });
    }

    // 3. Nếu cá nhân đã hoàn thành và Admin chưa mở khóa thì chặn
    if (evaluationMap.isCompleted) {
      return NextResponse.json({ 
        success: false, 
        message: 'Phiếu đánh giá này đã được khóa. Vui lòng liên hệ Admin để được mở khóa làm lại!' 
      }, { status: 400 });
    }

    let totalWeightedScore = 0;
    let totalWeights = 0;

    for (const [id, score] of Object.entries(scores)) {
      const weight = CRITERIA_WEIGHTS[id] || 1;
      totalWeightedScore += (Number(score) * weight);
      totalWeights += weight;
    }

    const avgTotalScore = totalWeights > 0 ? Number((totalWeightedScore / totalWeights).toFixed(2)) : 0;
    const trustPercent = Number(((avgTotalScore / 5) * 100).toFixed(1));

    let classification = "Không tín nhiệm";
    if (avgTotalScore >= 4.5) {
      classification = "Tín nhiệm cao";
    } else if (avgTotalScore >= 3.5) {
      classification = "Tín nhiệm";
    } else if (avgTotalScore >= 2.5) {
      classification = "Trung bình";
    } else if (avgTotalScore >= 2.0) {
      classification = "Tín nhiệm thấp";
    } else {
      classification = "Không tín nhiệm";
    }

    // 4. Thực hiện transaction lưu kết quả và đổi trạng thái hoàn thành của phiếu
    const [surveyResponse] = await prisma.$transaction([
      prisma.surveyResponse.upsert({
        where: { evaluationMapId: evaluationMap.id },
        update: {
          scores,
          avgTotalScore,
          trustPercent,
          classification,
        },
        create: {
          evaluationMapId: evaluationMap.id,
          scores,
          avgTotalScore,
          trustPercent,
          classification,
        },
      }),
      prisma.evaluationMap.update({
        where: { id: evaluationMap.id },
        data: { isCompleted: true },
      }),
    ]);

    return NextResponse.json({ success: true, surveyResponse });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}