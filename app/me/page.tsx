'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Building, Shield, Save } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/?openLoginModal=true&from=/me');
      return;
    }
    setUserId(id);
    
    // Fetch thông tin user từ database thông qua API (nếu bạn đã có endpoint GET user theo ID)
    // Hoặc tạm thời lấy thông tin từ localStorage
    setFormData({
      fullName: localStorage.getItem('userFullName') || '',
      email: '',
      department: '',
      role: localStorage.getItem('userRole') || 'STAFF',
      password: '',
    });
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userId}`, { // Hoặc đường dẫn API tương ứng của bạn
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Cập nhật thông tin thành công!');
        localStorage.setItem('userFullName', formData.fullName);
        window.dispatchEvent(new Event('storage'));
      } else {
        alert(data.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải thông tin...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600" />
          Thông Tin Cá Nhân
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Họ và tên</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Nhập email mới nếu muốn đổi..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phòng ban / Khoa</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mật khẩu mới (bỏ trống nếu không đổi)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}