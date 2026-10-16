'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Activity, 
  Calendar, 
  Award, 
  Home, 
  Trophy, 
  LogIn, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  X, 
  Lock 
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // State quản lý đăng nhập Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
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
        router.refresh();
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
        router.refresh();
      }
    }
  };

  const navItems = [
    {
      name: "Trang chủ",
      href: "/",
      icon: Home,
    },
    {
      name: "Đánh giá 360°",
      href: "/360",
      icon: Award,
    },
    {
      name: "Chuyển đổi lịch trực",
      href: "/calendars",
      icon: Calendar,
    },
    {
      name: "Bằng khen thưởng",
      href: "/award",
      icon: Trophy,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Tên Hệ Thống */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition shrink-0"
          >
            <div className="p-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl group-hover:bg-emerald-500/30 transition">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block leading-none">
                Khoa Cấp cứu
              </span>
              <span className="text-[11px] text-slate-400 font-medium block mt-1">
                Hệ thống hỗ trợ quản lý y tế
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/50"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Góc phải: Trạng thái & Đăng nhập / Đăng xuất Admin */}
          <div className="flex items-center space-x-3 shrink-0">
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 pl-3 rounded-xl border border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-200 leading-none">Admin</p>
                    <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Đã đăng nhập</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thoát</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Admin</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MODAL ĐĂNG NHẬP ADMIN */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleLogin} className="bg-white text-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Xác Thực Quản Trị</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50"
              >
                {submitting ? 'Đang kiểm tra...' : 'Xác Nhận'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}