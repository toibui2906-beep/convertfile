import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT: Cập nhật tiêu chí
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stt, category, title, description, weight } = body;

    // const updated = await db.criteria.update({
    //   where: { id },
    //   data: { stt: Number(stt), category, title, description, weight: Number(weight) }
    // });

    return NextResponse.json({ message: 'Cập nhật thành công', data: body });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi cập nhật tiêu chí' }, { status: 500 });
  }
}

// DELETE: Xóa tiêu chí
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // await db.criteria.delete({ where: { id } });

    return NextResponse.json({ message: 'Xóa tiêu chí thành công' });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi khi xóa tiêu chí' }, { status: 500 });
  }
}