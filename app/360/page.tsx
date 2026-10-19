'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  RefreshCw, 
  Building2, 
  ArrowRight, 
  Award,
  FolderKanban,
  Lock
} from 'lucide-react';

export default function Page360Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Kiểm tra trạng thái đăng nhập & role từ localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(Boolean(userId));
      setUserRole(role);
    };

    checkLoginStatus();
    // Lắng nghe sự thay đổi từ localStorage nếu người dùng Đăng nhập/Đăng xuất ở Navbar
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('auth-state-changed', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('auth-state-changed', checkLoginStatus);
    };
  }, []);

  const isAdmin = isLoggedIn && userRole === 'ADMIN';

  // Kiểm tra quyền khi điều hướng đến các route bảo vệ
  const handleProtectedNavigation = (path: string) => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');

    // 1. Nếu chưa đăng nhập -> Mở popup đăng nhập
    if (!userId) {
      window.dispatchEvent(new CustomEvent('open-login-modal', { detail: path }));
      return;
    }

    // 2. Phân quyền theo route
    if (path === '/360/evaluate') {
      // Cả ADMIN lẫn STAFF đều được truy cập trang Theo dõi / Làm phiếu
      router.push(path);
    } else {
      // Các route khác yêu cầu quyền ADMIN
      if (role === 'ADMIN') {
        router.push(path);
      } else {
        alert('Chức năng này chỉ dành cho Quản trị viên (ADMIN)!');
      }
    }
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
        
        {/* HEADER SECTION */}
        <div className="border-b border-slate-200 pb-6">
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

        {/* 3 Main Navigation Modules Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          
          {/* 1. Kết quả các đợt (Chỉ ADMIN) */}
          <div className={`flex flex-col justify-between rounded-lg border bg-white p-5 shadow-sm transition-all ${
            isAdmin ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-200 opacity-60 bg-slate-50/50'
          }`}>
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
                  isAdmin ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Award className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 flex items-center gap-1">
                  {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                  Kết quả các đợt
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Tổng hợp các đợt đánh giá
              </h2>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                Tổng hợp kết quả theo các đợt đánh giá, phân tích dữ liệu và xuất báo cáo chi tiết về năng lực của từng nhân sự.
              </p>
            </div>

            <button 
              onClick={() => handleProtectedNavigation('/360/admin/projects')}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none ${
                isAdmin 
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800' 
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-300'
              }`}
            >
              <span>{isAdmin ? 'Kết quả các đợt đánh giá' : 'Yêu cầu quyền Admin'}</span>
              {isAdmin ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>

          {/* 2. Tạo mới đợt đánh giá (Chỉ ADMIN) */}
          <div className={`flex flex-col justify-between rounded-lg border bg-white p-5 shadow-sm transition-all ${
            isAdmin ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-200 opacity-60 bg-slate-50/50'
          }`}>
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
                  isAdmin ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 flex items-center gap-1">
                  {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                  Tạo dự án mới
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Tạo mới đợt đánh giá
              </h2>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                Tạo mới đợt đánh giá năng lực, phân công người đánh giá và người được đánh giá, quản lý các phiếu đánh giá.
              </p>
            </div>

            <button 
              onClick={() => handleProtectedNavigation('/360/admin/assignments')}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none ${
                isAdmin 
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800' 
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-300'
              }`}
            >
              <span>{isAdmin ? 'Đợt đánh giá mới' : 'Yêu cầu quyền Admin'}</span>
              {isAdmin ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>

          {/* 3. Theo dõi phiếu đánh giá (Cho phép CẢ ADMIN VÀ STAFF) */}
          <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Theo dõi phiếu đánh giá
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Theo dõi các phiếu đánh giá
              </h2>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                Theo dõi các phiếu đánh giá, kiểm tra tiến độ hoàn thành, và quản lý các phiếu đánh giá theo từng đợt.
              </p>
            </div>

            <button 
              onClick={() => handleProtectedNavigation('/360/evaluate')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span>Theo dõi phiếu đánh giá</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quick Sub-links for Admin sub-routes */}
        <div className={`border-t border-slate-200 pt-6 transition-all ${!isAdmin ? 'opacity-50' : ''}`}>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FolderKanban className="h-4 w-4 text-emerald-700" /> Cấu hình hệ thống 360° - Quản lý Users
            {!isAdmin && <span className="text-xs font-normal text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1"><Lock className="w-3 h-3" /> Chỉ dành cho Admin</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleProtectedNavigation('/360/admin/users')} 
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                isAdmin 
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' 
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Users className="h-4 w-4 text-slate-400" /> Quản lý tài khoản
            </button>
            <button
              onClick={() => handleProtectedNavigation('/360/admin/criteria')} 
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                isAdmin 
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' 
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Users className="h-4 w-4 text-slate-400" /> Xây dựng bộ chỉ tiêu
            </button>
            <button
              onClick={() => handleProtectedNavigation('/360/converts')} 
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                isAdmin 
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' 
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Users className="h-4 w-4 text-slate-400" /> Chuyển đổi dữ liệu (file dữ liệu cũ)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}