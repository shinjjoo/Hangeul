import React, { useState, useEffect } from 'react';
import { NO_BATCHIM_VOCAB } from '../data/noBatchimVocab';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { 
  Volume2, RotateCcw, Check, RefreshCw, Sparkles, Star, 
  ChevronLeft, ChevronRight, LayoutGrid, Layers, HelpCircle, ArrowRight 
} from 'lucide-react';

/**
 * [초등 1학년 맞춤 받침 없는 단어 플래시카드 컴포넌트 v2]
 * 1. 한글을 모르는 아동이 글자 형태를 먼저 보고 소리를 떠올릴 수 있도록
 *    [앞면: 대형 단어 ➔ 터치 시 뒷면: 그림(이모지) + 친절한 설명 + 자모음 분절] 순서로 전면 개편.
 * 2. 주제별(7개) & 단계별(1~3단계) 118선 체계적 학습 지원.
 * 3. 1장씩 집중 학습 모드 & 전체 카드 모아보기(그리드 앨범) 뷰 제공.
 */
export default function FlashCards({ onEarnStar }) {
  // 필터 상태
  const [selectedStage, setSelectedStage] = useState('전체'); // '전체' | 1 | 2 | 3
  const [selectedCategory, setSelectedCategory] = useState('전체'); // '전체' | '동물' | '음식' | ...
  
  // 뷰 모드: 'card' (1장씩 넘기기) | 'grid' (모아보기 앨범)
  const [viewMode, setViewMode] = useState('card');

  // 덱 및 카드 상태
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // false: 앞면(단어), true: 뒷면(그림+설명)
  const [learnedCount, setLearnedCount] = useState(0);

  // 단계(Stage) 정의
  const STAGES = [
    { id: '전체', label: '모든 단계 (118)' },
    { id: 1, label: '🌱 1단계: 기초 씨앗 (55)' },
    { id: 2, label: '🌿 2단계: 새싹 자모 (32)' },
    { id: 3, label: '🌳 3단계: 꽃잎 열매 (31)' },
  ];

  // 주제(Category) 정의
  const CATEGORIES = [
    { id: '전체', label: '전체 주제', emoji: '🌟' },
    { id: '동물', label: '동물', emoji: '🐶' },
    { id: '음식', label: '음식', emoji: '🍎' },
    { id: '자연', label: '자연', emoji: '🌲' },
    { id: '사물', label: '사물', emoji: '🎒' },
    { id: '탈것', label: '탈것', emoji: '🚀' },
    { id: '신체', label: '신체', emoji: '👂' },
    { id: '가족', label: '가족', emoji: '👨‍👩‍👧' },
  ];

  // 필터 변경 시 덱 재구성
  useEffect(() => {
    let filtered = NO_BATCHIM_VOCAB;

    // 단계 필터 적용
    if (selectedStage !== '전체') {
      if (selectedStage === 3) {
        // 3단계 이상 (3음절 및 4음절)
        filtered = filtered.filter((item) => item.stage >= 3);
      } else {
        filtered = filtered.filter((item) => item.stage === selectedStage);
      }
    }

    // 주제 필터 적용
    if (selectedCategory !== '전체') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 단어 순서 섞기 (원하면 순차 학습도 가능하도록 정렬 후 세팅)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedStage, selectedCategory]);

  const currentCard = deck[currentIndex] || deck[0];

  // 단어 발음 듣기
  const handlePlayWordSound = (e) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    playHangeulSound(`${currentCard.word}!`);
  };

  // 단어 상세 설명 및 분절 소리 전체 듣기
  const handlePlayDetailSound = (e) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    const syllablesSound = currentCard.syllables ? currentCard.syllables.map((s) => s.char).join('! ') : '';
    playHangeulSound(`${currentCard.word}! ${syllablesSound}! 합치면 ${currentCard.word}! ${currentCard.description}`);
  };

  // 카드 뒤집기 (앞면 ➔ 뒷면 또는 뒷면 ➔ 앞면)
  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && currentCard) {
      // 뒷면으로 뒤집힐 때 단어 발음 자동 재생
      playHangeulSound(`${currentCard.word}! ${currentCard.hint}`);
    }
  };

  // "알아요! 통과 😊" 버튼 클릭
  const handleKnown = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });

    setLearnedCount((prev) => prev + 1);
    if (onEarnStar) onEarnStar();

    playHangeulSound(`참 잘했어요! ${currentCard.word} 단어를 멋지게 읽었어요!`);

    // 다음 카드로 이동
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      playHangeulSound('축하해요! 선택한 모든 카드를 다 마스터했어요! 최고예요!');
    }
  };

  // "다시 볼래요 🔁" 버튼 클릭 (에빙하우스 반복)
  const handleRepeat = (e) => {
    e.stopPropagation();
    playHangeulSound(`괜찮아요! ${currentCard.word}는 조금 이따가 한 번 더 만나보아요!`);

    // 현재 카드를 덱 맨 뒤에 한 번 더 추가
    const updatedDeck = [...deck, currentCard];
    setDeck(updatedDeck);

    if (currentIndex + 1 < updatedDeck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  // 이전 카드로 이동
  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  // 다음 카드로 이동
  const handleNextCard = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  // 덱 다시 섞기
  const handleShuffle = () => {
    const reshuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(reshuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    playHangeulSound('카드를 신나게 다시 섞었어요!');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-12">
      {/* 1. 상단 안내 배너 */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 sm:p-6 shadow-xl text-amber-950 border-4 border-amber-300 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black bg-white/40 px-3 py-1 rounded-full inline-block mb-1">
              초등 1학년 필수 받침 없는 낱말 118선
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              받침 없는 낱말 플래시카드 🎴
            </h2>
            <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1">
              큰 글씨를 먼저 보고 소리를 생각한 뒤, 터치해서 그림과 뜻을 확인해요!
            </p>
          </div>

          {/* 뷰 모드 토글 버튼 (1장씩 넘기기 vs 모아보기) */}
          <div className="flex items-center gap-1 bg-white/50 p-1.5 rounded-2xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                viewMode === 'card'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-white/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1장씩 넘기기</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-white/40'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>모아보기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 단계별(Stage) 필터 탭 바 */}
      <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-500 px-1">
          <span>단계별 난이도 선택:</span>
          <span className="text-amber-700 font-bold">현재 {deck.length}단어</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {STAGES.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`py-2 px-2.5 rounded-xl font-black text-xs transition-all whitespace-nowrap text-center ${
                selectedStage === st.id
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 shadow-xs scale-102'
                  : 'bg-slate-50 hover:bg-amber-50 text-slate-600'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 주제별(Category) 필터 탭 바 */}
      <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2">
        <div className="text-xs font-black text-slate-500 px-1">
          주제별 영역 선택:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-400 text-orange-950 ring-2 ring-orange-300 shadow-xs scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          뷰 모드 1: [1장씩 집중 플래시카드 넘기기 모드]
         ======================================================== */}
      {viewMode === 'card' && (
        <div className="space-y-4">
          {/* 진행 상태 및 성취 카운터 */}
          <div className="flex items-center justify-between px-2 text-xs sm:text-sm font-black text-amber-900">
            <span className="bg-amber-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>카드 {currentIndex + 1} / {deck.length}장</span>
            </span>

            <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-300">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>외운 단어: {learnedCount}개</span>
            </span>
          </div>

          {/* 메인 플래시카드 본체 (앞면: 단어 ➔ 뒷면: 그림+설명) */}
          {currentCard ? (
            <div
              onClick={handleFlipCard}
              className="w-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-white shadow-xl border-4 border-amber-300 p-6 sm:p-8 flex flex-col justify-between items-center text-center cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden select-none"
            >
              {/* 상단 뱃지 영역 */}
              <div className="w-full flex items-center justify-between">
                <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                  {currentCard.category} • {currentCard.stage}단계
                </span>

                <div className="bg-amber-50 text-amber-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 border border-amber-200">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>터치해서 뒤집기</span>
                </div>
              </div>

              {/* ====================================================
                  [앞면]: 아주 큰 글씨의 한글 단어 먼저 등장!
                 ==================================================== */}
              {!isFlipped ? (
                <div className="flex flex-col items-center justify-center my-auto space-y-5 animate-fade-in w-full py-4">
                  {/* 초대형 한글 단어 */}
                  <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-amber-950 tracking-wider transition-transform hover:scale-105">
                    {currentCard.word}
                  </h1>

                  {/* 호기심 유도 안내 문구 */}
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-black text-indigo-700 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200 inline-block">
                      👆 카드를 누르면 그림과 뜻이 나타나요!
                    </p>
                    <p className="text-xs text-slate-400 font-bold block">
                      글자의 모양을 보며 큰 소리로 먼저 읽어보세요!
                    </p>
                  </div>

                  {/* 앞면 발음 미리듣기 버튼 */}
                  <button
                    onClick={handlePlayWordSound}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>발음 소리 먼저 들어보기</span>
                  </button>
                </div>
              ) : (
                /* ====================================================
                    [뒷면]: 그림(이모지) + 친절한 설명 + 자모음 분절 블록
                   ==================================================== */
                <div className="flex flex-col items-center justify-center my-auto space-y-4 animate-jelly w-full py-2">
                  {/* 단어 타이틀 & 큰 그림 */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-6xl sm:text-7xl">{currentCard.emoji}</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-indigo-700">
                      {currentCard.word}
                    </h2>
                  </div>

                  {/* 1학년 눈높이 맞춤 친절한 단어 설명 */}
                  <div className="bg-amber-50/90 p-4 sm:p-5 rounded-3xl border-2 border-amber-200 text-left w-full space-y-1.5 shadow-inner">
                    <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentCard.word} 이야기:</span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-800 leading-relaxed">
                      "{currentCard.description}"
                    </p>
                  </div>

                  {/* 자모음 음소 분절 블록 */}
                  <div className="w-full">
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">
                      자음과 모음 합체 비밀:
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {currentCard.syllables &&
                        currentCard.syllables.map((syl, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center bg-white border-2 border-indigo-200 px-3 py-1.5 rounded-2xl shadow-xs"
                          >
                            <span className="text-xl font-black text-indigo-900">{syl.char}</span>
                            <span className="text-[11px] font-bold text-indigo-600 mt-0.5">
                              {syl.breakdown}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 하단 단어 전체 음성 듣기 버튼 */}
              <div className="w-full pt-2">
                <button
                  onClick={handlePlayDetailSound}
                  className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>선생님 목소리로 단어와 뜻 듣기 🔊</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-amber-200">
              <p className="font-bold text-slate-500">선택된 조건의 카드가 없습니다.</p>
            </div>
          )}

          {/* 4. 카드 넘기기 및 반복 학습 조작 버튼들 */}
          {currentCard && (
            <div className="space-y-3">
              {/* 알아요 / 다시 볼래요 버튼 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRepeat}
                  className="py-4 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-base transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 border-2 border-slate-300"
                >
                  <RotateCcw className="w-5 h-5 text-slate-500" />
                  <span>다시 볼래요 🔁</span>
                </button>

                <button
                  onClick={handleKnown}
                  className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                  <span>알아요! 통과 😊</span>
                </button>
              </div>

              {/* 이전 / 다음 / 섞기 보조 내비게이션 바 */}
              <div className="flex items-center justify-between px-1 pt-1">
                <button
                  onClick={handlePrevCard}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-xs font-black text-slate-600 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>이전 카드</span>
                </button>

                <button
                  onClick={handleShuffle}
                  className="text-xs font-black text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>단어 다시 섞기</span>
                </button>

                <button
                  onClick={handleNextCard}
                  disabled={currentIndex + 1 >= deck.length}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-xs font-black text-slate-600 flex items-center gap-1"
                >
                  <span>다음 카드</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          뷰 모드 2: [100선 모아보기 앨범 그리드 모드]
         ======================================================== */}
      {viewMode === 'grid' && (
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <span className="text-xs font-black text-slate-600 flex items-center gap-1">
              <LayoutGrid className="w-4 h-4 text-amber-600" />
              <span>단어 카드를 누르면 1장씩 넘기기 모드로 바로 공부할 수 있어요!</span>
            </span>
            <span className="text-xs font-black text-amber-800">
              총 {deck.length}개
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {deck.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsFlipped(false);
                  setViewMode('card');
                  playHangeulSound(`${item.word}!`);
                }}
                className="p-3 rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-100/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between gap-1 text-center transform hover:scale-105 active:scale-95"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-base font-black text-amber-950 mt-0.5">
                  {item.word}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
