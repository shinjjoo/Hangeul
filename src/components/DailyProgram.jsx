import React, { useState, useEffect } from 'react';
import { CURRICULUM_20_DAYS } from '../data/curriculum20Days';
import { playHangeulSound } from '../utils/speech';
import { getDailyProgress, saveDayCompletion } from '../utils/secureStorage';
import confetti from 'canvas-confetti';
import { 
  Calendar, CheckCircle2, Clock, Volume2, Sparkles, Award, 
  ChevronRight, RotateCcw, Star, BookOpen, Layers, Edit3, CheckSquare, Heart 
} from 'lucide-react';

/**
 * [20일 완성 하루 20분 한글 매일 배움터 컴포넌트]
 * 1학년 학생의 20분 집중 루틴에 맞추어
 * [1.소리열기 ➔ 2.낱말카드 ➔ 3.합체놀이 ➔ 4.일일평가]의 4단계 학습을 진행합니다.
 */
export default function DailyProgram({ onEarnStar, onOpenReport }) {
  const [progress, setProgress] = useState(getDailyProgress());
  const [selectedDayNum, setSelectedDayNum] = useState(progress.currentActiveDay || 1);
  const [sessionStep, setSessionStep] = useState('intro'); // 'map' | 'intro' | 'cards' | 'quiz' | 'finish'
  
  // 일일 퀴즈 상태
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // 선택된 일차의 데이터
  const dayData = CURRICULUM_20_DAYS.find((d) => d.day === selectedDayNum) || CURRICULUM_20_DAYS[0];

  // 진도 상태 동기화
  useEffect(() => {
    setProgress(getDailyProgress());
  }, [sessionStep]);

  // 일차 선택
  const handleSelectDay = (day) => {
    setSelectedDayNum(day);
    setSessionStep('intro');
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    playHangeulSound(`${day}일차, ${CURRICULUM_20_DAYS[day - 1].title} 학습을 시작합니다!`);
  };

  // 소리 재생 헬퍼
  const playAudio = (text) => {
    playHangeulSound(text);
  };

  // 일일 퀴즈 정답 선택 처리
  const handleAnswerQuiz = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQ = dayData.quiz[quizIdx];
    const isCorrect = option === currentQ.correct;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      playHangeulSound('딩동댕! 정답이에요! 참 잘했어요!');
    } else {
      playHangeulSound(`아쉬워요! 정답은 ${currentQ.correct}이에요. 다음 문제도 힘내요!`);
    }
  };

  // 일일 퀴즈 다음 문제 이동
  const handleNextQuiz = () => {
    if (quizIdx + 1 < dayData.quiz.length) {
      setQuizIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // 퀴즈 완료 및 일일 진도 저장
      const finalScore = quizScore + (selectedAnswer === dayData.quiz[quizIdx].correct ? 0 : 0);
      saveDayCompletion(dayData.day, finalScore, dayData.quiz.length);
      if (onEarnStar) onEarnStar();

      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      playHangeulSound(`와! ${dayData.day}일차 오늘의 20분 공부를 모두 완벽하게 끝마쳤어요! 최고예요!`);
      setSessionStep('finish');
    }
  };

  // 1. 전체 20일 로드맵 지도 뷰 (모든 일차 한눈에 보기)
  if (sessionStep === 'map') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-jelly">
        {/* 상단 배너 */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 shadow-xl text-amber-950 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/40 rounded-full font-black text-xs mb-2">
            <Clock className="w-3.5 h-3.5" />
            1일 20분 맞춤 코스
          </div>
          <h2 className="text-3xl font-black">20일 완성 한글 마스터 로드맵</h2>
          <p className="text-amber-900 text-sm mt-1 font-bold">
            기초 자모음부터 받침 있는 낱말, 문장까지 차근차근 정복해요!
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-2xl shadow-xs text-xs font-black text-amber-950">
            <span>완주 진도율:</span>
            <span className="text-indigo-600 text-sm font-black">
              {Object.keys(progress.days).length} / 20일 ({Math.round((Object.keys(progress.days).length / 20) * 100)}%)
            </span>
          </div>
        </div>

        {/* 4주차 그룹별 20일 타일 그리드 */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((wk) => {
            const weekTitles = {
              1: '🌱 1주차: 기본 모음과 자음 소리 탐험 (1~5일차)',
              2: '🌸 2주차: 자음과 모음 결합 낱말 완성 (6~10일차)',
              3: '⭐ 3주차: 대표 받침(ㅇ, ㄱ, ㄴ, ㄹ, ㅁ, ㅂ) 원리 깨치기 (11~15일차)',
              4: '👑 4주차: 받침 확장 & 첫 문장 완성 & 졸업 (16~20일차)',
            };
            const daysInWeek = CURRICULUM_20_DAYS.filter((d) => d.week === wk);

            return (
              <div key={wk} className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-sm">
                <h3 className="text-xs font-black text-amber-900 mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {weekTitles[wk]}
                </h3>

                <div className="grid grid-cols-5 gap-2">
                  {daysInWeek.map((d) => {
                    const isDone = !!progress.days[d.day];
                    const isCurrent = d.day === selectedDayNum;

                    return (
                      <button
                        key={d.day}
                        onClick={() => handleSelectDay(d.day)}
                        className={`p-2.5 rounded-2xl flex flex-col items-center justify-between gap-1 transition-all transform active:scale-95 shadow-xs ${
                          isDone
                            ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                            : isCurrent
                            ? 'bg-amber-400 border-2 border-amber-500 text-amber-950 ring-4 ring-amber-200 scale-105 shadow-md'
                            : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        <span className="text-[11px] font-black">{d.day}일</span>
                        <div className="text-xl">
                          {isDone ? '✅' : d.day === 20 ? '👑' : d.category === '받침' ? '📦' : '🐣'}
                        </div>
                        {isDone ? (
                          <span className="text-[10px] font-bold text-emerald-700">{progress.days[d.day].percentage}점</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">대기</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 닫기 */}
        <button
          onClick={() => setSessionStep('intro')}
          className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl shadow-sm transition-all text-sm"
        >
          선택한 {selectedDayNum}일차 공부 시작하기 👉
        </button>
      </div>
    );
  }

  // 2. 일일 세션 완료 화면
  if (sessionStep === 'finish') {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-300 max-w-lg mx-auto text-center space-y-6 animate-jelly">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner">
          🎉
        </div>
        <div>
          <span className="bg-amber-200 text-amber-950 text-xs font-black px-3 py-1 rounded-full">
            {dayData.day}일차 완주 성공!
          </span>
          <h2 className="text-3xl font-black text-amber-950 mt-2">오늘의 20분 공부 완료!</h2>
          <p className="text-slate-500 text-sm mt-1">오늘 배운 한글 실력이 쑥쑥 자라났어요.</p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200 flex items-center justify-around">
          <div>
            <span className="text-xs text-slate-500 font-bold">일일 평가 점수</span>
            <div className="text-3xl font-black text-amber-900 mt-0.5">
              {progress.days[dayData.day]?.percentage || 100}점
            </div>
          </div>
          <div className="h-10 w-px bg-amber-200"></div>
          <div>
            <span className="text-xs text-slate-500 font-bold">획득 칭찬 도장</span>
            <div className="text-3xl font-black text-emerald-600 mt-0.5">쾅! 💮</div>
          </div>
        </div>

        {/* 조작 버튼 */}
        <div className="space-y-2">
          {selectedDayNum < 20 && (
            <button
              onClick={() => handleSelectDay(selectedDayNum + 1)}
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black py-4 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all text-base"
            >
              다음 {selectedDayNum + 1}일차 공부하러 가기 👉
            </button>
          )}

          <button
            onClick={onOpenReport}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-2xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>학부모용 20일 성장 리포트 보기</span>
          </button>

          <button
            onClick={() => setSessionStep('map')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-all text-xs"
          >
            전체 20일 로드맵 지도 보기 🗺️
          </button>
        </div>
      </div>
    );
  }

  // 3. 일일 평가 문제 풀이 화면
  if (sessionStep === 'quiz') {
    const q = dayData.quiz[quizIdx];
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setSessionStep('intro')}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
          >
            ← 학습 내용 복습하기
          </button>
          <span className="text-xs font-black bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {dayData.day}일차 평가 ({quizIdx + 1} / {dayData.quiz.length}번)
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-300 flex flex-col items-center text-center">
          <div className="text-5xl my-2">📝</div>
          <h3 className="text-2xl font-black text-slate-800 mt-2">{q.question}</h3>

          <button
            onClick={() => playAudio(q.audio)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4 text-purple-700" />
            <span>문제 소리 듣기</span>
          </button>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            {q.options.map((opt) => {
              const isChosen = selectedAnswer === opt;
              const isCorrect = opt === q.correct;
              let btnStyle = 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-2 border-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-100 text-rose-700 border-2 border-rose-300 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswerQuiz(opt)}
                  disabled={isAnswered}
                  className={`py-5 rounded-2xl text-2xl sm:text-3xl font-black transition-all transform active:scale-95 shadow-sm flex items-center justify-center ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 w-full animate-jelly">
              <button
                onClick={handleNextQuiz}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all text-base"
              >
                {quizIdx + 1 < dayData.quiz.length ? '다음 문제 풀기 👉' : '오늘의 평가 완료하기 🏆'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. [기본 화면] 오늘의 20분 학습 세션 메인 안내
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* 상단 일차 헤더 및 로드맵 이동 버튼 */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setSessionStep('map')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-extrabold text-xs shadow-xs hover:bg-amber-50 active:scale-95 transition-all"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>전체 20일 로드맵 지도 🗺️</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>오늘 권장 시간: 20분</span>
        </div>
      </div>

      {/* 오늘의 주제 쇼케이스 카드 */}
      <div className="bg-gradient-to-b from-white to-amber-50/50 rounded-3xl p-6 shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-amber-400 text-amber-950 font-black rounded-full text-xs">
            DAY {dayData.day}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {dayData.week}주차 • {dayData.category}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
          {dayData.title}
        </h2>
        <p className="text-slate-600 text-sm mt-1 font-medium">{dayData.description}</p>

        {/* 오늘 익힐 목표 글자들 */}
        <div className="mt-5 bg-white p-4 rounded-2xl border-2 border-amber-200">
          <span className="text-xs font-extrabold text-amber-800 mb-2 block">
            🎯 오늘의 목표 글자 (터치하면 소리가 나요)
          </span>
          <div className="flex flex-wrap gap-2">
            {dayData.targetChars.map((char) => (
              <button
                key={char}
                onClick={() => playAudio(char)}
                className="w-12 h-12 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 font-black text-2xl text-amber-900 flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* 오늘 배울 낱말 3선 */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-extrabold text-slate-700 block">
            📖 오늘의 배움 단어
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {dayData.words.map((w, idx) => (
              <div
                key={idx}
                onClick={() => playAudio(`${w.word}! ${w.hint}`)}
                className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center gap-2.5 cursor-pointer hover:border-amber-400 hover:scale-102 transition-all"
              >
                <span className="text-3xl">{w.emoji}</span>
                <div>
                  <div className="text-base font-black text-amber-950">{w.word}</div>
                  <div className="text-[10px] text-slate-500">{w.hint}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 20분 세션 시작 버튼: 일일 평가 풀기 */}
        <button
          onClick={() => {
            setSessionStep('quiz');
            setQuizIdx(0);
            setQuizScore(0);
            setSelectedAnswer(null);
            setIsAnswered(false);
            playAudio(`${dayData.day}일차 오늘의 일일 평가를 시작합니다!`);
          }}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
        >
          <CheckSquare className="w-5 h-5" />
          <span>오늘의 일일 평가 시작하기 (3문제) 👉</span>
        </button>
      </div>
    </div>
  );
}
