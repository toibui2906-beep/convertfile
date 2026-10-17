'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ClipboardCheck, 
  Star, 
  Send, 
  User, 
  Building2, 
  FolderKanban, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface EvaluationDetail {
  id: string;
  relationship: string;
  project: { title: string };
  targetUser: { fullName: string; department: string; email: string };
  evaluator: { fullName: string; department: string };
  surveyResponse?: any;
}

interface CriteriaItem {
  id: string;
  stt: number;
  category: string;
  title: string;
  description: string;
  weight: number;
}

function SurveyFormContent() {
  const params = useParams();
  const router = useRouter();
  const evaluationMapId = params.token as string;

  const [evaluationDetail, setEvaluationDetail] = useState<EvaluationDetail | null>(null);
  const [criteriaList, setCriteriaList] = useState<CriteriaItem[]>([]); // Danh sách tiêu chí động
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  // Tải thông tin đánh giá VÀ danh sách tiêu chí từ API
  useEffect(() => {
    const initPageData = async () => {
      try {
        setLoading(true);
        // Gọi song song API lấy thông tin đánh giá và danh sách tiêu chí
        const [evalRes, criteriaRes] = await Promise.all([
          fetch(`/api/360/surveys/${evaluationMapId}`),
          fetch('/api/360/criteria') // API lấy danh sách tiêu chí động
        ]);

        if (evalRes.ok) {
          const evalData = await evalRes.json();
          setEvaluationDetail(evalData);
          if (evalData.surveyResponse?.scores) {
            setScores(evalData.surveyResponse.scores);
          }
        }

        if (criteriaRes.ok) {
          const criteriaData = await criteriaRes.json();
          setCriteriaList(criteriaData);
        }
      } catch (error) {
        console.error('Lỗi khởi tạo dữ liệu trang đánh giá:', error);
      } finally {
        setLoading(false);
      }
    };

    if (evaluationMapId) initPageData();
  }, [evaluationMapId]);

  const handleScoreChange = (id: string, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra số lượng tiêu chí động hiện tại
    const answeredCount = Object.keys(scores).length;
    if (answeredCount < criteriaList.length) {
      alert(`Vui lòng đánh giá đầy đủ tất cả các tiêu chí! Bạn mới hoàn thành ${answeredCount}/${criteriaList.length} tiêu chí.`);
      
      const firstMissing = criteriaList.find(item => scores[item.id] === undefined);
      if (firstMissing) {
        const element = document.getElementById(`criteria-${firstMissing.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn nộp phiếu đánh giá này không?')) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/360/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluationMapId,
          scores,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi khi gửi khảo sát');

      alert('Đã gửi phiếu đánh giá thành công!');
      router.push('/');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-slate-500 text-sm font-medium">Đang tải biểu mẫu khảo sát...</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(scores).length;
  const isComplete = answeredCount === criteriaList.length && criteriaList.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* THÔNG TIN NGƯỜI ĐƯỢC ĐÁNH GIÁ */}
        {evaluationDetail && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center space-x-1">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>{evaluationDetail.project?.title || 'Đợt Đánh Giá 360°'}</span>
              </span>

              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                Quan hệ: <strong className="text-emerald-700">{evaluationDetail.relationship}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                  {evaluationDetail.targetUser?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người được đánh giá</span>
                  <h2 className="text-xl font-extrabold text-slate-800">{evaluationDetail.targetUser?.fullName}</h2>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evaluationDetail.targetUser?.department}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 sm:text-right w-full sm:w-auto">
                <p className="font-semibold text-slate-700">Người thực hiện đánh giá:</p>
                <p className="font-bold text-emerald-600">{evaluationDetail.evaluator?.fullName}</p>
              </div>
            </div>
          </div>
        )}

        {/* FORM KHẢO SÁT CHÍNH (RENDER ĐỘNG TỪ CRITERIA LIST) */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {criteriaList.map((item, index) => {
            const showCategoryHeader = index === 0 || criteriaList[index - 1].category !== item.category;
            const hasScored = scores[item.id] !== undefined;

            return (
              <React.Fragment key={item.id}>
                {showCategoryHeader && (
                  <div className="bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md mt-6">
                    {item.category}
                  </div>
                )}

                <div 
                  id={`criteria-${item.id}`}
                  className={`bg-white p-5 rounded-2xl border shadow-sm space-y-4 transition ${
                    !hasScored ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        hasScored ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.stt}
                      </span>
                      <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg w-fit">
                      Hệ số / Điểm: <strong className="text-emerald-600">{item.weight}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Chọn mức độ đánh giá (1 - 5):</label>
                      {!hasScored && (
                        <span className="text-[11px] font-medium text-amber-600 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Chưa chọn</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((scoreVal) => (
                        <button
                          type="button"
                          key={scoreVal}
                          onClick={() => handleScoreChange(item.id, scoreVal)}
                          className={`py-2.5 rounded-xl text-sm font-bold border transition flex flex-col items-center justify-center gap-1 ${
                            scores[item.id] === scoreVal
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${scores[item.id] === scoreVal ? 'fill-white' : 'text-slate-400'}`} />
                          <span>{scoreVal} điểm</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* FOOTER SUBMIT */}
          <div className="sticky bottom-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between z-40">
            <div className="text-xs font-medium">
              Tiến độ: <strong className={isComplete ? "text-emerald-600" : "text-amber-600"}>{answeredCount}</strong> / {criteriaList.length} tiêu chí
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Đang gửi kết quả...' : 'Nộp Phiếu Đánh Giá'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function SurveyFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-slate-500 text-sm font-medium">Đang tải biểu mẫu khảo sát...</p>
        </div>
      </div>
    }>
      <SurveyFormContent />
    </Suspense>
  );
}