import React, { useState } from 'react';
import { HANGEUL_QUIZ_QUESTIONS } from '../data/hangeulCurriculumData';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Award, Star } from 'lucide-react';

/**
 * [4. 쑥쑥 낱말 퀴즈 컴포넌트]
 * 아직 글자를 모르는 초등 1학년을 위해 그림(이모지)과 음성 힌트를 듣고
 * 낱말의 첫 글자를 찾는 놀이형 퀴즈입니다.
 */
export default function QuizGame({ onEarnStar }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = HANGEUL_QUIZ_QUESTIONS[currentIndex];

  // 문제 음성 재생 함수 (질문과 힌트 읽어주기)
  const playQuestionAudio = () => {
    playHangeulSound(`${currentQ.questionText} ${currentQ.soundHint}`);
  };

  // 보기를 눌렀을 때 실행되는 함수
  const handleSelectOption = (option) => {
    if (isAnswered) return; // 이미 답을 골랐으면 중복 클릭 방지

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctChar) {
      // 정답인 경우
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      if (onEarnStar) onEarnStar();

      // 화려한 무지개 폭죽 연출
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
      playHangeulSound(`정답이에요! ${currentQ.targetWord}의 첫 글자는 ${option}이에요! 정말 잘했어요!`);
    } else {
      // 오답인 경우 (절대 야단치지 않고 다정하게 격려)
      setIsCorrect(false);
      playHangeulSound(`아쉬워요! ${currentQ.targetWord}의 첫 글자는 무엇일까요? 다시 한번 잘 들어보아요.`);
    }
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    if (currentIndex + 1 < HANGEUL_QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } });
      playHangeulSound(`와! 퀴즈를 모두 마쳤어요! 총 ${score + (isCorrect ? 0 : 0)}개의 별을 모았어요! 훌륭해요!`);
    }
  };

  // 퀴즈 다시 시작하기
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setQuizFinished(false);
    playHangeulSound('신나는 한글 퀴즈를 다시 시작해볼까요?');
  };

  // 퀴즈 완료 화면
  if (quizFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-300 max-w-lg mx-auto text-center space-y-6 animate-jelly">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner">
          🏆
        </div>
        <div>
          <h2 className="text-3xl font-black text-amber-950">참 잘했어요! 퀴즈 대장!</h2>
          <p className="text-slate-600 mt-2 font-medium">모든 문제를 씩씩하게 잘 풀었습니다!</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-center gap-3">
          <Star className="w-8 h-8 text-amber-500 fill-amber-500 animate-bounce" />
          <span className="text-2xl font-black text-amber-900">
            모은 별: {score} / {HANGEUL_QUIZ_QUESTIONS.length}개
          </span>
        </div>

        <button
          onClick={handleRestart}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black py-4 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <RotateCcw className="w-6 h-6" />
          <span>처음부터 다시 풀어보기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* 퀴즈 상단 진행 상태 표시줄 */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-700" />
          문제 {currentIndex + 1} / {HANGEUL_QUIZ_QUESTIONS.length}
        </span>
        <div className="flex items-center gap-1 font-black text-amber-600">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          <span>별 {score}개</span>
        </div>
      </div>

      {/* 문제 카드 본체 */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 flex flex-col items-center text-center relative overflow-hidden">
        {/* 커다란 그림 이모지 (글자를 몰라도 인지할 수 있는 핵심 단서) */}
        <div 
          onClick={playQuestionAudio}
          className="w-32 h-32 rounded-3xl bg-amber-50 border-4 border-amber-200 flex items-center justify-center text-7xl shadow-inner cursor-pointer transform hover:scale-105 transition-transform"
          title="소리 듣기"
        >
          {currentQ.emoji}
        </div>

        {/* 질문 안내 문구 */}
        <h3 className="text-2xl font-extrabold text-slate-800 mt-4 leading-snug">
          {currentQ.questionText}
        </h3>

        {/* 질문 소리 다시 듣기 버튼 */}
        <button
          onClick={playQuestionAudio}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>문제 소리 듣기</span>
        </button>

        {/* 4지선다 글자 보기 버튼들 (터치하기 좋게 큰 사이즈 제공) */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          {currentQ.options.map((option) => {
            const isChosen = selectedOption === option;
            const isCorrectOption = option === currentQ.correctChar;

            let buttonStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200';
            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200 scale-102';
              } else if (isChosen && !isCorrectOption) {
                buttonStyle = 'bg-rose-100 text-rose-700 border-2 border-rose-300 opacity-60';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`py-5 rounded-2xl text-4xl font-black transition-all transform active:scale-95 shadow-sm flex items-center justify-center ${buttonStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* 정답/오답 결과 피드백 바 */}
        {isAnswered && (
          <div className="mt-6 w-full animate-jelly">
            {isCorrect ? (
              <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>정답이에요! {currentQ.targetWord}의 첫 글자는 "{currentQ.correctChar}"!</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 font-bold flex items-center justify-center gap-2">
                <span>괜찮아요! 다음 문제에서 더 잘할 수 있어요! 💪</span>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-3 w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all text-lg"
            >
              {currentIndex + 1 < HANGEUL_QUIZ_QUESTIONS.length ? '다음 문제 풀기 👉' : '결과 보러 가기 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
