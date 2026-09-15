import React, { useState } from 'react';
import { 
  getStudentsList, getCurrentStudentId, setCurrentStudentId, 
  addStudent, deleteStudent, getDailyProgress 
} from '../utils/secureStorage';
import { playHangeulSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import { 
  UserCheck, UserPlus, Trash2, X, Sparkles, Star, Award, Heart, Check 
} from 'lucide-react';

/**
 * [아동 친화형 학생 관리 및 캐릭터 선택 모달]
 * 1학년 학생들이 좋아하는 귀여운 동물 친구 캐릭터를 선택하고,
 * 학생을 손쉽게 등록 및 전환하여 개별 진도와 평가를 관리하는 컴포넌트입니다.
 */
export default function StudentManagerModal({ isOpen, onClose, onStudentChanged }) {
  const [students, setStudents] = useState(getStudentsList());
  const [activeId, setActiveId] = useState(getCurrentStudentId());
  const [isAdding, setIsAdding] = useState(false);

  // 신규 등록 폼 상태
  const [newName, setNewName] = useState('');
  const [newGradeClass, setNewGradeClass] = useState('1학년 1반');
  const [selectedAvatar, setSelectedAvatar] = useState('🐯');
  const [selectedCharName, setSelectedCharName] = useState('호치');

  if (!isOpen) return null;

  // 1학년 아이들이 좋아하는 귀여운 동물 캐릭터 목록
  const AVATAR_CHARACTERS = [
    { emoji: '🐯', name: '호치', desc: '용감하고 씩씩한 아기 호랑이', bg: 'bg-amber-100 border-amber-300' },
    { emoji: '🐰', name: '토순이', desc: '귀를 쫑긋 세운 영리한 토끼', bg: 'bg-pink-100 border-pink-300' },
    { emoji: '🐼', name: '판다몽', desc: '뒹굴뒹굴 공부 좋아하는 판다', bg: 'bg-emerald-100 border-emerald-300' },
    { emoji: '🐻', name: '곰곰이', desc: '다정하고 든든한 꿀벌 친구', bg: 'bg-orange-100 border-orange-300' },
    { emoji: '🐥', name: '삐약이', desc: '노란 깃털의 귀여운 병아리', bg: 'bg-yellow-100 border-yellow-300' },
    { emoji: '🐶', name: '댕댕이', desc: '꼬리를 살랑살랑 흔드는 강아지', bg: 'bg-indigo-100 border-indigo-300' },
  ];

  // 학생 선택 전환
  const handleSelectStudent = (student) => {
    setCurrentStudentId(student.id);
    setActiveId(student.id);
    playHangeulSound(`${student.name} 친구, 오늘도 신나게 한글을 배워보자!`);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    if (onStudentChanged) onStudentChanged(student);
    onClose();
  };

  // 신규 학생 등록 처리
  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('학생의 이름을 입력해 주세요!');
      return;
    }

    const created = addStudent({
      name: newName,
      gradeClass: newGradeClass,
      avatar: selectedAvatar,
      characterName: selectedCharName,
    });

    if (created) {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
      playHangeulSound(`환영해, ${created.name}! ${created.characterName}와 함께 20일 한글 여행을 떠나보자!`);
      setStudents(getStudentsList());
      setActiveId(created.id);
      setIsAdding(false);
      setNewName('');
      if (onStudentChanged) onStudentChanged(created);
    }
  };

  // 학생 삭제
  const handleDeleteStudent = (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`정말로 '${name}' 학생의 학습 기록을 삭제할까요?`)) {
      const updated = deleteStudent(id);
      setStudents(updated);
      setActiveId(getCurrentStudentId());
      if (onStudentChanged) onStudentChanged(getStudentsList()[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 타이틀 배너 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-3xl shadow-md mb-2">
            🎒
          </div>
          <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
            <span>우리반 한글 꿈나무 친구들</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            오늘 20일 한글 여행을 함께할 주인공을 선택해 주세요!
          </p>
        </div>

        {/* 신규 등록 폼 토글 버튼 */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mb-6 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98"
          >
            <UserPlus className="w-5 h-5" />
            <span>새로운 친구 등록하기 ✨</span>
          </button>
        ) : (
          /* 신규 학생 등록 카드 */
          <form onSubmit={handleCreateStudent} className="mb-6 p-5 bg-amber-50/70 border-2 border-amber-300 rounded-3xl shadow-inner space-y-4 animate-jelly">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-amber-900 flex items-center gap-1.5">
                <span>새 친구 등록하기</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-bold"
              >
                취소하기
              </button>
            </div>

            {/* 캐릭터 선택 */}
            <div>
              <label className="block text-xs font-black text-slate-600 mb-2">
                나를 응원해 줄 단짝 동물 친구를 골라보아요!
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATAR_CHARACTERS.map((char) => {
                  const isSelected = selectedAvatar === char.emoji;
                  return (
                    <button
                      key={char.name}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(char.emoji);
                        setSelectedCharName(char.name);
                        playHangeulSound(`안녕! 나는 ${char.name}야!`);
                      }}
                      className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${
                        isSelected
                          ? 'bg-amber-400 border-amber-600 scale-105 shadow-md ring-2 ring-amber-300'
                          : 'bg-white border-slate-200 hover:bg-amber-100/50'
                      }`}
                    >
                      <span className="text-2xl">{char.emoji}</span>
                      <span className="text-[11px] font-black text-slate-800">{char.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 학생 이름 & 학급 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-600 mb-1">학생 이름</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 김민준, 이서아"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-bold text-sm bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-600 mb-1">학년 / 학급</label>
                <input
                  type="text"
                  value={newGradeClass}
                  onChange={(e) => setNewGradeClass(e.target.value)}
                  placeholder="예: 1학년 2반"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-bold text-sm bg-white"
                />
              </div>
            </div>

            {/* 등록 완료 버튼 */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>등록 완료하고 한글 여행 시작하기!</span>
            </button>
          </form>
        )}

        {/* 등록된 학생 목록 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 px-1">
            <span>등록된 학생 목록 ({students.length}명)</span>
            <span>클릭하여 주인공 바꾸기</span>
          </div>

          <div className="space-y-2.5">
            {students.map((student) => {
              const isCurrent = student.id === activeId;
              return (
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-400 shadow-md ring-2 ring-amber-300 scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 shadow-inner flex items-center justify-center text-3xl">
                      {student.avatar || '🐯'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-slate-900">{student.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black">
                            현재 학습 중
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{student.gradeClass || '1학년'}</span>
                        <span>•</span>
                        <span className="text-amber-700 font-black">
                          단짝: {student.characterName || '호치'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {students.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteStudent(e, student.id, student.name)}
                        className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="학생 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-200'
                      }`}
                    >
                      {isCurrent ? '선택됨' : '선택하기'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 닫기 버튼 하단 */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm transition-colors"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
