import React, { useState, useEffect } from 'react';
import { NO_BATCHIM_VOCAB } from './data/noBatchimVocab';
import { playHangeulSound } from './utils/speech';
import confetti from 'canvas-confetti';
import { 
  Volume2, RotateCcw, Check, RefreshCw, Sparkles, Star, 
  ChevronLeft, ChevronRight, LayoutGrid, Layers, Home, Award, Heart
} from 'lucide-react';

/**
 * =========================================================================
 * [최재우 학생 맞춤형] 받침 없는 필수 낱말 150선 독립 플래시카드 모바일 앱
 * =========================================================================
 * 
 * 주요 기능:
 * 1. 학생 맞춤 설정: '최재우' 어린이를 위한 특별한 응원 음성과 칭찬 피드백.
 * 2. 150개 받침 없는 순수 단어: 1단계(62개), 2단계(46개), 3단계(42개) 완벽 수록.
 * 3. 스마트폰 최적화 UX: 대형 단어 ➔ 터치 시 이모지 그림 + 뜻 이야기 + 자모음 분절.
 * 4. 자동 진도 저장: 로컬스토리지에 외운 단어와 별점을 저장하여 스마트폰에서 언제든 이어 학습.
 */
export default function DedicatedCardsApp() {
  // 학생 이름 고정
  const studentName = '최재우';

  // 필터 상태
  const [selectedStage, setSelectedStage] = useState('전체'); // '전체' | 1 | 2 | 3
  const [selectedCategory, setSelectedCategory] = useState('전체'); // '전체' | '동물' | ...
  
  // 뷰 모드: 'card' (1장씩 넘기기) | 'grid' (150개 모아보기)
  const [viewMode, setViewMode] = useState('card');

  // 카드 덱 및 학습 상태
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // false: 앞면(단어), true: 뒷면(그림+설명)

  // 로컬스토리지 연동 학습 진도 관리 (외운 단어 목록 및 별점)
  const [learnedWords, setLearnedWords] = useState(() => {
    try {
      const saved = localStorage.getItem('jaewoo_learned_words');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem('jaewoo_stars');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // 상태 변경 시 로컬스토리지 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem('jaewoo_learned_words', JSON.stringify(learnedWords));
      localStorage.setItem('jaewoo_stars', stars.toString());
    } catch (e) {
      console.error('로컬스토리지 저장 실패:', e);
    }
  }, [learnedWords, stars]);

  // 난이도 단계(Stage) 정의 (150개 기준 카운트 반영)
  const STAGES = [
    { id: '전체', label: '모든 단계 (150)' },
    { id: 1, label: '🌱 1단계: 쉬운 낱말 (62)' },
    { id: 2, label: '🌿 2단계: 쑥쑥 낱말 (46)' },
    { id: 3, label: '🌳 3단계: 알찬 낱말 (42)' },
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

    if (selectedStage !== '전체') {
      filtered = filtered.filter((item) => item.stage === selectedStage);
    }

    if (selectedCategory !== '전체') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 기본적으로 학습자가 편하게 볼 수 있도록 섞어서 제공
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedStage, selectedCategory]);

  const currentCard = deck[currentIndex] || deck[0];

  // 최재우 학생 맞춤 환영 음성
  const playWelcomeSound = () => {
    playHangeulSound(`${studentName} 어린이, 반가워요! 오늘도 씩씩하게 한글 카드를 읽어볼까요? 출발!`);
  };

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
      // 뒷면으로 뒤집힐 때 단어 발음과 힌트 안내
      playHangeulSound(`${currentCard.word}! ${currentCard.hint}`);
    }
  };

  // "알아요! 통과 😊" 버튼 클릭 - 최재우 어린이 맞춤 칭찬
  const handleKnown = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
    });

    // 외운 단어 목록에 추가 (중복 방지)
    if (!learnedWords.includes(currentCard.word)) {
      setLearnedWords((prev) => [...prev, currentCard.word]);
    }
    setStars((prev) => prev + 1);

    const praiseMessages = [
      `${studentName} 최고! ${currentCard.word} 단어를 아주 훌륭하게 읽었어요!`,
      `우와, ${studentName} 대단해요! ${currentCard.word} 완벽 성공!`,
      `참 잘했어요, ${studentName}! 별 하나를 획득했어요!`,
      `${studentName} 어린이 멋쟁이! 다음 단어도 힘차게 읽어봐요!`
    ];
    const randomPraise = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
    playHangeulSound(randomPraise);

    // 다음 카드로 이동
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      playHangeulSound(`축하합니다! ${studentName} 어린이가 모든 카드를 다 마스터했어요! 최고로 멋져요!`);
    }
  };

  // "다시 볼래요 🔁" 버튼 클릭 (에빙하우스 반복)
  const handleRepeat = (e) => {
    e.stopPropagation();
    playHangeulSound(`괜찮아요, ${studentName}! ${currentCard.word}는 조금 이따가 한 번 더 만나보아요!`);

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
    playHangeulSound(`${studentName} 어린이를 위해 카드를 신나게 다시 섞었어요!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 text-slate-800 flex flex-col justify-between selection:bg-amber-200">
      
      {/* 1. 최상단 모바일 전용 헤더 바 */}
      <header className="bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-sm sticky top-0 z-30 px-3 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* 학생 이름 & 아바타 */}
          <div 
            onClick={playWelcomeSound} 
            className="flex items-center gap-2 cursor-pointer group"
            title="소리 듣기"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm transform group-hover:scale-105 transition-transform">
              👦
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-amber-950">
                  {studentName}의 낱말카드
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-amber-800 font-bold">
                받침 없는 1학년 필수 150선
              </p>
            </div>
          </div>

          {/* 메인 홈 배움터 이동 링크 및 별 카운터 */}
          <div className="flex items-center gap-1.5">
            {/* 별 점수 */}
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-black text-amber-950">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{stars}</span>
            </div>

            {/* 홈(전체 배움터)으로 가기 버튼 */}
            <a
              href="./index.html"
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full text-xs font-black transition-colors"
              title="쑥쑥 한글 배움터 홈으로 이동"
            >
              <Home className="w-3.5 h-3.5" />
              <span>배움터 홈</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. 본문 컨테이너 */}
      <main className="max-w-md mx-auto w-full px-3 py-3 flex-1 flex flex-col justify-start gap-3">
        
        {/* 학습 격려 문구 & 뷰 모드 토글 (1장씩 vs 모아보기) */}
        <div className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 rounded-2xl p-3 shadow-sm border-2 border-amber-200 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black bg-white/60 text-amber-950 px-2 py-0.5 rounded-full inline-block mb-0.5">
              스마트폰 맞춤 한글 놀이
            </span>
            <p className="text-xs font-black text-amber-950 truncate">
              재우야, 큰 글씨를 먼저 소리 내어 읽어보자! 🌟
            </p>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs transition-all ${
                viewMode === 'card'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>1장씩</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-white/50'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>모아보기</span>
            </button>
          </div>
        </div>

        {/* 필터 탭 (단계별 & 주제별) */}
        <div className="space-y-1.5">
          {/* 난이도 단계 탭 */}
          <div className="grid grid-cols-4 gap-1">
            {STAGES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStage(st.id)}
                className={`py-1.5 px-1 rounded-xl font-black text-[11px] transition-all whitespace-nowrap text-center ${
                  selectedStage === st.id
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 shadow-xs scale-102'
                    : 'bg-white text-slate-600 border border-amber-200/80 hover:bg-amber-50'
                }`}
              >
                {st.id === '전체' ? '전체 150' : `${st.id}단계`}
              </button>
            ))}
          </div>

          {/* 주제별 탭 (가로 스크롤) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-[11px] whitespace-nowrap shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-400 text-orange-950 ring-2 ring-orange-300 shadow-xs'
                    : 'bg-white text-slate-700 border border-amber-200/70 hover:bg-slate-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            모드 1: [1장씩 집중 플래시카드 넘기기 모드]
           ======================================================== */}
        {viewMode === 'card' && (
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {/* 진행 상태 바 */}
            <div className="flex items-center justify-between text-xs font-black text-amber-900 px-1">
              <span className="bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentIndex + 1} / {deck.length}장</span>
              </span>

              <span className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>외운 단어: {learnedWords.length}개</span>
              </span>
            </div>

            {/* 메인 플래시카드 본체 (앞면: 단어 ➔ 뒷면: 그림+설명) */}
            {currentCard ? (
              <div
                onClick={handleFlipCard}
                className="w-full min-h-[350px] sm:min-h-[380px] rounded-3xl bg-white shadow-lg border-4 border-amber-300 p-5 flex flex-col justify-between items-center text-center cursor-pointer transform active:scale-98 transition-all relative overflow-hidden select-none"
              >
                {/* 상단 뱃지 영역 */}
                <div className="w-full flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-200">
                    {currentCard.category} • {currentCard.stage}단계
                  </span>

                  <div className="bg-amber-50 text-amber-800 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                    <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>터치해서 뒤집기</span>
                  </div>
                </div>

                {/* [앞면]: 아주 큰 글씨의 한글 단어 먼저 등장! */}
                {!isFlipped ? (
                  <div className="flex flex-col items-center justify-center my-auto space-y-4 animate-fade-in w-full py-2">
                    {/* 초대형 한글 단어 */}
                    <h1 className="text-7xl sm:text-8xl font-black text-amber-950 tracking-wider transition-transform hover:scale-105">
                      {currentCard.word}
                    </h1>

                    {/* 호기심 유도 안내 문구 */}
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-200 inline-block">
                        👆 카드를 터치하면 그림과 뜻이 나와요!
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold block">
                        글자 모양을 보며 큰 소리로 먼저 읽어보세요!
                      </p>
                    </div>

                    {/* 발음 미리듣기 버튼 */}
                    <button
                      onClick={handlePlayWordSound}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-amber-700" />
                      <span>소리 먼저 듣기</span>
                    </button>
                  </div>
                ) : (
                  /* [뒷면]: 그림(이모지) + 친절한 설명 + 자모음 분절 블록 */
                  <div className="flex flex-col items-center justify-center my-auto space-y-3 animate-jelly w-full py-1">
                    {/* 단어 타이틀 & 큰 그림 */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl sm:text-6xl">{currentCard.emoji}</span>
                      <h2 className="text-3xl sm:text-4xl font-black text-indigo-700">
                        {currentCard.word}
                      </h2>
                    </div>

                    {/* 1학년 눈높이 맞춤 친절한 단어 설명 */}
                    <div className="bg-amber-50/90 p-3.5 rounded-2xl border-2 border-amber-200 text-left w-full space-y-1 shadow-inner">
                      <div className="flex items-center gap-1 text-amber-900 font-black text-[11px]">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{currentCard.word} 이야기:</span>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed">
                        "{currentCard.description}"
                      </p>
                    </div>

                    {/* 자모음 음소 분절 블록 */}
                    <div className="w-full">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">
                        자음과 모음 합체 비밀:
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        {currentCard.syllables &&
                          currentCard.syllables.map((syl, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center bg-white border border-indigo-200 px-2.5 py-1 rounded-xl shadow-xs"
                            >
                              <span className="text-lg font-black text-indigo-950">{syl.char}</span>
                              <span className="text-[10px] font-bold text-indigo-600">
                                {syl.breakdown}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 하단 전체 음성 듣기 버튼 */}
                <div className="w-full pt-1">
                  <button
                    onClick={handlePlayDetailSound}
                    className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>선생님 목소리로 단어와 뜻 듣기 🔊</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-amber-200">
                <p className="font-bold text-slate-500">선택된 조건의 카드가 없습니다.</p>
              </div>
            )}

            {/* 카드 조작 버튼들 (다시 볼래요 / 알아요! 통과) */}
            {currentCard && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRepeat}
                    className="py-3.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-sm transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1.5 border-2 border-slate-300"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>다시 볼래요 🔁</span>
                  </button>

                  <button
                    onClick={handleKnown}
                    className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>알아요! 통과 😊</span>
                  </button>
                </div>

                {/* 보조 내비게이션 (이전 / 섞기 / 다음) */}
                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={handlePrevCard}
                    disabled={currentIndex === 0}
                    className="px-2.5 py-1 rounded-xl bg-white disabled:opacity-30 text-xs font-black text-slate-600 flex items-center gap-1 border border-slate-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>이전</span>
                  </button>

                  <button
                    onClick={handleShuffle}
                    className="text-xs font-black text-amber-800 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>단어 섞기</span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    disabled={currentIndex + 1 >= deck.length}
                    className="px-2.5 py-1 rounded-xl bg-white disabled:opacity-30 text-xs font-black text-slate-600 flex items-center gap-1 border border-slate-200"
                  >
                    <span>다음</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            모드 2: [150선 모아보기 앨범 그리드 모드]
           ======================================================== */}
        {viewMode === 'grid' && (
          <div className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <span className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                <span>카드를 터치하면 바로 공부할 수 있어요!</span>
              </span>
              <span className="text-xs font-black text-amber-800">
                총 {deck.length}개
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {deck.map((item, idx) => {
                const isMastered = learnedWords.includes(item.word);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsFlipped(false);
                      setViewMode('card');
                      playHangeulSound(`${item.word}!`);
                    }}
                    className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between gap-1 text-center transform active:scale-95 ${
                      isMastered
                        ? 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70'
                        : 'border-amber-200 bg-amber-50/40 hover:bg-amber-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full px-1">
                      <span className="text-xl">{item.emoji}</span>
                      {isMastered && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-base font-black text-amber-950 mt-0.5">
                      {item.word}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {item.category} • {item.stage}단계
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* 3. 모바일 최하단 패밀리 바 */}
      <footer className="text-center py-2 text-[11px] text-amber-900 font-bold bg-white/70 border-t border-amber-200">
        최재우 어린이를 위한 초등 1학년 맞춤 한글 낱말카드 ✨
      </footer>
    </div>
  );
}
