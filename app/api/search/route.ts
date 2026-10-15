import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query) {
    return NextResponse.json({ error: 'Thiếu từ khóa' }, { status: 400 });
  }

  try {
    // yt-search hỗ trợ phân trang hoặc lấy danh sách nhiều hơn qua các trang
    const searchResult = await ytSearch({ query, pages: page });
    const videos = searchResult.videos.map((v) => ({
      title: v.title,
      videoId: v.videoId,
      thumbnail: v.thumbnail,
      author: v.author.name,
      timestamp: v.timestamp,
    }));

    return NextResponse.json({ videos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}