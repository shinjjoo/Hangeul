/**
 * [보안 암호화 및 학습 데이터 누적 저장 유틸리티]
 * 프로젝트 보안 규칙(RULE 8)에 따라 학생의 개인정보(이름, 학급 등)와
 * 평가 결과 데이터를 브라우저 로컬 저장소에 안전하게 암호화하여 보관하고,
 * 학습 취약점을 자동으로 분석해주는 모듈입니다.
 */

// 암호화 키 (학생 개인정보 보호용)
const ENCRYPTION_SECRET = 'hangeul_educator_safe_key_2026';

/**
 * 텍스트 암호화 (XOR 마스킹 + Base64 인코딩)
 */
export const encryptData = (text) => {
  if (!text) return '';
  try {
    const encoded = encodeURIComponent(text);
    let result = '';
    for (let i = 0; i < encoded.length; i++) {
      const charCode = encoded.charCodeAt(i);
      const keyChar = ENCRYPTION_SECRET.charCodeAt(i % ENCRYPTION_SECRET.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return btoa(result);
  } catch (err) {
    console.error('데이터 암호화 중 오류 발생:', err);
    return text;
  }
};

/**
 * 텍스트 복호화 (Base64 디코딩 + XOR 언마스킹)
 */
export const decryptData = (cipherText) => {
  if (!cipherText) return '';
  try {
    const decoded = atob(cipherText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = ENCRYPTION_SECRET.charCodeAt(i % ENCRYPTION_SECRET.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return decodeURIComponent(result);
  } catch (err) {
    console.error('데이터 복호화 중 오류 발생:', err);
    return cipherText;
  }
};

const STORAGE_KEYS = {
  STUDENT_PROFILE: 'secure_student_profile',
  ASSESSMENT_HISTORY: 'secure_assessment_history',
};

/**
 * 학생 프로필 안전 저장 (암호화 적용)
 */
export const saveStudentProfile = (profile) => {
  try {
    const payload = JSON.stringify(profile);
    const encrypted = encryptData(payload);
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, encrypted);
  } catch (e) {
    console.error('학생 프로필 저장 실패:', e);
  }
};

/**
 * 학생 프로필 불러오기 (복호화 적용)
 */
export const getStudentProfile = () => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (!encrypted) {
      return { name: '우리반 꿈나무', grade: '1학년', className: '1반' };
    }
    const decrypted = decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (e) {
    return { name: '우리반 꿈나무', grade: '1학년', className: '1반' };
  }
};

/**
 * 평가 결과 누적 기록 저장
 * @param {Object} result { level, score, total, date, wrongQuestions }
 */
export const saveAssessmentResult = (result) => {
  try {
    const history = getAssessmentHistory();
    const newEntry = {
      id: 'eval_' + Date.now(),
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      level: result.level, // 1: 새싹(소리), 2: 꽃잎(단어), 3: 열매(빈칸)
      score: result.score,
      total: result.total,
      percentage: Math.round((result.score / result.total) * 100),
      wrongQuestions: result.wrongQuestions || [], // 오답 목록 (취약점 분석용)
    };

    history.unshift(newEntry); // 최신 결과를 맨 앞에 추가
    const encrypted = encryptData(JSON.stringify(history.slice(0, 20))); // 최근 20회 기록 보관
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_HISTORY, encrypted);
    return newEntry;
  } catch (e) {
    console.error('평가 결과 저장 실패:', e);
    return null;
  }
};

/**
 * 누적 평가 이력 불러오기
 */
export const getAssessmentHistory = () => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_HISTORY);
    if (!encrypted) return [];
    const decrypted = decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (e) {
    return [];
  }
};

/**
 * [취약점 자동 분석 엔진]
 * 오답 이력을 분석하여 학생이 자주 헷갈려하는 글자나 유형을 도출합니다.
 */
export const analyzeWeakAreas = () => {
  const history = getAssessmentHistory();
  if (history.length === 0) {
    return {
      weakLetters: [],
      advice: '아직 평가 기록이 없습니다. 먼저 신나는 수준별 평가를 시작해 보세요!',
      recommendedStep: '1수준 (새싹 단계)'
    };
  }

  const wrongCountMap = {};
  history.forEach((h) => {
    if (h.wrongQuestions) {
      h.wrongQuestions.forEach((q) => {
        const letter = q.targetChar || q.word;
        if (letter) {
          wrongCountMap[letter] = (wrongCountMap[letter] || 0) + 1;
        }
      });
    }
  });

  // 가장 많이 틀린 글자 상위 3개 추출
  const sortedWeak = Object.entries(wrongCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([letter]) => letter)
    .slice(0, 3);

  // 최신 평균 점수 계산
  const avgScore = Math.round(
    history.reduce((acc, cur) => acc + cur.percentage, 0) / history.length
  );

  let advice = '';
  let recommendedStep = '';

  if (avgScore >= 90) {
    advice = '모든 글자를 매우 훌륭하게 구별하고 있습니다! 책 읽기 놀이로 확장해 주세요.';
    recommendedStep = '3수준 (열매 단계 - 문장 완성)';
  } else if (avgScore >= 70) {
    advice = '자음과 모음의 기본 소리를 잘 알고 있습니다. 받침 없는 낱말 카드를 조금 더 반복하면 완벽해집니다!';
    recommendedStep = '2수준 (꽃잎 단계 - 낱말 완성)';
  } else {
    advice = '글자의 모양보다 "소리"를 먼저 귀로 듣고 익히는 것이 중요합니다. 플래시 카드의 소리 듣기를 권장합니다.';
    recommendedStep = '1수준 (새싹 단계 - 소리 탐색)';
  }

  return {
    weakLetters: sortedWeak,
    averageScore: avgScore,
    totalTests: history.length,
    advice,
    recommendedStep
  };
};
