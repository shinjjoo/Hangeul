import React from 'react';
import { STICKER_REWARDS } from '../data/hangeulCurriculumData';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Star } from 'lucide-react';

/**
 * [5. 칭찬 스티커북 컴포넌트]
 * 한글 공부를 성실하게 해낸 1학년 어린이들에게
 * 칭찬과 성취감을 안겨주는 디지털 스티커 보상판입니다.
 */
export default function StickerBook({ starsCount = 0 }) {
  const handleStickerClick = (sticker) => {
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 }
    });
    playHangeulSound(`${sticker.name} 스티커! ${sticker.desc}`);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* 스티커북 타이틀 헤더 */}
      <div className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-3xl p-6 shadow-xl border-4 border-amber-400 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/80 rounded-full text-amber-950 font-black text-xs mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          나의 자랑스러운 한글 배움 기록
        </div>
        <h2 className="text-3xl font-black text-amber-950">참 잘했어요! 칭찬 스티커판</h2>
        <p className="text-amber-900 text-sm mt-1 font-medium">
          매일매일 한 글자씩 열심히 배우면 예쁜 스티커가 모여요!
        </p>

        <div className="mt-4 inline-flex items-center gap-2 bg-white/90 px-5 py-2 rounded-2xl shadow-sm">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <span className="font-extrabold text-amber-950 text-lg">
            모은 반짝이 별: <span className="text-amber-600 font-black text-xl">{starsCount}</span>개
          </span>
        </div>
      </div>

      {/* 스티커 목록 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STICKER_REWARDS.map((sticker, idx) => {
          // 별 개수에 따라 스티커가 순차적으로 활성화됨
          const isUnlocked = starsCount >= (idx + 1) * 2 || idx === 0;

          return (
            <div
              key={sticker.id}
              onClick={() => handleStickerClick(sticker)}
              className={`p-5 rounded-3xl border-3 text-center transition-all transform active:scale-95 cursor-pointer shadow-md flex flex-col items-center justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-300 hover:scale-105 hover:shadow-lg'
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-5xl my-2 animate-pulse">
                {isUnlocked ? sticker.emoji : '🔒'}
              </div>
              <div className="mt-2">
                <h4 className="font-black text-slate-800 text-base">{sticker.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{sticker.desc}</p>
              </div>

              <div className="mt-3">
                {isUnlocked ? (
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    획득 완료 ✨
                  </span>
                ) : (
                  <span className="text-[11px] font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                    별 {(idx + 1) * 2}개 필요
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
