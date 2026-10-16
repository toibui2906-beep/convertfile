'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface CriteriaItem {
  id: string;
  stt: number;
  category: string;
  title: string;
  description: string;
  weight: number;
}

export default function AdminCriteriaPage() {
  const [criteriaList, setCriteriaList] = useState<CriteriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CriteriaItem | null>(null);
  const [formData, setFormData] = useState({
    stt: 1,
    category: 'I. PHẨM CHẤT CỦA CBNV',
    title: '',
    description: '',
    weight: 1.5,
  });

  const fetchCriteria = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/360/criteria');
      if (res.ok) {
        const data = await res.json();
        setCriteriaList(data);
      }
    } catch (err) {
      console.error('Lỗi tải tiêu chí:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleOpenModal = (item?: CriteriaItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        stt: item.stt,
        category: item.category,
        title: item.title,
        description: item.description,
        weight: item.weight,
      });
    } else {
      setEditingItem(null);
      setFormData({
        stt: criteriaList.length + 1,
        category: 'I. PHẨM CHẤT CỦA CBNV',
        title: '',
        description: '',
        weight: 1.5,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/360/criteria/${editingItem.id}` : '/api/360/criteria';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Thao tác thất bại');

      setShowModal(false);
      fetchCriteria();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tiêu chí này?')) return;
    try {
      const res = await fetch(`/api/360/criteria/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCriteriaList(criteriaList.filter((item) => item.id !== id));
      }
    } catch (err) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Cấu hình hệ thống
          </span>
          <h1 className="text-xl font-extrabold text-slate-800 mt-2">Quản Lý Các Tiêu Chí Đánh Giá 360°</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tiêu Chí Mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="p-4 text-center w-16">STT</th>
              <th className="p-4">Nhóm & Tiêu Chí</th>
              <th className="p-4">Mô Tả Chi Tiết</th>
              <th className="p-4 text-center w-24">Hệ Số</th>
              <th className="p-4 text-center w-28">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                  Đang tải danh sách...
                </td>
              </tr>
            ) : criteriaList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">Chưa có tiêu chí nào.</td>
              </tr>
            ) : (
              criteriaList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-center font-bold text-slate-700">{item.stt}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase block w-fit mb-1">
                      {item.category}
                    </span>
                    <span className="font-semibold text-slate-800">{item.title}</span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 leading-relaxed">{item.description}</td>
                  <td className="p-4 text-center font-bold text-emerald-700">{item.weight}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">{editingItem ? 'Sửa Tiêu Chí' : 'Thêm Tiêu Chí Mới'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Số Thứ Tự (STT)</label>
                <input
                  type="number"
                  value={formData.stt}
                  onChange={(e) => setFormData({ ...formData, stt: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hệ Số Điểm</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nhóm Tiêu Chí</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên Tiêu Chí</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Khát vọng, Bản lĩnh..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mô Tả Chi Tiết</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">Hủy</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white">Lưu Thay Đổi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}