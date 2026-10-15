'use client';

interface VideoItem {
  title: string;
  videoId: string;
  thumbnail: string;
  author: string;
  timestamp: string;
}

interface VideoGridProps {
  videos: VideoItem[];
  onAdd: (video: VideoItem) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export default function VideoGrid({ videos, onAdd, onLoadMore, hasMore = true, loadingMore = false }: VideoGridProps) {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      <h2 className="text-xl font-bold text-zinc-100">Kho bài hát / Gợi ý (Bấm để thêm vào danh sách chờ)</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((vid, index) => (
          <div 
            key={`${vid.videoId}-${index}`} 
            onClick={() => onAdd(vid)} // Đưa sự kiện click ra thẻ bao ngoài cùng để nhận diện toàn bộ khung card
            className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition flex flex-col cursor-pointer"
          >
            <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
              <img 
                src={vid.thumbnail} 
                alt={vid.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
              />
              <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded font-mono text-white">
                {vid.timestamp}
              </span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                  + Thêm vào danh sách
                </span>
              </div>
            </div>
            <div className="p-3 flex flex-col flex-1 justify-between">
              <h3 className="font-semibold text-sm line-clamp-2 text-zinc-200 group-hover:text-red-400 transition mb-1">
                {vid.title}
              </h3>
              <p className="text-xs text-gray-400">{vid.author}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nút Lazy Load / Tải thêm */}
      {onLoadMore && hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLoadMore();
            }}
            disabled={loadingMore}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-6 py-3 rounded-xl transition border border-zinc-700 disabled:opacity-50 text-sm shadow"
          >
            {loadingMore ? 'Đang tải thêm video...' : '⬇ Tải thêm kết quả (Load More)'}
          </button>
        </div>
      )}
    </div>
  );
}