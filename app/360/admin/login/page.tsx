'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, KeyRound, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

// 1. Tạo component con chứa logic dùng useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/360/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gửi request đối chiếu mật khẩu tới API đăng nhập thực tế của bạn
      const res = await fetch('/api/360/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Đăng nhập thành công, chuyển hướng về trang trước đó (hoặc trang admin)
        router.push(from);
        router.refresh();
      } else {
        setError(data.message || 'Mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 w-full max-w-md">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Đăng nhập Admin</h2>
        <p className="text-slate-500 text-sm mt-1">Nhập mật khẩu quản trị để tiếp tục</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1.5">
            Mật khẩu quản trị
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <KeyRound className="w-4 h-4"/>
            </span>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm text-sm disabled:opacity-50"
        >
          {loading ? 'Đang xác thực...' : 'Xác nhận Đăng nhập'}
        </button>
      </form>
    </div>
  );
}

// 2. Component chính bọc ngoài bằng <Suspense> theo khuyến nghị của Next.js
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md mb-4">
        <Link className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors" href="/360">
          <ArrowLeft className="w-4 h-4"/> Quay lại Trang chủ 360°
        </Link>
      </div>

      <Suspense fallback={
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 w-full max-w-md text-center py-12 text-slate-500">
          Đang tải trang đăng nhập...
        </div>
      }>
        <LoginForm/>
      </Suspense>
    </div>
  );
}