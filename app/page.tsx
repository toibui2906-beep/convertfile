"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Cpu,
  Layers,
  FileCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function RosterConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng chọn file Excel Roster đầu vào.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Xử lý thất bại.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Roster_Converted_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi chuyển đổi file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1143d6] text-slate-900 font-sans relative overflow-hidden pb-16">
      {/* Background Decorative Wave/Curve Effect mô phỏng template */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#0b2bb8] to-[#1143d6] -z-10" />
      <div className="absolute top-80 left-0 right-0 h-48 bg-white/5 rounded-t-[100%] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#ffb703] text-blue-950 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md">
            <Cpu className="w-4 h-4" /> Enterprise Roster Automation System
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Giải pháp Chuyển đổi Lịch trực Tối ưu
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto font-medium">
            Tự động hóa bóc tách và quy đổi dữ liệu ca trực điều dưỡng chuẩn xác từ ma trận sang hệ thống.
          </p>
        </div>

        {/* Feature Cards Grid (Phong cách tech illustration components) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white shadow-xl hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ffb703] text-blue-950 flex items-center justify-center font-bold mb-3 shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Sheet Roster</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Quét tự động dải ngày từ 26 tháng này đến 25 tháng sau theo mốc ô L1.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white shadow-xl hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ffb703] text-blue-950 flex items-center justify-center font-bold mb-3 shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Template Gốc</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Chuẩn hóa mã ca quy đổi, tách mã và tên phòng riêng biệt, đánh số thứ tự.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white shadow-xl hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ffb703] text-blue-950 flex items-center justify-center font-bold mb-3 shadow-md">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Import_PhanCa</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Loại bỏ dòng trống và tự động lọc bỏ các nhân sự thiếu Tài khoản AD.
            </p>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">Tải lên file Roster Excel</h2>
                <p className="text-xs text-slate-400">Định dạng hỗ trợ: .xlsx, .xls</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Sẵn sàng hoạt động
            </span>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              file
                ? "border-blue-600 bg-blue-50/40"
                : "border-slate-200 hover:border-blue-400 bg-slate-50/60"
            }`}
          >
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              id="roster-upload"
            />
            <label htmlFor="roster-upload" className="cursor-pointer space-y-3 block">
              <div className="mx-auto w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              {file ? (
                <div>
                  <p className="font-bold text-slate-800 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB — Nhấp để chọn file khác
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    Kéo thả file vào đây hoặc <span className="text-blue-600 underline font-bold">chọn từ thiết bị</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Hệ thống xử lý trực tiếp các sheet Roster, Account và Nurses</p>
                </div>
              )}
            </label>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3.5 rounded-xl">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>Chuyển đổi thành công! File Excel kết quả đã được tải xuống máy của bạn.</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                loading || !file
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-95 shadow-blue-600/30"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Đang chạy thuật toán xử lý...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" /> Thực hiện Chuyển đổi & Tải file <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}