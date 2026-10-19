'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  X, 
  RefreshCw,
  Trophy,
  Eye
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // Fetch Projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/360/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách dự án:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Open Modal for Create or Edit
  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
        isActive: project.isActive,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
      });
    }
    setShowModal(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProject) {
        const res = await fetch(`/api/360/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Cập nhật dự án thất bại.');
      } else {
        const res = await fetch('/api/360/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Thêm dự án mới thất bại.');
      }

      setShowModal(false);
      fetchProjects();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa dự án / đợt đánh giá "${title}"?`)) return;

    try {
      const res = await fetch(`/api/360/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Xóa dự án thất bại.');
      }

      setProjects(projects.filter((p) => p.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Quản trị đợt đánh giá
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-2">Danh Sách Dự Án / Đợt Đánh Giá</h1>
          <p className="text-xs text-slate-500">Thêm mới, cấu hình thời gian và quản lý trạng thái các kỳ đánh giá 360°</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Dự Án Mới</span>
        </button>
      </div>

      {/* FILTER & SEARCH BANNER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên dự án..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị: <strong className="text-slate-800">{filteredProjects.length}</strong> / {projects.length} dự án
        </div>
      </div>

      {/* PROJECT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">Tên Dự Án / Đợt Đánh Giá</th>
              <th className="p-4">Thời Gian Bắt Đầu</th>
              <th className="p-4">Thời Gian Kết Thúc</th>
              <th className="p-4 text-center">Trạng Thái</th>
              <th className="p-4 text-center">Hành Động & Tổng Kết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách dự án...
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                  Không tìm thấy dự án phù hợp.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-semibold text-slate-800 flex items-center space-x-2">
                    <FolderKanban className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{project.title}</span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="inline-flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(project.startDate).toLocaleDateString('vi-VN')}</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="inline-flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(project.endDate).toLocaleDateString('vi-VN')}</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        project.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {project.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đang hoạt động</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Đã đóng</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => router.push(`/360/admin/projects/${project.id}/summary`)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition border border-amber-200"
                        title="Xem tổng kết & kết quả"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tổng kết</span>
                      </button>

                      <button
                        onClick={() => handleOpenModal(project)}
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Chỉnh sửa cấu hình"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa dự án"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREATE / EDIT PROJECT */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {editingProject ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án / Đợt Đánh Giá'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên Dự Án / Đợt Đánh Giá</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Đánh giá 360 độ Quý 4/2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày Bắt Đầu</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày Kết Thúc</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trạng Thái Hoạt Động</label>
                <select
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                >
                  <option value="true">Đang hoạt động (Active)</option>
                  <option value="false">Đã đóng (Inactive)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  {submitting ? 'Đang lưu...' : editingProject ? 'Cập Nhật' : 'Tạo Dự Án'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}