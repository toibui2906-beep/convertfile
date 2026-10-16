import React, { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma'; // Đảm bảo đường dẫn tới prisma client của bạn đúng
import { 
  Users, 
  FolderKanban, 
  ClipboardList, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  PlusCircle, 
  Activity,
  ArrowLeft,
  KeyRound,
  LogOut,
  Lock
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
          Đang tải bảng quản trị...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  // 1. KIỂM TRA ĐĂNG NHẬP (Bắt buộc phải đăng nhập mới vào được phân hệ admin)
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value; // Hoặc tên cookie quản lý phiên đăng nhập của bạn

  // Nếu chưa đăng nhập, chuyển hướng về trang login của admin
  if (!adminSession) {
    redirect('/360/admin/login');
  }

  // 2. GET DỮ LIỆU THẬT TỪ DATABASE (Không mockup)
  let totalUsers = 0;
  let totalProjects = 0;
  let totalAssignments = 0;

  try {
    // Đếm số lượng user từ bảng users
    totalUsers = await prisma.user.count();

    // Đếm số lượng dự án từ bảng projects
    totalProjects = await prisma.project.count();

    // Đếm số lượng phân công (nếu có model Assignment)
    if (prisma.assignment) {
      totalAssignments = await prisma.assignment.count();
    }
  } catch (error) {
    console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
  }

  const stats = [
    { label: 'Tổng người dùng', value: totalUsers.toString(), icon: Users, change: 'Dữ liệu thực từ bảng User', color: 'text-blue-600 bg-blue-50' },
    { label: 'Tổng số dự án', value: totalProjects.toString(), icon: FolderKanban, change: 'Dữ liệu thực từ bảng Project', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Phân công công việc', value: totalAssignments.toString(), icon: ClipboardList, change: 'Dữ liệu từ hệ thống', color: 'text-purple-600 bg-purple-50' },
    { label: 'Trạng thái phiên', value: 'Đã xác thực', icon: ShieldCheck, change: 'Bảo mật mật khẩu active', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Topbar & Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/360" 
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ 360°
            </Link>

            {/* Trạng thái Login / Logout */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Đang đăng nhập (Admin)
              </span>
              <form action="/api/360/admin/logout" method="POST">
                <button 
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất (Logout)
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" /> Bảng Quản Trị Hệ Thống
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Admin Control Center
              </h1>
              <p className="text-slate-500 mt-1">
                Quản lý người dùng thực tế từ Database, phân quyền truy cập và cấu hình dự án y tế.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid (Real Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                  <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Admin Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Users Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-blue-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {totalUsers} bản ghi
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Quản lý Người dùng (Users)
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Truy xuất trực tiếp từ bảng <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-blue-600">User</code>, quản lý mật khẩu, tài khoản AD và phân quyền nhân sự.
              </p>
            </div>

            <Link 
              href="/360/admin/users" 
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm text-sm"
            >
              <span>Vào trang Quản lý Users</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Projects Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-emerald-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {totalProjects} dự án
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Quản lý Dự án (Projects)
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Truy xuất trực tiếp từ bảng <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600">Project</code>, thiết lập đợt khảo sát và danh mục khoa phòng.
              </p>
            </div>

            <Link 
              href="/360/admin/projects" 
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm text-sm"
            >
              <span>Vào trang Quản lý Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Assignments Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between transition-all hover:shadow-md hover:border-purple-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  Phân công
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Quản lý Phân công (Assignments)
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Thiết lập cặp đánh giá chéo giữa các nhân sự, theo dõi trạng thái hoàn thành khảo sát trực tiếp.
              </p>
            </div>

            <Link 
              href="/360/admin/assignments" 
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm text-sm"
            >
              <span>Vào trang Phân công Assignments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}