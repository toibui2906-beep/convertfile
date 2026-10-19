'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Building2, 
  FolderKanban, 
  RefreshCw,
  Filter
} from 'lucide-react';

interface EvaluationItem {
  id: string;
  projectId: string;
  project: { title: string };
  evaluatee: { 
    id: string;
    fullName: string; 
    department: string; 
    email: string;
  };
  isCompleted: boolean;
  survey?: { 
    id: string;
    avgTotalScore: number; 
    classification: string; 
  } | null;
}

export default function EvaluationsHubPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        
        // 1. Lấy role và userId từ localStorage
        const userRole = localStorage.getItem('userRole') || 'STAFF'; // 'ADMIN' hoặc 'STAFF'
        const currentUserId = localStorage.getItem('userId') || ''; 

        // 2. Xây dựng URL endpoint đúng với logic API mới của backend
        let endpoint = `/api/360/surveys/users?role=${userRole}`;
        
        if (userRole !== 'ADMIN') {
          if (!currentUserId) {
            console.warn('Chưa có thông tin userId trong localStorage. Vui lòng đăng nhập lại.');
          }
          endpoint += `&userId=${currentUserId}`;
        }

        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          setEvaluations(data);
        } else {
          console.error('Lỗi khi tải dữ liệu phiếu đánh giá từ server.');
        }
      } catch (error) {
        console.error('Lỗi tải danh sách đánh giá:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-slate-500 text-sm font-medium">Đang tải danh sách phiếu đánh giá...</p>
        </div>
      </div>
    );
  }

  const pendingList = evaluations.filter(e => !e.isCompleted);
  const completedList = evaluations.filter(e => e.isCompleted);
  const progressPercent = evaluations.length > 0 ? Math.round((completedList.length / evaluations.length) * 100) : 0;

  const filteredEvaluations = evaluations.filter(item => {
    if (filterTab === 'PENDING') return !item.isCompleted;
    if (filterTab === 'COMPLETED') return item.isCompleted;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER & TIẾN ĐỘ CHUNG */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center space-x-1 mb-2">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Cổng Đánh Giá 360°</span>
              </span>
              <h1 className="text-2xl font-extrabold text-slate-800">Danh Sách Phiếu Cần Đánh Giá</h1>
              <p className="text-sm text-slate-500 mt-1">Hoàn thành các phiếu bên dưới để hoàn tất đợt đánh giá nhân sự.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-right min-w-[220px]">
              <div className="text-xs font-semibold text-slate-500">Tiến độ hoàn thành</div>
              <div className="text-xl font-extrabold text-emerald-600">
                {completedList.length} / {evaluations.length} <span className="text-xs font-normal text-slate-400">({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* BỘ LỌC TAB NHANH */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <Filter className="w-4 h-4 text-slate-400 mr-1" />
            <button
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterTab === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({evaluations.length})
            </button>
            <button
              onClick={() => setFilterTab('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterTab === 'PENDING' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Chưa làm ({pendingList.length})
            </button>
            <button
              onClick={() => setFilterTab('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterTab === 'COMPLETED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Đã xong ({completedList.length})
            </button>
          </div>
        </div>

        {/* DANH SÁCH PHIẾU ĐÁNH GIÁ */}
        <div className="space-y-3">
          {filteredEvaluations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Không tìm thấy phiếu đánh giá nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredEvaluations.map((item) => {
              const isCompleted = item.isCompleted;

              return (
                <div 
                  key={item.id}
                  onClick={() => router.push(`/360/evaluate/${item.id}`)}
                  className={`bg-white rounded-2xl border p-5 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                    isCompleted ? 'border-slate-200 bg-slate-50/50 hover:border-slate-300' : 'border-amber-200 bg-white hover:border-emerald-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm ${
                      isCompleted ? 'bg-slate-200 text-slate-600' : 'bg-emerald-600 text-white'
                    }`}>
                      {item.evaluatee?.fullName?.charAt(0) || 'U'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-800 text-base group-hover:text-emerald-600 transition">
                          {item.evaluatee?.fullName}
                        </h3>
                        {isCompleted && item.survey?.classification && (
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Xếp loại: {item.survey.classification}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.evaluatee?.department}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.project?.title}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã đánh giá</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl">
                        <Clock className="w-4 h-4" />
                        <span>Chưa đánh giá</span>
                      </span>
                    )}

                    <button className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 transition">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}