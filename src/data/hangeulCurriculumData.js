/**
 * [초등 1학년 교육과정 맞춤 한글 데이터베이스]
 * 언어 데이터 큐레이터(Content Curator) 에이전트가 구축한
 * 1학년 필수 어휘, 퀴즈 문제 세트 및 발음 가이드 데이터입니다.
 */

// 1. 초등 1학년 필수 생활 어휘 및 그림(이모지) 데이터베이스
export const HANGEUL_VOCAB_LIST = [
  // 🎒 학교와 교실
  { id: 'v1', word: '가방', firstChar: 'ㄱ', cho: 'ㄱ', jung: 'ㅏ', emoji: '🎒', category: '학교', hint: '책과 공책을 넣어요' },
  { id: 'v2', word: '가위', firstChar: 'ㄱ', cho: 'ㄱ', jung: 'ㅏ', emoji: '✂️', category: '학교', hint: '종이를 싹둑 잘라요' },
  { id: 'v3', word: '공책', firstChar: 'ㄱ', cho: 'ㄱ', jung: 'ㅗ', emoji: '📓', category: '학교', hint: '연필로 글씨를 써요' },
  { id: 'v4', word: '연필', firstChar: 'ㅇ', cho: 'ㅇ', jung: 'ㅕ', emoji: '✏️', category: '학교', hint: '글씨를 바르게 써요' },
  { id: 'v5', word: '지우개', firstChar: 'ㅈ', cho: 'ㅈ', jung: 'ㅣ', emoji: '🧼', category: '학교', hint: '틀린 글씨를 지워요' },

  // 🐶 친근한 동물 친구들
  { id: 'v6', word: '나비', firstChar: 'ㄴ', cho: 'ㄴ', jung: 'ㅏ', emoji: '🦋', category: '동물', hint: '꽃밭을 팔랑팔랑 날아요' },
  { id: 'v7', word: '다람쥐', firstChar: 'ㄷ', cho: 'ㄷ', jung: 'ㅏ', emoji: '🐿️', category: '동물', hint: '도토리를 볼에 쏙 넣어요' },
  { id: 'v8', word: '사자', firstChar: 'ㅅ', cho: 'ㅅ', jung: 'ㅏ', emoji: '🦁', category: '동물', hint: '멋진 갈기를 가진 동물의 왕' },
  { id: 'v9', word: '오리', firstChar: 'ㅇ', cho: 'ㅇ', jung: 'ㅗ', emoji: '🦆', category: '동물', hint: '꽥꽥 물 위를 헤엄쳐요' },
  { id: 'v10', word: '호랑이', firstChar: 'ㅎ', cho: 'ㅎ', jung: 'ㅗ', emoji: '🐯', category: '동물', hint: '어흥! 줄무늬가 멋져요' },
  { id: 'v11', word: '토끼', firstChar: 'ㅌ', cho: 'ㅌ', jung: 'ㅗ', emoji: '🐰', category: '동물', hint: '귀가 쫑긋 깡충깡충 뛰어요' },
  { id: 'v12', word: '코끼리', firstChar: 'ㅋ', cho: 'ㅋ', jung: 'ㅗ', emoji: '🐘', category: '동물', hint: '코가 손처럼 길어요' },

  // 🍎 맛있는 음식과 과일
  { id: 'v13', word: '사과', firstChar: 'ㅅ', cho: 'ㅅ', jung: 'ㅏ', emoji: '🍎', category: '음식', hint: '빨갛고 아삭아삭 달콤해요' },
  { id: 'v14', word: '바나나', firstChar: 'ㅂ', cho: 'ㅂ', jung: 'ㅏ', emoji: '🍌', category: '음식', hint: '노랗고 달콤한 원숭이가 좋아하는 과일' },
  { id: 'v15', word: '포도', firstChar: 'ㅍ', cho: 'ㅍ', jung: 'ㅗ', emoji: '🍇', category: '음식', hint: '보랏빛 알맹이가 주렁주렁' },
  { id: 'v16', word: '우유', firstChar: 'ㅇ', cho: 'ㅇ', jung: 'ㅜ', emoji: '🥛', category: '음식', hint: '키가 쑥쑥 자라는 하얀 음료' },
  { id: 'v17', word: '치즈', firstChar: 'ㅊ', cho: 'ㅊ', jung: 'ㅣ', emoji: '🧀', category: '음식', hint: '고소하고 쫀득쫀득 노란 치즈' },
];

// 2. 1학년 맞춤형 [그림 보고 첫 글자 맞추기] 퀴즈 문제 세트
export const HANGEUL_QUIZ_QUESTIONS = [
  {
    id: 1,
    targetWord: '나비',
    emoji: '🦋',
    questionText: '팔랑팔랑 나비의 첫 글자는 무엇일까요?',
    correctChar: '나',
    soundHint: '나! 나비의 첫 글자 나!',
    options: ['나', '다', '가', '마']
  },
  {
    id: 2,
    targetWord: '사자',
    emoji: '🦁',
    questionText: '멋진 사자의 첫 글자를 찾아보세요!',
    correctChar: '사',
    soundHint: '사! 사자의 첫 글자 사!',
    options: ['바', '사', '자', '차']
  },
  {
    id: 3,
    targetWord: '바나나',
    emoji: '🍌',
    questionText: '달콤한 바나나의 첫 글자는 무엇일까요?',
    correctChar: '바',
    soundHint: '바! 바나나의 첫 글자 바!',
    options: ['마', '라', '바', '가']
  },
  {
    id: 4,
    targetWord: '호랑이',
    emoji: '🐯',
    questionText: '어흥! 호랑이의 첫 글자를 골라보아요!',
    correctChar: '호',
    soundHint: '호! 호랑이의 첫 글자 호!',
    options: ['코', '토', '포', '호']
  },
  {
    id: 5,
    targetWord: '가방',
    emoji: '🎒',
    questionText: '학교 갈 때 메는 가방의 첫 글자는?',
    correctChar: '가',
    soundHint: '가! 가방의 첫 글자 가!',
    options: ['가', '나', '다', '라']
  }
];

// 3. 칭찬 스티커 데이터
export const STICKER_REWARDS = [
  { id: 's1', name: '한글 새싹', emoji: '🌱', desc: '첫 한글 공부를 시작했어요!' },
  { id: 's2', name: '소리 박사', emoji: '📢', desc: '자음과 모음 소리를 모두 들었어요!' },
  { id: 's3', name: '글자 마법사', emoji: '🪄', desc: '자음과 모음을 합체시켰어요!' },
  { id: 's4', name: '글씨 쓰기 왕', emoji: '👑', desc: '바른 손으로 글씨를 따라 썼어요!' },
  { id: 's5', name: '퀴즈 대장', emoji: '🏆', desc: '첫 글자 맞추기 퀴즈를 모두 풀었어요!' }
];
