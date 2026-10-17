'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  RefreshCw, 
  Activity,
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  Award,
  Settings,
  FolderKanban,
  X,
  Lock
} from 'lucide-react';

export default function Page360Home() {
  const router = useRouter();

  // State quản lý đăng nhập Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // State Modal Login
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdminLoggedIn');
    if (loggedIn === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Xử lý submit Login qua API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/360/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('isAdminLoggedIn', 'true');
        setShowLoginModal(false);
        setPassword('');
        alert('Đăng nhập Quản trị viên thành công!');
      } else {
        alert(data.message || 'Mật khẩu không đúng!');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ!');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý Đăng xuất
  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Admin?')) {
      try {
        await fetch('/api/360/admin/logout', { method: 'POST' });
      } catch (err) {
        console.error('Lỗi khi xóa cookie logout:', err);
      } finally {
        setIsAdminLoggedIn(false);
        localStorage.removeItem('isAdminLoggedIn');
      }
    }
  };

  // Kiểm tra quyền Admin khi điều hướng
  const handleProtectedNavigation = (path: string) => {
    if (!isAdminLoggedIn) {
      alert('Vui lòng nhập mật khẩu Admin để truy cập chức năng này!');
      setShowLoginModal(true);
      return;
    }
    router.push(path);
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* HEADER SECTION - Tách bạch tiêu đề và khu vực Đăng nhập Admin rõ ràng */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          
          {/* Bên trái: Tiêu đề & Mô tả */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <Building2 className="h-4 w-4" /> Quản lý tạo dự án đánh giá năng lực 360°
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Trang Chủ đánh giá 360°
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Tạo dự án đánh giá năng lực, phân công người đánh cho người được đánh giá, và quản lý kết quả đánh giá.
            </p>
          </div>

          {/* Bên phải: Trạng thái & Nút Đăng nhập/Đăng xuất Admin */}
        </div>
        {/* 3 Main Navigation Modules Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          
          {/* 1. Phân hệ Evaluate (Đánh giá) */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <Award className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Kết quả các đợt
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Đợt đánh giá
              </h2>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                Tổng hợp kết quả theo các đợt đánh giá, phân tích dữ liệu và xuất báo cáo chi tiết về năng lực của từng nhân sự.
              </p>
            </div>

            <Link 
              href="/360/admin/projects" 
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span>Kết quả các đợt đánh giá</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2. Phân hệ Tạo mới đợt đánh giá */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Tạo dự án mới
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Tạo mới đợt đánh giá
              </h2>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                Tạo mới đợt đánh giá năng lực, phân công người đánh giá và người được đánh giá, quản lý các phiếu đánh giá
              </p>
            </div>

            <button 
              onClick={() => handleProtectedNavigation('/360/admin/assignments')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span>Đợt đánh giá mới</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Phân hệ Convert Excel */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <Settings className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Chuyển đổi từ file cũ
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Sử dụng chuyển đổi từ file excel cũ (google sheet)
              </h2>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                Chuyển từ dữ liệu google sheet kết quả đánh giá để tính toán kết quả
              </p>
            </div>

            <Link 
              href="/convert" 
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span>Import file Excel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Quick Sub-links for Admin sub-routes */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FolderKanban className="h-4 w-4 text-emerald-700" /> Cấu hình hệ thống 360° - Quản lý Users
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleProtectedNavigation('/360/admin/users')} 
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Users className="h-4 w-4 text-slate-500" /> Quản lý tài khoản
            </button>
            <button
              onClick={() => handleProtectedNavigation('/360/admin/criterianpm')} 
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Users className="h-4 w-4 text-slate-500" /> Xây dựng bộ chỉ tiêu
            </button>
          </div>
        </div>

      </div>

      {/* MODAL ĐĂNG NHẬP ADMIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="flex items-center space-x-2 text-lg font-semibold text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Xác Thực Quản Trị</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mật khẩu Quản Trị</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu Admin..."
                    className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    required
                    autoFocus
                  />
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:opacity-50"
              >
                {submitting ? 'Đang kiểm tra...' : 'Xác Nhận'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}