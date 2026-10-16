import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);

  try {
    if (!query) {
      return NextResponse.json({ error: 'Vui lòng nhập từ khóa tìm kiếm.' }, { status: 400 });
    }

    // Cào kết quả tìm kiếm bằng yt-search
    const result = await ytSearch({ query, pageStart: page, pageEnd: page });
    const videos = result.videos.map((video) => ({
      title: video.title,
      videoId: video.videoId,
      thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
      author: video.author.name,
      timestamp: video.timestamp,
    }));

    return NextResponse.json({
      videos,
      nextPageToken: null,
      hasMore: videos.length > 0,
    });
  } catch (error) {
    console.error('YouTube search failed:', error);
    return NextResponse.json(
      { error: 'Không thể tìm kiếm video lúc này.' },
      { status: 502 }
    );
  }
}