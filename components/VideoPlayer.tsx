'use client';

interface VideoPlayerProps {
  currentVideo: { title: string; author: string } | null;
  hasItems: boolean;
}

export default function VideoPlayer({ currentVideo, hasItems }: VideoPlayerProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col">
      <h2 className="text-sm font-semibold text-zinc-400 mb-2">Đang phát & Tự động chuyển bài</h2>

      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-inner mb-3 relative">
        {/* Thẻ ID cố định để YouTube IFrame API gắn vào */}
        <div id="youtube-player" className="w-full h-full"></div>
        
        {!hasItems && (
          <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm border border-dashed border-zinc-800 z-10">
            Danh sách chờ trống. Hãy chọn bài hát bên dưới hoặc tìm kiếm!
          </div>
        )}
      </div>

      {currentVideo && (
        <div>
          <h3 className="text-base font-bold text-zinc-100">{currentVideo.title}</h3>
          <p className="text-xs text-zinc-400">{currentVideo.author}</p>
        </div>
      )}
    </div>
  );
}