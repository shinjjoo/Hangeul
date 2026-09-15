import React, { useState, useEffect, useRef } from 'react';
import { CURRICULUM_20_DAYS } from '../data/curriculum20Days';
import { playHangeulSound } from '../utils/speech';
import { 
  getDailyProgress, saveDayCompletion, saveRemedialCompletion, 
  getCurrentStudent, setStudentStars, getStudentStars 
} from '../utils/secureStorage';
import confetti from 'canvas-confetti';
import { 
  Clock, Volume2, Sparkles, Award, ChevronRight, RotateCcw, 
  Star, BookOpen, Layers, Edit3, CheckCircle2, Lock, ArrowRight, 
  Smile, Heart, AlertCircle, Play, Check, Flame 
} from 'lucide-react';

/**
 * [초등 1학년 20일 완성 한글 마스터 데일리 배움터]
 * 1일 30분 표준 일체형 학습 루틴:
 *  - 1단계 (5분): 오늘의 소리와 원리 (음가 & 입모양)
 *  - 2단계 (10분): 바른 글씨 손가락 따라쓰기 (모눈 인터랙티브 캔버스)
 *  - 3단계 (8분): 낱말 카드 & 결합 마법 놀이 (3D 플래시카드)
 *  - 4단계 (7분): 오늘의 성취도 일일 평가 (3문항 형성평가)
 *  ➔ 결과 분기: 목표 도달 시 다음 일차 해금 / 미도달 시 10분 쑥쑥 보충학습 연계
 */
export default function DailyProgram({ onEarnStar, onOpenReport, onOpenStudentManager }) {
  const [currentStudent, setCurrentStudent] = useState(getCurrentStudent());
  const [progress, setProgress] = useState(getDailyProgress());
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  
  // 학습 세션 진행 상태: 'map' | 'intro'(소리) | 'trace'(쓰기) | 'cards'(낱말) | 'quiz'(평가) | 'eval_result'(결과) | 'remedial'(10분보충)
  const [sessionStep, setSessionStep] = useState('map');

  // 2단계 글씨 쓰기 상태
  const [traceCharIdx, setTraceCharIdx] = useState(0);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#3B82F6');

  // 3단계 낱말 카드 상태
  const [cardIdx, setCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // 4단계 일일 평가 상태
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // 10분 보충학습 상태
  const [remedialStep, setRemedialStep] = useState(1); // 1: 소리 복습, 2: 집중 쓰기, 3: 확인 퀴즈
  const [remedialQuizIdx, setRemedialQuizIdx] = useState(0);
  const [remedialAnswered, setRemedialAnswered] = useState(false);
  const [remedialSelected, setRemedialSelected] = useState(null);

  // 현재 선택된 일차의 데이터
  const dayData = CURRICULUM_20_DAYS.find((d) => d.day === selectedDayNum) || CURRICULUM_20_DAYS[0];

  // 학생 변경 또는 진도 갱신 시 상태 동기화
  const refreshStudentAndProgress = () => {
    const student = getCurrentStudent();
    setCurrentStudent(student);
    const p = getDailyProgress();
    setProgress(p);
    // 현재 활성화된 일차로 기본 선택
    if (sessionStep === 'map') {
      setSelectedDayNum(p.currentActiveDay || 1);
    }
  };

  useEffect(() => {
    refreshStudentAndProgress();
  }, [sessionStep]);

  // 소리 재생 도우미
  const playAudio = (text) => {
    playHangeulSound(text);
  };

  // -------------------------------------------------------------
  // [캔버스 글씨 쓰기 관련 로직]
  // -------------------------------------------------------------
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 모눈종이 십자선 가이드
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    if (sessionStep === 'trace' || (sessionStep === 'remedial' && remedialStep === 2)) {
      clearCanvas();
    }
  }, [sessionStep, traceCharIdx, remedialStep]);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // -------------------------------------------------------------
  // [일일 코스 단계 제어 로직]
  // -------------------------------------------------------------
  // 특정 일차 시작
  const handleStartDay = (dayNum) => {
    setSelectedDayNum(dayNum);
    setSessionStep('intro'); // 1단계 소리 원리로 시작
    setTraceCharIdx(0);
    setCardIdx(0);
    setIsCardFlipped(false);
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setWrongAnswers([]);
    
    const targetDay = CURRICULUM_20_DAYS.find((d) => d.day === dayNum) || CURRICULUM_20_DAYS[0];
    playHangeulSound(`${targetDay.day}일차, ${targetDay.title} 30분 신나는 배움을 시작합니다!`);
  };

  // 1단계(소리) ➔ 2단계(쓰기) 이동
  const handleGoToTrace = () => {
    setSessionStep('trace');
    setTraceCharIdx(0);
    playHangeulSound(`2단계, 예쁜 글씨 손가락 따라쓰기를 시작해요! ${dayData.traceTargets[0]} 글자를 써보세요.`);
  };

  // 2단계 글씨 쓰기 다음 글자 또는 3단계로 이동
  const handleNextTraceChar = () => {
    if (traceCharIdx + 1 < dayData.traceTargets.length) {
      setTraceCharIdx((prev) => prev + 1);
      clearCanvas();
      playHangeulSound(`참 잘했어요! 다음 글자 ${dayData.traceTargets[traceCharIdx + 1]}을 써보세요.`);
    } else {
      // 3단계(낱말 카드)로 이동
      setSessionStep('cards');
      setCardIdx(0);
      setIsCardFlipped(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      playHangeulSound('우와, 멋진 글씨 완성! 3단계, 낱말 카드와 결합 마법 놀이를 시작해요!');
    }
  };

  // 3단계 낱말 카드 다음 또는 4단계로 이동
  const handleNextCard = () => {
    if (cardIdx + 1 < dayData.words.length) {
      setCardIdx((prev) => prev + 1);
      setIsCardFlipped(false);
      playHangeulSound(`${dayData.words[cardIdx + 1].word}! 카드를 뒤집어 확인해 보세요.`);
    } else {
      // 4단계(일일 평가)로 이동
      setSessionStep('quiz');
      setQuizIdx(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setWrongAnswers([]);
      playHangeulSound('마지막 4단계, 오늘 배운 내용을 뽐내는 일일 성취도 평가예요!');
    }
  };

  // 4단계 일일 평가 정답 선택
  const handleAnswerQuiz = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQ = dayData.quiz[quizIdx];
    const isCorrect = option === currentQ.correct;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      playHangeulSound('딩동댕! 정답이에요! 최고예요!');
    } else {
      setWrongAnswers((prev) => [...prev, currentQ]);
      playHangeulSound(`괜찮아요! 정답은 ${currentQ.correct}이에요. 다시 한 번 기억해 볼까요?`);
    }
  };

  // 4단계 일일 평가 다음 문제 또는 채점 결과 화면 이동
  const handleNextQuiz = () => {
    if (quizIdx + 1 < dayData.quiz.length) {
      setQuizIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      playHangeulSound(dayData.quiz[quizIdx + 1].audio);
    } else {
      // 채점 및 분기 판정
      const finalScore = quizScore;
      const totalQ = dayData.quiz.length;
      const isPassed = finalScore >= 2; // 3문제 중 2문제 이상 정답 시 목표 도달

      // 진도 저장 (암호화)
      saveDayCompletion(dayData.day, finalScore, totalQ, isPassed, false);
      if (isPassed && onEarnStar) onEarnStar();

      setSessionStep('eval_result');

      if (isPassed) {
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
        playHangeulSound(`와아! ${dayData.day}일차 학습 목표에 멋지게 도달했어요! 다음 날짜가 열렸어요!`);
      } else {
        playHangeulSound(`오늘 조금 헷갈렸던 부분이 있어요. 10분 쑥쑥 보충학습으로 함께 완벽하게 다져보아요!`);
      }
    }
  };

  // 10분 보충학습 시작
  const handleStartRemedial = () => {
    setSessionStep('remedial');
    setRemedialStep(1);
    setRemedialQuizIdx(0);
    setRemedialAnswered(false);
    setRemedialSelected(null);
    playHangeulSound(`10분 마법 보충 훈련소에 온 걸 환영해! ${currentStudent.characterName}와 함께 다시 차근차근 짚어보자!`);
  };

  // 보충 확인 퀴즈 정답 선택
  const handleAnswerRemedialQuiz = (option) => {
    if (remedialAnswered) return;
    setRemedialSelected(option);
    setRemedialAnswered(true);

    const q = dayData.remedialQuiz[remedialQuizIdx];
    const isCorrect = option === q.correct;

    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      playHangeulSound('대단해요! 정답이에요! 완벽하게 이해했군요!');
    } else {
      playHangeulSound(`정답은 ${q.correct}이에요. 괜찮아요! 눈으로 꼭 기억해 두세요.`);
    }
  };

  // 보충 확인 퀴즈 다음 또는 보충 완주 처리
  const handleNextRemedialQuiz = () => {
    if (remedialQuizIdx + 1 < dayData.remedialQuiz.length) {
      setRemedialQuizIdx((prev) => prev + 1);
      setRemedialSelected(null);
      setRemedialAnswered(false);
    } else {
      // 10분 보충학습 완료 ➔ 다음 일차 정식 해금!
      saveRemedialCompletion(dayData.day);
      if (onEarnStar) onEarnStar();
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      playHangeulSound(`축하합니다! 10분 쑥쑥 보충학습을 완료하여 ${dayData.day + 1}일차가 활짝 열렸습니다! 최고예요!`);
      setSessionStep('map');
    }
  };

  // -------------------------------------------------------------
  // 1. [전체 20일 로드맵 지도 뷰]
  // -------------------------------------------------------------
  if (sessionStep === 'map') {
    const completedCount = Object.keys(progress.days).length;
    const passedCount = Object.values(progress.days).filter((d) => d.passed).length;
    const percent = Math.round((passedCount / 20) * 100);

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
        {/* 상단 학생 맞춤 프로필 대시보드 */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 sm:p-7 shadow-xl text-amber-950 border-4 border-amber-300 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            {/* 학생 캐릭터 및 이름 */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div 
                onClick={onOpenStudentManager}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-lg border-4 border-amber-200 flex items-center justify-center text-4xl sm:text-5xl cursor-pointer hover:scale-105 transition-transform group relative"
                title="단짝 캐릭터 & 학생 변경하기"
              >
                <span>{currentStudent.avatar || '🐯'}</span>
                <span className="absolute -bottom-2 -right-2 bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  변경
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-black bg-white/40 px-2.5 py-0.5 rounded-full">
                    {currentStudent.gradeClass || '1학년 1반'}
                  </span>
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    단짝: {currentStudent.characterName || '호치'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">
                  {currentStudent.name}의 20일 한글 마스터 🌟
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1">
                  "{currentStudent.characterName}와 함께 매일 30분씩 놀면 나도 혼자 책을 읽을 수 있어!"
                </p>
              </div>
            </div>

            {/* 우측 빠른 액션 버튼들 */}
            <div className="flex flex-wrap sm:flex-col gap-2 items-center sm:items-end w-full sm:w-auto">
              <button
                onClick={onOpenStudentManager}
                className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>🎒 친구 바꾸기 / 등록</span>
              </button>
              <button
                onClick={onOpenReport}
                className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-indigo-200" />
                <span>📊 학부모 통지표 (A4)</span>
              </button>
            </div>
          </div>

          {/* 20일 완주 프로그레스 바 */}
          <div className="mt-5 pt-4 border-t border-amber-900/10">
            <div className="flex items-center justify-between text-xs font-black text-amber-900 mb-1.5">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-900" />
                <span>20일 완주 목표 달성률</span>
              </span>
              <span className="text-sm font-black text-indigo-900">
                {passedCount}일 완료 / 20일 ({percent}%)
              </span>
            </div>
            <div className="w-full h-4 bg-white/50 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(5, percent)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 4주간 20일 로드맵 카드 그리드 */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((wk) => {
            const weekInfo = {
              1: {
                title: '🌱 1주차: 소리의 탄생 (1~5일차)',
                desc: '기본 모음 6자와 입모양 모음, 첫소리 닿소리의 신비한 모양을 탐험해요.',
                color: 'border-emerald-300 bg-emerald-50/50',
              },
              2: {
                title: '🌸 2주차: 자모 결합과 받침 없는 단어 (6~10일차)',
                desc: '자음과 모음이 만나 글자가 되고, 받침 없는 2~3음절 생활 낱말을 술술 읽어요.',
                color: 'border-pink-300 bg-pink-50/50',
              },
              3: {
                title: '⭐ 3주차: 마법의 7대 대표 받침 정복 (11~15일차)',
                desc: '글자 아래 쏙 들어가는 ㅇ, ㄴ, ㄹ, ㅁ, ㅂ, ㄱ, ㅅ 받침 소리의 원리를 깨쳐요.',
                color: 'border-amber-300 bg-amber-50/50',
              },
              4: {
                title: '👑 4주차: 문장 읽기 & 한글 독립 만세! (16~20일차)',
                desc: '학교 생활 낱말과 첫 문장을 읽고, 스스로 동화책을 읽는 졸업장을 수여받아요!',
                color: 'border-indigo-300 bg-indigo-50/50',
              },
            };
            const daysInWeek = CURRICULUM_20_DAYS.filter((d) => d.week === wk);

            return (
              <div 
                key={wk} 
                className={`p-5 rounded-3xl border-2 shadow-sm ${weekInfo[wk].color} space-y-4`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                    {weekInfo[wk].title}
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    {weekInfo[wk].desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {daysInWeek.map((d) => {
                    const dayRecord = progress.days[d.day];
                    const isDone = !!dayRecord?.completed;
                    const isPassed = !!dayRecord?.passed;
                    const isRemedialNeeded = isDone && !isPassed && !dayRecord?.remedialCompleted;
                    
                    // 해금 여부 판정 (1일차는 무조건 열림, 그 이후는 이전 날짜가 passed이거나 보충완료된 경우)
                    const prevDayRecord = progress.days[d.day - 1];
                    const isUnlocked = d.day === 1 || (prevDayRecord && (prevDayRecord.passed || prevDayRecord.remedialCompleted));
                    const isCurrentActive = d.day === progress.currentActiveDay;

                    return (
                      <div
                        key={d.day}
                        onClick={() => {
                          if (isUnlocked) {
                            handleStartDay(d.day);
                          } else {
                            playHangeulSound(`${d.day - 1}일차 공부를 먼저 완주해야 열려요! 힘내세요!`);
                          }
                        }}
                        className={`p-3.5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-2 relative cursor-pointer transform active:scale-95 ${
                          !isUnlocked
                            ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                            : isRemedialNeeded
                            ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-md ring-2 ring-orange-300'
                            : isPassed
                            ? 'bg-white border-emerald-300 text-emerald-950 shadow-sm hover:border-emerald-400 hover:shadow-md'
                            : isCurrentActive
                            ? 'bg-gradient-to-b from-amber-300 to-amber-400 border-amber-500 text-amber-950 shadow-lg ring-4 ring-amber-200 scale-102 animate-jelly'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                        }`}
                      >
                        {/* 상단 일차 & 카테고리 뱃지 */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
                            {d.day}일차
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {d.category}
                          </span>
                        </div>

                        {/* 중앙 이모지 아이콘 */}
                        <div className="text-center py-1">
                          <span className="text-3xl">
                            {!isUnlocked ? '🔒' : isRemedialNeeded ? '🔁' : isPassed ? '✅' : d.day === 20 ? '👑' : d.words[0]?.emoji || '🌟'}
                          </span>
                        </div>

                        {/* 제목 */}
                        <div className="text-center">
                          <h3 className="text-xs font-black line-clamp-1">
                            {d.title}
                          </h3>
                        </div>

                        {/* 하단 상태 태그 */}
                        <div className="text-center pt-1 border-t border-black/5">
                          {!isUnlocked ? (
                            <span className="text-[10px] font-bold text-slate-400">잠김</span>
                          ) : isRemedialNeeded ? (
                            <span className="text-[10px] font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                              보충 필요
                            </span>
                          ) : isPassed ? (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              완료 ({dayRecord.percentage}점)
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-amber-900 bg-white/80 px-2 py-0.5 rounded-full">
                              오늘 할 차례 ✨
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. [1일 30분 집중 학습실 공통 상단 네비게이션 헤더]
  // -------------------------------------------------------------
  const renderRoutineHeader = () => {
    const steps = [
      { key: 'intro', label: '1. 소리 원리', time: '5분', icon: Volume2 },
      { key: 'trace', label: '2. 바른 쓰기', time: '10분', icon: Edit3 },
      { key: 'cards', label: '3. 낱말 카드', time: '8분', icon: Layers },
      { key: 'quiz', label: '4. 일일 평가', time: '7분', icon: Award },
    ];

    return (
      <div className="bg-white rounded-3xl p-3.5 sm:p-5 border-2 border-amber-200 shadow-md mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSessionStep('map')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition-colors shrink-0 whitespace-nowrap"
            >
              ← 로드맵
            </button>
            <span className="font-black text-amber-950 text-sm sm:text-base truncate whitespace-nowrap">
              {dayData.day}일차: {dayData.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shrink-0 whitespace-nowrap self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="whitespace-nowrap">오늘의 30분 집중 코스</span>
          </div>
        </div>

        {/* 4단계 스텝 바 - 절대로 2줄로 나뉘지 않는 가로 1줄 배치 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCurrent = sessionStep === st.key;
            return (
              <div
                key={st.key}
                className={`py-2 px-2.5 rounded-2xl flex items-center justify-center gap-1.5 text-center transition-all whitespace-nowrap overflow-hidden ${
                  isCurrent
                    ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 scale-102'
                    : 'bg-slate-50 text-slate-400 font-bold'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs sm:text-sm font-black whitespace-nowrap">{st.label}</span>
                <span className="text-[10px] sm:text-xs opacity-75 font-bold whitespace-nowrap">({st.time})</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // Step 1: 오늘의 소리와 원리 (5분)
  // -------------------------------------------------------------
  if (sessionStep === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {renderRoutineHeader()}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-xl text-center space-y-6">
          {/* 캐릭터 말풍선 응원 */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <span className="text-2xl">{currentStudent.avatar || '🐯'}</span>
            <span className="text-xs sm:text-sm font-black text-amber-900">
              "{currentStudent.characterName}: 1단계는 귀로 소리를 듣고 입으로 크게 따라 말하는 시간이야!"
            </span>
          </div>

          {/* 목표 글자 배너 */}
          <div>
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
              오늘의 목표 글자
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              {dayData.targetChars.map((char) => (
                <button
                  key={char}
                  onClick={() => playAudio(char)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-3xl sm:text-4xl font-black text-amber-950 shadow-md transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                >
                  {char}
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-2">
              글자를 누르면 원어민 발음 소리가 나와요!
            </p>
          </div>

          {/* 입모양 및 발음 원리 가이드 카드 */}
          <div className="bg-amber-50/80 p-5 rounded-3xl border-2 border-amber-200 text-left space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
              <Volume2 className="w-5 h-5 text-amber-600" />
              <span>입모양과 소리의 비밀 💡</span>
            </div>
            <p className="text-sm sm:text-base font-black text-slate-800 leading-relaxed">
              {dayData.soundGuide}
            </p>
            {dayData.combinePrinciple && (
              <div className="pt-3 border-t border-amber-200/60">
                <span className="text-xs font-black text-indigo-800 block mb-1">
                  ✨ 자모 결합 공식:
                </span>
                <span className="text-sm font-black text-indigo-900 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 inline-block">
                  {dayData.combinePrinciple}
                </span>
              </div>
            )}
          </div>

          {/* 오디오 전체 듣기 & 2단계 이동 버튼 */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => playAudio(`${dayData.soundGuide} 소리를 큰 소리로 따라해 보세요!`)}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-base shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <Volume2 className="w-5 h-5" />
              <span>선생님 목소리로 원리 다시 듣기</span>
            </button>

            <button
              onClick={handleGoToTrace}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98 animate-jelly"
            >
              <span>2단계: 바른 글씨 손가락 쓰기로 이동! ✍️</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Step 2: 바른 글씨 손가락 따라쓰기 (10분)
  // -------------------------------------------------------------
  if (sessionStep === 'trace') {
    const currentChar = dayData.traceTargets[traceCharIdx] || dayData.traceTargets[0];
    const colors = [
      { name: '파랑', code: '#3B82F6' },
      { name: '빨강', code: '#EF4444' },
      { name: '초록', code: '#10B981' },
      { name: '주황', code: '#F97316' },
      { name: '보라', code: '#8B5CF6' },
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {renderRoutineHeader()}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-xl text-center space-y-5">
          {/* 단계 안내 & 글자 번호 */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              따라쓰기 ({traceCharIdx + 1} / {dayData.traceTargets.length})
            </span>
            <button
              onClick={() => playAudio(`${currentChar}! 바른 획순으로 손가락을 움직여 써보세요!`)}
              className="inline-flex items-center gap-1 text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>'{currentChar}' 발음 듣기</span>
            </button>
          </div>

          <h2 className="text-xl font-black text-slate-800">
            회색 가이드 선을 따라 <span className="text-indigo-600 underline decoration-wavy decoration-amber-400 font-black">'{currentChar}'</span>를 예쁘게 써보아요!
          </h2>

          {/* 인터랙티브 따라쓰기 캔버스 영역 */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto bg-amber-50/40 rounded-3xl border-4 border-amber-300 shadow-inner overflow-hidden flex items-center justify-center select-none touch-none">
            {/* 배경 회색 가이드 글자 */}
            <div className="absolute inset-0 flex items-center justify-center text-[160px] sm:text-[190px] font-black text-slate-200 pointer-events-none select-none">
              {currentChar}
            </div>

            {/* 실제 그리기 캔버스 */}
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
          </div>

          {/* 크레파스 색상 선택 바 */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs font-black text-slate-400 mr-1">크레파스:</span>
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setBrushColor(c.code)}
                style={{ backgroundColor: c.code }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  brushColor === c.code ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
            <button
              onClick={clearCanvas}
              className="ml-2 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>다시 쓰기</span>
            </button>
          </div>

          {/* 다음 글자 또는 3단계 이동 버튼 */}
          <div className="pt-3">
            <button
              onClick={handleNextTraceChar}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {traceCharIdx + 1 < dayData.traceTargets.length
                  ? '참 잘 썼어요! 다음 글자 쓰기 ➔'
                  : '글씨 완성! 3단계 낱말 카드로 이동! 🎴'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Step 3: 낱말 카드 & 결합 마법 놀이 (8분)
  // -------------------------------------------------------------
  if (sessionStep === 'cards') {
    const currentWord = dayData.words[cardIdx] || dayData.words[0];

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {renderRoutineHeader()}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-xl text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              낱말 카드 ({cardIdx + 1} / {dayData.words.length})
            </span>
            <span className="text-xs font-bold text-slate-400">
              카드를 터치하면 뒤집혀요!
            </span>
          </div>

          {/* 3D 회전 플래시카드 */}
          <div 
            onClick={() => {
              setIsCardFlipped(!isCardFlipped);
              playAudio(currentWord.word);
            }}
            className="w-full max-w-sm h-64 sm:h-72 mx-auto bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl border-4 border-amber-300 shadow-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-xl transition-all transform hover:scale-102"
          >
            {!isCardFlipped ? (
              /* 카드 앞면: 이모지 & 힌트 */
              <div className="space-y-3 animate-fade-in">
                <span className="text-6xl sm:text-7xl block">{currentWord.emoji}</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full inline-block">
                  💡 {currentWord.hint}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                  {currentWord.word}
                </h3>
                <span className="text-xs font-bold text-slate-400 block">
                  (터치하여 소리와 낱자 분해 보기)
                </span>
              </div>
            ) : (
              /* 카드 뒷면: 분절 & 소리 */
              <div className="space-y-4 animate-fade-in">
                <span className="text-4xl block">✨</span>
                <h3 className="text-4xl sm:text-5xl font-black text-indigo-700">
                  {currentWord.word}
                </h3>
                <div className="bg-white/90 px-4 py-2 rounded-2xl border border-indigo-200">
                  <span className="text-xs font-bold text-slate-500 block mb-0.5">낱자 합체 비밀:</span>
                  <span className="text-base font-black text-indigo-900">
                    {currentWord.breakdown}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentWord.word);
                  }}
                  className="px-4 py-1.5 rounded-full bg-indigo-500 text-white text-xs font-black flex items-center gap-1 mx-auto"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  소리 다시 듣기
                </button>
              </div>
            )}
          </div>

          {/* 다음 카드 또는 4단계 평가 이동 */}
          <div className="pt-2">
            <button
              onClick={handleNextCard}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>
                {cardIdx + 1 < dayData.words.length
                  ? '다음 낱말 카드 보기 ➔'
                  : '마지막 4단계: 일일 성취도 평가 시작! 📝'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Step 4: 오늘의 성취도 일일 평가 (7분)
  // -------------------------------------------------------------
  if (sessionStep === 'quiz') {
    const currentQ = dayData.quiz[quizIdx];

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {renderRoutineHeader()}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              일일 평가 문제 {quizIdx + 1} / {dayData.quiz.length}
            </span>
            <span className="text-xs font-black text-indigo-600">
              현재 맞힌 점수: {quizScore}점
            </span>
          </div>

          {/* 문제 및 소리 듣기 */}
          <div className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              {currentQ.question}
            </h2>
            <button
              onClick={() => playAudio(currentQ.audio)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs shadow-xs transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>문제 소리 다시 듣기</span>
            </button>
          </div>

          {/* 4지선다 보기 옵션 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correct;

              let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-4 ring-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-md';
                } else {
                  btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerQuiz(option)}
                  disabled={isAnswered}
                  className={`p-4 sm:p-5 rounded-2xl border-2 font-black text-xl sm:text-2xl transition-all transform active:scale-95 shadow-xs ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* 다음 문제 이동 버튼 */}
          {isAnswered && (
            <div className="pt-3 animate-jelly">
              <button
                onClick={handleNextQuiz}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>
                  {quizIdx + 1 < dayData.quiz.length
                    ? '다음 문제 풀기 ➔'
                    : '평가 결과 확인하기! 🏆'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. [평가 결과 및 분기 화면] (목표 도달 vs 10분 보충학습)
  // -------------------------------------------------------------
  if (sessionStep === 'eval_result') {
    const totalQ = dayData.quiz.length;
    const isPassed = quizScore >= 2; // 2문제 이상 통과
    const percentage = Math.round((quizScore / totalQ) * 100);

    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center space-y-6">
          {/* 캐릭터 칭찬 및 결과 헤더 */}
          <div className="space-y-3">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-5xl shadow-md">
              {isPassed ? '🎉' : '💪'}
            </div>

            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {dayData.day}일차 일일 평가 결과
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isPassed ? '학습 목표 도달 성공! 👑' : '조금 더 다져보아요! 🌟'}
            </h2>

            <div className="text-4xl font-black text-indigo-600">
              {quizScore} / {totalQ} 문제 정답 ({percentage}점)
            </div>
          </div>

          {/* 맞춤 피드백 말풍선 */}
          <div className={`p-5 rounded-3xl border-2 text-left space-y-2 ${
            isPassed ? 'bg-emerald-50 border-emerald-300' : 'bg-orange-50 border-orange-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStudent.avatar || '🐯'}</span>
              <span className="text-xs font-black text-slate-800">
                {currentStudent.characterName}의 한마디:
              </span>
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">
              {isPassed
                ? `와! ${currentStudent.name} 친구, 오늘 30분 공부를 정말 멋지게 해냈어! 다음 ${dayData.day + 1}일차가 활짝 열렸단다!`
                : `${currentStudent.name} 친구, 아쉬워하지 마! 10분 쑥쑥 보충학습으로 헷갈리는 글자를 나랑 한 번만 더 쓰면 바로 완벽해져!`}
            </p>
          </div>

          {/* 학부모 지도 팁 카드 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
            <span className="font-black text-amber-900 block">💡 오늘 가정 연계 팁:</span>
            <p>{dayData.parentAdvice}</p>
          </div>

          {/* 버튼 분기 */}
          <div className="space-y-3 pt-2">
            {isPassed ? (
              <>
                <button
                  onClick={() => setSessionStep('map')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Award className="w-5 h-5" />
                  <span>20일 로드맵 지도로 돌아가기</span>
                </button>
                {dayData.day < 20 && (
                  <button
                    onClick={() => handleStartDay(dayData.day + 1)}
                    className="w-full py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm transition-all"
                  >
                    다음 {dayData.day + 1}일차 바로 시작해보기 ➔
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleStartRemedial}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all animate-jelly"
                >
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                  <span>10분 쑥쑥 보충학습 시작하기! 🚀</span>
                </button>
                <button
                  onClick={() => setSessionStep('map')}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm"
                >
                  나중에 하기 (로드맵으로 이동)
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. [10분 쑥쑥 보충학습 전용 코스]
  // -------------------------------------------------------------
  if (sessionStep === 'remedial') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* 상단 보충학습 전용 배너 */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl p-5 shadow-lg text-white flex items-center justify-between border-2 border-orange-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <span className="text-xs font-black bg-white/30 px-2 py-0.5 rounded-full">
                10분 마법 보충 훈련소
              </span>
              <h2 className="text-xl font-black mt-0.5">
                {dayData.day}일차 쑥쑥 실력 다지기
              </h2>
            </div>
          </div>
          <button
            onClick={() => setSessionStep('map')}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl"
          >
            나가기
          </button>
        </div>

        {/* 보충 3단계 진행 바 - 1줄 가로 배치 */}
        <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-2xl border-2 border-orange-200">
          <div className={`py-2 px-1.5 rounded-xl text-center text-xs font-black whitespace-nowrap flex items-center justify-center gap-1 overflow-hidden ${remedialStep === 1 ? 'bg-orange-400 text-white shadow-xs' : 'bg-slate-50 text-slate-400'}`}>
            <span>1. 소리 복습</span>
            <span className="text-[10px] opacity-80">(3분)</span>
          </div>
          <div className={`py-2 px-1.5 rounded-xl text-center text-xs font-black whitespace-nowrap flex items-center justify-center gap-1 overflow-hidden ${remedialStep === 2 ? 'bg-orange-400 text-white shadow-xs' : 'bg-slate-50 text-slate-400'}`}>
            <span>2. 크게 쓰기</span>
            <span className="text-[10px] opacity-80">(4분)</span>
          </div>
          <div className={`py-2 px-1.5 rounded-xl text-center text-xs font-black whitespace-nowrap flex items-center justify-center gap-1 overflow-hidden ${remedialStep === 3 ? 'bg-orange-400 text-white shadow-xs' : 'bg-slate-50 text-slate-400'}`}>
            <span>3. 재도전</span>
            <span className="text-[10px] opacity-80">(3분)</span>
          </div>
        </div>

        {/* 보충 1단계: 소리 다시 듣기 */}
        {remedialStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-orange-300 shadow-xl text-center space-y-6">
            <span className="text-4xl block">👂</span>
            <h3 className="text-xl font-black text-slate-800">
              선생님 목소리에 귀를 쫑긋 세우고 따라해 보아요!
            </h3>
            <p className="text-base font-black text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-200">
              "{dayData.soundGuide}"
            </p>
            <button
              onClick={() => playAudio(`${dayData.soundGuide} 천천히 큰 소리로 발음해 보세요!`)}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow-md inline-flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>소리 크게 듣기</span>
            </button>
            <div className="pt-4">
              <button
                onClick={() => setRemedialStep(2)}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-lg"
              >
                다음 2단계: 헷갈린 글자 크게 쓰기 ➔
              </button>
            </div>
          </div>
        )}

        {/* 보충 2단계: 집중 글씨 따라쓰기 */}
        {remedialStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-orange-300 shadow-xl text-center space-y-5">
            <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
              보충 손가락 쓰기
            </span>
            <h3 className="text-xl font-black text-slate-800">
              오늘의 핵심 글자 <span className="text-orange-600 font-black">'{dayData.traceTargets[0]}'</span>를 손가락으로 큼직하게 써보아요!
            </h3>

            <div className="relative w-[280px] h-[280px] mx-auto bg-orange-50/40 rounded-3xl border-4 border-orange-300 shadow-inner flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-[160px] font-black text-slate-200 pointer-events-none">
                {dayData.traceTargets[0]}
              </div>
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                지우고 다시 쓰기
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setRemedialStep(3)}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-lg"
              >
                완벽해요! 마지막 3단계: 확인 재도전 퀴즈 ➔
              </button>
            </div>
          </div>
        )}

        {/* 보충 3단계: 확인 재도전 퀴즈 */}
        {remedialStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-orange-300 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                재도전 퀴즈 ({remedialQuizIdx + 1} / {dayData.remedialQuiz.length})
              </span>
              <button
                onClick={() => playAudio(dayData.remedialQuiz[remedialQuizIdx].audio)}
                className="text-xs font-black text-orange-700 flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>다시 듣기</span>
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-800 text-center">
              {dayData.remedialQuiz[remedialQuizIdx].question}
            </h3>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {dayData.remedialQuiz[remedialQuizIdx].options.map((option) => {
                const isSelected = remedialSelected === option;
                const isCorrect = option === dayData.remedialQuiz[remedialQuizIdx].correct;

                let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-orange-50 text-slate-800';
                if (remedialAnswered) {
                  if (isCorrect) btnStyle = 'bg-emerald-500 text-white shadow-md ring-4 ring-emerald-200';
                  else if (isSelected) btnStyle = 'bg-rose-500 text-white';
                  else btnStyle = 'bg-slate-100 text-slate-400 opacity-50';
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerRemedialQuiz(option)}
                    disabled={remedialAnswered}
                    className={`p-4 rounded-2xl border-2 font-black text-xl transition-all ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {remedialAnswered && (
              <div className="pt-4 animate-jelly">
                <button
                  onClick={handleNextRemedialQuiz}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg shadow-lg"
                >
                  {remedialQuizIdx + 1 < dayData.remedialQuiz.length
                    ? '다음 재도전 문제 ➔'
                    : '보충 완료하고 다음 일차 열기! 🌟'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
