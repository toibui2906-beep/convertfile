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
  Calendar,
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
      setError("Vui lòng chọn file Excel lịch trực đầu vào.");
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
    <main className="min-h-screen bg-slate-50/80 text-slate-900 pb-16">
      
      {/* HERO HEADER - Đồng bộ chuẩn thiết kế với trang 360 */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white pt-8 pb-16 px-4 sm:px-6 md:pt-10 md:pb-20 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Calendar className="w-96 h-96 text-white" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <Cpu className="w-3.5 h-3.5 text-emerald-300" />
              <span>Hệ thống tự động hóa lịch trực</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Chuyển đổi lịch trực <span className="text-emerald-400">Khoa Cấp cứu</span>
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Tự động bóc tách, quy đổi ca trực điều dưỡng và chuẩn hóa dữ liệu đầu vào cho hệ thống một cách nhanh chóng, chính xác.
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-2xl shrink-0">
            <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-300 font-medium">Phân hệ y tế</p>
              <p className="text-sm font-bold text-white">Quản lý lịch trực & nhân sự</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Căn chỉnh đồng bộ -10mt như trang 360 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 space-y-6 sm:space-y-8 relative z-20">

        {/* Feature Cards Grid - Đồng bộ style card trắng bo góc 2xl */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Sheet Roster</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quét tự động dải ngày từ 26 tháng này đến 25 tháng sau theo mốc ô L1.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Template gốc</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chuẩn hóa mã ca quy đổi, tách mã và tên phòng riêng biệt, tự động đánh số thứ tự.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-start space-x-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Import phân ca</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Loại bỏ dòng trống và tự động lọc bỏ các nhân sự chưa có tài khoản AD.
              </p>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Tải lên file Roster Excel</h2>
                <p className="text-xs text-slate-500">Định dạng hỗ trợ: .xlsx, .xls</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Sẵn sàng hoạt động
            </span>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              file
                ? "border-emerald-500 bg-emerald-50/20"
                : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-slate-50/50"
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
              <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                <UploadCloud className="w-6 h-6" />
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
                    Kéo thả file Excel vào đây hoặc <span className="text-emerald-600 underline font-bold">chọn từ thiết bị</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Hệ thống xử lý trực tiếp các sheet Roster, Account và Nurses</p>
                </div>
              )}
            </label>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
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
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${
                loading || !file
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-200"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang chạy thuật toán xử lý...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> <span>Thực hiện chuyển đổi & tải file</span> <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}