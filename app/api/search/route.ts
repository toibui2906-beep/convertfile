import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails?: {
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
  const pageToken = searchParams.get('pageToken');

  try {
    if (!query) {
      return NextResponse.json({ error: 'Vui lòng nhập từ khóa tìm kiếm.' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const apiUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      apiUrl.searchParams.set('part', 'snippet');
      apiUrl.searchParams.set('type', 'video');
      apiUrl.searchParams.set('maxResults', '16');
      apiUrl.searchParams.set('q', query);
      apiUrl.searchParams.set('key', apiKey);
      if (pageToken) apiUrl.searchParams.set('pageToken', pageToken);

      const response = await fetch(apiUrl, { cache: 'no-store' });
      const data: {
        items?: YouTubeSearchItem[];
        nextPageToken?: string;
        error?: { message?: string };
      } = await response.json();
      if (!response.ok) {
        console.error('YouTube Data API search failed:', data.error?.message || response.status);
        return NextResponse.json(
          { error: 'YouTube Data API không thể tìm kiếm lúc này. Hãy kiểm tra API key và quota.' },
          { status: 502 }
        );
      }

      const videos = (data.items || []).map((item) => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail:
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
        author: item.snippet.channelTitle,
        timestamp: '--:--',
      }));

      return NextResponse.json({
        videos,
        nextPageToken: data.nextPageToken || null,
        hasMore: Boolean(data.nextPageToken),
      });
    }

    const result = await ytSearch({ query, pageStart: page, pageEnd: page });
    const videos = result.videos.map((video) => ({
      title: video.title,
      videoId: video.videoId,
      thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
      author: video.author.name,
      timestamp: video.timestamp,
    }));

    return NextResponse.json({ videos, nextPageToken: null, hasMore: videos.length > 0 });
  } catch (error) {
    console.error('YouTube search failed:', error);
    return NextResponse.json(
      {
        error: process.env.YOUTUBE_API_KEY
          ? 'Không thể tìm kiếm bằng YouTube Data API. Hãy kiểm tra cấu hình API key và quota.'
          : 'Không thể tìm kiếm YouTube từ server này. Trên Vercel, hãy cấu hình YOUTUBE_API_KEY để tránh phụ thuộc IP máy chủ.',
      },
      { status: 502 }
    );
  }
}