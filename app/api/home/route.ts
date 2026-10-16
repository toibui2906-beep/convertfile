import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET() {
  try {
    // Dùng từ khóa xu hướng phổ biến để cào danh sách video nổi bật
    const result = await ytSearch('trending music 2026'); 
    
    const videos = result.videos.slice(0, 16).map((video) => ({
      title: video.title,
      videoId: video.videoId,
      thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
      author: video.author.name,
      timestamp: video.timestamp,
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('YouTube trending failed:', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách thịnh hành lúc này.' },
      { status: 502 }
    );
  }
}