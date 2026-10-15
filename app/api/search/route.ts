import { NextResponse } from 'next/server';
import { unstable_rethrow } from 'next/navigation';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa tìm kiếm' }, { status: 400 });
    }

    const searchResult = await ytSearch({ query, pages: page });
    
    if (!searchResult || !searchResult.videos) {
      return NextResponse.json({ videos: [] });
    }

    const videos = searchResult.videos.map((v) => ({
      title: v.title || 'Không có tiêu đề',
      videoId: v.videoId || '',
      thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
      author: v.author?.name || 'Unknown',
      timestamp: v.timestamp || '--:--',
    })).filter(v => v.videoId);

    return NextResponse.json({ videos });
  } catch (error: any) {
    unstable_rethrow(error);
    console.error('API Search Error:', error);
    return NextResponse.json({ videos: [], error: error.message || 'Lỗi server' }, { status: 500 });
  }
}