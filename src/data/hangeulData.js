/**
 * [초등 1학년 맞춤 한글 기초 데이터]
 * 자음, 모음의 이름, 대표 단어, 친근한 이모지 및 시각적 색상 테마를 정의합니다.
 */

// 1. 기본 자음 14자 데이터
export const CONSONANTS = [
  { char: 'ㄱ', name: '기역', sound: '그', word: '가방', emoji: '🎒', color: 'bg-rose-100 border-rose-300 text-rose-700' },
  { char: 'ㄴ', name: '니은', sound: '느', word: '나비', emoji: '🦋', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { char: 'ㄷ', name: '디귿', sound: '드', word: '다람쥐', emoji: '🐿️', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  { char: 'ㄹ', name: '리을', sound: '르', word: '라디오', emoji: '📻', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { char: 'ㅁ', name: '미음', sound: '므', word: '모자', emoji: '🧢', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  { char: 'ㅂ', name: '비읍', sound: '브', word: '바나나', emoji: '🍌', color: 'bg-teal-100 border-teal-300 text-teal-700' },
  { char: 'ㅅ', name: '시옷', sound: '스', word: '사자', emoji: '🦁', color: 'bg-cyan-100 border-cyan-300 text-cyan-700' },
  { char: 'ㅇ', name: '이응', sound: '으', word: '오리', emoji: '🦆', color: 'bg-sky-100 border-sky-300 text-sky-700' },
  { char: 'ㅈ', name: '지읒', sound: '즈', word: '자동차', emoji: '🚗', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { char: 'ㅊ', name: '치읓', sound: '츠', word: '치즈', emoji: '🧀', color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
  { char: 'ㅋ', name: '키읔', sound: '크', word: '코끼리', emoji: '🐘', color: 'bg-violet-100 border-violet-300 text-violet-700' },
  { char: 'ㅌ', name: '티읕', sound: '트', word: '토끼', emoji: '🐰', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { char: 'ㅍ', name: '피읖', sound: '프', word: '포도', emoji: '🍇', color: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700' },
  { char: 'ㅎ', name: '히읗', sound: '흐', word: '호랑이', emoji: '🐯', color: 'bg-pink-100 border-pink-300 text-pink-700' },
];

// 2. 기본 모음 10자 데이터
export const VOWELS = [
  { char: 'ㅏ', name: '아', sound: '아', word: '아기', emoji: '👶', color: 'bg-red-50 border-red-200 text-red-600' },
  { char: 'ㅑ', name: '야', sound: '야', word: '야구', emoji: '⚾', color: 'bg-orange-50 border-orange-200 text-orange-600' },
  { char: 'ㅓ', name: '어', sound: '어', word: '어머니', emoji: '👩', color: 'bg-amber-50 border-amber-200 text-amber-600' },
  { char: 'ㅕ', name: '여', sound: '여', word: '여우', emoji: '🦊', color: 'bg-lime-50 border-lime-200 text-lime-600' },
  { char: 'ㅗ', name: '오', sound: '오', word: '오이', emoji: '🥒', color: 'bg-green-50 border-green-200 text-green-600' },
  { char: 'ㅛ', name: '요', sound: '요', word: '요술봉', emoji: '🪄', color: 'bg-teal-50 border-teal-200 text-teal-600' },
  { char: 'ㅜ', name: '우', sound: '우', word: '우산', emoji: '☂️', color: 'bg-cyan-50 border-cyan-200 text-cyan-600' },
  { char: 'ㅠ', name: '유', sound: '유', word: '유리컵', emoji: '🥛', color: 'bg-sky-50 border-sky-200 text-sky-600' },
  { char: 'ㅡ', name: '으', sound: '으', word: '으뜸', emoji: '👍', color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
  { char: 'ㅣ', name: '이', sound: '이', word: '이빨', emoji: '🦷', color: 'bg-purple-50 border-purple-200 text-purple-600' },
];

// 3. 자음과 모음을 결합하는 한글 음절 조합 계산 함수
// 유니코드 공식: (초성인덱스 * 21 * 28) + (중성인덱스 * 28) + 종성인덱스 + 0xAC00
const CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNGSUNG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];

export const combineHangeul = (cho, jung) => {
  const choIndex = CHOSUNG_LIST.indexOf(cho);
  const jungIndex = JUNGSUNG_LIST.indexOf(jung);

  if (choIndex === -1 || jungIndex === -1) return '';

  const unicode = 0xAC00 + (choIndex * 21 * 28) + (jungIndex * 28);
  return String.fromCharCode(unicode);
};
