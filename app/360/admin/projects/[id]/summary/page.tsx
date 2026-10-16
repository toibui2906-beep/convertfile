'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Trophy, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Users, 
  RefreshCw, 
  AlertTriangle, 
  ArrowLeft
} from 'lucide-react';

interface SummaryItem {
  id: string;
  userId: string;
  user: {
    fullName: string;
    department: string;
    email: string;
  };
  totalEvaluators: number;
  completedCount: number;
  avgTotalScore: number;
  trustPercent: number;
  classification: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  isActive: boolean;
}

function ProjectSummaryContent() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [processing, setProcessing] = useState(false);

  // Tải dữ liệu tổng kết và thông tin project
  const fetchSummaryData = async () => {
    try {
      const res = await fetch(`/api/360/projects/${projectId}/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummaries(data.summaries);
        setProject(data.project);
      }
    } catch (error) {
      console.error('Lỗi tải tổng kết dự án:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchSummaryData();
  }, [projectId]);

  // Hàm xử lý Đóng/Mở khóa dự án (Gọi chung vào endpoint /summary với method PATCH)
  const handleToggleProjectStatus = async (newStatus: boolean) => {
    const actionText = newStatus ? "mở lại" : "đóng và chốt sổ";
    if (!confirm(`Bạn có chắc chắn muốn ${actionText} dự án này không? Khi đóng, nhân viên sẽ không thể nộp hoặc chỉnh sửa phiếu nữa.`)) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/360/projects/${projectId}/summary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error('Lỗi cập nhật trạng thái dự án');

      const data = await res.json();
      setProject((prev) => prev ? { ...prev, isActive: data.project.isActive } : null);
      alert(`Đã ${newStatus ? "mở khóa" : "đóng"} dự án thành công!`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Helper render màu badge xếp loại
  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'Tín nhiệm cao':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold border border-emerald-200">✨ Tín nhiệm cao</span>;
      case 'Tín nhiệm':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">👍 Tín nhiệm</span>;
      case 'Trung bình':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">⚡ Trung bình</span>;
      case 'Tín nhiệm thấp':
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold border border-orange-200">⚠️ Tín nhiệm thấp</span>;
      default:
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold border border-rose-200">❌ Không tín nhiệm</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-slate-500 text-sm font-medium">Đang tổng kết dữ liệu dự án...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER & NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <button 
              onClick={() => router.push('/360/admin/projects')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách đợt đánh giá</span>
            </button>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" />
              <span>Tổng kết: {project?.title}</span>
            </h1>
            <p className="text-xs text-slate-500">
              Bảng xếp hạng và kết quả tín nhiệm chi tiết của từng nhân sự sau khi tổng hợp các phiếu đánh giá.
            </p>
          </div>

          {/* ACTION BUTTONS (ĐÓNG / MỞ DỰ ÁN) */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {project?.isActive ? (
              <button
                onClick={() => handleToggleProjectStatus(false)}
                disabled={processing}
                className="inline-flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 w-full sm:w-auto"
              >
                <Lock className="w-4 h-4" />
                <span>Chốt sổ & Đóng dự án</span>
              </button>
            ) : (
              <button
                onClick={() => handleToggleProjectStatus(true)}
                disabled={processing}
                className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 w-full sm:w-auto"
              >
                <Unlock className="w-4 h-4" />
                <span>Mở lại khóa dự án</span>
              </button>
            )}
          </div>
        </div>

        {/* TRẠNG THÁI CẢNH BÁO KHÓA */}
        {!project?.isActive && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center space-x-3 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            <span>
              Dự án này đã bị <strong>khóa (Đóng)</strong>. Mọi thao tác nộp mới hoặc chỉnh sửa phiếu đánh giá từ nhân viên đã bị vô hiệu hóa hoàn toàn để chốt số liệu báo cáo.
            </span>
          </div>
        )}

        {/* BẢNG KẾT QUẢ TỔNG KẾT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Danh sách nhân sự được đánh giá ({summaries.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Khoa / Phòng</th>
                  <th className="py-3 px-4 text-center">Tiến độ nộp phiếu</th>
                  <th className="py-3 px-4 text-center">Điểm TB (1-5)</th>
                  <th className="py-3 px-4 text-center">Tín nhiệm (%)</th>
                  <th className="py-3 px-4 text-center">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {summaries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Chưa có dữ liệu tổng kết nào được ghi nhận.
                    </td>
                  </tr>
                ) : (
                  summaries.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.user?.fullName}</td>
                      <td className="py-3 px-4 text-slate-500">{item.user?.department}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.completedCount} / {item.totalEvaluators}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-extrabold text-emerald-600 text-sm">
                        {item.avgTotalScore}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {item.trustPercent}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getClassificationBadge(item.classification)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ProjectSummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-sm font-medium">Đang tải trang tổng kết...</p>
      </div>
    }>
      <ProjectSummaryContent />
    </Suspense>
  );
}