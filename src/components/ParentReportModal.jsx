import React, { useState } from 'react';
import { getStudentProfile, saveStudentProfile, getDailyProgress, analyzeWeakAreas } from '../utils/secureStorage';
import { CURRICULUM_20_DAYS } from '../data/curriculum20Days';
import { Printer, X, Award, Sparkles, BookOpen, AlertCircle, Heart, CheckCircle2, Calendar, Clock, Check } from 'lucide-react';

/**
 * [학부모용 20일 완성 한글 배움 리포트 모달]
 * 1일 20분 기준으로 20일간 진행된 아이의 일일 진도,
 * 매일 학습 평가 점수 및 가정 연계 지도 조언을 담아
 * 바로 A4 용지로 인쇄할 수 있는 공식 학부모 통지표입니다.
 */
export default function ParentReportModal({ onClose }) {
  const [profile, setProfile] = useState(getStudentProfile());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [classInput, setClassInput] = useState(profile.className);
  
  const dailyProgress = getDailyProgress();
  const analysis = analyzeWeakAreas();

  // 최신 학습 일차 데이터 (가정 지도 팁 연계용)
  const currentDayNum = Math.max(1, dailyProgress.lastCompletedDay || 1);
  const currentDayData = CURRICULUM_20_DAYS.find((d) => d.day === currentDayNum) || CURRICULUM_20_DAYS[0];

  // 학생 프로필 암호화 저장
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { ...profile, name: nameInput, className: classInput };
    saveStudentProfile(updated);
    setProfile(updated);
    setIsEditingProfile(false);
  };

  // 인쇄 실행
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 my-8 relative print:border-none print:shadow-none print:max-w-none print:p-2">
        {/* 상단 닫기 및 인쇄 버튼 (화면용) */}
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
            [인쇄 대상: 20일 완성 한글 성장 통지표 본체]
           ======================================================== */}
        <div className="space-y-6 text-slate-800 font-sans">
          {/* 1. 통지표 헤더 */}
          <div className="text-center border-b-4 border-double border-amber-300 pb-4">
            <span className="text-xs font-black text-amber-700 tracking-widest bg-amber-100 px-3 py-1 rounded-full uppercase">
              초등 1학년 20일 완성 가정 연계 공식 리포트
            </span>
            <h1 className="text-3xl font-black text-amber-950 mt-2">
              쑥쑥 한글 20일 배움 성장 통지표
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              "1일 20분, 기초 자모음부터 받침 있는 낱말까지 차근차근 다져가는 배움의 기록입니다."
            </p>
          </div>

          {/* 2. 학생 인적 사항 */}
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
                  <span className="text-xs text-slate-500">학생 정보 암호화 보관 완료 🔒</span>
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

          {/* 3. 20일 완주 종합 진도율 요약 카드 */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">20일 완주 진도율</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {Object.keys(dailyProgress.days).length} / 20일
              </div>
              <span className="text-[10px] text-amber-800 font-bold">
                ({Math.round((Object.keys(dailyProgress.days).length / 20) * 100)}% 달성)
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">평균 평가 성취도</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">{analysis.averageScore || 100}%</div>
              <span className="text-[10px] text-indigo-800 font-bold">참 잘하고 있어요!</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">현재 학습 단계</span>
              <div className="text-xs font-black text-emerald-700 mt-2 truncate">
                {currentDayData.title}
              </div>
              <span className="text-[10px] text-emerald-800 font-bold">DAY {currentDayNum} 진행 중</span>
            </div>
          </div>

          {/* 4. 20일 일일 평가 성취도 달력 (1일차~20일차 전 현황) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                20일 일일 평가 성취도 달력
              </span>
              <span className="text-[11px] text-slate-400 font-bold">1일 20분 루틴</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {CURRICULUM_20_DAYS.map((d) => {
                const dayResult = dailyProgress.days[d.day];
                const isCompleted = !!dayResult;
                return (
                  <div
                    key={d.day}
                    className={`p-2 rounded-xl text-center border flex flex-col items-center justify-between min-h-[52px] ${
                      isCompleted
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black">{d.day}일</span>
                    <div className="text-xs">
                      {isCompleted ? '💮' : d.day === 20 ? '👑' : '·'}
                    </div>
                    <span className="text-[9px] font-bold">
                      {isCompleted ? `${dayResult.percentage}점` : '대기'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. 학부모님을 위한 오늘의 맞춤형 가정 지도 조언문 (핵심 교사 꿀팁) */}
          <div className="bg-amber-100/70 p-5 rounded-2xl border-2 border-amber-300 space-y-2">
            <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>학부모님께 드리는 오늘의 가정 지도 꿀팁 (DAY {currentDayNum})</span>
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-bold bg-white/80 p-3 rounded-xl">
              📢 {currentDayData.parentAdvice}
            </p>
            <div className="text-[11px] text-slate-600 bg-white/60 p-3 rounded-xl space-y-1">
              <p>💡 <strong>1학년 20분 학습 성공 원칙:</strong></p>
              <p>• 아이가 20분 동안 공부를 마쳤다면, 결과와 상관없이 <strong>"오늘 20분 약속을 멋지게 지켰네!"</strong> 하고 노력을 칭찬해 주세요.</p>
              <p>• 틀린 글자가 있더라도 <strong>"다시 소리를 들어보자!"</strong> 하며 아이의 자존감을 지켜주세요.</p>
            </div>
          </div>

          {/* 6. 취약 글자 안내 */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
            <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>가정에서 한 번 더 짚어주면 좋은 글자</span>
            </h4>
            {analysis.weakLetters && analysis.weakLetters.length > 0 ? (
              <div className="flex items-center gap-2">
                {analysis.weakLetters.map((l, i) => (
                  <span key={i} className="px-3 py-1 bg-white border-2 border-rose-300 text-rose-700 font-black text-sm rounded-xl">
                    "{l}"
                  </span>
                ))}
                <span className="text-xs text-slate-600 ml-2">소리와 모양을 거울을 보며 한 번 더 들려주세요.</span>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>오답률이 높은 글자 없이 20일 코스를 균형 있게 잘 소화하고 있습니다!</span>
              </p>
            )}
          </div>

          {/* 7. 직인 및 발행일 */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>초등학교 1학년 한글 지도 교사 올림</span>
            <span className="font-bold">발행일: {new Date().toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
