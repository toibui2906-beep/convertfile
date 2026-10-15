import { NextResponse, connection } from 'next/server';

export async function GET(request: Request) {
  // Buộc Next.js chuyển route sang chế độ dynamic, tránh lỗi prerender khi dùng cacheComponents
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa tìm kiếm' }, { status: 400 });
    }

    // Danh sách các máy chủ Invidious công khai ổn định
    const instances = [
      'https://vid.puffyan.us',
      'https://invidious.projectsegfau.lt',
      'https://inv.nadeko.net'
    ];

    let rawData = null;

    // Vòng lặp dự phòng (fallback) qua các instance
    for (const instance of instances) {
      try {
        const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&page=${page}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          cache: 'no-store'
        });

        if (res.ok) {
          rawData = await res.json();
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!rawData || !Array.isArray(rawData)) {
      return NextResponse.json({ videos: [], error: 'Không thể kết nối đến máy chủ tìm kiếm.' }, { status: 500 });
    }

    const videos = rawData
      .filter((item: any) => item.type === 'video')
      .map((v: any) => ({
        title: v.title || 'Không có tiêu đề',
        videoId: v.videoId || '',
        thumbnail: v.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
        author: v.author || 'Unknown',
        timestamp: formatDuration(v.lengthSeconds || 0),
      }))
      .filter((v) => v.videoId);

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error('API Search Error:', error);
    return NextResponse.json({ videos: [], error: error.message || 'Lỗi hệ thống' }, { status: 500 });
  }
}

function formatDuration(seconds: number): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}