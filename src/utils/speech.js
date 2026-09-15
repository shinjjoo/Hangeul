/**
 * [한글 음성 합성 유틸리티]
 * 초등학교 1학년 어린이들을 위해 브라우저의 기본 음성(TTS)을 활용하여
 * 또박또박 천천히 친절한 목소리로 한글 글자와 단어를 읽어주는 함수입니다.
 */

export const playHangeulSound = (text, rate = 0.85) => {
  // 브라우저가 음성 합성을 지원하는지 확인합니다.
  if (!('speechSynthesis' in window)) {
    console.warn('이 브라우저는 음성 재생 기능을 지원하지 않습니다.');
    return;
  }

  // 이전에 재생 중이던 음성이 있다면 멈추고 새로운 음성을 준비합니다.
  window.speechSynthesis.cancel();

  // 읽을 텍스트 객체를 생성합니다.
  const utterance = new SpeechSynthesisUtterance(text);

  // 한국어(ko-KR)로 설정합니다.
  utterance.lang = 'ko-KR';

  // 1학년 학생들이 알아듣기 쉽도록 말하기 속도를 살짝 천천히(0.85배속) 조절합니다.
  utterance.rate = rate;

  // 목소리 톤을 약간 밝고 다정하게(1.1) 설정합니다.
  utterance.pitch = 1.1;

  // 음성을 재생합니다.
  window.speechSynthesis.speak(utterance);
};
