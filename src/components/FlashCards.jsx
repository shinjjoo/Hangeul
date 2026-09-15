import React, { useState, useEffect } from 'react';
import { NO_BATCHIM_VOCAB } from '../data/noBatchimVocab';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, Check, RefreshCw, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * [받침 없는 단어 3D 플래시 카드 컴포넌트]
 * 아직 글자를 모르는 초등 1학년을 위해 118개 이상의 받침 없는 친숙 단어를
 * 그림과 소리, 카드 뒤집기 애니메이션을 통해 반복 학습할 수 있도록 돕습니다.
 */
export default function FlashCards({ onEarnStar }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // 카드 앞면/뒷면 뒤집힘 여부
  const [learnedCount, setLearnedCount] = useState(0); // 오늘 외운 단어 수

  // 카테고리 목록
  const categories = ['전체', '동물', '식물', '사물', '신체', '가족', '음식', '자연'];

  // 카테고리 변경 시 해당 단어들로 학습 덱 재구성
  useEffect(() => {
    let filtered = NO_BATCHIM_VOCAB;
    if (selectedCategory !== '전체') {
      filtered = NO_BATCHIM_VOCAB.filter((item) => item.category === selectedCategory);
    }
    // 단어 순서를 골고루 섞어줍니다 (피셔-예이츠 셔플)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory]);

  const currentCard = deck[currentIndex] || deck[0];

  // 단어 음성 읽어주기 함수
  const handlePlaySound = (e) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    // "나! 비! 합치면 나비!" 형태로 또박또박 발음
    const syllablesSound = currentCard.syllables ? currentCard.syllables.map(s => s.char).join('! ') : '';
    playHangeulSound(`${syllablesSound}! 합치면 ${currentCard.word}! ${currentCard.hint}`);
  };

  // 카드 뒤집기
  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped) {
      // 뒷면으로 뒤집힐 때 자동으로 단어 발음 재생
      playHangeulSound(`${currentCard.word}!`);
    }
  };

  // "알아요! 통과" 버튼 클릭 시
  const handleKnown = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setLearnedCount((prev) => prev + 1);
    if (onEarnStar) onEarnStar();

    playHangeulSound(`참 잘했어요! ${currentCard.word} 단어를 마스터했어요!`);

    // 다음 카드로 넘어가기
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      playHangeulSound('축하해요! 이번 카테고리의 모든 카드를 다 배웠어요!');
    }
  };

  // "다시 볼래요" 버튼 클릭 시 (에빙하우스 반복 알고리즘: 카드를 덱 맨 뒤로 보냄)
  const handleRepeat = (e) => {
    e.stopPropagation();
    playHangeulSound(`괜찮아요! ${currentCard.word}는 조금 이따가 한 번 더 만나보아요!`);

    // 현재 카드를 덱 맨 뒤로 추가
    const updatedDeck = [...deck, currentCard];
    setDeck(updatedDeck);

    // 다음 카드로 이동
    if (currentIndex + 1 < updatedDeck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  // 처음부터 다시 섞기
  const handleShuffleAgain = () => {
    const reshuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(reshuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    playHangeulSound('카드들을 신나게 다시 섞었어요!');
  };

  if (!currentCard) {
    return (
      <div className="text-center p-8 bg-white rounded-3xl shadow">
        <p className="font-bold text-slate-600">학습할 카드를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* 1. 상단 카테고리 필터 탭 */}
      <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-amber-200 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 shadow-sm scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {cat} {cat === '전체' ? `(${NO_BATCHIM_VOCAB.length})` : ''}
          </button>
        ))}
      </div>

      {/* 2. 진행 상태 안내 바 */}
      <div className="flex items-center justify-between px-2 text-sm font-bold text-amber-900">
        <span className="bg-amber-200/80 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-700" />
          카드 {currentIndex + 1} / {deck.length}장
        </span>

        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
          <Check className="w-4 h-4 text-emerald-600" />
          외운 단어: {learnedCount}개
        </span>
      </div>

      {/* 3. 메인 3D 플래시 카드 본체 (클릭/터치 시 뒤집힘) */}
      <div 
        onClick={handleFlipCard}
        className="w-full h-80 sm:h-96 rounded-3xl bg-white shadow-xl border-4 border-amber-300 p-6 flex flex-col justify-between items-center text-center cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden select-none"
      >
        {/* 뒤집기 안내 뱃지 */}
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>터치해서 뒤집기</span>
        </div>

        {!isFlipped ? (
          /* [앞면] 그림 이모지 중심 화면 (글자 모르는 아이를 위한 시각 단서) */
          <div className="flex flex-col items-center justify-center h-full my-auto space-y-4">
            <div className="text-8xl sm:text-9xl animate-bounce">
              {currentCard.emoji}
            </div>
            <p className="text-slate-500 font-bold text-base sm:text-lg">
              "{currentCard.hint}"
            </p>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              어떤 글자일까요? 카드를 눌러보세요! 👉
            </span>
          </div>
        ) : (
          /* [뒷면] 큼직한 한글 글자 및 자모음 분절 안내 */
          <div className="flex flex-col items-center justify-center h-full my-auto space-y-4 animate-jelly">
            {/* 큰 한글 단어 */}
            <h2 className="text-6xl sm:text-7xl font-black text-amber-950 tracking-wide">
              {currentCard.word}
            </h2>

            {/* 자모음 음소 분절 블록 (예: ㄴ+ㅏ, ㅂ+ㅣ) */}
            <div className="flex items-center gap-2 mt-2">
              {currentCard.syllables && currentCard.syllables.map((syl, i) => (
                <div key={i} className="flex flex-col items-center bg-amber-50 border-2 border-amber-300 px-3 py-2 rounded-2xl">
                  <span className="text-2xl font-black text-amber-900">{syl.char}</span>
                  <span className="text-xs font-bold text-amber-600 mt-0.5">{syl.breakdown}</span>
                </div>
              ))}
            </div>

            <div className="text-3xl">{currentCard.emoji}</div>
          </div>
        )}

        {/* 하단 소리 듣기 버튼 */}
        <button
          onClick={handlePlaySound}
          className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all"
        >
          <Volume2 className="w-5 h-5 text-amber-700" />
          <span>소리 또박또박 듣기</span>
        </button>
      </div>

      {/* 4. 하단 반복 학습 조작 버튼 (알아요 / 다시 볼래요) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleRepeat}
          className="py-4 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-base transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 border-2 border-slate-300"
        >
          <RotateCcw className="w-5 h-5 text-slate-500" />
          <span>다시 볼래요 🔁</span>
        </button>

        <button
          onClick={handleKnown}
          className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>알아요! 통과 😊</span>
        </button>
      </div>

      {/* 덱 다시 섞기 버튼 */}
      <div className="text-center pt-2">
        <button
          onClick={handleShuffleAgain}
          className="text-xs font-bold text-slate-500 hover:text-amber-800 underline inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>단어 순서 다시 섞기</span>
        </button>
      </div>
    </div>
  );
}
