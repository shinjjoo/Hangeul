import React, { useState, useEffect } from 'react';
import { getStudentProfile, saveStudentProfile, getAssessmentHistory, analyzeWeakAreas } from '../utils/secureStorage';
import { Printer, X, Award, Sparkles, BookOpen, AlertCircle, Heart, CheckCircle } from 'lucide-react';

/**
 * [학부모 안내용 쑥쑥 한글 성장 통지표 컴포넌트]
 * 학교와 가정이 함께 협력하여 학생을 지도할 수 있도록
 * 평가 누적 데이터, 취약점 분석 및 가정 지도 조언을 담아
 * 바로 인쇄(A4)할 수 있도록 제작된 공식 리포트입니다.
 */
export default function ParentReportModal({ onClose }) {
  const [profile, setProfile] = useState(getStudentProfile());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [classInput, setClassInput] = useState(profile.className);
  
  const history = getAssessmentHistory();
  const analysis = analyzeWeakAreas();

  // 프로필 저장 처리 (규칙 8: 암호화 적용)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { ...profile, name: nameInput, className: classInput };
    saveStudentProfile(updated);
    setProfile(updated);
    setIsEditingProfile(false);
  };

  // 인쇄하기
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 my-8 relative print:border-none print:shadow-none print:max-w-none print:p-2">
        {/* 우측 상단 닫기 및 인쇄 버튼 (화면 표시용) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-100 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>A4 통지표 인쇄하기</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* ========================================================
            [인쇄 대상: 한글 성장 통지표 본체]
           ======================================================== */}
        <div className="space-y-6 text-slate-800 font-sans">
          {/* 1. 통지표 헤더 */}
          <div className="text-center border-b-4 border-double border-amber-300 pb-4">
            <span className="text-xs font-black text-amber-700 tracking-widest bg-amber-100 px-3 py-1 rounded-full uppercase">
              초등 1학년 가정 연계 교육 리포트
            </span>
            <h1 className="text-3xl font-black text-amber-950 mt-2">
              쑥쑥 한글 배움 성장 통지표
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              "한 글자 한 글자 소중하게 깨우치는 우리 아이의 한글 발걸음입니다."
            </p>
          </div>

          {/* 2. 학생 인적 사항 (편집 가능) */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {!isEditingProfile ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xl shadow-sm">
                  🧒
                </div>
                <div>
                  <div className="text-lg font-black text-amber-950">
                    {profile.grade} {profile.className} <span className="text-indigo-700">{profile.name}</span> 어린이
                  </div>
                  <span className="text-xs text-slate-500">개인정보 암호화 보관 완료 🔒</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  placeholder="예: 1반"
                  className="w-24 px-3 py-1.5 rounded-xl border border-amber-300 text-sm font-bold"
                />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="학생 이름"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 text-sm font-bold"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 text-white font-bold rounded-xl text-xs"
                >
                  저장
                </button>
              </form>
            )}

            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline print:hidden"
              >
                이름 변경
              </button>
            )}
          </div>

          {/* 3. 종합 성취 요약 카드 */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">누적 평가 횟수</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{analysis.totalTests || 0}회</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">평균 성취도</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">{analysis.averageScore || 0}%</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">현재 권장 단계</span>
              <div className="text-xs font-black text-amber-700 mt-2 truncate">{analysis.recommendedStep || '새싹 단계'}</div>
            </div>
          </div>

          {/* 4. 최근 평가 이력 테이블 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>최근 성취도 평가 기록 (최신 5건)</span>
            </div>
            {history.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                    <th className="p-2.5">평가 일시</th>
                    <th className="p-2.5">수준</th>
                    <th className="p-2.5">득점</th>
                    <th className="p-2.5 text-right">성취율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/30">
                      <td className="p-2.5 text-slate-600">{item.date}</td>
                      <td className="p-2.5 font-bold">
                        {item.level === 1 && '🌱 1수준 (소리)'}
                        {item.level === 2 && '🌸 2수준 (단어)'}
                        {item.level === 3 && '🍎 3수준 (빈칸)'}
                      </td>
                      <td className="p-2.5 text-slate-700 font-bold">{item.score} / {item.total}</td>
                      <td className="p-2.5 text-right font-black text-indigo-600">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                아직 진행된 평가 기록이 없습니다.
              </div>
            )}
          </div>

          {/* 5. 취약 음소 및 보충 지도 필요 글자 */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
            <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>조금 더 연습하면 좋은 글자 (취약점 분석)</span>
            </h4>
            {analysis.weakLetters && analysis.weakLetters.length > 0 ? (
              <div className="flex items-center gap-2">
                {analysis.weakLetters.map((letter, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border-2 border-rose-300 text-rose-700 font-black text-sm rounded-xl shadow-xs"
                  >
                    "{letter}"
                  </span>
                ))}
                <span className="text-xs text-slate-600 ml-2">글자의 소리와 모양을 한 번 더 들려주세요.</span>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>오답률이 높은 취약 글자가 없습니다! 골고루 잘 이해하고 있습니다.</span>
              </p>
            )}
          </div>

          {/* 6. 학부모님을 위한 가정 연계 지도 꿀팁 (교사 맞춤 조언) */}
          <div className="bg-amber-100/60 p-5 rounded-2xl border-2 border-amber-300 space-y-2">
            <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>학부모님께 드리는 다정한 가정 지도 꿀팁</span>
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {analysis.advice}
            </p>
            <div className="text-[11px] text-slate-600 bg-white/80 p-3 rounded-xl space-y-1">
              <p>💡 <strong>가정 연계 Tip:</strong></p>
              <p>• 틀려도 절대로 "왜 몰라?" 하고 다그치지 마시고, <strong>"괜찮아! 다시 들어보자!"</strong> 하고 격려해 주세요.</p>
              <p>• 일상생활에서 간판이나 과자 봉지의 글자를 볼 때 <strong>"나비의 '나'가 여기 있네!"</strong> 하며 칭찬해 주세요.</p>
            </div>
          </div>

          {/* 7. 직인 및 확인란 */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>초등학교 1학년 한글 지도 교사 올림</span>
            <span className="font-bold">발행일: {new Date().toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
