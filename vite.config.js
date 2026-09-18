import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * [Vite 설정 파일 - 다중 페이지(MPA) 빌드 지원]
 * 1. index.html: 전체 20일 완성 한글 배움터 메인 앱
 * 2. cards.html: 최재우 학생 전용 모바일 낱말카드 독립 앱
 * 온라인 웹 호스팅(GitHub Pages) 배포 시 상대 경로(base: './')로 모든 정적 파일이 안전하게 로드됩니다.
 */
export default defineConfig({
  plugins: [react()],
  base: './', // 상대 경로 에셋 로딩 적용
  server: {
    port: 3000, // 로컬 개발 서버 포트 번호
    open: true  // 서버 실행 시 브라우저 자동 오픈
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cards: resolve(__dirname, 'cards.html'),
      },
    },
  },
});
