"use client";

import React, { useState, useRef, useEffect } from "react";
import { Award, Upload, Download, Sparkles, MessageSquare } from "lucide-react";

interface TeamWish {
  id: string;
  teamName: string;
  wishText: string;
}

export default function AwardCanvasPage() {
  const [fullName, setFullName] = useState<string>("Nguyễn Văn Xuất Sắc");
  const [quarter, setQuarter] = useState<string>("III");
  const [year, setYear] = useState<string>("2026");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [bgImageSrc, setBgImageSrc] = useState<string>("/award-bg-clean.jpg");

  // Hằng số độ uốn cong tên (Đã được cấu hình cố định trong code để ôm khớp với dải ruy-băng)
  const CURVE_RADIUS = 1000; 

  const [teams, setTeams] = useState<TeamWish[]>([
    { id: "1", teamName: "Team Hương", wishText: "Chúc mừng anh đạt nhân viên xuất sắc của quý.\nChúc anh thật nhiều sức khoẻ!" },
    { id: "2", teamName: "Team Dương", wishText: "Chúc mừng Anh đã xuất sắc đạt thành tích lần này nhé!\nThành quả rất xứng đáng!" },
    { id: "3", teamName: "Team Thảo", wishText: "Quý này anh lại lên đỉnh\nAnh em biết thế lại mừng cho anh\nChúc anh thật nhiều hạnh phúc!" },
    { id: "4", teamName: "Team Tú", wishText: "Vững chuyên môn,\nLuôn hỗ trợ tuyệt vời cho đồng đội!" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * HÀM VẼ CHỮ UỐN CONG THEO HÌNH CUNG TRÒN
   * Giúp tên nhân viên uốn lượn theo đường cong của ruy-băng.
   */
  const drawCurvedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${Math.round(ctx.canvas.width * 0.033)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = Math.round(ctx.canvas.width * 0.008);

    const chars = text.toUpperCase().split("");
    const charWidths = chars.map((c) => ctx.measureText(c).width);
    const totalWidth = charWidths.reduce((a, b) => a + b, 0);

    // Tính tổng góc mà chuỗi ký tự chiếm trên đường tròn
    const totalAngle = totalWidth / radius;
    let currentAngle = -totalAngle / 2;

    chars.forEach((char, i) => {
      const charAngle = charWidths[i] / radius;
      const angle = currentAngle + charAngle / 2;

      ctx.save();
      // Dịch chuyển tọa độ và xoay góc tương ứng cho từng chữ cái
      ctx.translate(
        centerX + radius * Math.sin(angle),
        centerY - radius * Math.cos(angle)
      );
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();

      currentAngle += charAngle;
    });

    ctx.restore();
  };

  /**
   * HÀM WRAP TEXT NÂNG CẤP
   * Hỗ trợ đồng thời cả xuống dòng tự động (auto-wrap theo chiều rộng) 
   * và xuống dòng thủ công bằng phím Enter (\n) để làm thơ.
   */
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ) => {
    const paragraphs = text.split("\n"); // Tách đoạn theo dấu Enter người dùng gõ
    let currentY = y;
    let lineCount = 0;

    for (let p = 0; p < paragraphs.length; p++) {
      const words = paragraphs[p].split(" ");
      let line = "";

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, currentY);
          line = words[n] + " ";
          currentY += lineHeight;
          lineCount++;
          if (lineCount >= maxLines) return;
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line.trim(), x, currentY);
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines) return;
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = bgImageSrc;

    bgImg.onload = () => {
      const W = bgImg.naturalWidth || 736;
      const H = bgImg.naturalHeight || 981;

      canvas.width = W;
      canvas.height = H;

      // 1. Vẽ phôi nền bằng khen
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.drawImage(bgImg, 0, 0, W, H);
      ctx.restore();

      // 2. PHẦN CHỮ QUÝ - NĂM
      ctx.fillStyle = "#003b71";
      ctx.font = `900 ${Math.round(W * 0.052)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`QUÝ ${quarter} - ${year}`, W / 2, H * 0.238);

      // 3. PHẦN KHUNG TRÒN AVATAR
      const circleCenterX = W / 2;
      const circleCenterY = H * 0.434;
      const circleRadius = W * 0.219;

      const drawAvatarAndText = (imgElement: HTMLImageElement | null) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        if (imgElement) {
          ctx.drawImage(
            imgElement,
            circleCenterX - circleRadius,
            circleCenterY - circleRadius,
            circleRadius * 2,
            circleRadius * 2
          );
        } else {
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(circleCenterX - circleRadius, circleCenterY - circleRadius, circleRadius * 2, circleRadius * 2);
        }
        ctx.restore();

        ctx.strokeStyle = "#043c70";
        ctx.lineWidth = Math.round(W * 0.008);
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2, true);
        ctx.stroke();

        // 4. PHẦN TÊN NHÂN VIÊN UỐN CONG TRÊN RUY-BĂNG (Dùng hàm uốn cong cố định)
        const nameText = fullName || "HỌ VÀ TÊN";
        const nameCenterY = H * 0.634 + CURVE_RADIUS; 
        drawCurvedText(ctx, nameText, W / 2, nameCenterY, CURVE_RADIUS);

        // 5. PHẦN 4 Ô LỜI CHÚC TỪ CÁC TUA
        const maxTextWidth = W * 0.335; 

        const teamCoordinates = [
          {
            id: "1", // Tua 1 (Trên - Trái)
            x: W * 0.145,
            y: H * 0.705,
            teamNameXOffset: -W * 0.1,
            teamNameYOffset: H * 0.075,
          },
          {
            id: "2", // Tua 2 (Trên - Phải)
            x: W * 0.665,
            y: H * 0.705,
            teamNameXOffset: -W * 0.11,
            teamNameYOffset: H * 0.075,
          },
          {
            id: "3", // Tua 3 (Dưới - Trái)
            x: W * 0.145,
            y: H * 0.855,
            teamNameXOffset: -W * 0.1,
            teamNameYOffset: H * 0.075,
          },
          {
            id: "4", // Tua 4 (Dưới - Phải)
            x: W * 0.665,
            y: H * 0.855,
            teamNameXOffset: -W * 0.11,
            teamNameYOffset: H * 0.075,
          },
        ];

        teams.forEach((team, index) => {
          const pos = teamCoordinates[index];
          if (!pos) return;

          // --- 5.1. VĂN BẢN LỜI CHÚC (Hỗ trợ xuống dòng viết thơ) ---
          ctx.fillStyle = "#1e293b";
          ctx.font = `500 ${Math.round(W * 0.018)}px sans-serif`;
          ctx.textAlign = "left";
          wrapText(ctx, team.wishText, pos.x, pos.y, maxTextWidth, W * 0.022, 4);

          // --- 5.2. TÊN TUA ---
          ctx.fillStyle = "#ffffff";
          ctx.font = `800 ${Math.round(W * 0.012)}px sans-serif`;
          ctx.textAlign = "center";
          
          const ellipseX = pos.x + maxTextWidth / 2 + pos.teamNameXOffset;
          const ellipseY = pos.y + pos.teamNameYOffset; 
          ctx.fillText(team.teamName, ellipseX, ellipseY);
        });
      };

      if (avatarUrl) {
        const avatarImg = new Image();
        avatarImg.crossOrigin = "anonymous";
        avatarImg.src = avatarUrl;
        avatarImg.onload = () => drawAvatarAndText(avatarImg);
        avatarImg.onerror = () => drawAvatarAndText(null);
      } else {
        drawAvatarAndText(null);
      }
    };
  };

  useEffect(() => {
    renderCanvas();
  }, [fullName, quarter, year, avatarUrl, bgImageSrc, teams]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Bang_Khen_${fullName.replace(/\s+/g, "_")}_Q${quarter}_${year}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleTeamChange = (id: string, field: "teamName" | "wishText", value: string) => {
    setTeams((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header điều khiển */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Xin chúc mừng nhân viên xuất sắc</h1>
              <p className="text-xs text-slate-500">Đôi lời gửi tới nhân viên xuất sắc của chúng ta</p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Tải ảnh chất lượng cao</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cột form nhập liệu */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            <h2 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Thông tin chung</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên nhân viên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-semibold uppercase outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quý</label>
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 rounded-xl outline-none"
                >
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Năm</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ảnh chân dung nhân viên</label>
              <label className="flex items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 cursor-pointer bg-slate-50 transition">
                <Upload className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-xs font-medium text-slate-600">Tải ảnh cá nhân</span>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setAvatarUrl(URL.createObjectURL(e.target.files[0]))} className="hidden" />
              </label>
            </div>

            <h2 className="text-base font-bold text-slate-800 pt-3 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Đôi lời chúc gửi tới nhân viên xuất sắc</span>
            </h2>

            <div className="space-y-3">
              {teams.map((team, idx) => (
                <div key={team.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="block text-xs font-bold text-slate-500">Tua {idx + 1}:</span>
                  <input
                    type="text"
                    value={team.teamName}
                    onChange={(e) => handleTeamChange(team.id, "teamName", e.target.value)}
                    className="w-full p-1.5 text-xs font-bold text-slate-800 border border-slate-300 rounded-lg outline-none bg-white"
                  />
                  <textarea
                    rows={3}
                    value={team.wishText}
                    onChange={(e) => handleTeamChange(team.id, "wishText", e.target.value)}
                    placeholder="Nhập lời chúc (bấm Enter để xuống dòng)..."
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none bg-white resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột hiển thị Canvas */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-[480px] shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-200">
              <canvas 
                ref={canvasRef} 
                className="w-full h-auto block select-none"
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}