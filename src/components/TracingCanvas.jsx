import React, { useRef, useState, useEffect } from 'react';
import { CONSONANTS, VOWELS } from '../data/hangeulData';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, Volume2, Palette } from 'lucide-react';

/**
 * [3. 따라 쓰기 손가락 놀이터 컴포넌트]
 * 회색 글씨 가이드 위에 손가락이나 마우스로 직접 선을 그어
 * 글씨 쓰는 획순과 형태를 익히는 인터랙티브 캔버스입니다.
 */
export default function TracingCanvas() {
  const canvasRef = useRef(null);
  const [targetChar, setTargetChar] = useState('ㄱ');
  const [targetName, setTargetName] = useState('기역');
  const [strokeColor, setStrokeColor] = useState('#3B82F6'); // 기본 파란색 크레파스
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    { name: '파랑', code: '#3B82F6' },
    { name: '빨강', code: '#EF4444' },
    { name: '초록', code: '#10B981' },
    { name: '주황', code: '#F97316' },
    { name: '보라', code: '#8B5CF6' },
  ];

  // 캔버스 초기화 및 가이드 글자 그리기
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // 캔버스 깨끗이 비우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 바탕 모눈종이 십자선 가이드 그리기 (균형 잡힌 글씨 쓰기 연습용)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    // 가로선
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    // 세로선
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // 점선 해제
  };

  useEffect(() => {
    clearCanvas();
  }, [targetChar]);

  // 마우스 및 터치 좌표 계산 함수
  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
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

  // 선 그리기 시작
  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  // 선 긋는 중
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 20; // 1학년 아이들이 그리기 쉬운 도톰한 크레파스 두께
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  // 선 그리기 종료
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 참 잘했어요! 버튼 클릭 시
  const handlePraise = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 }
    });
    playHangeulSound(`참 잘했어요! ${targetChar} 글씨를 정말 멋지게 썼네요! 최고예요!`);
  };

  const handleSelectChar = (item) => {
    setTargetChar(item.char);
    setTargetName(item.name || item.sound);
    playHangeulSound(`${item.char}을 따라 써보아요`);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* 글자 선택 버튼 띠 */}
      <div className="bg-white p-3 rounded-2xl shadow border-2 border-sky-200 overflow-x-auto flex gap-2">
        {CONSONANTS.concat(VOWELS).map((item) => {
          const isSelected = targetChar === item.char;
          return (
            <button
              key={item.char}
              onClick={() => handleSelectChar(item)}
              className={`min-w-[44px] h-11 rounded-xl font-black text-xl flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white ring-2 ring-sky-300 scale-105 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.char}
            </button>
          );
        })}
      </div>

      {/* 캔버스 도화지 카드 */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-sky-300 flex flex-col items-center">
        {/* 상단 안내 문구 */}
        <div className="w-full flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-sky-900">{targetChar}</span>
            <span className="text-sm font-bold text-slate-500">따라 쓰기 ({targetName})</span>
          </div>
          <button
            onClick={() => playHangeulSound(targetChar)}
            className="p-2 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* 따라쓰기 캔버스 영역 (가이드 글자가 뒤에 비치도록 레이어링) */}
        <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-2xl bg-amber-50/50 border-4 border-dashed border-sky-300 overflow-hidden shadow-inner flex items-center justify-center">
          {/* 뒤에 희미하게 비치는 회색 가이드 글씨 */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none text-slate-300 font-black text-[220px] leading-none opacity-40">
            {targetChar}
          </div>

          {/* 실제 아이가 그림을 그리는 HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
          />
        </div>

        {/* 크레파스 색상 선택 바 */}
        <div className="flex items-center gap-3 my-4">
          <Palette className="w-5 h-5 text-slate-400" />
          {colors.map((c) => (
            <button
              key={c.code}
              onClick={() => setStrokeColor(c.code)}
              className={`w-9 h-9 rounded-full shadow-sm transition-transform ${
                strokeColor === c.code ? 'scale-125 ring-4 ring-slate-300' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c.code }}
              title={c.name}
            />
          ))}
        </div>

        {/* 하단 조작 버튼들 */}
        <div className="w-full grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={clearCanvas}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>지우고 다시 쓰기</span>
          </button>

          <button
            onClick={handlePraise}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black transition-all active:scale-95 shadow-md"
          >
            <Award className="w-5 h-5 text-amber-900" />
            <span>다 썼어요! 칭찬 도장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
