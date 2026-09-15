/** @type {import('tailwindcss').Config} */
// Tailwind CSS 스타일 설정 파일입니다.
// 1학년 어린이들이 좋아하는 밝고 귀여운 파스텔 톤 색상 및 폰트 설정을 지원합니다.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hangeul: {
          yellow: '#FFF3B0',
          peach: '#FFD1BA',
          mint: '#D8F3DC',
          sky: '#BEE1E6',
          purple: '#E2ECE9',
          pink: '#FAD2E1',
          coral: '#F78888',
          dark: '#33272A',
        }
      },
      fontFamily: {
        // 한글 폰트(둥근모, 고딕 등)
        sans: ['"Pretendard"', '"Noto Sans KR"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
