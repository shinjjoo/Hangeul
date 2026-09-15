import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyProgram from './components/DailyProgram';
import FlashCards from './components/FlashCards';
import CombineGame from './components/CombineGame';
import TracingCanvas from './components/TracingCanvas';
import Assessment from './components/Assessment';
import StickerBook from './components/StickerBook';
import ParentReportModal from './components/ParentReportModal';
import StudentManagerModal from './components/StudentManagerModal';
import { 
  getCurrentStudent, getStudentStars, setStudentStars 
} from './utils/secureStorage';
import { Smile, Sparkles } from 'lucide-react';

/**
 * [메인 App 컴포넌트]
 * '20일 완성 하루 30분 한글 마스터 프로그램'을 절대적인 중심축으로 두고,
 * 학생 다중 등록 및 맞춤 캐릭터, 날짜별 학습 루틴, 일일 평가 및 보충학습 분기,
 * 보조 자유 놀이터와 학부모 통지표를 총괄 제공하는 메인 컨테이너입니다.
 */
export default function App() {
  // 기본 첫 화면: 20일 완성 데일리 코스
  const [currentTab, setCurrentTab] = useState('daily20');
  
  // 모달 제어 상태
  const [isReportOpen, setIsReportOpen] = useState(false); // 학부모 통지표 모달
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState(false); // 학생 등록 및 관리 모달

  // 현재 선택된 학생 프로필 및 별 점수 상태
  const [currentStudent, setCurrentStudent] = useState(getCurrentStudent());
  const [starsCount, setStarsCount] = useState(getStudentStars());

  // 학생 변경 핸들러
  const handleStudentChanged = (student) => {
    setCurrentStudent(student);
    setStarsCount(getStudentStars());
  };

  // 별 점수 획득 함수 (학생별 누적)
  const handleEarnStar = () => {
    setStarsCount((prev) => {
      const next = prev + 1;
      setStudentStars(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/20 to-amber-100/40 flex flex-col justify-between">
      <div>
        {/* 상단 헤더 메뉴 (20일 커리큘럼 중심 & 학생 프로필 노출) */}
        <Header 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          starsCount={starsCount}
          currentStudent={currentStudent}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenStudentManager={() => setIsStudentManagerOpen(true)}
        />

        {/* 메인 학습 콘텐츠 영역 */}
        <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {currentTab === 'daily20' && (
            <DailyProgram 
              onEarnStar={handleEarnStar} 
              onOpenReport={() => setIsReportOpen(true)} 
              onOpenStudentManager={() => setIsStudentManagerOpen(true)}
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

      {/* 학생 등록 및 캐릭터 관리 모달 */}
      <StudentManagerModal
        isOpen={isStudentManagerOpen}
        onClose={() => setIsStudentManagerOpen(false)}
        onStudentChanged={handleStudentChanged}
      />

      {/* 학부모 20일 배움 성장 리포트 모달 */}
      {isReportOpen && (
        <ParentReportModal 
          onClose={() => setIsReportOpen(false)} 
        />
      )}

      {/* 하단 푸터 */}
      <footer className="bg-white/80 border-t border-amber-200 py-6 text-center text-sm text-slate-500 mt-12 print:hidden">
        <div className="flex items-center justify-center gap-1.5 font-black text-amber-900 mb-1 text-xs sm:text-sm">
          <Smile className="w-4 h-4 text-amber-600" />
          <span>매일매일 30분씩! 스스로 책을 읽는 기적의 20일 한글 배움터</span>
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
        </div>
        <p className="text-[11px] text-slate-400 font-bold">
          초등학교 1학년 한글 해득 공식 커리큘럼 • 학교-가정 안심 연계 시스템
        </p>
      </footer>
    </div>
  );
}
