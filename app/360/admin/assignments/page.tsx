'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, FolderPlus, Plus, Copy, Check, Trash2, Users, CheckCircle, Clock, ExternalLink, Search } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  department: string;
  role?: string;
}

interface Project {
  id: string;
  title: string;
  isActive: boolean;
}

interface Assignment {
  id: string;
  token: string;
  survey?: any;
  evaluator: User;
  evaluatee: User;
}

export default function AdminAssignmentsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Form states
  const [evaluateeId, setEvaluateeId] = useState(''); // Cố định người được đánh giá
  const [evaluatorId, setEvaluatorId] = useState('');   // Người chấm
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search states cho việc lọc dropdown nhân viên
  const [evaluatorSearch, setEvaluatorSearch] = useState('');
  const [evaluateeSearch, setEvaluateeSearch] = useState('');

  // 1. Tải danh sách Project và User khi mở trang
  useEffect(() => {
    async function initData() {
      try {
        const [projRes, userRes] = await Promise.all([
          fetch('/api/360/projects'),
          fetch('/api/360/users'),
        ]);
        if (projRes.ok) {
          const projs = await projRes.json();
          setProjects(projs);
          if (projs.length > 0) setSelectedProjectId(projs[0].id);
        }
        if (userRes.ok) {
          const listUsers = await userRes.json();
          // Chỉ lấy user có role = STAFF (hoặc bạn có thể điều chỉnh điều kiện này tùy thuộc vào dữ liệu trả về từ API)
          const staffUsers = listUsers.filter((u: User) => !u.role || u.role.toUpperCase() === 'STAFF');
          setUsers(staffUsers);
        }
      } catch (err) {
        console.error('Lỗi khởi tạo dữ liệu:', err);
      }
    }
    initData();
  }, []);

  // 2. Tải danh sách Assignments mỗi khi đổi Project được chọn
  useEffect(() => {
    if (!selectedProjectId) return;
    async function fetchAssignments() {
      try {
        const res = await fetch(`/api/360/assignments?projectId=${selectedProjectId}`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (err) {
        console.error('Lỗi tải assignments:', err);
      }
    }
    fetchAssignments();
  }, [selectedProjectId]);

  // Tạo Project mới
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      const res = await fetch('/api/360/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newProjectTitle, 
          startDate: new Date().toISOString(), 
          endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(), 
          isActive: true 
        }),
      });
      if (res.ok) {
        const newProj = await res.json();
        setProjects([newProj, ...projects]);
        setSelectedProjectId(newProj.id);
        setNewProjectTitle('');
        setShowProjectModal(false);
      }
    } catch (err) {
      alert('Lỗi tạo đợt đánh giá');
    }
  };

  // Tạo phân công mới
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorId || !evaluateeId || !selectedProjectId) return;

    if (evaluatorId === evaluateeId) {
      alert('Người đánh giá và người được đánh giá không thể là cùng một người!');
      return;
    }

    try {
      const res = await fetch('/api/360/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProjectId, evaluatorId, evaluateeId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Lỗi phân công');
      }

      const newAssignment = await res.json();
      setAssignments([newAssignment, ...assignments]);
      setEvaluatorId(''); // Reset người chấm để tiếp tục thêm người chấm khác cho cùng evaluatee nếu muốn
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Xóa phân công
  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa phân công này?')) return;
    try {
      const res = await fetch(`/api/360/assignments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAssignments(assignments.filter((item) => item.id !== id));
      }
    } catch (err) {
      alert('Lỗi xóa phân công');
    }
  };

  const handleCopyLink = (token: string, id: string) => {
    const link = `${window.location.origin}/360/evaluate/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const completedCount = assignments.filter((a) => !!a.survey).length;

  // Lọc danh sách nhân viên theo từ khóa tìm kiếm
  const filteredEvaluators = users.filter((u) => 
    u.fullName.toLowerCase().includes(evaluatorSearch.toLowerCase()) ||
    u.department.toLowerCase().includes(evaluatorSearch.toLowerCase())
  );

  const filteredEvaluatees = users.filter((u) => 
    u.fullName.toLowerCase().includes(evaluateeSearch.toLowerCase()) ||
    u.department.toLowerCase().includes(evaluateeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER & QUẢN LÝ PROJECT */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Quản trị hệ thống 360°
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-2">Quản lý dự án đánh giá 360°</h1>
          <p className="text-xs text-slate-500">Phân công người đánh giá cho từng nhân viên</p>
        </div>

        <button
          onClick={() => setShowProjectModal(true)}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition shrink-0"
        >
          <FolderPlus className="w-4 h-4 text-emerald-400" />
          <span>Tạo Đợt Đánh Giá Mới</span>
        </button>
      </div>

      {/* MODAL TẠO PROJECT */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateProject} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Tạo Kỳ / Đợt Đánh Giá Mới</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên Kỳ Đánh Giá</label>
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="VD: Đánh giá 360 độ Khoa Cấp Cứu - Q4/2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Tạo Đợt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* THANH CHỌN PROJECT & THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-emerald-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-emerald-300 font-medium">Đang làm việc tại đợt:</p>
              <h2 className="text-lg font-bold">{currentProject ? currentProject.title : 'Chưa có đợt nào'}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-emerald-950 border border-emerald-700 text-white text-sm rounded-xl px-4 py-2.5 outline-none w-full"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tiến Độ Hoàn Thành</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-800">{completedCount}</span>
            <span className="text-slate-400 text-sm">/ {assignments.length} phiếu đã nộp</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${assignments.length > 0 ? (completedCount / assignments.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* FORM PHÂN CÔNG ĐÁNH GIÁ (Cố định Người Được Đánh Giá + Tìm kiếm nhân viên role STAFF) */}
      <form onSubmit={handleCreateAssignment} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Thêm Phân Công Đánh Giá Mới </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CỘT 1: CỐ ĐỊNH NGƯỜI ĐƯỢC ĐÁNH GIÁ */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase">1. Người Được Đánh Giá (Evaluatee)</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm kiếm tên hoặc phòng ban..."
                value={evaluateeSearch}
                onChange={(e) => setEvaluateeSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-200 mb-2"
              />
            </div>
            <select
              value={evaluateeId}
              onChange={(e) => setEvaluateeId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white font-medium text-slate-800"
              required
            >
              <option value="">-- Chọn nhân sự được chấm --</option>
              {filteredEvaluatees.map((u) => (
                <option key={u.id} value={u.id}>{u.fullName} ({u.department})</option>
              ))}
            </select>
          </div>

          {/* CỘT 2: CHỌN NGƯỜI ĐI ĐÁNH GIÁ */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase">2. Chọn Người Đánh Giá (Evaluator)</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm kiếm tên hoặc phòng ban..."
                value={evaluatorSearch}
                onChange={(e) => setEvaluatorSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-200 mb-2"
              />
            </div>
            <select
              value={evaluatorId}
              onChange={(e) => setEvaluatorId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white font-medium text-slate-800"
              required
            >
              <option value="">-- Chọn người chấm điểm --</option>
              {filteredEvaluators.map((u) => (
                <option key={u.id} value={u.id}>{u.fullName} ({u.department})</option>
              ))}
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm cặp đánh giá này</span>
        </button>
      </form>

      {/* DANH SÁCH ASSIGNMENTS & THEO DÕI TIẾN ĐỘ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm flex justify-between items-center">
          <span>Danh Sách Phân Công & Theo Dõi Tiến Độ ({assignments.length})</span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">Người Được Đánh Giá (Evaluatee)</th>
              <th className="p-4">Người Đánh Giá (Evaluator)</th>
              <th className="p-4 text-center">Trạng Thái Thực Hiện</th>
              <th className="p-4 text-center">Đường Link Làm Khảo Sát</th>
              <th className="p-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                  Chưa có phân công nào trong đợt này.
                </td>
              </tr>
            ) : (
              assignments.map((item) => {
                const isCompleted = !!item.survey;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-emerald-700">{item.evaluatee?.fullName} <span className="text-xs text-slate-400 font-normal">({item.evaluatee?.department})</span></td>
                    <td className="p-4 font-semibold text-slate-800">{item.evaluator?.fullName} <span className="text-xs text-slate-400 font-normal">({item.evaluator?.department})</span></td>
                    <td className="p-4 text-center">
                      {isCompleted ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Đã hoàn thành</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Chờ đánh giá</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleCopyLink(item.token, item.id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Đã copy!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/360/evaluate/${item.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition border border-emerald-200"
                          title="Mở trang đánh giá"
                        >
                          <span>Vào chấm</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteAssignment(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition"
                        title="Xóa phân công"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}