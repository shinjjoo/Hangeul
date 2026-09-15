import React from 'react';
import { 
  Calendar, Layers, Sparkles, Edit3, 
  CheckSquare, Award, Heart, Star, FileText, Users 
} from 'lucide-react';
import { playHangeulSound } from '../utils/speech';

/**
 * [상단 헤더 - 20일 완성 커리큘럼 중심 네비게이션]
 * 현재 활성화된 학생 프로필(이름, 동물 캐릭터)을 직관적으로 표시하고,
 * '20일 완주 배움터'를 압도적 메인 중심축으로 배치합니다.
 */
export default function Header({ 
  currentTab, 
  setCurrentTab, 
  starsCount = 0, 
  currentStudent, 
  onOpenReport, 
  onOpenStudentManager 
}) {
  // 메인 메뉴 탭 목록 (20일 완주 배움터를 최우선 핵심으로 배치)
  const tabs = [
    { 
      id: 'daily20', 
      label: '🌟 20일 완주 배움터 (1일 30분)', 
      icon: Calendar, 
      color: 'bg-amber-400 hover:bg-amber-500 text-amber-950 font-black', 
      soundDesc: '기초부터 받침, 문장까지 20일 완성 한글 마스터 코스예요!' 
    },
    { 
      id: 'flashcards', 
      label: '🎴 낱말 카드 (118선)', 
      icon: Layers, 
      color: 'bg-orange-400 hover:bg-orange-500 text-orange-950 font-black', 
      soundDesc: '받침 없는 118개 단어를 플래시 카드로 뒤집어보아요!' 
    },
    { 
      id: 'combine', 
      label: '✨ 글자 합체 마법', 
      icon: Sparkles, 
      color: 'bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black', 
      soundDesc: '자음과 모음이 만나 글자가 되는 마법을 관찰해요!' 
    },
    { 
      id: 'trace', 
      label: '✍️ 자유 따라 쓰기', 
      icon: Edit3, 
      color: 'bg-sky-400 hover:bg-sky-500 text-sky-950 font-black', 
      soundDesc: '손가락으로 글씨를 마음껏 따라 써보아요!' 
    },
    { 
      id: 'assessment', 
      label: '📝 3단계 진단평가', 
      icon: CheckSquare, 
      color: 'bg-purple-400 hover:bg-purple-500 text-purple-950 font-black', 
      soundDesc: '새싹, 꽃잎, 열매 수준별 평가를 치러보아요!' 
    },
    { 
      id: 'stickers', 
      label: '🏆 칭찬 스티커판', 
      icon: Award, 
      color: 'bg-rose-400 hover:bg-rose-500 text-rose-950 font-black', 
      soundDesc: '내가 모은 반짝반짝 칭찬 스티커를 확인해요!' 
    },
  ];

  const handleTabClick = (tab) => {
    setCurrentTab(tab.id);
    playHangeulSound(tab.soundDesc);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-sm sticky top-0 z-40 px-3 sm:px-4 py-2.5 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* 좌측 로고 및 타이틀 영역 */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={() => {
              setCurrentTab('daily20');
              playHangeulSound('초등 1학년 쑥쑥 한글 배움터에 온 것을 환영해요!');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-md transform group-hover:rotate-6 transition-transform">
              🐣
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-1">
                쑥쑥 한글 배움터
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse inline" />
              </h1>
              <p className="text-[11px] text-amber-800 font-bold">초등 1학년 20일 완성 한글 마스터</p>
            </div>
          </div>

          {/* 모바일용 학생 아바타 뱃지 및 별 카운터 */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onOpenStudentManager}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-black text-amber-950"
              title="학생 변경"
            >
              <span>{currentStudent?.avatar || '🐯'}</span>
              <span>{currentStudent?.name || '꿈나무'}</span>
            </button>
            <div className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full font-black text-amber-900 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{starsCount}</span>
            </div>
          </div>
        </div>

        {/* 중앙 메뉴 탭 버튼들 */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-start md:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all transform active:scale-95 shadow-xs ${
                  isActive
                    ? `${tab.color} ring-3 ring-amber-300 shadow-md scale-105`
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-bounce' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 우측 데스크톱용 [현재 학생 프로필 버튼] & [학부모 통지표 버튼] */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* 학생 프로필 뱃지 버튼 */}
          <button
            onClick={onOpenStudentManager}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/90 hover:bg-amber-200 border-2 border-amber-300 rounded-2xl text-xs font-black text-amber-950 shadow-xs transition-all active:scale-95"
            title="학생 및 캐릭터 변경하기"
          >
            <span className="text-base">{currentStudent?.avatar || '🐯'}</span>
            <span>{currentStudent?.name || '김새싹'}</span>
            <span className="text-[10px] text-amber-700 font-bold bg-white/70 px-1.5 py-0.5 rounded-full">
              {currentStudent?.characterName || '호치'}
            </span>
          </button>

          {/* 학부모 리포트 버튼 */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-xs transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>학부모 리포트 📄</span>
          </button>

          {/* 별 개수 표시 */}
          <div className="flex items-center gap-1 bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-full font-black text-amber-900 text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>별 {starsCount}개</span>
          </div>
        </div>
      </div>
    </header>
  );
}
