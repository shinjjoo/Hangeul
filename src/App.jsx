import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SoundStudy from './components/SoundStudy';
import FlashCards from './components/FlashCards';
import CombineGame from './components/CombineGame';
import TracingCanvas from './components/TracingCanvas';
import QuizGame from './components/QuizGame';
import Assessment from './components/Assessment';
import StickerBook from './components/StickerBook';
import ParentReportModal from './components/ParentReportModal';
import { Smile } from 'lucide-react';

/**
 * [메인 App 컴포넌트]
 * 1학년 학생들의 한글 기초 학습을 위한 7대 핵심 모드와
 * 학부모 가정 연계 안내 통지표를 총괄 관리하는 메인 화면입니다.
 */
export default function App() {
  const [currentTab, setCurrentTab] = useState('flashcards'); // 받침 없는 낱말 카드를 기본 학습으로 진입
  const [isReportOpen, setIsReportOpen] = useState(false); // 학부모 통지표 모달 열림 여부
  const [starsCount, setStarsCount] = useState(() => {
    // 로컬 스토리지에서 기존 별 점수 불러오기
    const saved = localStorage.getItem('hangeul_stars');
    return saved ? parseInt(saved, 10) : 2; // 처음 온 어린이에게 환영 별 2개 지급!
  });

  // 별 점수 변경 시 로컬 스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem('hangeul_stars', starsCount.toString());
  }, [starsCount]);

  // 별 획득 처리 함수
  const handleEarnStar = () => {
    setStarsCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/20 to-amber-100/40 flex flex-col justify-between">
      <div>
        {/* 상단 헤더 메뉴 탭 */}
        <Header 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          starsCount={starsCount}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* 메인 학습 콘텐츠 영역 */}
        <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          {currentTab === 'sound' && <SoundStudy onEarnStar={handleEarnStar} />}
          {currentTab === 'flashcards' && <FlashCards onEarnStar={handleEarnStar} />}
          {currentTab === 'combine' && <CombineGame onEarnStar={handleEarnStar} />}
          {currentTab === 'trace' && <TracingCanvas onEarnStar={handleEarnStar} />}
          {currentTab === 'quiz' && <QuizGame onEarnStar={handleEarnStar} />}
          {currentTab === 'assessment' && (
            <Assessment 
              onOpenReport={() => setIsReportOpen(true)} 
              onEarnStar={handleEarnStar} 
            />
          )}
          {currentTab === 'stickers' && <StickerBook starsCount={starsCount} />}
        </main>
      </div>

      {/* 학부모 안내 통지표 모달 */}
      {isReportOpen && (
        <ParentReportModal onClose={() => setIsReportOpen(false)} />
      )}

      {/* 하단 푸터 */}
      <footer className="bg-white/80 border-t border-amber-200 py-6 text-center text-sm text-slate-500 mt-12 print:hidden">
        <div className="flex items-center justify-center gap-1.5 font-bold text-amber-800 mb-1">
          <Smile className="w-4 h-4 text-amber-600" />
          <span>매일매일 한 글자씩 쑥쑥 자라는 우리들의 한글 실력!</span>
        </div>
        <p className="text-xs text-slate-400">
          초등학교 1학년 눈높이 맞춤 한글 교육용 앱 • 5대 전문 에이전트 협업 시스템
        </p>
      </footer>
    </div>
  );
}
