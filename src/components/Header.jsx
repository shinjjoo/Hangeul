import React from 'react';
import { 
  Calendar, Layers, Volume2, Sparkles, Edit3, HelpCircle, 
  CheckSquare, Award, Heart, Star, FileText, Clock 
} from 'lucide-react';
import { playHangeulSound } from '../utils/speech';

/**
 * [상단 헤더 및 20일 완성 프로그램 중심 메뉴 탭 컴포넌트]
 * 1학년 어린이와 선생님이 매일 20분씩 체계적으로 학습할 수 있도록
 * '20일 완성 코스'를 메인 첫 번째로 전면 배치하고,
 * 자유 탐색 배움터(낱말카드, 소리, 합체 등)를 함께 제공합니다.
 */
export default function Header({ currentTab, setCurrentTab, starsCount = 0, onOpenReport }) {
  const tabs = [
    { id: 'daily20', label: '20일 완성 코스 (1일 20분)', icon: Calendar, color: 'bg-amber-400 hover:bg-amber-500 text-amber-950', soundDesc: '기초부터 받침까지 20일 완성 한글 코스를 공부해요' },
    { id: 'flashcards', label: '낱말 카드(118선)', icon: Layers, color: 'bg-orange-400 hover:bg-orange-500 text-orange-950', soundDesc: '받침 없는 낱말 카드를 뒤집으며 공부해요' },
    { id: 'combine', label: '글자 합체 마법', icon: Sparkles, color: 'bg-emerald-400 hover:bg-emerald-500 text-emerald-950', soundDesc: '자음과 모음을 합쳐 글자를 만들어요' },
    { id: 'trace', label: '따라 쓰기', icon: Edit3, color: 'bg-sky-400 hover:bg-sky-500 text-sky-950', soundDesc: '손가락으로 글씨를 따라 써보아요' },
    { id: 'assessment', label: '수준별 평가', icon: CheckSquare, color: 'bg-purple-400 hover:bg-purple-500 text-purple-950', soundDesc: '나의 한글 실력을 뽐내보아요' },
    { id: 'stickers', label: '칭찬 스티커', icon: Award, color: 'bg-rose-400 hover:bg-rose-500 text-rose-950', soundDesc: '내가 모은 칭찬 스티커를 확인해요' },
  ];

  const handleTabClick = (tab) => {
    setCurrentTab(tab.id);
    playHangeulSound(tab.soundDesc);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-4 border-amber-200 shadow-sm sticky top-0 z-40 px-4 py-2.5 print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* 앱 로고 및 타이틀 영역 */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={() => playHangeulSound('초등 1학년 쑥쑥 한글 배움터에 온 것을 환영해요!')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-400 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md transform group-hover:rotate-6 transition-transform">
              🐣
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-amber-900 tracking-tight flex items-center gap-1">
                쑥쑥 한글 배움터
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse inline" />
              </h1>
              <p className="text-[11px] text-amber-700 font-medium">초등 1학년 20일 완성 한글 코스</p>
            </div>
          </div>

          {/* 모바일 통지표 및 별 카운터 */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenReport}
              className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold"
              title="학부모 리포트"
            >
              <FileText className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full font-black text-amber-900 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{starsCount}</span>
            </div>
          </div>
        </div>

        {/* 메인 메뉴 탭 버튼들 */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-start md:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap transition-all transform active:scale-95 shadow-xs ${
                  isActive
                    ? `${tab.color} ring-3 ring-amber-200 shadow-sm scale-105`
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-bounce' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 데스크톱용 통지표 버튼 및 별 카운터 */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>학부모 리포트 📄</span>
          </button>

          <div className="flex items-center gap-1 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full font-black text-amber-900 text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>별 {starsCount}개</span>
          </div>
        </div>
      </div>
    </header>
  );
}
