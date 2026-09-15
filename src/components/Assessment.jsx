import React, { useState } from 'react';
import { playHangeulSound } from '../utils/speech';
import { saveAssessmentResult, getAssessmentHistory } from '../utils/secureStorage';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, Award, CheckCircle2, RotateCcw, FileText, ChevronRight, Star } from 'lucide-react';

/**
 * [수준별 한글 성취도 평가 컴포넌트]
 * 1학년 아이들이 시험에 대한 부담감 없이 놀이처럼 참여할 수 있는
 * 3단계 수준별 진단 평가(새싹, 꽃잎, 열매) 도구입니다.
 */
export default function Assessment({ onOpenReport, onEarnStar }) {
  const [currentLevel, setCurrentLevel] = useState(null); // null이면 수준 선택 화면
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongList, setWrongList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // 1수준: 새싹 단계 (소리 듣고 글자 찾기)
  const LEVEL_1_QUESTIONS = [
    { id: 'l1_1', audioText: '그! 기역을 찾아보세요.', correct: 'ㄱ', options: ['ㄴ', 'ㄱ', 'ㄷ', 'ㄹ'], targetChar: 'ㄱ', hint: '기역 소리' },
    { id: 'l1_2', audioText: '느! 니은을 찾아보세요.', correct: 'ㄴ', options: ['ㄴ', 'ㅁ', 'ㅅ', 'ㅇ'], targetChar: 'ㄴ', hint: '니은 소리' },
    { id: 'l1_3', audioText: '아! 모음 아를 찾아보세요.', correct: 'ㅏ', options: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'], targetChar: 'ㅏ', hint: '모음 아' },
    { id: 'l1_4', audioText: '오! 모음 오를 찾아보세요.', correct: 'ㅗ', options: ['ㅜ', 'ㅡ', 'ㅗ', 'ㅣ'], targetChar: 'ㅗ', hint: '모음 오' },
    { id: 'l1_5', audioText: '스! 시옷을 찾아보세요.', correct: 'ㅅ', options: ['ㅈ', 'ㅊ', 'ㅅ', 'ㅎ'], targetChar: 'ㅅ', hint: '시옷 소리' },
  ];

  // 2수준: 꽃잎 단계 (그림 보고 받침 없는 낱말 맞추기)
  const LEVEL_2_QUESTIONS = [
    { id: 'l2_1', emoji: '🦋', audioText: '팔랑팔랑 나비입니다. 나비를 골라보세요.', correct: '나비', options: ['나비', '다람', '사자', '오리'], targetChar: '나비', hint: '나비' },
    { id: 'l2_2', emoji: '🧢', audioText: '머리에 쓰는 모자입니다. 모자를 골라보세요.', correct: '모자', options: ['바지', '치마', '모자', '구두'], targetChar: '모자', hint: '모자' },
    { id: 'l2_3', emoji: '🦁', audioText: '동물의 왕 사자입니다. 사자를 골라보세요.', correct: '사자', options: ['호랑', '사자', '토끼', '하마'], targetChar: '사자', hint: '사자' },
    { id: 'l2_4', emoji: '🥒', audioText: '초록색 시원한 오이입니다. 오이를 골라보세요.', correct: '오이', options: ['가지', '오이', '파파', '배추'], targetChar: '오이', hint: '오이' },
    { id: 'l2_5', emoji: '🍌', audioText: '달콤한 바나나입니다. 바나나를 골라보세요.', correct: '바나나', options: ['토마토', '바나나', '고구마', '도라지'], targetChar: '바나나', hint: '바나나' },
  ];

  // 3수준: 열매 단계 (빈칸 채우기 도전)
  const LEVEL_3_QUESTIONS = [
    { id: 'l3_1', emoji: '🍌', display: '바 _ 나', audioText: '바나나에서 빠진 글자는 무엇일까요?', correct: '나', options: ['가', '나', '다', '라'], targetChar: '나', hint: '바(나)나' },
    { id: 'l3_2', emoji: '🦛', display: '_ 마', audioText: '입이 큰 하마에서 빠진 첫 글자는?', correct: '하', options: ['가', '사', '하', '파'], targetChar: '하', hint: '(하)마' },
    { id: 'l3_3', emoji: '👗', display: '치 _', audioText: '예쁜 치마에서 빠진 글자는?', correct: '마', options: ['바', '사', '자', '마'], targetChar: '마', hint: '치(마)' },
    { id: 'l3_4', emoji: '👶', display: '아 _', audioText: '응애응애 아기에서 빠진 글자는?', correct: '기', options: ['기', '니', '디', '리'], targetChar: '기', hint: '아(기)' },
    { id: 'l3_5', emoji: '🦆', display: '_ 리', audioText: '꽥꽥 오리에서 빠진 첫 글자는?', correct: '오', options: ['아', '어', '오', '우'], targetChar: '오', hint: '(오)리' },
  ];

  // 선택된 레벨의 문제 목록
  const getQuestions = () => {
    if (currentLevel === 1) return LEVEL_1_QUESTIONS;
    if (currentLevel === 2) return LEVEL_2_QUESTIONS;
    if (currentLevel === 3) return LEVEL_3_QUESTIONS;
    return [];
  };

  const questions = getQuestions();
  const q = questions[currentQuestionIdx];

  // 수준 시작
  const startLevel = (lvl) => {
    setCurrentLevel(lvl);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setWrongList([]);
    setIsFinished(false);

    const levelNames = { 1: '새싹 단계', 2: '꽃잎 단계', 3: '열매 단계' };
    playHangeulSound(`${levelNames[lvl]} 한글 평가를 시작합니다! 귀를 쫑긋 세우고 들어보세요.`);
  };

  // 문제 소리 재생
  const playAudio = () => {
    if (q) playHangeulSound(q.audioText);
  };

  // 정답 선택 처리
  const handleSelectAnswer = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === q.correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      playHangeulSound('딩동댕! 정답입니다! 정말 잘했어요!');
    } else {
      setWrongList((prev) => [...prev, q]);
      playHangeulSound(`아쉽네요! 정답은 ${q.correct}이었어요. 힘내요!`);
    }
  };

  // 다음 문제
  const handleNext = () => {
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // 평가 종료 처리 및 결과 누적 저장
      setIsFinished(true);
      const finalScore = score + (selectedAnswer === q.correct ? 0 : 0);
      const resultEntry = {
        level: currentLevel,
        score: finalScore,
        total: questions.length,
        wrongQuestions: wrongList,
      };
      saveAssessmentResult(resultEntry);
      if (onEarnStar) onEarnStar();

      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      playHangeulSound(`평가를 모두 마쳤어요! 총 ${questions.length}문제 중 ${finalScore}문제를 맞혔어요! 칭찬 스티커를 받으세요!`);
    }
  };

  // 수준 선택 메인 화면
  if (!currentLevel) {
    const history = getAssessmentHistory();
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        {/* 상단 안내 배너 */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl p-6 shadow-xl text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full font-bold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            재미있는 수준별 한글 뽐내기
          </div>
          <h2 className="text-3xl font-black">나의 한글 실력은 어디쯤일까요?</h2>
          <p className="text-blue-100 text-sm mt-1">
            시험이 아니라 신나는 게임이에요! 나에게 맞는 단계를 골라보세요.
          </p>
        </div>

        {/* 3단계 수준 선택 카드들 */}
        <div className="space-y-3">
          {/* 1수준: 새싹 */}
          <div
            onClick={() => startLevel(1)}
            className="p-5 rounded-3xl bg-white border-3 border-emerald-300 shadow-md hover:shadow-xl hover:scale-102 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl shadow-inner group-hover:rotate-6 transition-transform">
                🌱
              </div>
              <div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  1수준 (기초)
                </span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-1">새싹 단계: 소리 듣고 글자 찾기</h3>
                <p className="text-xs text-slate-500">자음과 모음의 기본 소리를 구별해요 (5문제)</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* 2수준: 꽃잎 */}
          <div
            onClick={() => startLevel(2)}
            className="p-5 rounded-3xl bg-white border-3 border-pink-300 shadow-md hover:shadow-xl hover:scale-102 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-4xl shadow-inner group-hover:rotate-6 transition-transform">
                🌸
              </div>
              <div>
                <span className="text-xs font-black text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full">
                  2수준 (기본)
                </span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-1">꽃잎 단계: 받침 없는 낱말 찾기</h3>
                <p className="text-xs text-slate-500">그림을 보고 알맞은 단어를 찾아요 (5문제)</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-pink-600 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* 3수준: 열매 */}
          <div
            onClick={() => startLevel(3)}
            className="p-5 rounded-3xl bg-white border-3 border-amber-300 shadow-md hover:shadow-xl hover:scale-102 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner group-hover:rotate-6 transition-transform">
                🍎
              </div>
              <div>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  3수준 (도전)
                </span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-1">열매 단계: 빈칸 글자 채우기</h3>
                <p className="text-xs text-slate-500">단어에서 쏙 빠진 글자를 완성해요 (5문제)</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 누적 평가 기록 요약 및 통지표 보기 버튼 */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-700" />
            <span className="text-sm font-bold text-amber-950">
              지금까지 누적된 평가: <span className="text-amber-600">{history.length}</span>회
            </span>
          </div>
          <button
            onClick={onOpenReport}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-xs shadow-sm transition-all active:scale-95"
          >
            학부모 통지표 보기 📄
          </button>
        </div>
      </div>
    );
  }

  // 평가 완료 화면
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-300 max-w-lg mx-auto text-center space-y-6 animate-jelly">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner">
          🎉
        </div>
        <div>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full">
            {currentLevel}수준 완료!
          </span>
          <h2 className="text-3xl font-black text-slate-800 mt-2">평가를 씩씩하게 마쳤어요!</h2>
          <p className="text-slate-500 text-sm mt-1">평가 결과가 안전하게 누적 기록되었습니다.</p>
        </div>

        {/* 점수 요약 카드 */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-3xl p-5 border-2 border-amber-300">
          <div className="text-5xl font-black text-amber-900">{percentage}점</div>
          <p className="text-xs font-bold text-amber-700 mt-1">
            {questions.length}문제 중 {score}문제 정답!
          </p>
        </div>

        {/* 조작 버튼들 */}
        <div className="space-y-2">
          <button
            onClick={onOpenReport}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all text-base flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            <span>학부모 안내 통지표 확인하기</span>
          </button>

          <button
            onClick={() => setCurrentLevel(null)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 px-6 rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>수준 선택으로 돌아가기</span>
          </button>
        </div>
      </div>
    );
  }

  // 평가 문제 풀이 화면
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* 상단 진행 상태 헤더 */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => setCurrentLevel(null)}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
        >
          ← 다른 수준 선택
        </button>
        <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
          문제 {currentQuestionIdx + 1} / {questions.length}
        </span>
      </div>

      {/* 문제 카드 본체 */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-indigo-200 flex flex-col items-center text-center">
        {/* 그림(이모지) 또는 디스플레이 글자 */}
        {q.emoji && (
          <div 
            onClick={playAudio}
            className="text-8xl my-2 cursor-pointer transform hover:scale-105 transition-transform"
            title="소리 듣기"
          >
            {q.emoji}
          </div>
        )}

        {q.display && (
          <div className="text-5xl font-black text-amber-600 tracking-wider my-3 bg-amber-50 px-6 py-2 rounded-2xl border-2 border-amber-300">
            {q.display}
          </div>
        )}

        {/* 안내 음성 다시 듣기 버튼 */}
        <button
          onClick={playAudio}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-sm transition-all active:scale-95 border border-indigo-200"
        >
          <Volume2 className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span>문제 소리 듣기 🔊</span>
        </button>

        {/* 4지선다 보기 (터치하기 좋은 큼직한 버튼) */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          {q.options.map((opt) => {
            const isChosen = selectedAnswer === opt;
            const isCorrectOpt = opt === q.correct;

            let style = 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-2 border-slate-200';
            if (isAnswered) {
              if (isCorrectOpt) {
                style = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200';
              } else if (isChosen && !isCorrectOpt) {
                style = 'bg-rose-100 text-rose-700 border-2 border-rose-300 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectAnswer(opt)}
                disabled={isAnswered}
                className={`py-5 rounded-2xl text-3xl font-black transition-all transform active:scale-95 shadow-sm flex items-center justify-center ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* 피드백 및 다음 버튼 */}
        {isAnswered && (
          <div className="mt-6 w-full animate-jelly">
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all text-base"
            >
              {currentQuestionIdx + 1 < questions.length ? '다음 문제 👉' : '결과 확인하기 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
