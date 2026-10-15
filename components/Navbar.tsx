"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Calendar, Award, Home } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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
    icon: Award,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Tên Hệ Thống */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group transition"
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
        <nav className="flex items-center space-x-1 sm:space-x-2">
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
      </div>
    </header>
  );
}