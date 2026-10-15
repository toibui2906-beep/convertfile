import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET() {
  try {
    // Lấy danh sách video gợi ý/phổ biến dựa trên từ khóa chung hoặc trending
    const searchResult = await ytSearch('Vietnam music trending news 2026');
    const videos = searchResult.videos.slice(0, 16).map((v) => ({
      title: v.title,
      videoId: v.videoId,
      thumbnail: v.thumbnail,
      author: v.author.name,
      timestamp: v.timestamp,
      views: v.views,
    }));

    return NextResponse.json({ videos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lấy trang chủ' }, { status: 500 });
  }
}