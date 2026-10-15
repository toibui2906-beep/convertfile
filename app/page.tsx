"use client";

import Link from "next/link";
import { 
  Award, 
  Calendar, 
  ArrowRight, 
  Activity, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/80 text-slate-900 pb-16">
      
      {/* HERO HEADER */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white pt-12 pb-24 px-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Activity className="w-96 h-96 text-white" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Nền tảng quản lý vận hành y tế</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Cổng công cụ quản lý <span className="text-emerald-400">Khoa Cấp cứu</span>
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Tối ưu hóa quy trình đánh giá năng lực cán bộ và tự động hóa công tác lập lịch trực y tế, nâng cao hiệu quả vận hành chuyên môn tại khoa.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shrink-0">
            <Building2 className="w-10 h-10 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-300 font-medium">Đơn vị sử dụng</p>
              <p className="text-sm font-bold text-white">Khoa Cấp cứu - Bệnh viện ĐKQT Vinmec Times City</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINERS */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 space-y-8 relative z-20">

        {/* CARDS LỐI VÀO PHÂN HỆ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Đánh giá 360 */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                  <Award className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Đánh giá năng lực
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                Đánh giá 360° cán bộ y tế
              </h2>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                Phân tích dữ liệu khảo sát tín nhiệm đa chiều, tự động tổng hợp điểm KPI và xếp loại khen thưởng cán bộ y tế, điều dưỡng trong khoa.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Xử lý file khảo sát định dạng Excel (.xlsx, .csv)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tạo bằng khen cho nhân viên xuất sắc tiện lợi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Xuất báo cáo định dạng Times New Roman chuẩn y khoa</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/360"
                className="inline-flex items-center justify-center w-full space-x-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-sm transition"
              >
                <span>Truy cập phân hệ 360°</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Chuyển đổi lịch trực */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200">
                  <Calendar className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  Quản lý lịch trực
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                Chuyển đổi lịch trực điều dưỡng
              </h2>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                Tự động bóc tách dữ liệu từ ma trận lịch trực, quy đổi mã ca trực và tách danh sách nhân sự sẵn sàng đưa vào hệ thống quản lý.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-500">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Tự động nhận diện dải ngày lịch trực từ ngày 26 đến 25</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Quy đổi chuẩn xác mã ca và tách tên phòng chuyên môn</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Tự động lọc bỏ các dòng dữ liệu thiếu tài khoản AD</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/calendars"
                className="inline-flex items-center justify-center w-full space-x-2 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-sm transition"
              >
                <span>Truy cập phân hệ lịch trực</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* THÔNG TIN TỔNG QUAN HỆ THỐNG */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Bảo mật dữ liệu</h3>
                <p className="text-xs text-slate-500 mt-0.5">Xử lý dữ liệu trực tiếp trên thiết bị, bảo mật thông tin nhân sự.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Tiết kiệm thời gian</h3>
                <p className="text-xs text-slate-500 mt-0.5">Rút ngắn thời gian lập báo cáo và quy đổi lịch trực chỉ còn vài giây.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Chuẩn hóa y tế</h3>
                <p className="text-xs text-slate-500 mt-0.5">Định dạng nhất quán, đúng tiêu chuẩn quản lý lâm sàng.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}