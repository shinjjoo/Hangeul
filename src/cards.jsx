import React from 'react';
import ReactDOM from 'react-dom/client';
import DedicatedCardsApp from './DedicatedCardsApp';
import './index.css';

/**
 * [최재우 학생 전용 모바일 낱말카드 독립 진입점]
 * cards.html에 마운트되어 단독으로 실행되는 React 엔트리포인트입니다.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DedicatedCardsApp />
  </React.StrictMode>
);
