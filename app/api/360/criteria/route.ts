import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Đảm bảo đường dẫn này trỏ đúng tới Prisma Client của bạn

// GET: Lấy danh sách tiêu chí từ Database, sắp xếp theo stt tăng dần
export async function GET(request: Request) {
  try {
    // Lấy thêm query param 'projectId' nếu bạn muốn lọc theo dự án (tùy chọn)
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Nếu có projectId, có thể lọc theo project hoặc lấy chung (tùy logic hệ thống của bạn)
    // Ở đây mình lấy tất cả hoặc lọc theo projectId nếu được truyền vào
    const criteria = await prisma.criteria.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { stt: 'asc' },
    });

    return NextResponse.json(criteria, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tiêu chí:', error);
    return NextResponse.json(
      { message: 'Lỗi tải danh sách tiêu chí', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: Thêm mới tiêu chí vào Database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stt, category, title, description, weight, projectId } = body;

    // Kiểm tra các trường bắt buộc cơ bản
    if (stt === undefined || !category || !title || weight === undefined) {
      return NextResponse.json(
        { message: 'Thiếu các trường bắt buộc (stt, category, title, weight)' },
        { status: 400 }
      );
    }

    // Tạo mới bản ghi trong Database bằng Prisma
    const newCriteria = await prisma.criteria.create({
      data: {
        stt: Number(stt),
        category,
        title,
        description: description || '',
        weight: Number(weight),
        projectId: projectId || null, // Nếu không truyền thì để null (dùng chung toàn hệ thống)
      },
    });

    return NextResponse.json(
      { message: 'Thêm tiêu chí thành công', data: newCriteria },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi khi thêm tiêu chí:', error);
    return NextResponse.json(
      { message: 'Lỗi khi thêm tiêu chí', error: (error as Error).message },
      { status: 500 }
    );
  }
}