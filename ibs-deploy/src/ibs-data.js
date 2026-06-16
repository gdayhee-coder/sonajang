import { useState, useEffect, useCallback } from "react";

const IBS_TYPES = {
  constipation: {
    label: "IBS-C (변비형)",
    emoji: "🟤",
    color: "#8B5E3C",
    bg: "#FFF8F3",
    accent: "#C47A3A",
    desc: "변비가 주요 증상. 딱딱하거나 뭉친 변, 배변 후에도 잔변감이 있는 유형",
  },
  diarrhea: {
    label: "IBS-D (설사형)",
    emoji: "💧",
    color: "#2D6FA6",
    bg: "#F0F7FF",
    accent: "#3A7FC4",
    desc: "설사가 주요 증상. 무른 변, 급박한 배변 욕구, 복통이 반복되는 유형",
  },
  mixed: {
    label: "IBS-M (혼합형)",
    emoji: "🔄",
    color: "#5A3D8A",
    bg: "#F5F0FF",
    accent: "#7B5CC4",
    desc: "변비와 설사가 번갈아 나타나는 유형. 가장 흔한 IBS 유형 중 하나",
  },
  unclassified: {
    label: "IBS-U (미분류형)",
    emoji: "❓",
    color: "#2D7A5F",
    bg: "#F0FBF6",
    accent: "#3A9E78",
    desc: "특정 패턴이 없거나 아직 파악 중인 유형. 전반적인 복부 불편감이 특징",
  },
};

// ── 커스텀 라인 아이콘: 꽉 찬 원(정체) · 물방울(흐름) · 반반 원(혼합) · 점선 원(미정)
const TypeIcon = ({ type, color = "#2E5045", size = 24 }) => {
  if (type === "constipation") return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="9" fill={color} />
      <circle cx="13" cy="13" r="11.5" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
    </svg>
  );
  if (type === "diarrhea") return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <path d="M13 3.5 C13 3.5 5.5 12 5.5 16.5 C5.5 20.6 8.9 23.5 13 23.5 C17.1 23.5 20.5 20.6 20.5 16.5 C20.5 12 13 3.5 13 3.5 Z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 16.5 C9.5 18.7 11 20 12.2 20.2" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
  if (type === "mixed") return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="9.5" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M13 3.5 A9.5 9.5 0 0 1 13 22.5 Z" fill={color} />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="9.5" fill="none" stroke={color} strokeWidth="1.8" strokeDasharray="3.5 3.5" strokeLinecap="round" />
      <circle cx="13" cy="13" r="2" fill={color} />
    </svg>
  );
};

const FOOD_DATA = {
  constipation: {
    avoid: [
      { name: "정제된 흰 밀가루 제품", reason: "섬유질 부족, 장 운동 억제", icon: "🍞" },
      { name: "붉은 육류 (소고기, 돼지고기)", reason: "소화가 느리고 장 이동 시간 증가", icon: "🥩" },
      { name: "유제품 (우유, 치즈)", reason: "일부에서 장 운동 감소 유발", icon: "🧀" },
      { name: "바나나 (덜 익은 것)", reason: "타닌 성분이 변비 악화", icon: "🍌" },
      { name: "알코올", reason: "장 탈수 유발, 변 굳어짐", icon: "🍺" },
      { name: "카페인 (과다 섭취)", reason: "탈수로 변비 악화 가능", icon: "☕" },
    ],
    recommended: {
      "고섬유 식품": {
        icon: "🌾",
        color: "#4CAF50",
        foods: [
          { name: "귀리 & 오트밀", benefit: "수용성 섬유질로 변 부드럽게", icon: "🥣" },
          { name: "고구마", benefit: "불용성 섬유질 풍부, 장 운동 촉진", icon: "🍠" },
          { name: "브로콜리", benefit: "섬유질 + 수분 함량 높음", icon: "🥦" },
          { name: "통곡물밥", benefit: "정제 탄수화물 대신 섬유질 공급", icon: "🍚" },
        ],
      },
      "수분 공급 식품": {
        icon: "💧",
        color: "#2196F3",
        foods: [
          { name: "오이", benefit: "95% 수분, 장 윤활에 도움", icon: "🥒" },
          { name: "수박", benefit: "수분 + 천연 당으로 장 자극", icon: "🍉" },
          { name: "셀러리", benefit: "수분 + 식이섬유 복합 효과", icon: "🥬" },
        ],
      },
      "프로바이오틱스": {
        icon: "🦠",
        color: "#FF9800",
        foods: [
          { name: "요거트 (무가당)", benefit: "유산균으로 장내 환경 개선", icon: "🥛" },
          { name: "김치 (소량)", benefit: "발효 유산균, 장 운동 자극", icon: "🥬" },
          { name: "낫토", benefit: "강력한 프로바이오틱스 효과", icon: "🫘" },
        ],
      },
    },
  },
  diarrhea: {
    avoid: [
      { name: "고FODMAP 식품 (양파, 마늘)", reason: "발효성 탄수화물이 가스·설사 유발", icon: "🧅" },
      { name: "유제품 (유당 민감시)", reason: "유당불내증 동반 시 설사 악화", icon: "🥛" },
      { name: "기름진 튀김류", reason: "고지방이 장 과활성화 유발", icon: "🍟" },
      { name: "인공 감미료 (소르비톨)", reason: "삼투성 설사 유발", icon: "🍬" },
      { name: "카페인 (커피, 에너지드링크)", reason: "장 수축 촉진, 설사 악화", icon: "☕" },
      { name: "생채소 과다 섭취", reason: "불용성 섬유가 설사 시 자극", icon: "🥗" },
      { name: "탄산음료", reason: "가스 팽만 + 장 자극", icon: "🥤" },
    ],
    recommended: {
      "완화 식품 (BRAT)": {
        icon: "🍌",
        color: "#FFC107",
        foods: [
          { name: "바나나 (익은 것)", benefit: "펙틴이 변 굳히기, 전해질 보충", icon: "🍌" },
          { name: "흰쌀밥", benefit: "소화 쉽고 장 자극 최소화", icon: "🍚" },
          { name: "사과소스 (무가당)", benefit: "펙틴이 장 점막 보호", icon: "🍎" },
          { name: "토스트 (흰 빵)", benefit: "소화 부담 없이 에너지 공급", icon: "🍞" },
        ],
      },
      "저FODMAP 식품": {
        icon: "✅",
        color: "#4CAF50",
        foods: [
          { name: "닭가슴살", benefit: "저지방 단백질, 소화 부담 최소", icon: "🍗" },
          { name: "당근 (익힌 것)", benefit: "수용성 섬유로 변 형성 도움", icon: "🥕" },
          { name: "두부", benefit: "저FODMAP 단백질 공급원", icon: "🫘" },
          { name: "감자 (삶은 것)", benefit: "저섬유, 소화 용이, 전해질", icon: "🥔" },
        ],
      },
      "전해질 보충": {
        icon: "⚡",
        color: "#9C27B0",
        foods: [
          { name: "코코넛 워터", benefit: "천연 전해질 (칼륨, 나트륨)", icon: "🥥" },
          { name: "미역국 (저염)", benefit: "미네랄 + 수분 보충", icon: "🍲" },
        ],
      },
    },
  },
  mixed: {
    avoid: [
      { name: "고FODMAP 식품", reason: "양쪽 증상 모두 악화 가능", icon: "❌" },
      { name: "글루텐 함유 식품", reason: "일부 IBS-M에서 민감도 높음", icon: "🍞" },
      { name: "유제품", reason: "유당이 설사·변비 모두 유발 가능", icon: "🧀" },
      { name: "가공식품 (방부제, 첨가물)", reason: "장내 세균총 불균형 유발", icon: "🍕" },
      { name: "알코올", reason: "장 점막 손상, 증상 악화", icon: "🍷" },
      { name: "과도한 생채소", reason: "소화 불량 및 가스 유발", icon: "🥗" },
    ],
    recommended: {
      "저FODMAP 균형식": {
        icon: "⚖️",
        color: "#607D8B",
        foods: [
          { name: "귀리 (소량)", benefit: "수용성 섬유로 양방향 조절", icon: "🌾" },
          { name: "연어", benefit: "오메가3로 장 염증 완화", icon: "🐟" },
          { name: "호박 (익힌 것)", benefit: "소화 용이, 섬유질 균형", icon: "🎃" },
          { name: "계란", benefit: "저FODMAP 완전 단백질", icon: "🥚" },
        ],
      },
      "장내 환경 개선": {
        icon: "🦠",
        color: "#8BC34A",
        foods: [
          { name: "발효식품 (소량)", benefit: "프로바이오틱스로 균형 유지", icon: "🥬" },
          { name: "올리브 오일", benefit: "항염증 효과, 장 점막 보호", icon: "🫒" },
          { name: "생강차", benefit: "소화 촉진 + 경련 완화", icon: "🫖" },
        ],
      },
      "규칙적 식사 기반": {
        icon: "🕐",
        color: "#FF5722",
        foods: [
          { name: "현미밥 (소량)", benefit: "점진적 섬유 도입으로 조절", icon: "🍚" },
          { name: "삶은 닭고기", benefit: "균일한 소화 속도 유지", icon: "🍗" },
          { name: "블루베리", benefit: "저FODMAP 항산화 과일", icon: "🫐" },
        ],
      },
    },
  },
  unclassified: {
    avoid: [
      { name: "초가공식품", reason: "장내 미생물 불균형 유발", icon: "🍔" },
      { name: "과당이 많은 과일 (망고, 포도)", reason: "복부 팽만 및 불편감", icon: "🍇" },
      { name: "탄산음료 & 인공감미료", reason: "가스 생성 및 장 자극", icon: "🥤" },
      { name: "매운 음식", reason: "장 점막 자극 및 경련 유발", icon: "🌶️" },
      { name: "과식", reason: "과신전으로 복통 유발", icon: "🍽️" },
    ],
    recommended: {
      "기본 안전 식품": {
        icon: "🛡️",
        color: "#4CAF50",
        foods: [
          { name: "흰쌀밥", benefit: "가장 소화 부담 적은 주식", icon: "🍚" },
          { name: "닭가슴살 (삶은)", benefit: "단백질, 소화 쉬움", icon: "🍗" },
          { name: "당근 (익힌)", benefit: "부드러운 식이섬유 공급", icon: "🥕" },
          { name: "사과 (껍질 제거)", benefit: "펙틴, 장 점막 보호", icon: "🍎" },
        ],
      },
      "항염증 식품": {
        icon: "🌿",
        color: "#26A69A",
        foods: [
          { name: "강황 (황금 우유)", benefit: "커큐민의 항염증 효과", icon: "🥛" },
          { name: "녹차", benefit: "카테킨으로 장 염증 억제", icon: "🍵" },
          { name: "연어", benefit: "오메가3 지방산, 장 보호", icon: "🐟" },
        ],
      },
    },
  },
};


const DINING_OUT_DATA = {
  constipation: {
    한식: [
      { menu: "비빔밥 (나물 듬뿍)", tip: "나물 섬유질 + 고추장 소량. 잡곡밥으로 업그레이드 요청 시 더 좋음", safe: true, icon: "🍚" },
      { menu: "된장찌개 + 잡곡밥", tip: "된장 프로바이오틱스 + 잡곡 섬유질 조합. 단골 메뉴로 추천", safe: true, icon: "🍲" },
      { menu: "청국장찌개", tip: "발효 균이 장 운동 촉진. 두부·채소 건더기 위주로 섭취", safe: true, icon: "🫕" },
      { menu: "삼계탕", tip: "부드러운 닭고기 + 수분. 기름 걷어내고 섭취 권장", safe: true, icon: "🍗" },
      { menu: "나물 정식 / 쌈밥", tip: "다양한 채소 섬유질. 쌈채소 듬뿍, 된장 찍어 먹기", safe: true, icon: "🥗" },
      { menu: "순두부찌개 (맑은)", tip: "자극 없는 단백질. 매운 버전은 피하고 맑은 국물 선택", safe: true, icon: "🫘" },
      { menu: "갈비탕 · 설렁탕", tip: "기름 과다 + 섬유질 전무. 변비 악화 위험", safe: false, icon: "🍖" },
      { menu: "제육볶음 · 불고기", tip: "고지방 돼지고기 + 양파 고FODMAP. 변비 악화", safe: false, icon: "🥩" },
    ],
    중식: [
      { menu: "채소 볶음밥 (마늘 줄여 달라고 요청)", tip: "마늘 최소화 요청 필수. 채소 듬뿍 버전으로 선택", safe: true, icon: "🍳" },
      { menu: "두부요리 (마파두부 순한맛)", tip: "두부 단백질 + 소화 용이. 매운맛 낮게 조절 요청", safe: true, icon: "🫘" },
      { menu: "훠궈 (버섯·채소 위주)", tip: "브로콜리·배추·두부 위주로 골라 먹기. 마라 소스 소량만", safe: true, icon: "🥘" },
      { menu: "짜장면 · 탕수육", tip: "춘장 고지방 + 양파 고FODMAP. 변비 악화 콤보", safe: false, icon: "🍝" },
      { menu: "마라탕 · 마라샹궈", tip: "마라 향신료 + 기름 과다. 장 점막 자극 심함", safe: false, icon: "🌶️" },
    ],
    양식: [
      { menu: "그린 샐러드 + 통곡물 빵", tip: "드레싱 따로 요청. 채소 섬유질로 장 운동 활성화", safe: true, icon: "🥗" },
      { menu: "연어 스테이크 + 채소 구이", tip: "오메가3 + 채소 섬유질 이상적 조합", safe: true, icon: "🐟" },
      { menu: "오트밀 브런치", tip: "수용성 섬유 베타글루칸. 베리류 토핑 추천", safe: true, icon: "🥣" },
      { menu: "아보카도 토스트 (통곡물)", tip: "건강한 지방 + 섬유질. 아보카도 과량은 중FODMAP 주의", safe: true, icon: "🥑" },
      { menu: "크림파스타 · 까르보나라", tip: "유제품 + 정제 탄수화물. 변비 악화", safe: false, icon: "🍝" },
      { menu: "버거 · 핫도그", tip: "정제 탄수화물 + 가공육. 섬유질 부족", safe: false, icon: "🍔" },
    ],
    아시아식: [
      { menu: "월남쌈 (채소 가득)", tip: "다양한 채소 + 라이스페이퍼. 고수·향신료 취향껏 조절", safe: true, icon: "🫔" },
      { menu: "일본식 낫토 정식", tip: "강력한 프로바이오틱스. 장 운동 촉진 최강 메뉴", safe: true, icon: "🫘" },
      { menu: "규동 (소고기 덮밥)", tip: "흰밥 + 소고기. 양파 양 많으면 주의, 간장 소량", safe: true, icon: "🍚" },
      { menu: "스시 (연어·흰살 생선 위주)", tip: "저FODMAP 생선 + 밥. 와사비·간장 소량", safe: true, icon: "🍣" },
      { menu: "팟타이 (채소·두부 버전)", tip: "쌀국수 기반 저자극. 고수 빼고, 매운맛 낮게 주문", safe: true, icon: "🍜" },
      { menu: "태국 그린·레드 커리", tip: "코코넛밀크 + 향신료 자극. 변비형엔 복부 팽만 유발", safe: false, icon: "🍛" },
    ],
    배달: [
      { menu: "치킨 (순살구이·오븐구이)", tip: "기름 적은 구이 타입. 양념치킨은 고추·마늘 소스 과다", safe: true, icon: "🍗" },
      { menu: "연어 포케 (하와이안 덮밥)", tip: "저FODMAP 생선 + 채소 + 밥. 어니언 소스 제외 요청", safe: true, icon: "🐟" },
      { menu: "곱창 · 막창", tip: "고지방 내장육. 소화 부담 극심, 변비 악화", safe: false, icon: "🫀" },
      { menu: "피자 (도우 두꺼운)", tip: "밀가루 + 유제품 + 양파 토핑 조합. 변비 악화", safe: false, icon: "🍕" },
      { menu: "떡볶이", tip: "밀가루떡 + 고추 + 양파. 변비 시 자극 주의", safe: false, icon: "🌶️" },
    ],
    편의점: [
      { menu: "귀리 삼각김밥 / 현미 주먹밥", tip: "정제 탄수화물 대신 섬유질. 훨씬 나은 선택", safe: true, icon: "🍙" },
      { menu: "삶은 계란 (편의점)", tip: "어디서나 구할 수 있는 저FODMAP 단백질", safe: true, icon: "🥚" },
      { menu: "바나나 (편의점)", tip: "잘 익은 것으로. 변비 완화에 도움", safe: true, icon: "🍌" },
      { menu: "그릭 요거트 (무가당)", tip: "편의점 제품 중 가장 추천. 당 함량 확인 필수", safe: true, icon: "🥛" },
      { menu: "믹스넛 소용량 팩", tip: "마그네슘 보충. 하루 한 팩(20g) 이내", safe: true, icon: "🌰" },
      { menu: "컵라면 · 봉지라면", tip: "정제 면 + 나트륨 과다 + 마늘 스프. 변비 악화", safe: false, icon: "🍜" },
      { menu: "삼각김밥 (일반 흰밥·참치마요)", tip: "정제 탄수화물 + 고지방 소스. 섬유질 없음", safe: false, icon: "🍙" },
      { menu: "핫바 · 어묵", tip: "가공식품 + 고나트륨. 장 점막 자극", safe: false, icon: "🌭" },
    ],
  },
  diarrhea: {
    한식: [
      { menu: "흰쌀밥 + 계란찜 + 두부조림", tip: "설사형 가장 안전한 조합. 담백하고 소화 용이", safe: true, icon: "🍚" },
      { menu: "닭죽 / 흰쌀죽", tip: "설사 당일 최고 선택. 수분 + 탄수화물 동시 보충", safe: true, icon: "🥣" },
      { menu: "미역국 (저염)", tip: "미네랄·수분 보충. 전해질 회복에 도움", safe: true, icon: "🍲" },
      { menu: "순두부찌개 (맑은)", tip: "부드러운 두부 단백질. 매운 순두부는 절대 금지", safe: true, icon: "🫘" },
      { menu: "북엇국 · 콩나물국밥", tip: "숙취해소 목적의 맑은 국물. 자극 없고 전해질 보충", safe: true, icon: "🍲" },
      { menu: "김치찌개 · 된장찌개", tip: "발효산 + 매운맛이 설사 극도로 악화", safe: false, icon: "🌶️" },
      { menu: "육개장 · 해장국 (매운)", tip: "고추 + 기름 + 내장류. 설사 최악의 조합", safe: false, icon: "🍖" },
      { menu: "냉면 (특히 비빔)", tip: "식초 + 고추장 + 냉자극 3중 설사 유발", safe: false, icon: "🍜" },
    ],
    중식: [
      { menu: "계란볶음밥 (담백하게)", tip: "마늘·양파 최소화 요청. 간장 소량. 설사형엔 무난", safe: true, icon: "🍳" },
      { menu: "완탕수프 (맑은 국물)", tip: "부드러운 만두피 + 육수. 소화 부담 낮음", safe: true, icon: "🍜" },
      { menu: "딤섬 (찐 것만)", tip: "튀긴 딤섬은 기름 과다. 찐 것만 선택", safe: true, icon: "🥟" },
      { menu: "짬뽕 · 짜장면", tip: "양파·마늘 다량 + 기름. 설사 폭발 위험", safe: false, icon: "🍜" },
      { menu: "마라탕 · 마라샹궈", tip: "마라 향신료 + 기름. 설사형 절대 금지 메뉴", safe: false, icon: "🌶️" },
    ],
    양식: [
      { menu: "치킨 수프 + 감자 (크림 없이)", tip: "닭육수 + 익힌 감자. 장 달래는 클래식 메뉴", safe: true, icon: "🍲" },
      { menu: "스크램블 에그 + 토스트", tip: "부드러운 단백질 + 소화 용이 탄수화물 조합", safe: true, icon: "🍳" },
      { menu: "연어 구이 + 찐 감자", tip: "저FODMAP 조합. 소스 없이 담백하게", safe: true, icon: "🐟" },
      { menu: "샐러드 (드레싱 따로)", tip: "생채소 과다 시 설사 자극. 드레싱 반드시 따로", safe: true, icon: "🥗" },
      { menu: "크림수프 · 감자수프", tip: "유제품 기반. 유당 민감하면 악화 가능", safe: false, icon: "🍲" },
      { menu: "버거 · 핫도그 · 감자튀김", tip: "기름 + 가공육 + 양파. 설사형 최악 조합", safe: false, icon: "🍔" },
    ],
    아시아식: [
      { menu: "오야코동 (계란·닭 덮밥)", tip: "담백한 닭고기 + 계란 + 흰밥. 설사형 안전식", safe: true, icon: "🍚" },
      { menu: "우동 (맑은 국물)", tip: "부드러운 면 + 따뜻한 국물. 가장 무난한 외식", safe: true, icon: "🍜" },
      { menu: "쌀국수 (퍼, 담백하게)", tip: "고수·향신료 빼고 주문. 라이스누들은 소화 용이", safe: true, icon: "🍜" },
      { menu: "미소라멘 (담백한)", tip: "된장 기반 맑은 국물. 마라·돈코츠는 피하기", safe: true, icon: "🍜" },
      { menu: "카레라이스", tip: "향신료 + 지방. 설사형 자극. 소량 시험 후 판단", safe: false, icon: "🍛" },
      { menu: "쌀국수 (매운 버전)", tip: "고추기름 + 향신료. 설사 즉각 악화", safe: false, icon: "🌶️" },
    ],
    배달: [
      { menu: "죽 배달 (흰쌀죽·닭죽·전복죽)", tip: "설사 당일 최고의 배달 선택. 자극 제로", safe: true, icon: "🥣" },
      { menu: "삼계탕 배달", tip: "부드러운 닭고기 + 국물. 기름 걷어내고 먹기", safe: true, icon: "🍗" },
      { menu: "치킨 (오븐구이 순살)", tip: "기름 적은 구이. 양념치킨은 설사 악화", safe: true, icon: "🍗" },
      { menu: "치킨 (양념 · 간장)", tip: "고추 + 마늘 + 기름 소스. 설사형 주의", safe: false, icon: "🌶️" },
      { menu: "족발 · 보쌈", tip: "고지방 돼지고기 + 마늘쌈장. 설사 악화", safe: false, icon: "🥩" },
      { menu: "피자 (모든 종류)", tip: "유제품 + 밀가루 + 양파 토핑. 설사 지속", safe: false, icon: "🍕" },
    ],
    편의점: [
      { menu: "흰쌀 삼각김밥 (매실·참치 소금)", tip: "담백한 충전식. 매운 소스 들어간 건 피하기", safe: true, icon: "🍙" },
      { menu: "바나나 (익은 것)", tip: "설사형 필수 간식. 펙틴이 변 형태 잡아줌", safe: true, icon: "🍌" },
      { menu: "삶은 계란", tip: "고단백 저자극. 설사 시 가장 안전한 편의점 단백질", safe: true, icon: "🥚" },
      { menu: "이온음료 (포카리·게토레이)", tip: "설사로 잃은 전해질 보충. 물과 1:1로 희석 권장", safe: true, icon: "🧃" },
      { menu: "쌀과자 (오리온 쌀과자 등)", tip: "저자극 탄수화물. 설사 시 에너지 보충", safe: true, icon: "🍘" },
      { menu: "컵라면 · 짜파게티", tip: "고추·마늘 스프 + 기름. 설사 즉각 악화", safe: false, icon: "🍜" },
      { menu: "제로 음료 (인공감미료)", tip: "소르비톨·말티톨 등 폴리올 설사 유발", safe: false, icon: "🥤" },
      { menu: "샌드위치 (마요네즈·양파)", tip: "양파 고FODMAP + 마요 고지방. 설사 악화", safe: false, icon: "🥪" },
    ],
  },
  mixed: {
    한식: [
      { menu: "연두부 + 흰쌀밥", tip: "부드러운 두부 단백질. 소화 균형에 가장 안전", safe: true, icon: "🫘" },
      { menu: "닭가슴살 덮밥 (저염)", tip: "저지방 단백질 + 흰밥. 소스 최소화로 주문", safe: true, icon: "🍚" },
      { menu: "나물비빔밥 (고추장 소량)", tip: "채소 섬유질이지만 고추장 양 조절 필수", safe: true, icon: "🥗" },
      { menu: "미역국 + 흰쌀밥", tip: "미네랄 + 수분. 자극 없는 안정적 조합", safe: true, icon: "🍲" },
      { menu: "삼계탕", tip: "부드러운 닭 + 수분. 혼합형에 균형 잡힌 메뉴", safe: true, icon: "🍗" },
      { menu: "제육볶음 · 오삼불고기", tip: "기름 + 양파 + 고추. 혼합형 양쪽 증상 모두 악화", safe: false, icon: "🥩" },
      { menu: "부대찌개", tip: "가공육 + 밀떡 + 양파. 혼합형 최악의 선택", safe: false, icon: "🌶️" },
    ],
    중식: [
      { menu: "채소 두부 볶음 (마늘 줄여 달라고 요청)", tip: "저FODMAP 채소 위주. 마늘 최소화 필수 요청", safe: true, icon: "🥦" },
      { menu: "계란탕", tip: "맑은 계란 수프. 자극 없고 영양 균형", safe: true, icon: "🥚" },
      { menu: "흰살생선 찜 (광어·도미)", tip: "저지방 단백질. 소스 없이 담백하게", safe: true, icon: "🐟" },
      { menu: "양꼬치 · 양갈비", tip: "고지방 육류 + 마라향신료. 혼합형 양쪽 모두 악화", safe: false, icon: "🌶️" },
    ],
    양식: [
      { menu: "그릴 치킨 + 찐 채소 (드레싱 따로)", tip: "저지방 단백질 + 저FODMAP 채소. 최고 조합", safe: true, icon: "🍗" },
      { menu: "연어 구이 + 감자 (삶은)", tip: "오메가3 항염증 + 안전한 탄수화물", safe: true, icon: "🐟" },
      { menu: "스크램블 에그 + 아보카도 (반개)", tip: "완전 단백질 + 건강한 지방. 아보카도 반개 초과 금지", safe: true, icon: "🥑" },
      { menu: "피자 · 파스타 (크림·토마토)", tip: "글루텐 + 유제품 + 양파. 혼합형 최악", safe: false, icon: "🍕" },
    ],
    아시아식: [
      { menu: "스시 (흰살·연어 위주)", tip: "저지방 생선 + 밥. 와사비 소량", safe: true, icon: "🍣" },
      { menu: "일본식 된장국 + 두부 정식", tip: "미소 프로바이오틱스 + 부드러운 두부. 균형식", safe: true, icon: "🍲" },
      { menu: "쌀국수 (담백한 육수, 향신료 제외)", tip: "라이스누들 안전. 고수·고추기름 빼고 주문", safe: true, icon: "🍜" },
      { menu: "규동 (소고기 덮밥, 양파 줄여 달라고)", tip: "양파 줄여 달라고 요청하면 중FODMAP 수준으로 관리 가능", safe: true, icon: "🍚" },
      { menu: "마사만커리 · 그린커리", tip: "코코넛밀크 + 향신료. 혼합형 모든 증상 자극", safe: false, icon: "🍛" },
    ],
    배달: [
      { menu: "죽 배달 (닭죽·야채죽)", tip: "혼합형 가장 안전한 배달 선택", safe: true, icon: "🥣" },
      { menu: "치킨 (오븐구이 순살)", tip: "기름 적은 구이. 소스 따로 요청", safe: true, icon: "🍗" },
      { menu: "초밥 배달 (생선 위주)", tip: "저지방 생선 + 밥. 소스 소량", safe: true, icon: "🍣" },
      { menu: "족발 · 보쌈", tip: "고지방 + 마늘 소스. 혼합형 위험", safe: false, icon: "🥩" },
      { menu: "떡볶이 · 순대", tip: "밀가루 + 고추 + 양파. 혼합형 양방향 자극", safe: false, icon: "🌶️" },
    ],
    편의점: [
      { menu: "귀리 or 현미 삼각김밥", tip: "섬유질 있는 탄수화물. 혼합형에 균형적", safe: true, icon: "🍙" },
      { menu: "삶은 계란", tip: "혼합형 언제나 안전한 단백질", safe: true, icon: "🥚" },
      { menu: "바나나 (잘 익은)", tip: "변비·설사 양방향 조절. 혼합형 필수 간식", safe: true, icon: "🍌" },
      { menu: "락토프리 우유 (매일·남양)", tip: "유당 부담 없는 단백질 보충", safe: true, icon: "🥛" },
      { menu: "믹스넛 소용량 팩", tip: "마그네슘 보충. 하루 한 팩 이내", safe: true, icon: "🌰" },
      { menu: "컵라면 · 신라면", tip: "고추 + 마늘 + 기름. 혼합형 최악", safe: false, icon: "🍜" },
      { menu: "핫도그 · 소시지 빵", tip: "가공육 + 밀가루 + 마늘. 양방향 자극", safe: false, icon: "🌭" },
    ],
  },
  unclassified: {
    한식: [
      { menu: "흰쌀밥 + 계란찜 + 두부", tip: "가장 무난한 조합. 증상 파악 중엔 단순하게", safe: true, icon: "🥚" },
      { menu: "닭죽 · 흰죽", tip: "증상 불명확할 때 가장 안전한 선택", safe: true, icon: "🥣" },
      { menu: "순두부찌개 (맑은)", tip: "자극 없는 단백질. 매운 버전은 피하기", safe: true, icon: "🫘" },
      { menu: "미역국 + 흰밥", tip: "기본적이고 안전. 소금 적게 요청", safe: true, icon: "🍲" },
      { menu: "매운 찌개·전골류", tip: "증상 파악 전 자극적 음식은 모두 피하기", safe: false, icon: "🌶️" },
    ],
    중식: [
      { menu: "계란볶음밥 (담백하게)", tip: "단순한 재료. 소화 부담 최소화", safe: true, icon: "🍳" },
      { menu: "두부요리 (담백한)", tip: "저FODMAP 단백질. 기본 안전식", safe: true, icon: "🫘" },
      { menu: "마라 · 양념 강한 메뉴", tip: "증상 불명확 시 자극 향신료 모두 피하기", safe: false, icon: "🌶️" },
    ],
    양식: [
      { menu: "닭가슴살 샌드위치 (통곡물)", tip: "양상추·토마토·머스터드. 마요·양파 빼고 주문", safe: true, icon: "🥪" },
      { menu: "스크램블 에그 + 토스트", tip: "가장 안전하고 어디서나 구할 수 있는 브런치", safe: true, icon: "🍳" },
      { menu: "그릴 연어 + 샐러드", tip: "오메가3 + 채소. 드레싱 따로 요청", safe: true, icon: "🐟" },
      { menu: "튀김류 · 패스트푸드 전반", tip: "고지방 가공식품. 어떤 유형이든 자극", safe: false, icon: "🍟" },
    ],
    아시아식: [
      { menu: "우동 (맑은 국물)", tip: "소화 부담 최소. 증상 불명확할 때 가장 무난", safe: true, icon: "🍜" },
      { menu: "오야코동 (닭·계란 덮밥)", tip: "계란 + 닭 + 흰밥. 안전하고 영양 균형", safe: true, icon: "🍚" },
      { menu: "스시 (흰살 생선 위주)", tip: "담백한 생선. 와사비 소량", safe: true, icon: "🍣" },
      { menu: "매운 라멘 · 탄탄면", tip: "기름 + 향신료. 증상 불명확 시 절대 피하기", safe: false, icon: "🍜" },
    ],
    배달: [
      { menu: "죽 배달 (흰죽·닭죽)", tip: "증상 파악 중 가장 안전한 배달 메뉴", safe: true, icon: "🥣" },
      { menu: "치킨 (구이 순살)", tip: "기름 적은 구이로 선택. 소스 따로", safe: true, icon: "🍗" },
      { menu: "초밥 (생선 위주)", tip: "담백한 선택. 연어·광어·도미 위주", safe: true, icon: "🍣" },
      { menu: "떡볶이 · 순대 · 튀김 세트", tip: "자극 조합의 끝. 증상 파악 전 금지", safe: false, icon: "🌶️" },
      { menu: "야식 치킨 (양념·버팔로)", tip: "고추 소스 + 기름. 야식 특히 증상 악화", safe: false, icon: "🌶️" },
    ],
    편의점: [
      { menu: "흰쌀 삼각김밥 (참치·매실)", tip: "가장 무난한 편의점 식사", safe: true, icon: "🍙" },
      { menu: "삶은 계란", tip: "어디서나 구할 수 있는 안전 단백질", safe: true, icon: "🥚" },
      { menu: "바나나", tip: "무난한 과일. 잘 익은 것으로", safe: true, icon: "🍌" },
      { menu: "이온음료 (희석해서)", tip: "수분·전해질 보충. 물과 1:1 희석 권장", safe: true, icon: "🧃" },
      { menu: "컵라면 · 분식류", tip: "고나트륨 + 자극성 분말. 피하기", safe: false, icon: "🍜" },
      { menu: "제로콜라 · 탄산음료", tip: "인공감미료 + 탄산. 복부 팽만 즉각 유발", safe: false, icon: "🥤" },
    ],
  },
};

// ── FODMAP 하위그룹별 식품 분류 (누적 경고용) ──────────────────
// 각 그룹의 1회 제공량당 FODMAP 점수: 0=안전 1=주의 2=위험
// ── 유형별 특별 추천 음식 ──────────────────────────────────────
const SPECIAL_RECO = {
  constipation: ["귀리 & 오트밀", "고구마", "아마씨", "차전자피 (사일리엄)", "마그네슘 보충"],
  diarrhea:     ["흰쌀밥", "닭가슴살", "바나나 (잘 익은)", "오트밀", "당근"],
  mixed:        ["귀리 & 오트밀", "흰쌀밥", "닭가슴살", "바나나 (잘 익은)"],
  unclassified: ["흰쌀밥", "닭가슴살", "오트밀"],
};

const FODMAP_SUBGROUPS = {
  fructan: {
    name: "프럭탄",
    desc: "밀·마늘·양파 계열",
    safeLimit: 1,
    foods: {
      "마늘": 2, "마늘 소스": 2, "양파": 2, "어니언 드레싱": 2,
      "파": 1, "쪽파": 1, "라면": 2, "우동": 1, "파스타": 1,
      "식빵": 1, "베이글": 1, "떡": 0, "쌀국수": 0, "고추장": 1, "쌈장": 1,
    },
  },
  gos: {
    name: "GOS (갈락탄)",
    desc: "콩류 계열",
    safeLimit: 1,
    foods: {
      "콩": 2, "두부": 0, "두유": 1, "된장국": 1, "청국장찌개": 1,
      "된장 양념": 1, "굴소스": 1, "브로콜리": 1,
    },
  },
  lactose: {
    name: "락토오스 (유당)",
    desc: "유제품 계열",
    safeLimit: 1,
    foods: {
      "우유": 2, "아이스크림": 2, "요거트": 1, "치즈": 1,
      "버터": 0, "버터 소스": 1, "크림 소스": 2, "두유": 0,
    },
  },
  fructose: {
    name: "프럭토오스 (과당)",
    desc: "꿀·망고·사과 계열",
    safeLimit: 1,
    foods: {
      "사과": 2, "망고": 2, "수박": 2, "꿀": 2,
      "케첩": 1, "데리야키 소스": 1, "배": 1,
    },
  },
  sorbitol: {
    name: "소르비톨",
    desc: "자두·살구·아보카도 계열",
    safeLimit: 1,
    foods: {
      "아보카도 토스트 (통곡물)": 1, "자두": 2, "살구": 2,
      "버섯": 1, "콜리플라워": 1,
    },
  },
  mannitol: {
    name: "만니톨",
    desc: "버섯·콜리플라워 계열",
    safeLimit: 1,
    foods: {
      "버섯": 2, "콜리플라워": 2, "고구마": 1, "셀러리": 1,
    },
  },
};

const FODMAP_LEVELS = {
  // 식단 가이드 음식
  "귀리 & 오트밀": "low", "고구마": "mid", "브로콜리": "low", "통곡물밥": "low",
  "오이": "low", "수박": "high", "셀러리": "mid", "요거트 (무가당)": "mid",
  "김치 (소량)": "low", "낫토": "low",
  "바나나 (익은 것)": "mid", "흰쌀밥": "low", "사과소스 (무가당)": "high", "토스트 (흰 빵)": "mid",
  "닭가슴살": "low", "당근 (익힌 것)": "low", "두부": "low", "감자 (삶은 것)": "low",
  "코코넛 워터": "mid", "미역국 (저염)": "low",
  "귀리 (소량)": "low", "연어": "low", "호박 (익힌 것)": "low", "계란": "low",
  "발효식품 (소량)": "low", "올리브 오일": "low", "생강차": "low",
  "현미밥 (소량)": "low", "삶은 닭고기": "low", "블루베리": "low",
  "닭가슴살 (삶은)": "low", "당근 (익힌)": "low", "사과 (껍질 제거)": "high",
  "강황 (황금 우유)": "mid", "녹차": "low",
  // 간식
  "프룬 (말린 자두)": "high", "키위": "low", "아몬드 한 줌": "low",
  "무가당 요거트 + 베리": "mid", "고구마말랭이": "mid", "오트밀 쿠키 (저당)": "low",
  "바나나 (잘 익은 것)": "mid", "쌀과자·누룽지": "low", "삶은 계란": "low",
  "구운 사과·사과소스": "high", "글루텐프리 크래커": "low", "따뜻한 보리차·생강차": "low",
  "잘 익은 바나나": "mid", "블루베리 한 컵": "low", "쌀 크래커 + 땅콩버터 소량": "low",
  "락토프리 요거트 (소량)": "low", "다크초콜릿 1~2조각": "low",
  "바나나": "mid", "쌀과자": "low", "삶은 감자·고구마 소량": "mid", "보리차·캐모마일차": "low",
  // 외식 메뉴
  "비빔밥 (나물 듬뿍)": "mid", "된장찌개 + 잡곡밥": "mid", "청국장찌개": "low",
  "나물 정식": "mid", "삼계탕": "mid", "채소 볶음밥": "mid",
  "두부요리 (마파두부 순한맛)": "mid", "야채 짬뽕 (순한맛)": "high",
  "그린 샐러드 + 통곡물 빵": "mid", "오트밀 브런치": "low",
  "연어 스테이크 (채소 곁들임)": "low", "아보카도 토스트 (통곡물)": "high",
  "월남쌈 (채소 가득)": "low", "팟타이 (채소 추가)": "mid", "일본식 낫토 정식": "low",
  "스시 (야채·연어 위주)": "low",
  "흰쌀밥 + 두부조림": "low", "닭죽 / 쌀죽": "low", "계란찜": "low",
  "계란볶음밥 (담백하게)": "low", "완탕수프 (맑은)": "mid", "딤섬 (찐 것)": "mid",
  "치킨 수프 (채소 최소)": "low", "스크램블 에그 + 토스트": "mid", "감자 수프": "mid",
  "오야코동 (일본 덮밥)": "mid", "우동 (맑은 국물)": "mid", "쌀국수 (퍼, 담백하게)": "low",
  "연두부 + 흰쌀밥": "low", "닭가슴살 덮밥": "mid", "나물비빔밥 (고추장 소량)": "mid",
  "채소 두부 볶음": "low", "계란탕": "low", "흰살생선 찜": "low",
  "그릴 치킨 샐러드": "low", "연어 구이 + 감자": "low", "스크램블 에그 + 아보카도": "mid",
  "스시 (흰살 생선)": "low", "일본식 된장국 + 두부": "low", "쌀국수 (담백한 육수)": "low",
  "흰쌀밥 + 계란찜": "low", "닭죽": "low", "두부찌개 (순두부 맑은)": "low",
  "계란볶음밥": "low", "두부요리 (담백한)": "low",
  "닭가슴살 샌드위치 (통곡물)": "mid", "스크램블 에그 + 과일": "low", "그릴 연어": "low",
  "오야코동": "mid",
  // 확장 외식·배달·편의점
  "비빔밥 (나물 듬뿍)": "mid", "된장찌개 + 잡곡밥": "mid", "청국장찌개": "low",
  "삼계탕": "low", "나물 정식 / 쌈밥": "low", "순두부찌개 (맑은)": "low",
  "갈비탕 · 설렁탕": "mid", "제육볶음 · 불고기": "high",
  "채소 볶음밥 (마늘 줄여 달라고 요청)": "mid", "두부요리 (마파두부 순한맛)": "low",
  "훠궈 (버섯·채소 위주)": "mid", "짜장면 · 탕수육": "high", "마라탕 · 마라샹궈": "high",
  "그린 샐러드 + 통곡물 빵": "low", "연어 스테이크 + 채소 구이": "low",
  "오트밀 브런치": "low", "아보카도 토스트 (통곡물)": "mid",
  "크림파스타 · 까르보나라": "high", "버거 · 핫도그": "high",
  "월남쌈 (채소 가득)": "low", "일본식 낫토 정식": "low",
  "규동 (소고기 덮밥)": "mid", "스시 (연어·흰살 생선 위주)": "low",
  "팟타이 (채소·두부 버전)": "mid", "태국 그린·레드 커리": "high",
  // 배달
  "치킨 (순살구이·오븐구이)": "low", "연어 포케 (하와이안 덮밥)": "low",
  "곱창 · 막창": "mid", "피자 (도우 두꺼운)": "high", "떡볶이": "high",
  "죽 배달 (흰쌀죽·닭죽·전복죽)": "low", "삼계탕 배달": "low",
  "치킨 (오븐구이 순살)": "low", "치킨 (양념 · 간장)": "high",
  "족발 · 보쌈": "mid", "피자 (모든 종류)": "high",
  "죽 배달 (닭죽·야채죽)": "low", "초밥 배달 (생선 위주)": "low",
  "치킨 (구이 순살)": "low", "초밥 (생선 위주)": "low",
  "떡볶이 · 순대": "high", "야식 치킨 (양념·버팔로)": "high",
  // 편의점
  "귀리 삼각김밥 / 현미 주먹밥": "low", "삶은 계란 (편의점)": "low",
  "바나나 (편의점)": "mid", "그릭 요거트 (무가당)": "low",
  "믹스넛 소용량 팩": "low", "컵라면 · 봉지라면": "high",
  "삼각김밥 (일반 흰밥·참치마요)": "mid", "핫바 · 어묵": "mid",
  "흰쌀 삼각김밥 (매실·참치 소금)": "low", "이온음료 (포카리·게토레이)": "low",
  "쌀과자 (오리온 쌀과자 등)": "low", "컵라면 · 짜파게티": "high",
  "제로 음료 (인공감미료)": "high", "샌드위치 (마요네즈·양파)": "high",
  "귀리 or 현미 삼각김밥": "low", "락토프리 우유 (매일·남양)": "low",
  "컵라면 · 신라면": "high", "핫도그 · 소시지 빵": "high",
  "흰쌀 삼각김밥 (참치·매실)": "low", "바나나": "mid",
  "이온음료 (희석해서)": "low", "컵라면 · 분식류": "high",
  "제로콜라 · 탄산음료": "high",
  // 소스·양념·드레싱
  "마늘 소스": "high",       // 마늘 고FODMAP
  "어니언 드레싱": "high",   // 양파 고FODMAP
  "고추장": "mid",           // 고추 mid, 소량 가능
  "쌈장": "mid",             // 된장+고추장 혼합
  "크림 소스": "high",       // 유제품 고FODMAP
  "마요네즈": "low",         // 계란 기반, 저FODMAP
  "간장 소스": "low",        // 소량은 저FODMAP
  "된장 양념": "mid",        // 소량 mid
  "참기름": "low",           // 오일류 저FODMAP
  "올리브오일": "low",
  "발사믹": "low",           // 소량 저FODMAP
  "케첩": "mid",             // 토마토+당분 mid
  "굴소스": "mid",           // 소량 mid
  "마라 소스": "high",       // 마늘+향신료 고FODMAP
  "데리야키 소스": "mid",    // 간장+당분 mid
  "버터 소스": "mid",        // 유제품 mid
  "핫소스": "low",           // 고추 기반이지만 소량 low
  "쌀식초": "low",
  "레몬즙": "low",
};


// ── 끼니별 SVG 아이콘 (렌더 밖 상수) ──────────────────────────────
const MealIcon = ({ meal, color = "#00695C", size = 22 }) => {
  const w = size, h = size;
  const sw = "1.6";
  if (meal === "아침") return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.9" y1="4.9" x2="7.1" y2="7.1"/><line x1="16.9" y1="16.9" x2="19.1" y2="19.1"/>
      <line x1="19.1" y1="4.9" x2="16.9" y2="7.1"/><line x1="7.1" y1="16.9" x2="4.9" y2="19.1"/>
    </svg>
  );
  if (meal === "점심") return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11c0-4 2-7 5-7v14"/><path d="M12 4v4c0 2 2 3 3 3v9"/><line x1="10" y1="20" x2="7" y2="20"/>
    </svg>
  );
  if (meal === "저녁") return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"/>
    </svg>
  );
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 C7 3 4 7 4 11 C4 16 8 20 12 21 C16 20 20 16 20 11 C20 7 17 3 12 3Z"/>
      <path d="M9 12 a1.5 1.5 0 0 0 3 0 a1.5 1.5 0 0 0 3 0" strokeWidth="1.4"/>
      <circle cx="10" cy="9.5" r="0.7" fill={color} stroke="none"/>
      <circle cx="14" cy="9.5" r="0.7" fill={color} stroke="none"/>
    </svg>
  );
};

const FodmapBadge = ({ name }) => {
  const lv = FODMAP_LEVELS[name];
  if (!lv) return null;
  const cfg = {
    low:  { t: "저F", bg: "#EDF4EF", fg: "#3A6B52" },
    mid:  { t: "중F", bg: "#FFFBEB", fg: "#B7791F" },
    high: { t: "고F", bg: "#FDF2F2", fg: "#C0392B" },
  }[lv];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "1.5px 6px", borderRadius: 20, background: cfg.bg, color: cfg.fg, border: `1px solid ${cfg.fg}30`, whiteSpace: "nowrap", flexShrink: 0 }}>
      {cfg.t}
    </span>
  );
};

// ── 재도입기 FODMAP 그룹 (3일 챌린지) ──────────────────────────
const FODMAP_GROUPS = [
  { key: "fructan",  name: "프럭탄",        examples: "밀빵 · 양파 · 마늘",      test: "1일차 식빵 1장 → 2일차 1.5장 → 3일차 2장", icon: "🌾" },
  { key: "gos",      name: "갈락탄 (GOS)",  examples: "콩류 · 병아리콩",         test: "1일차 병아리콩 ¼컵 → 점진적으로 증량",      icon: "🫘" },
  { key: "lactose",  name: "유당",          examples: "우유 · 요거트 · 치즈",    test: "1일차 우유 ½컵 → 3일차 1컵",               icon: "🥛" },
  { key: "fructose", name: "과당",          examples: "꿀 · 망고 · 사과",        test: "1일차 꿀 1작은술 → 3일차 1큰술",            icon: "🍯" },
  { key: "sorbitol", name: "소르비톨",      examples: "자두 · 살구 · 아보카도",  test: "1일차 자두 1개 → 3일차 3개",               icon: "🍑" },
  { key: "mannitol", name: "만니톨",        examples: "버섯 · 콜리플라워",       test: "1일차 양송이 ¼컵 → 3일차 ½컵",             icon: "🍄" },
];

const MEAL_FOOD_GROUPS = {
  "밥·면·빵": ["흰쌀밥", "잡곡밥", "현미밥", "죽", "국수", "라면", "우동", "파스타", "쌀국수", "식빵", "베이글", "감자", "고구마", "떡"],
  "고기·생선·단백질": ["닭고기", "소고기", "돼지고기", "오리고기", "생선", "연어", "새우", "오징어", "두부", "계란", "콩", "햄·소시지"],
  "채소": ["브로콜리", "당근", "시금치", "양배추", "오이", "토마토", "버섯", "양파", "마늘", "파프리카", "상추", "호박", "가지", "콩나물"],
  "과일": ["사과", "바나나", "딸기", "블루베리", "포도", "오렌지", "키위", "수박", "배", "망고", "귤"],
  "유제품": ["우유", "요거트", "치즈", "버터", "아이스크림", "두유"],
  "국·찌개·반찬": ["된장국", "미역국", "김치찌개", "순두부", "김치", "나물", "장아찌", "샐러드"],
  "소스·양념·드레싱": [
    "마늘 소스", "어니언 드레싱", "고추장", "쌈장", "크림 소스", "마요네즈",
    "간장 소스", "된장 양념", "참기름", "올리브오일", "발사믹", "케첩",
    "굴소스", "마라 소스", "데리야키 소스", "버터 소스",
    "핫소스", "쌀식초", "레몬즙",
  ],
  "간식·디저트": ["과자", "초콜릿", "쿠키", "케이크", "빵류", "견과류", "쌀과자", "젤리"],
  "음료": ["커피", "녹차", "홍차", "탄산음료", "주스", "맥주", "와인", "소주", "물"],
};


export { IBS_TYPES, FOOD_DATA, DINING_OUT_DATA, FODMAP_LEVELS, FODMAP_SUBGROUPS, FODMAP_GROUPS, MEAL_FOOD_GROUPS, SPECIAL_RECO, QUIZ, TypeIcon, MealIcon, FodmapBadge };