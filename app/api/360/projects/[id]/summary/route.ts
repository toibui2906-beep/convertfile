import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: Tải thông tin dự án, tính toán và trả về bảng tổng kết
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params bằng await (Bắt buộc trong Next.js mới)
    const { id: projectId } = await params;

    // Lấy thông tin dự án
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, title: true, isActive: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy dự án!' }, { status: 404 });
    }

    // Lấy tất cả các phiếu đánh giá thuộc project này kèm kết quả
    const evaluationMaps = await prisma.evaluationMap.findMany({
      where: { projectId },
      include: { survey: true },
    });

    // Gom nhóm theo evaluateeId (Người được đánh giá)
    const userMap: Record<string, { scores: number[]; trustPercents: number[]; completed: number; total: number }> = {};

    evaluationMaps.forEach((map) => {
      const evaluateeId = map.evaluateeId;
      if (!userMap[evaluateeId]) {
        userMap[evaluateeId] = { scores: [], trustPercents: [], completed: 0, total: 0 };
      }

      userMap[evaluateeId].total += 1;

      if (map.isCompleted && map.survey) {
        userMap[evaluateeId].completed += 1;
        userMap[evaluateeId].scores.push(map.survey.avgTotalScore);
        userMap[evaluateeId].trustPercents.push(map.survey.trustPercent);
      }
    });

    // Tính toán và lưu vào ProjectSummary
    const summaryPromises = Object.entries(userMap).map(async ([userId, data]) => {
      const totalEvaluators = data.total;
      const completedCount = data.completed;

      if (completedCount === 0) return null; 

      const avgScoreSum = data.scores.reduce((a, b) => a + b, 0);
      const avgTotalScore = Number((avgScoreSum / completedCount).toFixed(2));

      const trustSum = data.trustPercents.reduce((a, b) => a + b, 0);
      const trustPercent = Number((trustSum / completedCount).toFixed(1));

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

      return (prisma as any).projectSummary.upsert({
        where: {
          projectId_userId: { projectId, userId },
        },
        update: {
          totalEvaluators,
          completedCount,
          avgTotalScore,
          trustPercent,
          classification,
        },
        create: {
          projectId,
          userId,
          totalEvaluators,
          completedCount,
          avgTotalScore,
          trustPercent,
          classification,
        },
      });
    });

    await Promise.all(summaryPromises);

    // Lấy danh sách kết quả tổng kết kèm thông tin user
    const summaries = await (prisma as any).projectSummary.findMany({
      where: { projectId },
      include: { user: true },
      orderBy: { avgTotalScore: 'desc' },
    });

    return NextResponse.json({ success: true, project, summaries });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. PATCH: Dùng để Admin thay đổi trạng thái Đóng / Mở dự án (isActive)
export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params bằng await
    const { id: projectId } = await params;
    const { isActive } = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { isActive },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}