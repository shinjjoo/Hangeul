import React, { useState } from 'react';
import { 
  getCurrentStudent, getDailyProgress, analyzeWeakAreas 
} from '../utils/secureStorage';
import { CURRICULUM_20_DAYS } from '../data/curriculum20Days';
import { 
  Printer, X, Award, Sparkles, AlertCircle, Heart, CheckCircle2, Calendar, Clock, RotateCcw 
} from 'lucide-react';

/**
 * [학부모용 20일 완성 한글 배움 성장 통지표 모달]
 * 1일 30분 기준으로 20일간 진행된 학생의 정규 학습 진도,
 * 일일 형성평가 점수, 10분 쑥쑥 보충학습 이수 현황 및
 * 맞춤 가정 연계 지도 조언을 담아 A4 용지로 즉시 인쇄 가능한 공식 통지표입니다.
 */
export default function ParentReportModal({ onClose }) {
  const currentStudent = getCurrentStudent();
  const dailyProgress = getDailyProgress();
  const analysis = analyzeWeakAreas();

  // 최신 학습 일차 데이터 (가정 지도 팁 연계용)
  const currentDayNum = Math.max(1, dailyProgress.lastCompletedDay || 1);
  const currentDayData = CURRICULUM_20_DAYS.find((d) => d.day === currentDayNum) || CURRICULUM_20_DAYS[0];

  // 인쇄 실행
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 my-8 relative print:border-none print:shadow-none print:max-w-none print:p-2">
        {/* 상단 닫기 및 인쇄 버튼 (화면용) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-100 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>A4 통지표 인쇄하기 🖨️</span>
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
            <span className="text-xs font-black text-amber-800 tracking-widest bg-amber-100 px-3 py-1 rounded-full uppercase">
              초등 1학년 20일 완성 공식 가정 연계 리포트
            </span>
            <h1 className="text-3xl font-black text-amber-950 mt-2">
              쑥쑥 한글 20일 배움 성장 통지표
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-bold">
              "1일 30분 루틴 (소리 ➔ 쓰기 ➔ 낱말카드 ➔ 평가) 및 10분 보충학습 연계 성장 기록"
            </p>
          </div>

          {/* 2. 학생 인적 사항 */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-3xl shadow-sm border-2 border-amber-300">
                {currentStudent.avatar || '🐯'}
              </div>
              <div>
                <div className="text-lg font-black text-amber-950">
                  {currentStudent.gradeClass || '1학년 1반'}{' '}
                  <span className="text-indigo-700 underline decoration-amber-400">{currentStudent.name}</span> 어린이
                </div>
                <div className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-0.5">
                  <span>단짝 캐릭터: {currentStudent.characterName || '호치'}</span>
                  <span>•</span>
                  <span className="text-emerald-700">보안 암호화 보관 완료 🔒</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 20일 완주 종합 진도율 요약 카드 */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">20일 완주 달성률</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {analysis.passedDaysCount || 0} / 20일
              </div>
              <span className="text-[10px] text-amber-800 font-bold">
                ({analysis.progressPercentage || 0}% 정규 통과)
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">평균 평가 성취도</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {analysis.averageScore || 100}%
              </div>
              <span className="text-[10px] text-indigo-800 font-bold">
                {analysis.remedialDaysCount > 0 ? `보충 완료 ${analysis.remedialDaysCount}회` : '성실히 잘하고 있어요!'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">현재 학습 단계</span>
              <div className="text-xs font-black text-emerald-700 mt-2 truncate">
                {currentDayData.title}
              </div>
              <span className="text-[10px] text-emerald-800 font-bold">DAY {currentDayNum} 진행 중</span>
            </div>
          </div>

          {/* 4. 20일 일일 평가 성취도 달력 (1일차~20일차 전 현황) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                20일 일일 평가 & 보충학습 성취도 달력
              </span>
              <span className="text-[11px] text-slate-400 font-bold">1일 30분 표준 루틴</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {CURRICULUM_20_DAYS.map((d) => {
                const dayResult = dailyProgress.days[d.day];
                const isPassed = !!dayResult?.passed;
                const isRemedial = !!dayResult?.remedialCompleted;
                const isCompleted = !!dayResult?.completed;

                return (
                  <div
                    key={d.day}
                    className={`p-2 rounded-xl text-center border flex flex-col items-center justify-between min-h-[56px] ${
                      isPassed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : isRemedial
                        ? 'bg-orange-50 border-orange-300 text-orange-950'
                        : isCompleted
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black">{d.day}일</span>
                    <div className="text-xs">
                      {isPassed ? '💮' : isRemedial ? '🌟' : d.day === 20 ? '👑' : '·'}
                    </div>
                    <span className="text-[9px] font-bold">
                      {isPassed ? `${dayResult.percentage}점` : isRemedial ? '보충완료' : '대기'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. 학부모님을 위한 오늘의 맞춤형 가정 지도 조언문 (핵심 교사 팁) */}
          <div className="bg-amber-100/70 p-5 rounded-2xl border-2 border-amber-300 space-y-2">
            <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>학부모님께 드리는 오늘의 가정 지도 꿀팁 (DAY {currentDayNum})</span>
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-bold bg-white/80 p-3 rounded-xl">
              📢 {currentDayData.parentAdvice}
            </p>
            <div className="text-[11px] text-slate-600 bg-white/60 p-3 rounded-xl space-y-1">
              <p>💡 <strong>1학년 30분 학습 성공 지도 원칙:</strong></p>
              <p>• <strong>1. 소리(5분) ➔ 2. 쓰기(10분) ➔ 3. 카드(8분) ➔ 4. 평가(7분)</strong> 흐름을 아이가 즐겁게 완료했을 때 마음껏 칭찬해 주세요.</p>
              <p>• 혹시 평가에서 실수를 하더라도 <strong>"10분 마법 보충학습에서 다시 짚어보면 금방 알아!"</strong> 하고 자신감을 심어주세요.</p>
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
