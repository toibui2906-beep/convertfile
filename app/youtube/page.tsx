'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import VideoPlayer from '@/components/VideoPlayer';
import PlaylistQueue from '@/components/PlaylistQueue';
import VideoGrid from '@/components/VideoGrid';

interface VideoItem {
  title: string;
  videoId: string;
  thumbnail: string;
  author: string;
  timestamp: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Home() {
  const [inputVal, setInputVal] = useState<string>('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [currentQuery, setCurrentQuery] = useState<string>('trending music 2026');
  const [page, setPage] = useState<number>(1);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [playlist, setPlaylist] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const playerRef = useRef<any>(null);
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  
  // Dùng ref để lưu trữ videoId đang phát thực tế, tránh reload oan khi thêm bài vào queue
  const loadedVideoIdRef = useRef<string | null>(null);

  // 1. Tải YouTube IFrame API script khi mở trang
  useEffect(() => {
    fetchVideos('trending music 2026', 1, false);

    if (window.YT && window.YT.Player) {
      setApiLoaded(true);
    } else {
      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };

      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }, []);

  // 2. Quản lý việc khởi tạo và phát video thông minh (Không reload khi thêm bài mới)
  useEffect(() => {
    if (!apiLoaded || playlist.length === 0) return;

    const targetVideo = playlist[currentIndex];
    if (!targetVideo || !targetVideo.videoId) return;

    // Nếu videoId hiện tại trùng khớp với bài đang phát thì bỏ qua (tránh reload khi thêm bài khác vào queue)
    if (loadedVideoIdRef.current === targetVideo.videoId) return;

    // Cập nhật lại ref videoId đang phát
    loadedVideoIdRef.current = targetVideo.videoId;

    if (!playerRef.current) {
      const playerElement = document.getElementById('youtube-player');
      if (!playerElement) return;

      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: targetVideo.videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            // Khi video kết thúc (Mã 0) -> Tự động chuyển bài tiếp theo
            if (event.data === 0) {
              setCurrentIndex((prevIndex) => (prevIndex < playlist.length - 1 ? prevIndex + 1 : prevIndex));
            }
          },
        },
      });
    } else {
      if (typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(targetVideo.videoId);
      }
    }
  }, [currentIndex, playlist, apiLoaded]);

  const fetchVideos = async (query: string, pageNum: number, isAppend: boolean, pageToken?: string | null) => {
    if (pageNum === 1) {
      setLoading(true);
      setSearchError(null);
      setVideos([]);
    }
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({ q: query, page: String(pageNum) });
      if (pageToken) params.set('pageToken', pageToken);
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Không thể tìm kiếm video lúc này.');
      }
      const foundVideos: VideoItem[] = data.videos || [];
      setVideos((previous) => isAppend ? [...previous, ...foundVideos] : foundVideos);
      setNextPageToken(data.nextPageToken || null);
      setHasMore(Boolean(data.hasMore));
    } catch (error) {
      console.error(error);
      setSearchError(error instanceof Error ? error.message : 'Không thể tìm kiếm video lúc này.');
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(currentQuery, nextPage, true, nextPageToken);
  };

  const extractVideoId = (url: string): string | null => {
    let videoId = null;
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1]?.split('&')[0];
    else if (url.includes('embed/')) videoId = url.split('embed/')[1]?.split('?')[0];
    return videoId;
  };

  const addToPlaylist = (video: VideoItem) => {
    setPlaylist((prev) => {
      const newPlaylist = [...prev, video];
      if (prev.length === 0) {
        setCurrentIndex(0);
      }
      return newPlaylist;
    });
  };

  const removeFromPlaylist = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaylist((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (updated.length === 0) {
        setCurrentIndex(0);
        loadedVideoIdRef.current = null;
        if (playerRef.current?.destroy) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      } else if (indexToRemove === currentIndex) {
        setCurrentIndex(indexToRemove >= updated.length ? updated.length - 1 : indexToRemove);
      } else if (indexToRemove < currentIndex) {
        setCurrentIndex((p) => p - 1);
      }
      return updated;
    });
  };

  const moveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    setPlaylist((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      if (currentIndex === index) setCurrentIndex(index - 1);
      else if (currentIndex === index - 1) setCurrentIndex(index);
      return updated;
    });
  };

  const moveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaylist((prev) => {
      if (index === prev.length - 1) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      if (currentIndex === index) setCurrentIndex(index + 1);
      else if (currentIndex === index + 1) setCurrentIndex(index);
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) {
      setCurrentQuery('trending music 2026');
      setPage(1);
      setNextPageToken(null);
      setHasMore(true);
      fetchVideos('trending music 2026', 1, false);
      return;
    }

    const extractedId = extractVideoId(query);
    if (extractedId) {
      addToPlaylist({
        title: `Video trực tiếp (${extractedId})`,
        videoId: extractedId,
        thumbnail: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
        author: 'Custom Link',
        timestamp: '--:--',
      });
      setInputVal('');
      return;
    }

    setCurrentQuery(query);
    setPage(1);
    setNextPageToken(null);
    setHasMore(true);
    fetchVideos(query, 1, false);
  };

  const currentVideo = playlist[currentIndex] || null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 shadow">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => {
            setInputVal('');
            setCurrentQuery('trending music 2026');
            setPage(1);
            setNextPageToken(null);
            setHasMore(true);
            fetchVideos('trending music 2026', 1, false);
          }}
        >
          <span className="bg-red-600 text-white font-black px-3 py-1 rounded-lg tracking-wider text-lg">YouTube</span>
        </div>
      </header>

      {/* Nội dung chính */}
      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái: Form tìm kiếm & Trình phát */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SearchBar inputVal={inputVal} setInputVal={setInputVal} onSubmit={handleSubmit} loading={loading} />
          <VideoPlayer currentVideo={currentVideo} hasItems={playlist.length > 0} />
        </div>

        {/* Cột phải: Hàng đợi Playlist */}
        <PlaylistQueue 
          playlist={playlist}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          onRemove={removeFromPlaylist}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onClearAll={() => {
            setPlaylist([]);
            setCurrentIndex(0);
            loadedVideoIdRef.current = null;
            if (playerRef.current?.destroy) {
              playerRef.current.destroy();
              playerRef.current = null;
            }
          }}
        />

      </div>

      {/* Kho bài hát / Gợi ý với tính năng Lazy Load */}
      {searchError && (
        <p role="alert" className="mx-auto w-full max-w-7xl px-4 text-sm text-red-400 md:px-8">
          {searchError}
        </p>
      )}
      {loading && videos.length === 0 && (
        <p className="mx-auto w-full max-w-7xl px-4 text-sm text-zinc-400 md:px-8">Đang tìm video...</p>
      )}
      {!loading && !searchError && videos.length === 0 && (
        <p className="mx-auto w-full max-w-7xl px-4 text-sm text-zinc-400 md:px-8">Không tìm thấy video phù hợp.</p>
      )}
      <VideoGrid 
        videos={videos} 
        onAdd={addToPlaylist} 
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
      />
    </main>
  );
}