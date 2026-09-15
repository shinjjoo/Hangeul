import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 설정 파일: 빠른 개발 서버와 React 플러그인을 활성화합니다.
// GitHub Pages 등 온라인 웹 호스팅 배포를 위해 상대 경로(base: './')를 기본으로 설정합니다.
export default defineConfig({
  plugins: [react()],
  base: './', // 온라인 배포 시 에셋(CSS, JS) 경로가 깨지지 않도록 상대 경로 적용
  server: {
    port: 3000, // 로컬 개발 서버 포트 번호 (http://localhost:3000)
    open: true  // 서버 실행 시 자동으로 웹 브라우저를 엽니다.
  }
});
