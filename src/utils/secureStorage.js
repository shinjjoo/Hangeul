/**
 * [보안 암호화 및 학습 데이터 누적 저장 유틸리티]
 * 프로젝트 보안 규칙(RULE 8)에 따라 학생의 개인정보(이름, 학급 등)와
 * 20일 데일리 학습 진도, 일일 평가 결과를 브라우저 로컬 저장소에
 * 안전하게 암호화하여 보관하고, 학습 취약점을 자동으로 분석해주는 모듈입니다.
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
  DAILY_PROGRESS_20: 'secure_daily_progress_20', // 20일 데일리 학습 진도
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
 * [20일 프로그램] 특정 일차(Day 1~20) 학습 및 일일 평가 완료 기록 저장
 */
export const saveDayCompletion = (dayNumber, score, totalQuestions = 3) => {
  try {
    const progress = getDailyProgress();
    const percentage = Math.round((score / totalQuestions) * 100);
    
    progress.days[dayNumber] = {
      completed: true,
      score,
      total: totalQuestions,
      percentage,
      date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    // 최신 학습 일차 갱신
    progress.lastCompletedDay = Math.max(progress.lastCompletedDay || 0, dayNumber);
    progress.currentActiveDay = Math.min(20, Math.max(...Object.keys(progress.days).map(Number)) + 1);

    const encrypted = encryptData(JSON.stringify(progress));
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS_20, encrypted);
    return progress;
  } catch (e) {
    console.error('일일 진도 저장 실패:', e);
    return null;
  }
};

/**
 * [20일 프로그램] 전체 20일 진도 현황 불러오기
 */
export const getDailyProgress = () => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS_20);
    if (!encrypted) {
      return {
        days: {}, // { 1: { completed: true, score: 3, total: 3, percentage: 100, date: '...' } }
        lastCompletedDay: 0,
        currentActiveDay: 1,
      };
    }
    const decrypted = decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (e) {
    return {
      days: {},
      lastCompletedDay: 0,
      currentActiveDay: 1,
    };
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
 * [취약점 및 20일 종합 분석 엔진]
 * 오답 이력과 20일 진도를 종합 분석하여 학부모 통지표용 피드백을 도출합니다.
 */
export const analyzeWeakAreas = () => {
  const history = getAssessmentHistory();
  const dailyProgress = getDailyProgress();
  const completedDaysCount = Object.keys(dailyProgress.days).length;

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
  let avgScore = 0;
  if (history.length > 0) {
    avgScore = Math.round(
      history.reduce((acc, cur) => acc + cur.percentage, 0) / history.length
    );
  } else if (completedDaysCount > 0) {
    const dayScores = Object.values(dailyProgress.days).map(d => d.percentage);
    avgScore = Math.round(dayScores.reduce((a, b) => a + b, 0) / dayScores.length);
  }

  let advice = '';
  let recommendedStep = '';

  if (completedDaysCount >= 15) {
    advice = '받침 있는 글자까지 훌륭하게 마스터하고 있습니다! 이제 짧은 동화책을 함께 소리 내어 읽어주세요.';
    recommendedStep = '4주차 (문장 읽기 및 종합 완성)';
  } else if (completedDaysCount >= 10) {
    advice = '받침 없는 글자를 완벽히 정복하고 대표 받침(ㅇ, ㄱ, ㄴ, ㄹ, ㅁ) 단계에 진입했습니다! 생활 속에서 받침 글자를 발견할 때마다 칭찬해 주세요.';
    recommendedStep = '3주차 (대표 받침의 원리)';
  } else if (completedDaysCount >= 5) {
    advice = '기본 자음과 모음 소리를 익히고 글자 합체를 시작했습니다. 자음과 모음이 만나 글자가 되는 과정을 함께 격려해 주세요.';
    recommendedStep = '2주차 (자음과 모음 결합 낱말)';
  } else {
    advice = '한글의 첫걸음을 씩씩하게 시작했습니다! 글자의 모양보다 입모양과 소리를 먼저 귀로 듣는 놀이를 권장합니다.';
    recommendedStep = '1주차 (기본 모음과 자음 소리 탐험)';
  }

  return {
    weakLetters: sortedWeak,
    averageScore: avgScore,
    totalTests: history.length + completedDaysCount,
    completedDaysCount,
    progressPercentage: Math.round((completedDaysCount / 20) * 100),
    advice,
    recommendedStep
  };
};
