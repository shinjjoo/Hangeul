const fs = require('fs');

// 118개 받침 없는 단어 전체 사전 정의 (단계별, 주제별, 1학년 눈높이 설명, 음소 분절 포함)
const vocabList = [
  // ==================== [동물 친구들 27선] ====================
  {
    id: "nb1",
    word: "나비",
    stage: 1,
    category: "동물",
    emoji: "🦋",
    hint: "꽃밭을 팔랑팔랑 날아요",
    description: "봄바람을 타고 팔랑팔랑 꽃밭을 날아다니며 달콤한 꿀을 찾는 예쁜 곤충 친구예요.",
    syllables: [
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "비", cho: "ㅂ", jung: "ㅣ", breakdown: "ㅂ + ㅣ" }
    ]
  },
  {
    id: "nb2",
    word: "사자",
    stage: 1,
    category: "동물",
    emoji: "🦁",
    hint: "멋진 갈기를 가진 동물의 왕",
    description: "황금빛 멋진 갈기를 뽐내며 '어흥!' 용감하게 달리는 넓은 초원의 왕이에요.",
    syllables: [
      { char: "사", cho: "ㅅ", jung: "ㅏ", breakdown: "ㅅ + ㅏ" },
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" }
    ]
  },
  {
    id: "nb3",
    word: "오리",
    stage: 1,
    category: "동물",
    emoji: "🦆",
    hint: "꽥꽥 물 위를 헤엄쳐요",
    description: "노란 물갈퀴 발로 물속을 '꽥꽥' 첨벙첨벙 기분 좋게 헤엄치는 동물이에요.",
    syllables: [
      { char: "오", cho: "ㅇ", jung: "ㅗ", breakdown: "ㅇ + ㅗ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb4",
    word: "토끼",
    stage: 2,
    category: "동물",
    emoji: "🐰",
    hint: "귀가 길고 깡충깡충 뛰어요",
    description: "쫑긋쫑긋 긴 귀를 움직이고, 주황색 당근을 아삭아삭 맛있게 먹는 동물이에요.",
    syllables: [
      { char: "토", cho: "ㅌ", jung: "ㅗ", breakdown: "ㅌ + ㅗ" },
      { char: "끼", cho: "ㄲ", jung: "ㅣ", breakdown: "ㄲ + ㅣ" }
    ]
  },
  {
    id: "nb5",
    word: "하마",
    stage: 1,
    category: "동물",
    emoji: "🦛",
    hint: "입이 아주 크고 물을 좋아해요",
    description: "입을 하품하듯 쩌억 크게 벌리고, 시원한 물속에 풍덩 들어가 쉬는 동물이에요.",
    syllables: [
      { char: "하", cho: "ㅎ", jung: "ㅏ", breakdown: "ㅎ + ㅏ" },
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" }
    ]
  },
  {
    id: "nb6",
    word: "너구리",
    stage: 3,
    category: "동물",
    emoji: "🦝",
    hint: "눈 주위가 까맣고 줄무늬 꼬리가 있어요",
    description: "눈가에 까만 안경을 쓴 것처럼 생겼고, 숲속에서 먹이를 손으로 조물조물 씻어 먹어요.",
    syllables: [
      { char: "너", cho: "ㄴ", jung: "ㅓ", breakdown: "ㄴ + ㅓ" },
      { char: "구", cho: "ㄱ", jung: "ㅜ", breakdown: "ㄱ + ㅜ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb7",
    word: "두더지",
    stage: 3,
    category: "동물",
    emoji: "🐾",
    hint: "땅속에서 터널을 파요",
    description: "단단한 앞발로 흙을 쓱쓱 파내어 어두운 땅속에 비밀 터널을 뚫는 동물이에요.",
    syllables: [
      { char: "두", cho: "ㄷ", jung: "ㅜ", breakdown: "ㄷ + ㅜ" },
      { char: "더", cho: "ㄷ", jung: "ㅓ", breakdown: "ㄷ + ㅓ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb8",
    word: "돼지",
    stage: 2,
    category: "동물",
    emoji: "🐷",
    hint: "꿀꿀 소리를 내며 분홍 코가 귀여워요",
    description: "분홍색 둥근 코를 킁킁거리며 '꿀꿀' 노래하고, 꼬리가 돌돌 말려 있는 귀여운 동물이에요.",
    syllables: [
      { char: "돼", cho: "ㄷ", jung: "ㅙ", breakdown: "ㄷ + ㅙ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb9",
    word: "개미",
    stage: 2,
    category: "동물",
    emoji: "🐜",
    hint: "작지만 무거운 짐도 번쩍 들어요",
    description: "몸집은 작아도 자기 몸보다 몇 배나 무거운 과자 부스러기를 줄지어 나르는 부지런한 곤충이에요.",
    syllables: [
      { char: "개", cho: "ㄱ", jung: "ㅐ", breakdown: "ㄱ + ㅐ" },
      { char: "미", cho: "ㅁ", jung: "ㅣ", breakdown: "ㅁ + ㅣ" }
    ]
  },
  {
    id: "nb10",
    word: "매미",
    stage: 2,
    category: "동물",
    emoji: "🪲",
    hint: "여름 나무에서 맴맴 울어요",
    description: "더운 여름날 나무에 딱 붙어서 '맴맴 맴맴' 신나게 여름 노래를 부르는 곤충이에요.",
    syllables: [
      { char: "매", cho: "ㅁ", jung: "ㅐ", breakdown: "ㅁ + ㅐ" },
      { char: "미", cho: "ㅁ", jung: "ㅣ", breakdown: "ㅁ + ㅣ" }
    ]
  },
  {
    id: "nb11",
    word: "거미",
    stage: 2,
    category: "동물",
    emoji: "🕷️",
    hint: "줄을 치고 먹이를 기다려요",
    description: "엉덩이에서 가느다란 실을 뽑아 둥근 거미줄을 멋지게 짓고 매달려 살아요.",
    syllables: [
      { char: "거", cho: "ㄱ", jung: "ㅓ", breakdown: "ㄱ + ㅓ" },
      { char: "미", cho: "ㅁ", jung: "ㅣ", breakdown: "ㅁ + ㅣ" }
    ]
  },
  {
    id: "nb12",
    word: "타조",
    stage: 1,
    category: "동물",
    emoji: "🦤",
    hint: "날지 못하지만 달리기가 아주 빨라요",
    description: "목과 다리가 아주 길쭉하고, 날개 대신 두 발로 자동차처럼 빠르게 달리는 큰 새예요.",
    syllables: [
      { char: "타", cho: "ㅌ", jung: "ㅏ", breakdown: "ㅌ + ㅏ" },
      { char: "조", cho: "ㅈ", jung: "ㅗ", breakdown: "ㅈ + ㅗ" }
    ]
  },
  {
    id: "nb13",
    word: "까치",
    stage: 2,
    category: "동물",
    emoji: "🕊️",
    hint: "반가운 소식을 전해주는 새",
    description: "검은색과 흰색 깃털이 멋지며, 아침에 감나무 위에서 '깍깍' 반갑게 우는 새예요.",
    syllables: [
      { char: "까", cho: "ㄲ", jung: "ㅏ", breakdown: "ㄲ + ㅏ" },
      { char: "치", cho: "ㅊ", jung: "ㅣ", breakdown: "ㅊ + ㅣ" }
    ]
  },
  {
    id: "nb14",
    word: "제비",
    stage: 2,
    category: "동물",
    emoji: "🐦",
    hint: "가위 모양 꼬리를 가지고 봄에 찾아와요",
    description: "봄이 오면 따뜻한 곳에서 날아와 처마 밑에 진흙으로 동글동글 집을 짓는 새예요.",
    syllables: [
      { char: "제", cho: "ㅈ", jung: "ㅔ", breakdown: "ㅈ + ㅔ" },
      { char: "비", cho: "ㅂ", jung: "ㅣ", breakdown: "ㅂ + ㅣ" }
    ]
  },
  {
    id: "nb15",
    word: "개구리",
    stage: 3,
    category: "동물",
    emoji: "🐸",
    hint: "개골개골 연못에서 높이 뛰어요",
    description: "초록빛 몸에 뒷다리가 튼튼해서 연못 풀잎 위를 '개골개골' 높이 뛰어오르는 친구예요.",
    syllables: [
      { char: "개", cho: "ㄱ", jung: "ㅐ", breakdown: "ㄱ + ㅐ" },
      { char: "구", cho: "ㄱ", jung: "ㅜ", breakdown: "ㄱ + ㅜ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb16",
    word: "여우",
    stage: 2,
    category: "동물",
    emoji: "🦊",
    hint: "붉은 털과 풍성한 꼬리가 멋져요",
    description: "주황빛 털에 꼬리가 탐스럽고, 눈치가 빠르고 영리해서 동화 속에 자주 나오는 동물이에요.",
    syllables: [
      { char: "여", cho: "ㅇ", jung: "ㅕ", breakdown: "ㅇ + ㅕ" },
      { char: "우", cho: "ㅇ", jung: "ㅜ", breakdown: "ㅇ + ㅜ" }
    ]
  },
  {
    id: "nb17",
    word: "모기",
    stage: 1,
    category: "동물",
    emoji: "🦟",
    hint: "여름밤에 윙윙 귓가를 맴돌아요",
    description: "여름밤 귓가에서 '윙~' 날아다니며 뾰족한 침으로 물어 간지럽게 만드는 곤충이에요.",
    syllables: [
      { char: "모", cho: "ㅁ", jung: "ㅗ", breakdown: "ㅁ + ㅗ" },
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" }
    ]
  },
  {
    id: "nb18",
    word: "파리",
    stage: 1,
    category: "동물",
    emoji: "🪰",
    hint: "앞발을 싹싹 비비며 날아다녀요",
    description: "식탁 위에 앉아 앞발을 싹싹 비비고, 윙 날아다니는 빠른 곤충이에요.",
    syllables: [
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb19",
    word: "까마귀",
    stage: 3,
    category: "동물",
    emoji: "🦅",
    hint: "까만 깃털을 가진 영리한 새",
    description: "온몸이 반짝이는 까만 깃털로 덮여 있고 '까악까악' 울며 머리가 아주 좋은 새예요.",
    syllables: [
      { char: "까", cho: "ㄲ", jung: "ㅏ", breakdown: "ㄲ + ㅏ" },
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" },
      { char: "귀", cho: "ㄱ", jung: "ㅟ", breakdown: "ㄱ + ㅟ" }
    ]
  },
  {
    id: "nb20",
    word: "가재",
    stage: 2,
    category: "동물",
    emoji: "🦞",
    hint: "맑은 시냇물에 집게발을 가진 동물",
    description: "깨끗한 냇가 바위 밑에 살며 멋진 큰 집게발을 뽐내는 물속 친구예요.",
    syllables: [
      { char: "가", cho: "ㄱ", jung: "ㅏ", breakdown: "ㄱ + ㅏ" },
      { char: "재", cho: "ㅈ", jung: "ㅐ", breakdown: "ㅈ + ㅐ" }
    ]
  },
  {
    id: "nb21",
    word: "자라",
    stage: 1,
    category: "동물",
    emoji: "🐢",
    hint: "등껍질이 둥글고 목을 쏙 넣어요",
    description: "거북이처럼 등껍질을 짊어지고 살며, 위험하면 목과 다리를 껍질 속으로 쏙 집어넣어요.",
    syllables: [
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" },
      { char: "라", cho: "ㄹ", jung: "ㅏ", breakdown: "ㄹ + ㅏ" }
    ]
  },
  {
    id: "nb22",
    word: "고래",
    stage: 2,
    category: "동물",
    emoji: "🐋",
    hint: "바다에서 가장 크고 물을 뿜어요",
    description: "푸른 바다를 누비는 가장 거대한 동물로, 숨을 쉴 때 머리 위로 분수처럼 물을 뿜어 올려요.",
    syllables: [
      { char: "고", cho: "ㄱ", jung: "ㅗ", breakdown: "ㄱ + ㅗ" },
      { char: "래", cho: "ㄹ", jung: "ㅐ", breakdown: "ㄹ + ㅐ" }
    ]
  },
  {
    id: "nb23",
    word: "메기",
    stage: 2,
    category: "동물",
    emoji: "🐟",
    hint: "긴 수염을 가진 강물 물고기",
    description: "입가에 멋진 긴 수염이 달려 있고, 미끌미끌한 몸으로 강바닥을 유유히 헤엄치는 물고기예요.",
    syllables: [
      { char: "메", cho: "ㅁ", jung: "ㅔ", breakdown: "ㅁ + ㅔ" },
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" }
    ]
  },
  {
    id: "nb24",
    word: "치타",
    stage: 1,
    category: "동물",
    emoji: "🐆",
    hint: "세상에서 가장 빠르게 달리는 동물",
    description: "노란 털에 검은 점박이 무늬가 있고, 번개처럼 빠르게 달리는 멋진 동물이에요.",
    syllables: [
      { char: "치", cho: "ㅊ", jung: "ㅣ", breakdown: "ㅊ + ㅣ" },
      { char: "타", cho: "ㅌ", jung: "ㅏ", breakdown: "ㅌ + ㅏ" }
    ]
  },
  {
    id: "nb25",
    word: "비버",
    stage: 1,
    category: "동물",
    emoji: "🦫",
    hint: "나무를 갉아 냇가에 댐을 지어요",
    description: "튼튼한 앞니로 통나무를 갉아 쓰러뜨린 뒤 물을 막아 멋진 나무집을 짓는 기술자 동물이에요.",
    syllables: [
      { char: "비", cho: "ㅂ", jung: "ㅣ", breakdown: "ㅂ + ㅣ" },
      { char: "버", cho: "ㅂ", jung: "ㅓ", breakdown: "ㅂ + ㅓ" }
    ]
  },
  {
    id: "nb26",
    word: "해파리",
    stage: 3,
    category: "동물",
    emoji: "🪼",
    hint: "바닷속에서 둥실둥실 떠다녀요",
    description: "투명한 우산처럼 생겨서 바닷속을 둥실둥실 떠다니며 신비로운 빛을 내는 동물이에요.",
    syllables: [
      { char: "해", cho: "ㅎ", jung: "ㅐ", breakdown: "ㅎ + ㅐ" },
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb27",
    word: "뻐꾸기",
    stage: 3,
    category: "동물",
    emoji: "🐤",
    hint: "뻐꾹뻐꾹 봄을 노래하는 새",
    description: "숲속에서 '뻐꾹 뻐꾹' 맑고 청아한 목소리로 시계 소리처럼 노래하는 고마운 새예요.",
    syllables: [
      { char: "뻐", cho: "ㅃ", jung: "ㅓ", breakdown: "ㅃ + ㅓ" },
      { char: "꾸", cho: "ㄲ", jung: "ㅜ", breakdown: "ㄲ + ㅜ" },
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" }
    ]
  },

  // ==================== [맛있는 음식 23선] ====================
  {
    id: "nb28",
    word: "사과",
    stage: 2,
    category: "음식",
    emoji: "🍎",
    hint: "빨갛고 달콤 아삭아삭한 과일",
    description: "빨간 껍질 속에 달콤한 꿀이 가득 들어 있어 아삭아삭 베어 물면 행복해지는 과일이에요.",
    syllables: [
      { char: "사", cho: "ㅅ", jung: "ㅏ", breakdown: "ㅅ + ㅏ" },
      { char: "과", cho: "ㄱ", jung: "ㅘ", breakdown: "ㄱ + ㅘ" }
    ]
  },
  {
    id: "nb29",
    word: "바나나",
    stage: 3,
    category: "음식",
    emoji: "🍌",
    hint: "노란 껍질을 벗겨 먹어요",
    description: "달님처럼 노랗고 길쭉하며, 껍질을 스르륵 벗기면 부드럽고 달콤한 과육이 쏙 나와요.",
    syllables: [
      { char: "바", cho: "ㅂ", jung: "ㅏ", breakdown: "ㅂ + ㅏ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" }
    ]
  },
  {
    id: "nb30",
    word: "포도",
    stage: 1,
    category: "음식",
    emoji: "🍇",
    hint: "보랏빛 알맹이가 주렁주렁 열려요",
    description: "보랏빛 둥근 알맹이들이 송이송이 맺혀 있어 하나씩 쏙쏙 따먹는 새콤달콤한 과일이에요.",
    syllables: [
      { char: "포", cho: "ㅍ", jung: "ㅗ", breakdown: "ㅍ + ㅗ" },
      { char: "도", cho: "ㄷ", jung: "ㅗ", breakdown: "ㄷ + ㅗ" }
    ]
  },
  {
    id: "nb31",
    word: "오이",
    stage: 1,
    category: "음식",
    emoji: "🥒",
    hint: "초록색 시원하고 아삭한 채소",
    description: "초록빛 긴 채소로, 한 입 베어 물면 시원한 물이 촉촉하게 입안을 감돌아요.",
    syllables: [
      { char: "오", cho: "ㅇ", jung: "ㅗ", breakdown: "ㅇ + ㅗ" },
      { char: "이", cho: "ㅇ", jung: "ㅣ", breakdown: "ㅇ + ㅣ" }
    ]
  },
  {
    id: "nb32",
    word: "토마토",
    stage: 3,
    category: "음식",
    emoji: "🍅",
    hint: "앞뒤로 읽어도 똑같은 이름의 붉은 열매",
    description: "동글동글 빨갛게 익으면 비타민이 가득해져 몸을 튼튼하고 건강하게 해주는 영양 만점 열매예요.",
    syllables: [
      { char: "토", cho: "ㅌ", jung: "ㅗ", breakdown: "ㅌ + ㅗ" },
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" },
      { char: "토", cho: "ㅌ", jung: "ㅗ", breakdown: "ㅌ + ㅗ" }
    ]
  },
  {
    id: "nb33",
    word: "자두",
    stage: 1,
    category: "음식",
    emoji: "🍑",
    hint: "빨갛고 새콤달콤한 여름 과일",
    description: "빨간 껍질 속에 노란 속살이 숨어 있어, 여름철에 먹으면 입안 가득 침이 고이는 맛있는 과일이에요.",
    syllables: [
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" },
      { char: "두", cho: "ㄷ", jung: "ㅜ", breakdown: "ㄷ + ㅜ" }
    ]
  },
  {
    id: "nb34",
    word: "고구마",
    stage: 3,
    category: "음식",
    emoji: "🍠",
    hint: "흙 속에서 자라는 달콤한 간식",
    description: "따끈따끈하게 찌거나 구워 먹으면 노란 속살이 달콤하고 배를 든든하게 채워줘요.",
    syllables: [
      { char: "고", cho: "ㄱ", jung: "ㅗ", breakdown: "ㄱ + ㅗ" },
      { char: "구", cho: "ㄱ", jung: "ㅜ", breakdown: "ㄱ + ㅜ" },
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" }
    ]
  },
  {
    id: "nb35",
    word: "배추",
    stage: 2,
    category: "음식",
    emoji: "🥬",
    hint: "맛있는 김치를 만드는 초록 채소",
    description: "초록색 잎이 겹겹이 포개져 자라며, 시원한 국을 끓이거나 맛있는 김치를 만드는 채소예요.",
    syllables: [
      { char: "배", cho: "ㅂ", jung: "ㅐ", breakdown: "ㅂ + ㅐ" },
      { char: "추", cho: "ㅊ", jung: "ㅜ", breakdown: "ㅊ + ㅜ" }
    ]
  },
  {
    id: "nb36",
    word: "가지",
    stage: 1,
    category: "음식",
    emoji: "🍆",
    hint: "보랏빛 기다란 채소",
    description: "윤기가 흐르는 진한 보랏빛 옷을 입고 있으며, 볶아 먹으면 부드럽고 맛있는 채소예요.",
    syllables: [
      { char: "가", cho: "ㄱ", jung: "ㅏ", breakdown: "ㄱ + ㅏ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb37",
    word: "파",
    stage: 1,
    category: "음식",
    emoji: "🧅",
    hint: "음식 맛을 좋게 하는 초록 채소",
    description: "뿌리는 하얗고 줄기는 초록빛이며, 찌개나 국에 송송 썰어 넣으면 향긋한 냄새가 나요.",
    syllables: [
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" }
    ]
  },
  {
    id: "nb38",
    word: "고추",
    stage: 1,
    category: "음식",
    emoji: "🌶️",
    hint: "매콤한 맛을 내는 빨갛고 초록의 채소",
    description: "초록빛으로 자라다 가을이면 빨갛게 익으며, 매콤한 맛으로 김치와 떡볶이를 맛있게 해줘요.",
    syllables: [
      { char: "고", cho: "ㄱ", jung: "ㅗ", breakdown: "ㄱ + ㅗ" },
      { char: "추", cho: "ㅊ", jung: "ㅜ", breakdown: "ㅊ + ㅜ" }
    ]
  },
  {
    id: "nb39",
    word: "고기",
    stage: 1,
    category: "음식",
    emoji: "🥩",
    hint: "지글지글 구워 먹으면 힘이 불끈 솟아요",
    description: "프라이팬에 노릇노릇 구워 먹으면 고소한 냄새가 솔솔 나고 쑥쑥 자라게 돕는 영양 식품이에요.",
    syllables: [
      { char: "고", cho: "ㄱ", jung: "ㅗ", breakdown: "ㄱ + ㅗ" },
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" }
    ]
  },
  {
    id: "nb40",
    word: "두부",
    stage: 1,
    category: "음식",
    emoji: "🧊",
    hint: "콩으로 만든 부드럽고 하얀 음식",
    description: "노란 콩을 맷돌에 갈아 만든 새하얗고 네모난 음식으로, 푸딩처럼 보들보들 담백해요.",
    syllables: [
      { char: "두", cho: "ㄷ", jung: "ㅜ", breakdown: "ㄷ + ㅜ" },
      { char: "부", cho: "ㅂ", jung: "ㅜ", breakdown: "ㅂ + ㅜ" }
    ]
  },
  {
    id: "nb41",
    word: "과자",
    stage: 2,
    category: "음식",
    emoji: "🍪",
    hint: "바삭바삭 소리 나는 달콤한 간식",
    description: "봉지를 열어 한 입 깨물면 '바사삭' 소리가 나고 달콤해서 손이 자꾸만 가는 간식이에요.",
    syllables: [
      { char: "과", cho: "ㄱ", jung: "ㅘ", breakdown: "ㄱ + ㅘ" },
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" }
    ]
  },
  {
    id: "nb42",
    word: "차",
    stage: 1,
    category: "음식",
    emoji: "🍵",
    hint: "따뜻하게 우려 마시는 맑은 음료",
    description: "향긋한 풀잎이나 과일을 따뜻한 물에 우려내어 호호 불며 천천히 마시는 음료예요.",
    syllables: [
      { char: "차", cho: "ㅊ", jung: "ㅏ", breakdown: "ㅊ + ㅏ" }
    ]
  },
  {
    id: "nb43",
    word: "치즈",
    stage: 2,
    category: "음식",
    emoji: "🧀",
    hint: "우유로 만든 쫀득쫀득 고소한 음식",
    description: "우유의 영양을 듬뿍 모아 만든 노란 음식으로, 피자 위에 올리면 쭉쭉 늘어나고 고소해요.",
    syllables: [
      { char: "치", cho: "ㅊ", jung: "ㅣ", breakdown: "ㅊ + ㅣ" },
      { char: "즈", cho: "ㅈ", jung: "ㅡ", breakdown: "ㅈ + ㅡ" }
    ]
  },
  {
    id: "nb44",
    word: "피자",
    stage: 2,
    category: "음식",
    emoji: "🍕",
    hint: "둥근 도우 위에 치즈가 듬뿍",
    description: "둥근 빵 위에 토마토소스와 치즈, 채소를 얹어 화덕에 노릇하게 구운 맛있는 서양 음식이에요.",
    syllables: [
      { char: "피", cho: "ㅍ", jung: "ㅣ", breakdown: "ㅍ + ㅣ" },
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" }
    ]
  },
  {
    id: "nb45",
    word: "스파게티",
    stage: 3,
    category: "음식",
    emoji: "🍝",
    hint: "포크로 돌돌 말아 먹는 면 요리",
    description: "길쭉한 국수를 삶아 빨간 토마토소스에 버무린 뒤 포크로 돌돌 말아 입에 쏙 넣는 요리예요.",
    syllables: [
      { char: "스", cho: "ㅅ", jung: "ㅡ", breakdown: "ㅅ + ㅡ" },
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" },
      { char: "게", cho: "ㄱ", jung: "ㅔ", breakdown: "ㄱ + ㅔ" },
      { char: "티", cho: "ㅌ", jung: "ㅣ", breakdown: "ㅌ + ㅣ" }
    ]
  },
  {
    id: "nb46",
    word: "버터",
    stage: 1,
    category: "음식",
    emoji: "🧈",
    hint: "식빵에 바르면 고소한 노란 크림",
    description: "우유에서 얻은 부드러운 노란 기름으로, 따뜻한 빵에 사르르 발라 먹으면 정말 고소해요.",
    syllables: [
      { char: "버", cho: "ㅂ", jung: "ㅓ", breakdown: "ㅂ + ㅓ" },
      { char: "터", cho: "ㅌ", jung: "ㅓ", breakdown: "ㅌ + ㅓ" }
    ]
  },
  {
    id: "nb47",
    word: "초코",
    stage: 1,
    category: "음식",
    emoji: "🍫",
    hint: "달콤하고 부드러운 갈색 간식",
    description: "한 조각 입에 넣으면 사르르 녹아내리며 달콤한 기운을 선물해 주는 갈색 과자예요.",
    syllables: [
      { char: "초", cho: "ㅊ", jung: "ㅗ", breakdown: "ㅊ + ㅗ" },
      { char: "코", cho: "ㅋ", jung: "ㅗ", breakdown: "ㅋ + ㅗ" }
    ]
  },
  {
    id: "nb48",
    word: "카레",
    stage: 2,
    category: "음식",
    emoji: "🍛",
    hint: "노란 소스에 밥을 슥슥 비벼 먹어요",
    description: "감자와 당근, 고기를 볶아 노란 가루를 넣고 끓여 따뜻한 밥 위에 얹어 먹는 맛있는 음식이에요.",
    syllables: [
      { char: "카", cho: "ㅋ", jung: "ㅏ", breakdown: "ㅋ + ㅏ" },
      { char: "레", cho: "ㄹ", jung: "ㅔ", breakdown: "ㄹ + ㅔ" }
    ]
  },
  {
    id: "nb49",
    word: "체리",
    stage: 2,
    category: "음식",
    emoji: "🍒",
    hint: "빨간 구슬처럼 쌍둥이로 매달린 과일",
    description: "반짝반짝 작은 빨간 구슬처럼 예쁘게 생겨서 케이크 위에 쏙 올라가는 귀여운 과일이에요.",
    syllables: [
      { char: "체", cho: "ㅊ", jung: "ㅔ", breakdown: "ㅊ + ㅔ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb50",
    word: "키위",
    stage: 2,
    category: "음식",
    emoji: "🥝",
    hint: "초록색 속살에 까만 씨가 콕콕",
    description: "갈색 솜털 껍질을 깎으면 싱그러운 초록색 속살과 까만 깨 같은 씨가 콕콕 박혀 있는 과일이에요.",
    syllables: [
      { char: "키", cho: "ㅋ", jung: "ㅣ", breakdown: "ㅋ + ㅣ" },
      { char: "위", cho: "ㅇ", jung: "ㅟ", breakdown: "ㅇ + ㅟ" }
    ]
  },

  // ==================== [자연과 식물 15선] ====================
  {
    id: "nb51",
    word: "나무",
    stage: 1,
    category: "자연",
    emoji: "🌳",
    hint: "시원한 그늘과 맑은 공기를 주어요",
    description: "땅속 깊이 뿌리를 내리고 초록 잎을 무성하게 피워 우리에게 시원한 그늘과 산소를 주는 고마운 친구예요.",
    syllables: [
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "무", cho: "ㅁ", jung: "ㅜ", breakdown: "ㅁ + ㅜ" }
    ]
  },
  {
    id: "nb52",
    word: "소나무",
    stage: 3,
    category: "자연",
    emoji: "🌲",
    hint: "겨울에도 초록 잎을 뽐내요",
    description: "추운 겨울 눈보라 속에서도 뾰족한 초록 솔잎을 푸르게 간직하는 씩씩하고 늘 푸른 나무예요.",
    syllables: [
      { char: "소", cho: "ㅅ", jung: "ㅗ", breakdown: "ㅅ + ㅗ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "무", cho: "ㅁ", jung: "ㅜ", breakdown: "ㅁ + ㅜ" }
    ]
  },
  {
    id: "nb53",
    word: "대나무",
    stage: 3,
    category: "자연",
    emoji: "🎋",
    hint: "속이 비어 있고 곧게 쭉쭉 자라요",
    description: "마디마디가 단단하고 속은 비어 있으며, 바람이 불면 댓잎이 사각사각 노래하는 곧은 나무예요.",
    syllables: [
      { char: "대", cho: "ㄷ", jung: "ㅐ", breakdown: "ㄷ + ㅐ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "무", cho: "ㅁ", jung: "ㅜ", breakdown: "ㅁ + ㅜ" }
    ]
  },
  {
    id: "nb54",
    word: "개나리",
    stage: 3,
    category: "자연",
    emoji: "🌼",
    hint: "봄을 알리는 샛노란 꽃",
    description: "추운 겨울이 지나고 따스한 봄이 찾아오면 길가에 노란 종 모양 꽃망울을 활짝 터뜨려요.",
    syllables: [
      { char: "개", cho: "ㄱ", jung: "ㅐ", breakdown: "ㄱ + ㅐ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb55",
    word: "미나리",
    stage: 3,
    category: "자연",
    emoji: "🌿",
    hint: "물가에서 자라는 향긋한 나물",
    description: "시원한 물가에서 파릇파릇 자라며, 입안에 넣으면 아삭하고 향긋한 봄내음이 가득 퍼져요.",
    syllables: [
      { char: "미", cho: "ㅁ", jung: "ㅣ", breakdown: "ㅁ + ㅣ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb56",
    word: "도라지",
    stage: 3,
    category: "자연",
    emoji: "🪻",
    hint: "보라색 별꽃을 피우는 뿌리 채소",
    description: "예쁜 보랏빛 꽃을 피우고, 땅속 뿌리는 목을 튼튼하고 건강하게 지켜주는 약이 되는 식물이에요.",
    syllables: [
      { char: "도", cho: "ㄷ", jung: "ㅗ", breakdown: "ㄷ + ㅗ" },
      { char: "라", cho: "ㄹ", jung: "ㅏ", breakdown: "ㄹ + ㅏ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb57",
    word: "보리",
    stage: 1,
    category: "자연",
    emoji: "🌾",
    hint: "까끄라기 수염을 달고 자라는 곡식",
    description: "겨울 추위를 이겨내고 봄 들판을 초록빛으로 물들이는 구수한 밥이 되는 고마운 곡식이에요.",
    syllables: [
      { char: "보", cho: "ㅂ", jung: "ㅗ", breakdown: "ㅂ + ㅗ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb58",
    word: "벼",
    stage: 1,
    category: "자연",
    emoji: "🌾",
    hint: "가을이면 황금빛으로 물드는 쌀의 나무",
    description: "논에서 쑥쑥 자라 가을이 되면 고개를 겸손하게 숙이며 우리 밥상의 새하얀 쌀밥을 선물해 줘요.",
    syllables: [
      { char: "벼", cho: "ㅂ", jung: "ㅕ", breakdown: "ㅂ + ㅕ" }
    ]
  },
  {
    id: "nb59",
    word: "무",
    stage: 1,
    category: "자연",
    emoji: "🥕",
    hint: "땅속에서 자라는 하얗고 시원한 채소",
    description: "흙 속에서 통통하게 자라나며, 시원한 깍두기를 담그거나 국물에 넣으면 달착지근한 맛을 내요.",
    syllables: [
      { char: "무", cho: "ㅁ", jung: "ㅜ", breakdown: "ㅁ + ㅜ" }
    ]
  },
  {
    id: "nb60",
    word: "대추",
    stage: 2,
    category: "자연",
    emoji: "🌰",
    hint: "가을에 빨갛게 익는 달콤한 열매",
    description: "가을바람을 맞으면 초록 열매가 붉은빛으로 곱게 물들며, 주름지게 말려 먹으면 꿀처럼 달아요.",
    syllables: [
      { char: "대", cho: "ㄷ", jung: "ㅐ", breakdown: "ㄷ + ㅐ" },
      { char: "추", cho: "ㅊ", jung: "ㅜ", breakdown: "ㅊ + ㅜ" }
    ]
  },
  {
    id: "nb61",
    word: "파파야",
    stage: 3,
    category: "자연",
    emoji: "🥭",
    hint: "따뜻한 나라에서 자라는 주황색 과일",
    description: "태양이 뜨거운 열대 지방에서 자라며, 반으로 자르면 속에 검은 씨가 있고 주황 살이 부드러워요.",
    syllables: [
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" },
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" },
      { char: "야", cho: "ㅇ", jung: "ㅑ", breakdown: "ㅇ + ㅑ" }
    ]
  },
  {
    id: "nb62",
    word: "수수",
    stage: 1,
    category: "자연",
    emoji: "🌾",
    hint: "키가 크고 붉은 이삭을 맺어요",
    description: "어린이 키보다 훨씬 높게 자라며, 붉은 열매로 돌잔치 수수팥떡을 만들어 건강을 빌어줘요.",
    syllables: [
      { char: "수", cho: "ㅅ", jung: "ㅜ", breakdown: "ㅅ + ㅜ" },
      { char: "수", cho: "ㅅ", jung: "ㅜ", breakdown: "ㅅ + ㅜ" }
    ]
  },
  {
    id: "nb63",
    word: "바다",
    stage: 1,
    category: "자연",
    emoji: "🌊",
    hint: "끝없이 넓고 푸른 물",
    description: "수평선 너머로 끝없이 펼쳐진 거대한 푸른 물결로, 시원한 파도와 물고기들의 소중한 보금자리예요.",
    syllables: [
      { char: "바", cho: "ㅂ", jung: "ㅏ", breakdown: "ㅂ + ㅏ" },
      { char: "다", cho: "ㄷ", jung: "ㅏ", breakdown: "ㄷ + ㅏ" }
    ]
  },
  {
    id: "nb64",
    word: "파도",
    stage: 1,
    category: "자연",
    emoji: "🌊",
    hint: "모래사장으로 철썩 밀려오는 물결",
    description: "바닷바람을 타고 하얀 물거품을 일으키며 '철썩철썩' 모래사장으로 밀려왔다 밀려가는 물결이에요.",
    syllables: [
      { char: "파", cho: "ㅍ", jung: "ㅏ", breakdown: "ㅍ + ㅏ" },
      { char: "도", cho: "ㄷ", jung: "ㅗ", breakdown: "ㄷ + ㅗ" }
    ]
  },
  {
    id: "nb65",
    word: "무지개",
    stage: 3,
    category: "자연",
    emoji: "🌈",
    hint: "비 온 뒤 하늘에 뜨는 일곱 빛깔 다리",
    description: "비가 그치고 해님이 반짝 떠오르면 파란 하늘에 빨주노초파남보 아름답게 걸리는 빛의 다리예요.",
    syllables: [
      { char: "무", cho: "ㅁ", jung: "ㅜ", breakdown: "ㅁ + ㅜ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" },
      { char: "개", cho: "ㄱ", jung: "ㅐ", breakdown: "ㄱ + ㅐ" }
    ]
  },

  // ==================== [생활과 사물 24선] ====================
  {
    id: "nb66",
    word: "모자",
    stage: 1,
    category: "사물",
    emoji: "🧢",
    hint: "햇빛을 가리기 위해 머리에 써요",
    description: "눈부신 햇살을 가려주고 멋진 패션을 완성하기 위해 머리 위에 쏙 얹어 쓰는 물건이에요.",
    syllables: [
      { char: "모", cho: "ㅁ", jung: "ㅗ", breakdown: "ㅁ + ㅗ" },
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" }
    ]
  },
  {
    id: "nb67",
    word: "구두",
    stage: 1,
    category: "사물",
    emoji: "👞",
    hint: "발에 신는 반짝반짝 신발",
    description: "단단하고 반짝이는 가죽으로 만들어 또각또각 소리를 내며 발을 멋지고 편안하게 감싸줘요.",
    syllables: [
      { char: "구", cho: "ㄱ", jung: "ㅜ", breakdown: "ㄱ + ㅜ" },
      { char: "두", cho: "ㄷ", jung: "ㅜ", breakdown: "ㄷ + ㅜ" }
    ]
  },
  {
    id: "nb68",
    word: "치마",
    stage: 1,
    category: "사물",
    emoji: "👗",
    hint: "허리에 둘러 입는 나풀나풀 옷",
    description: "빙그르르 돌면 나비처럼 나풀나풀 펼쳐지며 다리를 시원하고 편하게 해주는 예쁜 옷이에요.",
    syllables: [
      { char: "치", cho: "ㅊ", jung: "ㅣ", breakdown: "ㅊ + ㅣ" },
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" }
    ]
  },
  {
    id: "nb69",
    word: "바지",
    stage: 1,
    category: "사물",
    emoji: "👖",
    hint: "두 다리에 쏙 입는 옷",
    description: "왼쪽 다리, 오른쪽 다리를 쏙 집어넣어 입고 마음껏 뛰어놀 수 있게 해주는 편리한 옷이에요.",
    syllables: [
      { char: "바", cho: "ㅂ", jung: "ㅏ", breakdown: "ㅂ + ㅏ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb70",
    word: "저고리",
    stage: 3,
    category: "사물",
    emoji: "👘",
    hint: "명절에 한복 위에 입는 윗옷",
    description: "설날이나 추석 명절에 한복과 함께 예쁜 옷고름을 정성껏 매어 입는 우리의 전통 윗옷이에요.",
    syllables: [
      { char: "저", cho: "ㅈ", jung: "ㅓ", breakdown: "ㅈ + ㅓ" },
      { char: "고", cho: "ㄱ", jung: "ㅗ", breakdown: "ㄱ + ㅗ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb71",
    word: "비누",
    stage: 1,
    category: "사물",
    emoji: "🧼",
    hint: "손을 씻으면 거품이 보글보글",
    description: "물과 만나면 향기로운 거품을 보글보글 피워내어 손에 묻은 먼지와 세균을 깨끗이 씻어내 줘요.",
    syllables: [
      { char: "비", cho: "ㅂ", jung: "ㅣ", breakdown: "ㅂ + ㅣ" },
      { char: "누", cho: "ㄴ", jung: "ㅜ", breakdown: "ㄴ + ㅜ" }
    ]
  },
  {
    id: "nb72",
    word: "휴지",
    stage: 2,
    category: "사물",
    emoji: "🧻",
    hint: "흘린 물이나 손을 닦는 얇은 종이",
    description: "돌돌 말려 있는 부드럽고 하얀 종이로, 콧물을 닦거나 식탁의 물방울을 쏙 흡수해 닦아줘요.",
    syllables: [
      { char: "휴", cho: "ㅎ", jung: "ㅠ", breakdown: "ㅎ + ㅠ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb73",
    word: "피아노",
    stage: 3,
    category: "사물",
    emoji: "🎹",
    hint: "건반을 누르면 도레미 소리가 나요",
    description: "검은 건반과 흰 건반을 열 손가락으로 가볍게 두드리면 맑고 아름다운 노래가 피어나는 악기예요.",
    syllables: [
      { char: "피", cho: "ㅍ", jung: "ㅣ", breakdown: "ㅍ + ㅣ" },
      { char: "아", cho: "ㅇ", jung: "ㅏ", breakdown: "ㅇ + ㅏ" },
      { char: "노", cho: "ㄴ", jung: "ㅗ", breakdown: "ㄴ + ㅗ" }
    ]
  },
  {
    id: "nb74",
    word: "라디오",
    stage: 3,
    category: "사물",
    emoji: "📻",
    hint: "신나는 음악과 목소리를 들려줘요",
    description: "안테나로 전파를 받아 재미있는 이야기와 신나는 동요를 방 안 가득 들려주는 마법 상자예요.",
    syllables: [
      { char: "라", cho: "ㄹ", jung: "ㅏ", breakdown: "ㄹ + ㅏ" },
      { char: "디", cho: "ㄷ", jung: "ㅣ", breakdown: "ㄷ + ㅣ" },
      { char: "오", cho: "ㅇ", jung: "ㅗ", breakdown: "ㅇ + ㅗ" }
    ]
  },
  {
    id: "nb75",
    word: "시계",
    stage: 2,
    category: "사물",
    emoji: "⏰",
    hint: "째깍째깍 시간을 알려줘요",
    description: "긴바늘과 짧은바늘이 '째깍째깍' 부지런히 돌아가며 지금이 몇 시 몇 분인지 정확히 알려줘요.",
    syllables: [
      { char: "시", cho: "ㅅ", jung: "ㅣ", breakdown: "ㅅ + ㅣ" },
      { char: "계", cho: "ㄱ", jung: "ㅖ", breakdown: "ㄱ + ㅖ" }
    ]
  },
  {
    id: "nb76",
    word: "바구니",
    stage: 3,
    category: "사물",
    emoji: "🧺",
    hint: "과일이나 물건을 쏙 담는 그릇",
    description: "대나무나 플라스틱으로 엮어 만들어 소풍 갈 때 맛있는 과일과 간식을 담아 들고 가요.",
    syllables: [
      { char: "바", cho: "ㅂ", jung: "ㅏ", breakdown: "ㅂ + ㅏ" },
      { char: "구", cho: "ㄱ", jung: "ㅜ", breakdown: "ㄱ + ㅜ" },
      { char: "니", cho: "ㄴ", jung: "ㅣ", breakdown: "ㄴ + ㅣ" }
    ]
  },
  {
    id: "nb77",
    word: "주머니",
    stage: 3,
    category: "사물",
    emoji: "👛",
    hint: "옷에 달린 비밀 수납공간",
    description: "옷이나 가방에 쏙 달려 있어 차가운 손을 녹이거나 소중한 물건을 잃어버리지 않게 품어줘요.",
    syllables: [
      { char: "주", cho: "ㅈ", jung: "ㅜ", breakdown: "ㅈ + ㅜ" },
      { char: "머", cho: "ㅁ", jung: "ㅓ", breakdown: "ㅁ + ㅓ" },
      { char: "니", cho: "ㄴ", jung: "ㅣ", breakdown: "ㄴ + ㅣ" }
    ]
  },
  {
    id: "nb78",
    word: "가위",
    stage: 2,
    category: "사물",
    emoji: "✂️",
    hint: "종이를 싹둑싹둑 잘라요",
    description: "두 개의 날을 손잡이로 쥐고 움직여 색종이를 싹둑싹둑 예쁜 모양으로 오려내는 문구 도구예요.",
    syllables: [
      { char: "가", cho: "ㄱ", jung: "ㅏ", breakdown: "ㄱ + ㅏ" },
      { char: "위", cho: "ㅇ", jung: "ㅟ", breakdown: "ㅇ + ㅟ" }
    ]
  },
  {
    id: "nb79",
    word: "의자",
    stage: 2,
    category: "사물",
    emoji: "🪑",
    hint: "편안하게 엉덩이를 대고 앉아요",
    description: "공부를 하거나 밥을 먹을 때 바른 자세로 엉덩이를 편안하게 받쳐주는 든든한 가구예요.",
    syllables: [
      { char: "의", cho: "ㅇ", jung: "ㅢ", breakdown: "ㅇ + ㅢ" },
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" }
    ]
  },
  {
    id: "nb80",
    word: "지도",
    stage: 1,
    category: "사물",
    emoji: "🗺️",
    hint: "길과 도시를 한눈에 보여주는 그림",
    description: "넓은 세상과 우리나라의 산, 바다, 길이 어디에 있는지 한눈에 찾아볼 수 있는 그림 종이예요.",
    syllables: [
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" },
      { char: "도", cho: "ㄷ", jung: "ㅗ", breakdown: "ㄷ + ㅗ" }
    ]
  },
  {
    id: "nb81",
    word: "지우개",
    stage: 3,
    category: "사물",
    emoji: "🧼",
    hint: "연필로 쓴 글씨를 깨끗이 지워요",
    description: "연필로 잘못 쓴 글씨를 쓱쓱 문지르면 마술처럼 다시 하얗게 깨끗한 종이로 되돌려줘요.",
    syllables: [
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" },
      { char: "우", cho: "ㅇ", jung: "ㅜ", breakdown: "ㅇ + ㅜ" },
      { char: "개", cho: "ㄱ", jung: "ㅐ", breakdown: "ㄱ + ㅐ" }
    ]
  },
  {
    id: "nb82",
    word: "도화지",
    stage: 3,
    category: "사물",
    emoji: "📄",
    hint: "크레파스로 그림을 그리는 큰 하얀 종이",
    description: "크레파스와 물감으로 우리들의 꿈과 상상력을 마음껏 펼쳐 그릴 수 있는 두껍고 하얀 종이예요.",
    syllables: [
      { char: "도", cho: "ㄷ", jung: "ㅗ", breakdown: "ㄷ + ㅗ" },
      { char: "화", cho: "ㅎ", jung: "ㅘ", breakdown: "ㅎ + ㅘ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb83",
    word: "자",
    stage: 1,
    category: "사물",
    emoji: "📏",
    hint: "반듯한 줄을 긋고 길이를 재요",
    description: "눈금이 그려져 있어 연필로 곧은 줄을 긋거나 지우개와 연필의 길이를 잴 때 쓰는 도구예요.",
    syllables: [
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" }
    ]
  },
  {
    id: "nb84",
    word: "조끼",
    stage: 2,
    category: "사물",
    emoji: "🦺",
    hint: "소매가 없는 따뜻한 옷",
    description: "팔 소매가 없어 활동하기 편하며, 티셔츠 위에 덧입으면 가슴과 등을 따뜻하게 지켜줘요.",
    syllables: [
      { char: "조", cho: "ㅈ", jung: "ㅗ", breakdown: "ㅈ + ㅗ" },
      { char: "끼", cho: "ㄲ", jung: "ㅣ", breakdown: "ㄲ + ㅣ" }
    ]
  },
  {
    id: "nb85",
    word: "부채",
    stage: 2,
    category: "사물",
    emoji: "🪭",
    hint: "손을 살랑살랑 흔들면 시원한 바람이 솔솔",
    description: "더운 여름날 손잡이를 쥐고 살랑살랑 흔들면 얼굴 가득 시원하고 자연스러운 바람을 선물해 줘요.",
    syllables: [
      { char: "부", cho: "ㅂ", jung: "ㅜ", breakdown: "ㅂ + ㅜ" },
      { char: "채", cho: "ㅊ", jung: "ㅐ", breakdown: "ㅊ + ㅐ" }
    ]
  },
  {
    id: "nb86",
    word: "보자기",
    stage: 3,
    category: "사물",
    emoji: "👝",
    hint: "물건을 네모나게 곱게 싸는 천",
    description: "알록달록 고운 네모 천으로, 어떤 모양의 물건이든 품에 쏙 넣어 예쁘게 묶어 들고 다녀요.",
    syllables: [
      { char: "보", cho: "ㅂ", jung: "ㅗ", breakdown: "ㅂ + ㅗ" },
      { char: "자", cho: "ㅈ", jung: "ㅏ", breakdown: "ㅈ + ㅏ" },
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" }
    ]
  },
  {
    id: "nb87",
    word: "소쿠리",
    stage: 3,
    category: "사물",
    emoji: "🧺",
    hint: "채소를 씻어 물기를 쏙 빼는 그릇",
    description: "싸리나무나 대나무로 엮어 구멍이 송송 뚫려 있어, 씻은 채소의 물기를 털어낼 때 써요.",
    syllables: [
      { char: "소", cho: "ㅅ", jung: "ㅗ", breakdown: "ㅅ + ㅗ" },
      { char: "쿠", cho: "ㅋ", jung: "ㅜ", breakdown: "ㅋ + ㅜ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb88",
    word: "튜브",
    stage: 2,
    category: "사물",
    emoji: "🛟",
    hint: "물놀이할 때 몸에 끼우면 동동 떠요",
    description: "공기를 빵빵하게 불어넣고 몸에 끼우면 수영을 못해도 물 위에 도넛처럼 동동 뜨게 해줘요.",
    syllables: [
      { char: "튜", cho: "ㅌ", jung: "ㅠ", breakdown: "ㅌ + ㅠ" },
      { char: "브", cho: "ㅂ", jung: "ㅡ", breakdown: "ㅂ + ㅡ" }
    ]
  },
  {
    id: "nb89",
    word: "카메라",
    stage: 3,
    category: "사물",
    emoji: "📷",
    hint: "행복한 순간을 찰칵 사진으로 남겨요",
    description: "렌즈를 대고 버튼을 '찰칵' 누르면 활짝 웃는 우리들의 모습을 멋진 사진으로 담아줘요.",
    syllables: [
      { char: "카", cho: "ㅋ", jung: "ㅏ", breakdown: "ㅋ + ㅏ" },
      { char: "메", cho: "ㅁ", jung: "ㅔ", breakdown: "ㅁ + ㅔ" },
      { char: "라", cho: "ㄹ", jung: "ㅏ", breakdown: "ㄹ + ㅏ" }
    ]
  },

  // ==================== [탈것과 놀이 7선] ====================
  {
    id: "nb90",
    word: "기차",
    stage: 2,
    category: "탈것",
    emoji: "🚂",
    hint: "칙칙폭폭 긴 철길을 달려요",
    description: "여러 칸의 열차가 서로 손잡고 긴 철길 위를 '칙칙폭폭' 신나게 달리는 탈것이에요.",
    syllables: [
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" },
      { char: "차", cho: "ㅊ", jung: "ㅏ", breakdown: "ㅊ + ㅏ" }
    ]
  },
  {
    id: "nb91",
    word: "버스",
    stage: 1,
    category: "탈것",
    emoji: "🚌",
    hint: "많은 친구들과 함께 타는 큰 차",
    description: "정류장에 멈춰 서서 부릉부릉 소리를 내며 많은 이웃들과 함께 타는 친숙한 큰 자동차예요.",
    syllables: [
      { char: "버", cho: "ㅂ", jung: "ㅓ", breakdown: "ㅂ + ㅓ" },
      { char: "스", cho: "ㅅ", jung: "ㅡ", breakdown: "ㅅ + ㅡ" }
    ]
  },
  {
    id: "nb92",
    word: "마차",
    stage: 1,
    category: "탈것",
    emoji: "🐎",
    hint: "힘센 말이 따가닥따가닥 끄는 수레",
    description: "멋진 말이 앞에서 '따가닥따가닥' 바퀴 달린 수레를 끌어 사람들을 태우고 가던 옛날 탈것이에요.",
    syllables: [
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" },
      { char: "차", cho: "ㅊ", jung: "ㅏ", breakdown: "ㅊ + ㅏ" }
    ]
  },
  {
    id: "nb93",
    word: "오토바이",
    stage: 4,
    category: "탈것",
    emoji: "🏍️",
    hint: "두 바퀴로 부릉부릉 빠르게 달려요",
    description: "엔진 소리를 '부릉부릉' 힘차게 울리며 헬멧을 쓰고 두 바퀴로 씽씽 달리는 탈것이에요.",
    syllables: [
      { char: "오", cho: "ㅇ", jung: "ㅗ", breakdown: "ㅇ + ㅗ" },
      { char: "토", cho: "ㅌ", jung: "ㅗ", breakdown: "ㅌ + ㅗ" },
      { char: "바", cho: "ㅂ", jung: "ㅏ", breakdown: "ㅂ + ㅏ" },
      { char: "이", cho: "ㅇ", jung: "ㅣ", breakdown: "ㅇ + ㅣ" }
    ]
  },
  {
    id: "nb94",
    word: "유모차",
    stage: 3,
    category: "탈것",
    emoji: "🛒",
    hint: "귀여운 아기가 타고 나들이 가요",
    description: "다리가 아직 약한 귀여운 아기가 포근하게 누워 엄마 아빠와 함께 산책할 때 타는 수레예요.",
    syllables: [
      { char: "유", cho: "ㅇ", jung: "ㅠ", breakdown: "ㅇ + ㅠ" },
      { char: "모", cho: "ㅁ", jung: "ㅗ", breakdown: "ㅁ + ㅗ" },
      { char: "차", cho: "ㅊ", jung: "ㅏ", breakdown: "ㅊ + ㅏ" }
    ]
  },
  {
    id: "nb95",
    word: "그네",
    stage: 2,
    category: "탈것",
    emoji: "🎠",
    hint: "앞뒤로 흔들흔들 하늘 높이 올라가요",
    description: "줄을 꼭 붙잡고 발을 굴리면 하늘 높이 슝 날아오를 듯 바람을 가르는 놀이터 기구예요.",
    syllables: [
      { char: "그", cho: "ㄱ", jung: "ㅡ", breakdown: "ㄱ + ㅡ" },
      { char: "네", cho: "ㄴ", jung: "ㅔ", breakdown: "ㄴ + ㅔ" }
    ]
  },
  {
    id: "nb96",
    word: "시소",
    stage: 1,
    category: "탈것",
    emoji: "🎡",
    hint: "친구와 둘이 타며 오르락내리락해요",
    description: "양쪽에 마주 앉아 발을 쿵쿵 구르면 번갈아 위로 붕 솟구쳤다 내려오는 놀이터 친구예요.",
    syllables: [
      { char: "시", cho: "ㅅ", jung: "ㅣ", breakdown: "ㅅ + ㅣ" },
      { char: "소", cho: "ㅅ", jung: "ㅗ", breakdown: "ㅅ + ㅗ" }
    ]
  },

  // ==================== [소중한 우리 몸 10선] ====================
  {
    id: "nb97",
    word: "머리",
    stage: 1,
    category: "신체",
    emoji: "👧",
    hint: "생각을 쑥쑥 키우는 몸의 가장 위쪽",
    description: "반짝이는 생각과 기억이 가득 담긴 소중한 곳으로, 예쁜 머리카락이 자라나요.",
    syllables: [
      { char: "머", cho: "ㅁ", jung: "ㅓ", breakdown: "ㅁ + ㅓ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb98",
    word: "이마",
    stage: 1,
    category: "신체",
    emoji: "🧑",
    hint: "머리카락과 눈썹 사이의 넓은 곳",
    description: "눈썹 위와 머리 사이에 위치한 반짝이는 곳으로, 엄마 아빠가 사랑스럽게 뽀뽀해 주는 곳이에요.",
    syllables: [
      { char: "이", cho: "ㅇ", jung: "ㅣ", breakdown: "ㅇ + ㅣ" },
      { char: "마", cho: "ㅁ", jung: "ㅏ", breakdown: "ㅁ + ㅏ" }
    ]
  },
  {
    id: "nb99",
    word: "코",
    stage: 1,
    category: "신체",
    emoji: "👃",
    hint: "향기로운 냄새를 킁킁 맡아요",
    description: "꽃향기나 맛있는 음식 냄새를 킁킁 맡고, 숨을 들이마시고 내쉬는 얼굴 한가운데의 소중한 부위예요.",
    syllables: [
      { char: "코", cho: "ㅋ", jung: "ㅗ", breakdown: "ㅋ + ㅗ" }
    ]
  },
  {
    id: "nb100",
    word: "귀",
    stage: 1,
    category: "신체",
    emoji: "👂",
    hint: "엄마 목소리와 새소리를 들어요",
    description: "얼굴 양쪽에 쫑긋 자리 잡아 친구들의 다정한 목소리와 신나는 음악을 맑게 듣게 해줘요.",
    syllables: [
      { char: "귀", cho: "ㄱ", jung: "ㅟ", breakdown: "ㄱ + ㅟ" }
    ]
  },
  {
    id: "nb101",
    word: "치아",
    stage: 1,
    category: "신체",
    emoji: "🦷",
    hint: "음식을 꼭꼭 씹어 먹는 하얀 이",
    description: "입속에 나란히 줄지어 있어 맛있는 사과와 밥을 꼭꼭 씹어 먹게 돕는 하얗고 단단한 보석이에요.",
    syllables: [
      { char: "치", cho: "ㅊ", jung: "ㅣ", breakdown: "ㅊ + ㅣ" },
      { char: "아", cho: "ㅇ", jung: "ㅏ", breakdown: "ㅇ + ㅏ" }
    ]
  },
  {
    id: "nb102",
    word: "다리",
    stage: 1,
    category: "신체",
    emoji: "🦵",
    hint: "씩씩하게 걷고 달릴 수 있어요",
    description: "튼튼하게 몸을 지탱해주어 학교에 씩씩하게 걸어가고 운동장에서 신나게 공을 차게 해줘요.",
    syllables: [
      { char: "다", cho: "ㄷ", jung: "ㅏ", breakdown: "ㄷ + ㅏ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb103",
    word: "허리",
    stage: 1,
    category: "신체",
    emoji: "🧍",
    hint: "몸을 굽혔다 폈다 하는 중심",
    description: "상체와 하체를 이어주며 인사할 때 '공손히' 숙이고 똑바로 설 수 있도록 중심을 잡아줘요.",
    syllables: [
      { char: "허", cho: "ㅎ", jung: "ㅓ", breakdown: "ㅎ + ㅓ" },
      { char: "리", cho: "ㄹ", jung: "ㅣ", breakdown: "ㄹ + ㅣ" }
    ]
  },
  {
    id: "nb104",
    word: "배",
    stage: 1,
    category: "신체",
    emoji: "🤰",
    hint: "맛있는 음식이 들어가는 통통한 곳",
    description: "밥을 맛있게 먹으면 볼록 나오고, 소화를 시켜 우리 몸에 힘과 에너지를 채워주는 곳이에요.",
    syllables: [
      { char: "배", cho: "ㅂ", jung: "ㅐ", breakdown: "ㅂ + ㅐ" }
    ]
  },
  {
    id: "nb105",
    word: "피부",
    stage: 1,
    category: "신체",
    emoji: "🧴",
    hint: "온몸을 부드럽게 감싸는 살갗",
    description: "우리 몸 전체를 겉에서 부드럽게 감싸 추위와 더위로부터 우리를 안전하게 지켜주는 보호막이에요.",
    syllables: [
      { char: "피", cho: "ㅍ", jung: "ㅣ", breakdown: "ㅍ + ㅣ" },
      { char: "부", cho: "ㅂ", jung: "ㅜ", breakdown: "ㅂ + ㅜ" }
    ]
  },
  {
    id: "nb106",
    word: "어깨",
    stage: 2,
    category: "신체",
    emoji: "💪",
    hint: "무거운 가방을 메는 든든한 곳",
    description: "목 양옆에 있어 무거운 책가방을 씩씩하게 짊어지고 친구들과 어깨동무하며 놀 수 있는 곳이에요.",
    syllables: [
      { char: "어", cho: "ㅇ", jung: "ㅓ", breakdown: "ㅇ + ㅓ" },
      { char: "깨", cho: "ㄲ", jung: "ㅐ", breakdown: "ㄲ + ㅐ" }
    ]
  },

  // ==================== [사랑하는 가족과 사람 12선] ====================
  {
    id: "nb107",
    word: "아기",
    stage: 1,
    category: "가족",
    emoji: "👶",
    hint: "방긋방긋 웃는 사랑스러운 아가",
    description: "옹알옹알 귀여운 소리를 내며 포근한 요람에서 새근새근 잠자는 가장 어리고 사랑스러운 가족이에요.",
    syllables: [
      { char: "아", cho: "ㅇ", jung: "ㅏ", breakdown: "ㅇ + ㅏ" },
      { char: "기", cho: "ㄱ", jung: "ㅣ", breakdown: "ㄱ + ㅣ" }
    ]
  },
  {
    id: "nb108",
    word: "아이",
    stage: 1,
    category: "가족",
    emoji: "🧒",
    hint: "무럭무럭 자라나는 꿈나무",
    description: "매일매일 키와 생각이 쑥쑥 자라며 호기심 가득한 눈으로 세상을 배우는 멋진 친구예요.",
    syllables: [
      { char: "아", cho: "ㅇ", jung: "ㅏ", breakdown: "ㅇ + ㅏ" },
      { char: "이", cho: "ㅇ", jung: "ㅣ", breakdown: "ㅇ + ㅣ" }
    ]
  },
  {
    id: "nb109",
    word: "어머니",
    stage: 3,
    category: "가족",
    emoji: "👩",
    hint: "따뜻하게 안아주시는 고마운 엄마",
    description: "세상에서 나를 가장 사랑해 주시고 맛있는 밥과 따뜻한 품으로 나를 돌보아 주시는 분이에요.",
    syllables: [
      { char: "어", cho: "ㅇ", jung: "ㅓ", breakdown: "ㅇ + ㅓ" },
      { char: "머", cho: "ㅁ", jung: "ㅓ", breakdown: "ㅁ + ㅓ" },
      { char: "니", cho: "ㄴ", jung: "ㅣ", breakdown: "ㄴ + ㅣ" }
    ]
  },
  {
    id: "nb110",
    word: "아버지",
    stage: 3,
    category: "가족",
    emoji: "👨",
    hint: "든든하게 지켜주시는 멋진 아빠",
    description: "높은 산처럼 든든한 어깨로 우리 가족을 사랑으로 지켜주시고 함께 놀아주시는 멋진 분이에요.",
    syllables: [
      { char: "아", cho: "ㅇ", jung: "ㅏ", breakdown: "ㅇ + ㅏ" },
      { char: "버", cho: "ㅂ", jung: "ㅓ", breakdown: "ㅂ + ㅓ" },
      { char: "지", cho: "ㅈ", jung: "ㅣ", breakdown: "ㅈ + ㅣ" }
    ]
  },
  {
    id: "nb111",
    word: "누나",
    stage: 1,
    category: "가족",
    emoji: "👧",
    hint: "남동생을 다정하게 챙겨주는 손위 여자 형제",
    description: "동생에게 재미있는 그림책도 읽어주고 사이좋게 놀아주는 친절하고 다정한 손위 여자 형제예요.",
    syllables: [
      { char: "누", cho: "ㄴ", jung: "ㅜ", breakdown: "ㄴ + ㅜ" },
      { char: "나", cho: "ㄴ", jung: "ㅏ", breakdown: "ㄴ + ㅏ" }
    ]
  },
  {
    id: "nb112",
    word: "오빠",
    stage: 2,
    category: "가족",
    emoji: "👦",
    hint: "여동생을 든든하게 지켜주는 손위 남자 형제",
    description: "손을 꼭 잡고 학교에 함께 가주며 동생을 씩씩하게 도와주는 멋진 손위 남자 형제예요.",
    syllables: [
      { char: "오", cho: "ㅇ", jung: "ㅗ", breakdown: "ㅇ + ㅗ" },
      { char: "빠", cho: "ㅃ", jung: "ㅏ", breakdown: "ㅃ + ㅏ" }
    ]
  },
  {
    id: "nb113",
    word: "아우",
    stage: 1,
    category: "가족",
    emoji: "🧒",
    hint: "나보다 나이가 어린 동생",
    description: "나를 졸졸 따라다니며 언니, 오빠, 형을 가장 멋지다고 좋아하는 귀여운 동생을 뜻하는 순우리말이에요.",
    syllables: [
      { char: "아", cho: "ㅇ", jung: "ㅏ", breakdown: "ㅇ + ㅏ" },
      { char: "우", cho: "ㅇ", jung: "ㅜ", breakdown: "ㅇ + ㅜ" }
    ]
  },
  {
    id: "nb114",
    word: "이모",
    stage: 1,
    category: "가족",
    emoji: "👩‍🦰",
    hint: "엄마의 다정한 자매",
    description: "엄마의 언니나 여동생으로, 우리 집에 놀러 오실 때마다 맛있는 간식과 웃음을 선물해 주세요.",
    syllables: [
      { char: "이", cho: "ㅇ", jung: "ㅣ", breakdown: "ㅇ + ㅣ" },
      { char: "모", cho: "ㅁ", jung: "ㅗ", breakdown: "ㅁ + ㅗ" }
    ]
  },
  {
    id: "nb115",
    word: "고모",
    stage: 1,
    category: "가족",
    emoji: "👱‍♀️",
    hint: "아빠의 다정한 자매",
    description: "아빠의 누나나 여동생으로, 나를 볼 때마다 '참 예쁘다' 칭찬해주시는 고마운 친척 어른이에요.",
    syllables: [
      { char: "고", cho: "ㄱ", jung: "ㅗ", breakdown: "ㄱ + ㅗ" },
      { char: "모", cho: "ㅁ", jung: "ㅗ", breakdown: "ㅁ + ㅗ" }
    ]
  },
  {
    id: "nb116",
    word: "소",
    stage: 1,
    category: "동물",
    emoji: "🐂",
    hint: "음머 울며 착하고 힘이 센 동물",
    description: "커다란 눈망울로 '음머~' 소리 내며 풀을 맛있게 먹고 우유를 선물해 주는 고마운 동물이에요.",
    syllables: [
      { char: "소", cho: "ㅅ", jung: "ㅗ", breakdown: "ㅅ + ㅗ" }
    ]
  },
  {
    id: "nb117",
    word: "비",
    stage: 1,
    category: "자연",
    emoji: "🌧️",
    hint: "하늘에서 주룩주룩 내리는 물방울",
    description: "먹구름 사이로 투둑투둑 떨어져 메마른 식물들에게 시원한 물을 주는 하늘의 선물이에요.",
    syllables: [
      { char: "비", cho: "ㅂ", jung: "ㅣ", breakdown: "ㅂ + ㅣ" }
    ]
  },
  {
    id: "nb118",
    word: "새",
    stage: 2,
    category: "동물",
    emoji: "🕊️",
    hint: "하늘을 펄펄 날아다니는 날개 달린 동물",
    description: "가벼운 날개로 파란 하늘을 훨훨 날아다니며 나뭇가지에 앉아 맑은 소리로 노래해요.",
    syllables: [
      { char: "새", cho: "ㅅ", jung: "ㅐ", breakdown: "ㅅ + ㅐ" }
    ]
  }
];

// 종성(받침) 무결성 엄격 검증
vocabList.forEach((item) => {
  for (let ch of item.word) {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const jong = (code - 0xAC00) % 28;
      if (jong !== 0) {
        throw new Error(`종성이 발견되었습니다: ${item.word} 의 글자 ${ch}`);
      }
    }
  }
});

const content = `/**
 * [초등 1학년 필수 받침 없는 단어 118선 데이터베이스 v2]
 * 초등 1학년 한글 미해득 아동을 위해 종성(받침)이 전혀 없는 순수 개음절 단어 118선입니다.
 * - 단어가 큰 글씨로 먼저 노출되고, 선택 시 그림과 친절한 1학년 눈높이 설명 제공
 * - 주제별(동물, 음식, 자연, 사물, 탈것, 신체, 가족) 7대 영역 분류
 * - 단계별(🌱 1단계 기초 씨앗 ➔ 🌿 2단계 새싹 자모 확장 ➔ 🌳 3단계 꽃잎 3음절 이상) 분류
 */

export const NO_BATCHIM_VOCAB = ${JSON.stringify(vocabList, null, 2)};
`;

fs.writeFileSync('/Users/shinjoohan/antigravity/Hangeul/src/data/noBatchimVocab.js', content, 'utf8');
console.log(`성공적으로 118개 단어 데이터를 생성했습니다. (전원 받침 0 검증 통과)`);
