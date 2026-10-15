'use client';

import { FormEvent } from 'react';

interface SearchBarProps {
  inputVal: string;
  setInputVal: (val: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function SearchBar({ inputVal, setInputVal, onSubmit, loading }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input 
        type="text" 
        placeholder="Dán link YouTube hoặc tìm bài hát/karaoke..." 
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        className="flex-1 p-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-sm focus:outline-none focus:border-red-500 shadow-inner text-white"
      />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-500 transition text-sm disabled:bg-zinc-700 whitespace-nowrap text-white"
      >
        {loading ? 'Đang tìm...' : 'Thêm vào danh sách'}
      </button>
    </form>
  );
}