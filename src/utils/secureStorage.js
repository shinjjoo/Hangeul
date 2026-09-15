/**
 * [보안 암호화 및 다중 학생 학습 데이터 누적 저장 유틸리티]
 * 프로젝트 보안 규칙(RULE 8)에 따라 학생의 개인정보(이름, 학급, 캐릭터)와
 * 20일 데일리 학습 진도, 일일 평가 점수, 10분 보충학습 이력을
 * 브라우저 로컬 저장소에 안전하게 암호화(XOR+Base64)하여 보관하고,
 * 학생별 맞춤 취약점 분석을 지원하는 통합 스토리지 엔진입니다.
 */

// 암호화 시크릿 키 (학생 개인정보 및 학습 이력 보호용)
const ENCRYPTION_SECRET = 'hangeul_educator_safe_key_2026_v2';

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

// 스토리지 저장 키 상수
const STORAGE_KEYS = {
  STUDENTS_LIST: 'secure_students_list_v2', // 학생 목록
  CURRENT_STUDENT_ID: 'secure_current_student_id_v2', // 현재 선택된 학생 ID
  STUDENT_DATA_PREFIX: 'secure_student_data_', // 각 학생별 데이터 접두사
};

// 기본 학생 초기 데이터 (초기 로딩 시 생성)
const DEFAULT_STUDENT = {
  id: 'student_default',
  name: '김새싹',
  gradeClass: '1학년 1반',
  avatar: '🐯', // 귀여운 호랑이 호치
  characterName: '호치',
  createdAt: new Date().toISOString(),
};

/**
 * 등록된 전체 학생 목록 불러오기 (암호화 복호화)
 */
export const getStudentsList = () => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.STUDENTS_LIST);
    if (!encrypted) {
      // 최초 실행 시 기본 학생 자동 등록
      const initialList = [DEFAULT_STUDENT];
      saveStudentsList(initialList);
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, DEFAULT_STUDENT.id);
      return initialList;
    }
    const decrypted = decryptData(encrypted);
    const list = JSON.parse(decrypted);
    return Array.isArray(list) && list.length > 0 ? list : [DEFAULT_STUDENT];
  } catch (e) {
    console.error('학생 목록 로드 실패:', e);
    return [DEFAULT_STUDENT];
  }
};

/**
 * 학생 목록 안전 저장 (암호화)
 */
export const saveStudentsList = (list) => {
  try {
    const encrypted = encryptData(JSON.stringify(list));
    localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, encrypted);
  } catch (e) {
    console.error('학생 목록 저장 실패:', e);
  }
};

/**
 * 현재 활성화된 학생 ID 가져오기
 */
export const getCurrentStudentId = () => {
  const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
  if (currentId) return currentId;
  const list = getStudentsList();
  const firstId = list[0]?.id || DEFAULT_STUDENT.id;
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, firstId);
  return firstId;
};

/**
 * 현재 활성화된 학생 객체 가져오기
 */
export const getCurrentStudent = () => {
  const list = getStudentsList();
  const currentId = getCurrentStudentId();
  return list.find((s) => s.id === currentId) || list[0] || DEFAULT_STUDENT;
};

/**
 * 현재 활성화 학생 변경
 */
export const setCurrentStudentId = (id) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, id);
};

/**
 * 신규 학생 등록
 */
export const addStudent = ({ name, gradeClass, avatar, characterName }) => {
  try {
    const list = getStudentsList();
    const newStudent = {
      id: 'student_' + Date.now(),
      name: name.trim() || '꿈나무',
      gradeClass: gradeClass.trim() || '1학년 1반',
      avatar: avatar || '🐯',
      characterName: characterName || '호치',
      createdAt: new Date().toISOString(),
    };
    const updated = [...list, newStudent];
    saveStudentsList(updated);
    setCurrentStudentId(newStudent.id);
    return newStudent;
  } catch (e) {
    console.error('신규 학생 등록 실패:', e);
    return null;
  }
};

/**
 * 학생 삭제
 */
export const deleteStudent = (id) => {
  try {
    let list = getStudentsList();
    if (list.length <= 1) {
      alert('최소 한 명의 학생은 유지되어야 합니다.');
      return list;
    }
    list = list.filter((s) => s.id !== id);
    saveStudentsList(list);
    // 해당 학생의 데이터도 삭제
    localStorage.removeItem(STORAGE_KEYS.STUDENT_DATA_PREFIX + id);
    if (getCurrentStudentId() === id) {
      setCurrentStudentId(list[0].id);
    }
    return list;
  } catch (e) {
    console.error('학생 삭제 실패:', e);
    return getStudentsList();
  }
};

/**
 * 특정 학생의 전체 학습 데이터 객체 불러오기
 */
const getStudentStorageData = (studentId) => {
  try {
    const sid = studentId || getCurrentStudentId();
    const key = STORAGE_KEYS.STUDENT_DATA_PREFIX + sid;
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
      return {
        dailyProgress: {
          days: {}, // { 1: { completed: true, passed: true, score: 3, total: 3, percentage: 100, remedialCompleted: false, date: '...' } }
          lastCompletedDay: 0,
          currentActiveDay: 1,
        },
        assessmentHistory: [],
        starsCount: 5,
      };
    }
    return JSON.parse(decryptData(encrypted));
  } catch (e) {
    return {
      dailyProgress: { days: {}, lastCompletedDay: 0, currentActiveDay: 1 },
      assessmentHistory: [],
      starsCount: 5,
    };
  }
};

/**
 * 특정 학생의 전체 학습 데이터 객체 저장하기
 */
const saveStudentStorageData = (data, studentId) => {
  try {
    const sid = studentId || getCurrentStudentId();
    const key = STORAGE_KEYS.STUDENT_DATA_PREFIX + sid;
    const encrypted = encryptData(JSON.stringify(data));
    localStorage.setItem(key, encrypted);
  } catch (e) {
    console.error('학생 데이터 저장 실패:', e);
  }
};

/**
 * [현재 학생] 20일 진도 현황 불러오기
 */
export const getDailyProgress = () => {
  const data = getStudentStorageData();
  return (
    data.dailyProgress || {
      days: {},
      lastCompletedDay: 0,
      currentActiveDay: 1,
    }
  );
};

/**
 * [현재 학생] 특정 일차(Day 1~20) 학습 및 일일 평가 완료 기록 저장
 * @param {number} dayNumber 학습 일차 (1~20)
 * @param {number} score 퀴즈 맞힌 개수
 * @param {number} totalQuestions 총 문항 수
 * @param {boolean} passed 학습 목표 도달 여부 (70% 이상 또는 보충 완료)
 * @param {boolean} isRemedial 10분 보충학습 완료 여부
 */
export const saveDayCompletion = (dayNumber, score, totalQuestions = 3, passed = true, isRemedial = false) => {
  try {
    const data = getStudentStorageData();
    const progress = data.dailyProgress || { days: {}, lastCompletedDay: 0, currentActiveDay: 1 };
    const percentage = Math.round((score / totalQuestions) * 100);

    const existingDay = progress.days[dayNumber] || {};

    progress.days[dayNumber] = {
      ...existingDay,
      completed: true,
      score,
      total: totalQuestions,
      percentage,
      passed: passed || existingDay.passed, // 한 번이라도 통과하면 통과 상태 유지
      remedialCompleted: isRemedial || existingDay.remedialCompleted || false,
      date: new Date().toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // 목표에 도달했거나(passed) 보충학습을 완료한 경우 다음 일차를 해금!
    if (passed || isRemedial) {
      progress.lastCompletedDay = Math.max(progress.lastCompletedDay || 0, dayNumber);
      progress.currentActiveDay = Math.min(20, Math.max(progress.currentActiveDay, dayNumber + 1));
    }

    data.dailyProgress = progress;
    saveStudentStorageData(data);
    return progress;
  } catch (e) {
    console.error('일일 진도 저장 실패:', e);
    return null;
  }
};

/**
 * [현재 학생] 일일 10분 보충학습 완료 처리
 */
export const saveRemedialCompletion = (dayNumber) => {
  return saveDayCompletion(dayNumber, 3, 3, true, true);
};

/**
 * [현재 학생] 평가 결과 누적 기록 저장
 */
export const saveAssessmentResult = (result) => {
  try {
    const data = getStudentStorageData();
    const history = data.assessmentHistory || [];

    const newEntry = {
      id: 'eval_' + Date.now(),
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      level: result.level,
      score: result.score,
      total: result.total,
      percentage: Math.round((result.score / result.total) * 100),
      wrongQuestions: result.wrongQuestions || [],
    };

    history.unshift(newEntry);
    data.assessmentHistory = history.slice(0, 30); // 최근 30회 보관
    saveStudentStorageData(data);
    return newEntry;
  } catch (e) {
    console.error('평가 결과 저장 실패:', e);
    return null;
  }
};

/**
 * [현재 학생] 누적 평가 이력 불러오기
 */
export const getAssessmentHistory = () => {
  const data = getStudentStorageData();
  return data.assessmentHistory || [];
};

/**
 * [현재 학생] 별 점수 가져오기
 */
export const getStudentStars = () => {
  const data = getStudentStorageData();
  return typeof data.starsCount === 'number' ? data.starsCount : 5;
};

/**
 * [현재 학생] 별 점수 저장하기
 */
export const setStudentStars = (count) => {
  const data = getStudentStorageData();
  data.starsCount = count;
  saveStudentStorageData(data);
};

/**
 * [현재 학생] 취약점 및 20일 종합 분석 엔진
 */
export const analyzeWeakAreas = () => {
  const currentStudent = getCurrentStudent();
  const history = getAssessmentHistory();
  const dailyProgress = getDailyProgress();
  const completedDaysCount = Object.keys(dailyProgress.days).length;
  const passedDaysCount = Object.values(dailyProgress.days).filter((d) => d.passed).length;
  const remedialDaysCount = Object.values(dailyProgress.days).filter((d) => d.remedialCompleted).length;

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

  // 평균 점수 계산
  let avgScore = 0;
  if (completedDaysCount > 0) {
    const dayScores = Object.values(dailyProgress.days).map((d) => d.percentage);
    avgScore = Math.round(dayScores.reduce((a, b) => a + b, 0) / dayScores.length);
  } else if (history.length > 0) {
    avgScore = Math.round(history.reduce((acc, cur) => acc + cur.percentage, 0) / history.length);
  }

  let advice = '';
  let recommendedStep = '';

  if (passedDaysCount >= 16) {
    advice = '받침 글자와 문장 읽기까지 훌륭하게 해내고 있습니다! 생활 속 동화책을 함께 소리 내어 읽으며 문장 이해력을 확장해 주세요.';
    recommendedStep = '4주차 (문장 완성 및 한글 독립 졸업)';
  } else if (passedDaysCount >= 11) {
    advice = '대표 받침(ㅇ, ㄱ, ㄴ, ㄹ, ㅁ, ㅂ, ㅅ)의 소리값을 깨우쳤습니다! 받침이 있는 간판이나 낱말을 찾아보는 놀이를 함께해 주시면 큰 도움이 됩니다.';
    recommendedStep = '3주차 (대표 받침 7종 마스터)';
  } else if (passedDaysCount >= 6) {
    advice = '자음과 모음이 만나 글자가 되는 원리를 탄탄히 익히고 있습니다. 받침 없는 낱말을 소리 내어 또박또박 읽는 자신감을 북돋워 주세요.';
    recommendedStep = '2주차 (자모 결합 및 받침 없는 낱말)';
  } else {
    advice = '한글의 첫걸음을 씩씩하게 시작했습니다! 입모양을 크고 정확하게 움직이며 소리를 귀로 듣는 즐거움을 충분히 느끼게 해주세요.';
    recommendedStep = '1주차 (기본 모음과 첫소리 자음)';
  }

  return {
    studentName: currentStudent.name,
    gradeClass: currentStudent.gradeClass,
    avatar: currentStudent.avatar,
    characterName: currentStudent.characterName,
    weakLetters: sortedWeak,
    averageScore: avgScore,
    totalCompletedDays: completedDaysCount,
    passedDaysCount,
    remedialDaysCount,
    progressPercentage: Math.round((passedDaysCount / 20) * 100),
    advice,
    recommendedStep,
  };
};

/**
 * 하위 호환용 헬퍼 함수
 */
export const getStudentProfile = () => {
  const s = getCurrentStudent();
  return { name: s.name, grade: s.gradeClass, className: '' };
};

export const saveStudentProfile = (profile) => {
  const s = getCurrentStudent();
  s.name = profile.name || s.name;
  s.gradeClass = profile.grade || s.gradeClass;
  const list = getStudentsList().map((item) => (item.id === s.id ? s : item));
  saveStudentsList(list);
};
