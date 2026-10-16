import { NextResponse } from 'next/server';
// import { db } from '@/lib/db'; // Đường dẫn đến prisma client của bạn

// GET: Lấy danh sách tiêu chí
export async function GET() {
  try {
    // const criteria = await db.criteria.findMany({ orderBy: { stt: 'asc' } });
    
    // Dữ liệu mẫu (thay thế bằng db.criteria.findMany khi đã cấu hình DB)
    const criteria = [
      { id: 'TC1', stt: 1, category: 'I. PHẨM CHẤT CỦA CBNV', title: 'Yêu nước', description: 'Suy nghĩ và hành động vì lợi ích chung...', weight: 1.5 },
    ];

    return NextResponse.json(criteria);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi tải danh sách tiêu chí' }, { status: 500 });
  }
}

// POST: Thêm mới tiêu chí
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stt, category, title, description, weight } = body;

    // const newCriteria = await db.criteria.create({
    //   data: { stt: Number(stt), category, title, description, weight: Number(weight) }
    // });

    return NextResponse.json({ message: 'Thêm tiêu chí thành công', data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi khi thêm tiêu chí' }, { status: 500 });
  }
}