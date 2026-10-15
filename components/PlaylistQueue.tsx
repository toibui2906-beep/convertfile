'use client';

import React from 'react';

interface VideoItem {
  title: string;
  videoId: string;
  thumbnail: string;
  author: string;
  timestamp: string;
}

interface PlaylistQueueProps {
  playlist: VideoItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number, e: React.MouseEvent) => void;
  onMoveUp: (index: number, e: React.MouseEvent) => void;
  onMoveDown: (index: number, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export default function PlaylistQueue({
  playlist,
  currentIndex,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onClearAll,
}: PlaylistQueueProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col max-h-[600px]">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-800">
        <h3 className="font-bold text-sm text-zinc-200">Danh sách chờ ({playlist.length})</h3>
        {playlist.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-xs text-red-400 hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
        {playlist.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-10">Chưa có bài nào trong hàng đợi.</p>
        ) : (
          playlist.map((item, idx) => (
            <div 
              key={`${item.videoId}-${idx}`}
              onClick={() => onSelect(idx)}
              className={`group relative flex items-center gap-2 p-2 rounded-xl cursor-pointer transition border ${
                currentIndex === idx 
                  ? 'bg-red-600/20 border-red-600/50 text-white' 
                  : 'bg-zinc-950/50 border-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <span className="text-xs font-mono font-bold w-5 flex items-center justify-center text-zinc-500 shrink-0">
                {idx + 1}
              </span>
              <img src={item.thumbnail} alt={item.title} className="w-16 aspect-video object-cover rounded-lg bg-black shrink-0" />
              <div className="flex flex-col justify-center flex-1 min-w-0 pr-16">
                <h4 className="text-xs font-semibold line-clamp-1">{item.title}</h4>
                <span className="text-[10px] text-zinc-400">{item.author}</span>
              </div>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-90 group-hover:opacity-100">
                <button
                  onClick={(e) => onMoveUp(idx, e)}
                  disabled={idx === 0}
                  title="Chuyển lên trên"
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 text-[10px]"
                >
                  ▲
                </button>
                <button
                  onClick={(e) => onMoveDown(idx, e)}
                  disabled={idx === playlist.length - 1}
                  title="Chuyển xuống dưới"
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 text-[10px]"
                >
                  ▼
                </button>
                <button
                  onClick={(e) => onRemove(idx, e)}
                  title="Xóa khỏi danh sách"
                  className="p-1 rounded bg-zinc-800 hover:bg-red-600/30 hover:text-red-400 text-zinc-400 text-[10px]"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}