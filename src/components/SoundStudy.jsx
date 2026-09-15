import React, { useState } from 'react';
import { CONSONANTS, VOWELS } from '../data/hangeulData';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, Smile } from 'lucide-react';

/**
 * [1. 소리 탐험관 컴포넌트]
 * 자음과 모음을 손가락(마우스)으로 터치하면
 * 친절한 목소리로 글자의 이름과 소리, 단어를 읽어주는 모드입니다.
 */
export default function SoundStudy() {
  const [activeCategory, setActiveCategory] = useState('consonant'); // 'consonant' (자음) 또는 'vowel' (모음)
  const [selectedItem, setSelectedItem] = useState(CONSONANTS[0]);

  const items = activeCategory === 'consonant' ? CONSONANTS : VOWELS;

  // 글자 카드를 눌렀을 때 실행되는 함수
  const handleItemClick = (item) => {
    setSelectedItem(item);

    // 귀여운 폭죽 효과 연출
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
    });

    // 어린이의 귀에 쏙 들어오도록 안내 멘트 재생
    if (activeCategory === 'consonant') {
      playHangeulSound(`${item.name}! ${item.sound}! ${item.word}의 ${item.char}!`);
    } else {
      playHangeulSound(`${item.char}! ${item.word}의 ${item.char}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 자음/모음 카테고리 선택 버튼 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            setActiveCategory('consonant');
            setSelectedItem(CONSONANTS[0]);
            playHangeulSound('자음을 배워보아요');
          }}
          className={`px-6 py-3 rounded-full text-lg font-black transition-all transform active:scale-95 shadow-md flex items-center gap-2 ${
            activeCategory === 'consonant'
              ? 'bg-rose-500 text-white ring-4 ring-rose-200 scale-105'
              : 'bg-white text-slate-700 hover:bg-rose-50'
          }`}
        >
          <span>자음 친구들 (14개)</span>
          <span className="text-xl">🎒</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('vowel');
            setSelectedItem(VOWELS[0]);
            playHangeulSound('모음을 배워보아요');
          }}
          className={`px-6 py-3 rounded-full text-lg font-black transition-all transform active:scale-95 shadow-md flex items-center gap-2 ${
            activeCategory === 'vowel'
              ? 'bg-sky-500 text-white ring-4 ring-sky-200 scale-105'
              : 'bg-white text-slate-700 hover:bg-sky-50'
          }`}
        >
          <span>모음 친구들 (10개)</span>
          <span className="text-xl">👶</span>
        </button>
      </div>

      {/* 현재 선택된 글자 상세 미리보기 카드 (크고 선명하게 보여줌) */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 max-w-xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-100 rounded-full opacity-50 pointer-events-none" />
        
        {/* 이모지와 글자 */}
        <div className="flex items-center justify-center gap-6 my-2">
          <div className="w-28 h-28 rounded-3xl bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-7xl font-black text-amber-900 shadow-inner">
            {selectedItem.char}
          </div>
          <div className="text-7xl animate-bounce">
            {selectedItem.emoji}
          </div>
        </div>

        {/* 글자 정보 설명 */}
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-slate-800">
            {selectedItem.word}
          </div>
          <p className="text-slate-500 text-base mt-1">
            소리: <span className="font-bold text-amber-600 text-xl">{selectedItem.sound}</span> ({selectedItem.name})
          </p>
        </div>

        {/* 다시 소리 듣기 큰 버튼 */}
        <button
          onClick={() => handleItemClick(selectedItem)}
          className="mt-5 w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <Volume2 className="w-6 h-6 animate-pulse" />
          <span>소리 다시 듣기</span>
        </button>
      </div>

      {/* 글자 카드 그리드 (터치하기 좋게 큼직한 타일 배치) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
        {items.map((item) => {
          const isCurrent = selectedItem.char === item.char;
          return (
            <button
              key={item.char}
              onClick={() => handleItemClick(item)}
              className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all transform active:scale-90 shadow-sm ${
                item.color
              } ${
                isCurrent
                  ? 'ring-4 ring-amber-400 scale-105 shadow-lg -translate-y-1'
                  : 'hover:scale-102 hover:shadow-md'
              }`}
            >
              <span className="text-4xl font-black leading-none">{item.char}</span>
              <span className="text-2xl mt-1">{item.emoji}</span>
              <span className="text-xs font-bold text-slate-600">{item.word}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
