'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Building2, 
  Mail, 
  ShieldCheck, 
  X, 
  Check, 
  RefreshCw,
  KeyRound 
} from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: 'ADMIN' | 'STAFF';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form States (Thêm trường password)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '', // Thêm password vào form state
    department: 'Khoa Cấp Cứu',
    role: 'STAFF' as 'ADMIN' | 'STAFF',
  });

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/360/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open Modal for Create or Edit
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: '', // Khi sửa để trống, nếu nhập thì sẽ đổi mật khẩu mới
        department: user.department,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        department: 'Khoa Cấp Cứu',
        role: 'STAFF',
      });
    }
    setShowModal(true);
  };

  // Handle Form Submit (POST for Create, PATCH for Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        // Call PATCH (Nếu password để trống, có thể loại bỏ hoặc gửi lên tùy API xử lý)
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password; // Không gửi nếu không đổi mật khẩu

        const res = await fetch(`/api/360/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Cập nhật nhân sự thất bại.');
      } else {
        // Call POST (Tạo mới bắt buộc phải có password)
        if (!formData.password) {
          alert('Vui lòng nhập mật khẩu cho nhân sự mới.');
          setSubmitting(false);
          return;
        }

        const res = await fetch('/api/360/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Thêm nhân sự thất bại (Email có thể đã tồn tại).');
      }

      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân sự ${name}?`)) return;

    try {
      const res = await fetch(`/api/360/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Xóa nhân sự thất bại.');
      }

      setUsers(users.filter((u) => u.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Quản trị nhân sự
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-2">Danh Sách Cán Bộ Y Tế</h1>
          <p className="text-xs text-slate-500">Thêm mới, cập nhật thông tin và quản lý danh sách nhân sự phục vụ đánh giá 360°</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Nhân Sự Mới</span>
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
            placeholder="Tìm kiếm theo tên, email, khoa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị: <strong className="text-slate-800">{filteredUsers.length}</strong> / {users.length} cán bộ
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">Họ và Tên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Khoa / Phòng</th>
              <th className="p-4 text-center">Vai Trò</th>
              <th className="p-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Đang tải danh sách nhân sự...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                  Không tìm thấy nhân sự phù hợp.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-semibold text-slate-800">{user.fullName}</td>
                  <td className="p-4 text-slate-600">
                    <span className="inline-flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.email}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.department}</span>
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.fullName)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREATE / EDIT USER */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {editingUser ? 'Chỉnh Sửa Thông Tin Nhân Sự' : 'Thêm Nhân Sự Mới'}
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="VD: BS. Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email liên hệ</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nguyenvana@hospital.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 text-slate-900"
                  required
                />
              </div>

              {/* Ô nhập Mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {editingUser ? 'Mật khẩu mới (Bỏ trống nếu không đổi)' : 'Mật khẩu đăng nhập'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'Nhập mật khẩu...'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 text-slate-900"
                    {...(!editingUser ? { required: true } : {})}
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Khoa / Phòng</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Khoa Cấp Cứu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vai Trò Hệ Thống</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'STAFF' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200 bg-white text-slate-900"
                >
                  <option value="STAFF">STAFF (Nhân sự)</option>
                  <option value="ADMIN">ADMIN (Quản trị)</option>
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
                  {submitting ? 'Đang lưu...' : editingUser ? 'Cập Nhật' : 'Tạo Nhân Sự'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}