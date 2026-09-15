import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyProgram from './components/DailyProgram';
import FlashCards from './components/FlashCards';
import CombineGame from './components/CombineGame';
import TracingCanvas from './components/TracingCanvas';
import Assessment from './components/Assessment';
import StickerBook from './components/StickerBook';
import ParentReportModal from './components/ParentReportModal';
import { Smile } from 'lucide-react';

/**
 * [메인 App 컴포넌트]
 * '20일 완성 하루 20분 한글 마스터 프로그램'을 핵심 중심축으로 두고,
 * 낱말 카드, 글자 합체 마법, 따라 쓰기, 수준별 평가, 칭찬 스티커 및
 * 학부모 가정 연계 리포트를 총괄 제공하는 메인 뷰입니다.
 */
export default function App() {
  // 기본 첫 화면: 20일 완성 데일리 코스
  const [currentTab, setCurrentTab] = useState('daily20');
  const [isReportOpen, setIsReportOpen] = useState(false); // 학부모 통지표 모달
  const [starsCount, setStarsCount] = useState(() => {
    // 로컬 스토리지에서 별 점수 불러오기
    const saved = localStorage.getItem('hangeul_stars');
    return saved ? parseInt(saved, 10) : 5; // 환영 선물로 별 5개 지급!
  });

  // 별 점수 로컬 스토리지 동기화
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
          {currentTab === 'daily20' && (
            <DailyProgram 
              onEarnStar={handleEarnStar} 
              onOpenReport={() => setIsReportOpen(true)} 
            />
          )}
          {currentTab === 'flashcards' && <FlashCards onEarnStar={handleEarnStar} />}
          {currentTab === 'combine' && <CombineGame onEarnStar={handleEarnStar} />}
          {currentTab === 'trace' && <TracingCanvas onEarnStar={handleEarnStar} />}
          {currentTab === 'assessment' && (
            <Assessment 
              onOpenReport={() => setIsReportOpen(true)} 
              onEarnStar={handleEarnStar} 
            />
          )}
          {currentTab === 'stickers' && <StickerBook starsCount={starsCount} />}
        </main>
      </div>

      {/* 학부모 20일 배움 성장 리포트 모달 */}
      {isReportOpen && (
        <ParentReportModal onClose={() => setIsReportOpen(false)} />
      )}

      {/* 하단 푸터 */}
      <footer className="bg-white/80 border-t border-amber-200 py-6 text-center text-sm text-slate-500 mt-12 print:hidden">
        <div className="flex items-center justify-center gap-1.5 font-bold text-amber-800 mb-1">
          <Smile className="w-4 h-4 text-amber-600" />
          <span>매일매일 20분씩 한 글자씩 쑥쑥 자라는 우리들의 한글 실력!</span>
        </div>
        <p className="text-xs text-slate-400">
          초등학교 1학년 20일 완성 한글 마스터 프로그램 • 학교-가정 연계 시스템
        </p>
      </footer>
    </div>
  );
}
