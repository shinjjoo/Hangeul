import React, { useState, useEffect } from 'react';
import { CONSONANTS, VOWELS, combineHangeul } from '../data/hangeulData';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Sparkles, Plus, Equal, Volume2 } from 'lucide-react';

/**
 * [2. 글자 합체 마법 컴포넌트]
 * 자음과 모음을 각각 골라서 합체시키면
 * 하나의 글자가 완성되는 한글의 창제 원리를 체험하는 놀이 공간입니다.
 */
export default function CombineGame() {
  const [selectedCho, setSelectedCho] = useState('ㄱ');
  const [selectedJung, setSelectedJung] = useState('ㅏ');
  const [combinedChar, setCombinedChar] = useState('가');

  // 자음 또는 모음이 변경될 때마다 결합 글자 갱신
  useEffect(() => {
    const res = combineHangeul(selectedCho, selectedJung);
    setCombinedChar(res || '가');
  }, [selectedCho, selectedJung]);

  // 합체 버튼 눌렀을 때 발음 및 폭죽 효과
  const handleCombineSpeech = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
    playHangeulSound(`${selectedCho}! ${selectedJung}! 합치면 ${combinedChar}!`);
  };

  return (
    <div className="space-y-6">
      {/* 마법 결합 화면 (상단 쇼케이스) */}
      <div className="bg-gradient-to-b from-emerald-100 to-teal-50 rounded-3xl p-6 shadow-xl border-4 border-emerald-300 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            마법의 글자 합체 놀이
          </span>
          <h2 className="text-xl font-black text-emerald-950 mt-1">자음과 모음을 더하면 어떤 글자가 될까요?</h2>
        </div>

        {/* 결합 수식 박스: [자음] + [모음] = [완성 글자] */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 my-4">
          {/* 선택된 초성 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-rose-500 text-white rounded-3xl flex items-center justify-center text-5xl font-black shadow-lg">
              {selectedCho}
            </div>
            <span className="text-xs font-bold text-rose-600 mt-1">첫소리(자음)</span>
          </div>

          <Plus className="w-6 h-6 text-emerald-600 font-black" />

          {/* 선택된 중성 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-sky-500 text-white rounded-3xl flex items-center justify-center text-5xl font-black shadow-lg">
              {selectedJung}
            </div>
            <span className="text-xs font-bold text-sky-600 mt-1">가운뎃소리(모음)</span>
          </div>

          <Equal className="w-6 h-6 text-emerald-600 font-black" />

          {/* 합쳐진 완성 글자 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-amber-400 text-amber-950 rounded-3xl flex items-center justify-center text-6xl font-black shadow-xl ring-4 ring-amber-300 animate-pulse">
              {combinedChar}
            </div>
            <span className="text-xs font-bold text-amber-700 mt-1">완성된 글자!</span>
          </div>
        </div>

        {/* 소리 듣기 버튼 */}
        <button
          onClick={handleCombineSpeech}
          className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <Volume2 className="w-6 h-6" />
          <span>합체 소리 듣기 ("{combinedChar}")</span>
        </button>
      </div>

      {/* 2열 선택기: 왼쪽 자음 고르기 / 오른쪽 모음 고르기 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 자음 선택 패널 */}
        <div className="bg-white rounded-2xl p-4 shadow border-2 border-rose-200">
          <h3 className="font-extrabold text-rose-800 text-sm mb-3 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            1. 자음을 골라보세요
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {CONSONANTS.map((c) => {
              const isSelected = selectedCho === c.char;
              return (
                <button
                  key={c.char}
                  onClick={() => {
                    setSelectedCho(c.char);
                    playHangeulSound(c.name);
                  }}
                  className={`py-3 rounded-xl font-black text-2xl transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-md scale-105'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {c.char}
                </button>
              );
            })}
          </div>
        </div>

        {/* 모음 선택 패널 */}
        <div className="bg-white rounded-2xl p-4 shadow border-2 border-sky-200">
          <h3 className="font-extrabold text-sky-800 text-sm mb-3 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            2. 모음을 골라보세요
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {VOWELS.map((v) => {
              const isSelected = selectedJung === v.char;
              return (
                <button
                  key={v.char}
                  onClick={() => {
                    setSelectedJung(v.char);
                    playHangeulSound(v.sound);
                  }}
                  className={`py-3 rounded-xl font-black text-2xl transition-all ${
                    isSelected
                      ? 'bg-sky-500 text-white ring-2 ring-sky-400 shadow-md scale-105'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  {v.char}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
