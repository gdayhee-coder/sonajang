import { useState, useEffect, useRef } from "react";
const C = {
  bg:"#F6F4EE", surface:"#FEFCF7", surfaceAlt:"#F0EDE4",border:"#DDD8CC", borderStrong:"#C4BC9E",primary:"#4A7C59", primaryLight:"#EAF2EC", primaryMid:"#7BAE80",gold:"#C8A96E", goldLight:"#FBF5E8", goldBorder:"#E8D4A8",text:"#2C2417", textMid:"#5C4F3A", textMuted:"#9C8F7A",warn:"#B85450", warnBg:"#FDF0EF", warnBorder:"#F0B8B6",safe:"#4A7C59", safeBg:"#EAF2EC", safeBorder:"#A8CBB4",caution:"#C8936E", cautionBg:"#FDF5EE", cautionBorder:"#F0C8A8",
};
const QUIZ = [
  {
    id:"q1", q:"최근 3개월간 가장 자주 나타나는 변의 형태는?",opts:[
      {label:"딱딱한 변(1~2)", score:{C:2}},{label:"정상형(3~4)", score:{M:1,U:1}},{label:"흐물한 변(5~6)", score:{D:1,M:1}},{label:"묽은 변(7)", score:{D:2}},],},{
    id:"q2", q:"배변 횟수는 평균적으로 어떤가요?",opts:[
      {label:"주 3회 미만", score:{C:2}},{label:"하루 1~2회", score:{U:1}},{label:"하루 3회 이상", score:{D:2}},{label:"변비·설사 번갈아", score:{M:3}},],},{
    id:"q3", q:"배변 시 어떤 느낌이 드나요?",opts:[
      {label:"힘을 줘야함", score:{C:2}},{label:"급하게(긴박감)", score:{D:2}},{label:"둘 다 번갈아", score:{M:2}},{label:"해당 없음", score:{U:1}},],},{
    id:"q4", q:"복통이나 복부 불편감은 언제 주로 발생하나요?",opts:[
      {label:"배변전 악화·후 완화", score:{C:1,D:1}},{label:"식후 30분~2시간", score:{D:2}},{label:"배변과 무관", score:{U:2}},{label:"스트레스시 심해짐", score:{M:1,U:1}},],},{
    id:"q5", q:"복부 팽만감이나 가스가 얼마나 심한가요?",opts:[
      {label:"없음", score:{U:1}},{label:"가끔 있고 불편하지 않음", score:{C:1}},{label:"자주 있고 불편", score:{M:1,D:1}},{label:"거의 매일 심하게", score:{M:2}},],},{
    id:"q6", q:"증상이 가장 심한 시간대는?",opts:[
      {label:"아침~오전", score:{D:2}},{label:"식사 후", score:{D:1,M:1}},{label:"저녁~취침", score:{C:1,M:1}},{label:"하루 종일", score:{U:2}},],},{
    id:"q7", q:"음식과 증상의 관계는 어떤가요?",opts:[
      {label:"특정음식 후 설사·복통", score:{D:2}},{label:"며칠 후 변비", score:{C:2}},{label:"음식 무관", score:{U:2}},{label:"어떤 날은 괜찮고 어떤 날은 심함", score:{M:2}},],},{
    id:"q8", q:"대변을 본 후 느낌은 어떤가요?",opts:[
      {label:"다 본 느낌 없음 (잔변감)", score:{C:3}},{label:"급하게 여러 번", score:{D:3}},{label:"변비·급박감 번갈아", score:{M:3}},{label:"시원한 편", score:{U:1}},],},{
    id:"q9", q:"스트레스나 감정 변화가 증상에 미치는 영향은?",opts:[
      {label:"스트레스시 설사", score:{D:1,M:1}},{label:"스트레스→변비", score:{C:1}},{label:"감정 무관", score:{U:2}},{label:"중요일정 복통", score:{D:1,M:1}},],},{
    id:"q10", q:"증상이 얼마나 오래 지속되고 있나요?",opts:[
      {label:"6개월 미만", score:{U:2}},{label:"6개월~2년", score:{M:1,D:1,C:1}},{label:"2년 이상", score:{C:1,D:1}},{label:"10년 이상", score:{M:1,C:1}},],},
];
const TYPES = {
  constipation:{ label:"IBS-C 변비형", desc:"딱딱한 변·잔변감·배변 감소" },diarrhea:    { label:"IBS-D 설사형", desc:"묽은 변·급박한 변의·복통" },mixed:       { label:"IBS-M 혼합형", desc:"변비와 설사가 번갈아" },unclassified:{ label:"IBS-U 미분류", desc:"패턴 없는 복부 불편감" },
};
const FOODS = {
  constipation:{
    rec:[
      {name:"차전자피",reason:"ACG·AGA 강권고. 변비·설사 모두 개선. 섬유질 효과 필수, 탈수시 변비악화"},
      {name:"귀리·오트밀",reason:"CAG 권장 β-글루칸. 수용성 섬유질로 장 운동 촉진"},
      {name:"키위(2개/일)",reason:"BDA 2024 권장. 자연 완하 효과. 매일 섭취 권장"},
      {name:"자두·프룬",reason:"소르비톨+섬유질 복합 작용. 소량부터 시작"},
      {name:"아마씨(분쇄)",reason:"오메가3+섬유질. 물과 함께 충분히"},
      {name:"시금치·브로콜리",reason:"마그네슘+섬유질. 장 운동 촉진"},
    ],
    avoid:[
      {name:"흰쌀밥·흰빵",reason:"ACG 불용성↑ 증상악화. 정제 탄수화물은 장 운동 저하"},
      {name:"붉은 고기",reason:"장 운동 저하, 변비형 악화. 소화 느림, 주 2회 이하 권장"},
      {name:"유제품(과다)",reason:"일부에서 장 운동 저하. 소량은 무관"},
      {name:"바나나(덜익은)",reason:"탄닌 성분이 변비 악화. 잘 익은 것은 OK"},
      {name:"튀김·지방식",reason:"장 점막 자극, 변비악화"},
    ]
  },
  diarrhea:{
    rec:[
      {name:"흰쌀밥",reason:"BRAT 핵심, 소화 쉬움. 장 점막 자극 없음"},
      {name:"닭가슴살(삶은)",reason:"저지방 단백질. 소화 부담 없음"},
      {name:"바나나(잘익은)",reason:"펙틴+칼륨. 전해질 보충, 묽은 변 개선"},
      {name:"두부",reason:"저FODMAP 단백질. 소화 쉽고 자극 없음"},
      {name:"당근(익힌)",reason:"펙틴 함유. 장 점막 보호"},
      {name:"차전자피",reason:"수용성 섬유질로 변 굳히기 효과. 수분과 함께"},
    ],
    avoid:[
      {name:"마늘·양파",reason:"고FODMAP. 삼투성 설사 유발"},
      {name:"사과·수박·망고",reason:"과당·폴리올 과다. 설사 악화"},
      {name:"우유·아이스크림",reason:"락토오스. 설사형 IBS 대부분 민감"},
      {name:"커피·카페인",reason:"장 운동 과항진. 설사 악화"},
      {name:"탄산음료",reason:"가스 생성으로 복통·설사 악화"},
    ]
  },
  mixed:{
    rec:[
      {name:"차전자피",reason:"변비·설사 모두 개선. 혼합형 최우선 권장"},
      {name:"흰쌀밥",reason:"안정적 기저 식품. 소화 부담 없음"},
      {name:"닭가슴살",reason:"저지방 단백질. 증상 무관하게 안전"},
      {name:"당근(익힌)",reason:"수용성 섬유질. 변비·설사 모두 완화"},
      {name:"두부",reason:"저FODMAP 단백질. 어떤 패턴에도 안전"},
      {name:"귀리·오트밀",reason:"β-글루칸. 장 환경 안정화"},
    ],
    avoid:[
      {name:"마늘·양파·대파",reason:"고FODMAP. 혼합형에서 가장 흔한 트리거"},
      {name:"밀(글루텐)",reason:"프럭탄 함량 높음. 혼합형 증상 악화"},
      {name:"사과·배·복숭아",reason:"과당·폴리올. 설사 패턴 시 특히 주의"},
      {name:"커피",reason:"장 운동 과항진. 패턴 불안정 악화"},
    ]
  },
  unclassified:{
    rec:[
      {name:"흰쌀밥",reason:"가장 안전한 기저 식품"},
      {name:"닭가슴살",reason:"저지방·저FODMAP 단백질"},
      {name:"두부",reason:"저FODMAP. 어떤 증상 패턴에도 안전"},
      {name:"당근(익힌)",reason:"부드럽고 자극 없음"},
      {name:"차전자피",reason:"증상 패턴 안정화에 도움"},
      {name:"귀리·오트밀",reason:"장 환경 전반 개선"},
    ],
    avoid:[
      {name:"마늘·양파",reason:"고FODMAP. 가장 흔한 트리거"},
      {name:"고지방·튀김",reason:"소화 부담, 증상 악화"},
      {name:"커피·알코올",reason:"장 자극. 증상 불안정 악화"},
      {name:"가공식품",reason:"첨가물이 장 예민성 높임"},
    ]
  },
};
const DINING = {
  "한식":[
    {menu:"비빔밥(나물)",safe:true,tip:"마늘 소스 적게 요청"},
    {menu:"삼계탕",safe:true,tip:"담백하고 소화 쉬움"},
    {menu:"콩나물국밥",safe:true,tip:"맑은 국물 선택"},
    {menu:"불고기",safe:true,tip:"양파 적게 요청"},
    {menu:"된장찌개",safe:false,tip:"마늘·콩 고FODMAP"},
    {menu:"김치찌개",safe:false,tip:"발효 양념 과다"},
    {menu:"떡볶이",safe:false,tip:"고추장 양념 자극"},
  ],
  "양식":[
    {menu:"그릴드 치킨",safe:true,tip:"소스 별도 요청"},
    {menu:"연어 구이",safe:true,tip:"크림 소스 피하기"},
    {menu:"오트밀 브런치",safe:true,tip:"저FODMAP 토핑으로"},
    {menu:"파스타(크림)",safe:false,tip:"유제품·밀가루 고FODMAP"},
    {menu:"피자",safe:false,tip:"밀가루·치즈 자극"},
  ],
  "중식":[
    {menu:"쌀국수",safe:true,tip:"육수 맑은 것 선택"},
    {menu:"볶음밥(소스 적게)",safe:true,tip:"마늘·양파 최소"},
    {menu:"짜장면",safe:false,tip:"양파·밀 고FODMAP"},
    {menu:"마라탕",safe:false,tip:"강한 자극 피하기"},
  ],
  "일식":[
    {menu:"초밥(간단히)",safe:true,tip:"와사비 소량"},
    {menu:"연어덮밥",safe:true,tip:"간장 소량"},
    {menu:"라멘",safe:false,tip:"국물 자극·마늘 과다"},
    {menu:"우동",safe:false,tip:"밀가루 민감 주의"},
  ],
  "카페":[
    {menu:"블랙커피(소량)",safe:true,tip:"빈속 금지. 소량만"},
    {menu:"아메리카노",safe:true,tip:"우유 없이"},
    {menu:"라떼",safe:false,tip:"우유 락토오스"},
    {menu:"케이크·머핀",safe:false,tip:"밀가루·설탕 과다"},
  ],
};
const FODMAP_GROUPS_DATA = [
  {key:"fructan",name:"프럭탄",color:"#E74C3C",foods:"밀·보리·마늘·양파·파",trigger:"복부 팽만",test_foods:["밀빵","마늘","양파"],limit:"1일 1회 이하"},
  {key:"gos",name:"GOS(갈락탄)",color:"#E67E22",foods:"콩·렌틸·병아리콩·브로콜리",trigger:"복부 팽만",test_foods:["콩나물","두부(소량)","병아리콩"],limit:"1/4컵 이하"},
  {key:"lactose",name:"락토오스",color:"#F39C12",foods:"우유·아이스크림·요거트·생크림",trigger:"설사·복통",test_foods:["우유","아이스크림","크림"],limit:"1/4컵 이하"},
  {key:"fructose",name:"프럭토오스",color:"#27AE60",foods:"사과·망고·꿀·HFCS",trigger:"삼투성 설사",test_foods:["사과","꿀","망고"],limit:"소량만"},
  {key:"sorbitol",name:"소르비톨",color:"#2980B9",foods:"자두·살구·아보카도·블랙베리",trigger:"설사",test_foods:["자두","살구","아보카도"],limit:"소량만"},
  {key:"mannitol",name:"만니톨",color:"#8E44AD",foods:"버섯·콜리플라워·고구마",trigger:"복부 팽만",test_foods:["버섯","콜리플라워","고구마"],limit:"소량만"},
];
const FODMAP_LV = {
  "흰쌀밥":"low","귀리·오트밀":"low","고구마":"mid","닭가슴살":"low","계란":"low",
  "두부":"low","연어":"low","새우":"low","당근(익힌)":"low","시금치":"low","오이":"low",
  "토마토":"low","바나나(익은)":"low","딸기":"low","블루베리":"low","키위":"low",
  "우유":"high","두유":"low","마늘":"high","양파":"high","파":"mid",
  "사과":"high","수박":"high","망고":"high","식빵":"high","라면":"high",
  "쌀국수":"low","꿀":"high","올리고당":"high","아보카도":"mid","버섯":"high",
  "감자":"low","불고기":"high","제육볶음":"high","짜장면":"high","짬뽕":"high",
  "파스타":"high","피자":"high","햄버거":"high","아이스크림":"high",
  "땅콩":"low","커피(블랙)":"low","라떼(우유)":"high","초콜릿":"mid",
  "맥주":"high","와인":"mid","그릭요거트":"mid","아마씨":"low",
  "차전자피":"low","자두":"mid","브로콜리":"mid","양배추":"mid",
  "상추":"low","피망":"low","복숭아":"high","김치":"high",
  "된장찌개":"mid","순두부찌개":"low","삼겹살":"low","보쌈":"mid",
  "족발":"low","떡볶이":"high","탄산음료":"mid","녹차":"low",
};
const BADGE_BG = {low:"#EAF2EC",mid:"#FBF5E8",high:"#FDF0EF"};
const BADGE_COLOR = {low:"#4A7C59",mid:"#B7791F",high:"#C0392B"};

function ReportPanel({logs,repPeriod,setRepPeriod,C}) {
  if (logs.length<3) return (
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:36,marginBottom:12}}>📊</div>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:6}}>기록이 더 필요해요</div>
      <div style={{fontSize:12,color:C.textMuted}}>3개 이상 기록하면 리포트를 볼 수 있어요.</div>
    </div>
  );
  const now = Date.now();
  const cutms = now - repPeriod*864e5;
  const pData = logs.filter(e=>{ try{return new Date(e.isoDate||e.date).getTime()>=cutms;}catch(x){return false;} });
  const prevData = logs.filter(e=>{ try{const t=new Date(e.isoDate||e.date).getTime(); return t>=cutms-repPeriod*864e5&&t<cutms;}catch(x){return false;} });
  const avg = (arr,k) => arr.length ? arr.reduce((s,e)=>s+(e[k]||0),0)/arr.length : null;
  const curPain=avg(pData,"pain"), prevPain=avg(prevData,"pain");
  const curComf=avg(pData,"comfort"), prevComf=avg(prevData,"comfort");
  const painText=v=>v===null?"기록없음":v<0.5?"없음":v<1.2?"약한편":v<2?"조금심함":v<2.7?"심함":"매우심함";
  const painEmoji=v=>v===null?"❓":v<0.5?"😊":v<1.2?"🙂":v<2?"😐":v<2.7?"😣":"😫";
  const comfText=v=>v===null?"기록없음":v>=3.5?"매우좋음":v>=2.8?"좋은편":v>=2?"보통":v>=1.2?"별로":"나쁨";
  const comfEmoji=v=>v===null?"❓":v>=3.5?"🌟":v>=2.8?"😊":v>=2?"😐":v>=1.2?"😔":"😰";
  const painDiff = (prevPain!==null&&curPain!==null) ? curPain-prevPain : null;
  const comfDiff = (prevComf!==null&&curComf!==null) ? curComf-prevComf : null;
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  const wkMap={};
  logs.forEach(e=>{ try{ const d=new Date(e.isoDate||e.date); const ws=new Date(d); ws.setDate(d.getDate()-d.getDay()); const wk=ws.toISOString().slice(0,10); if(!wkMap[wk])wkMap[wk]={pain:[],comfort:[]}; wkMap[wk].pain.push(e.pain||0); wkMap[wk].comfort.push(e.comfort||3); }catch(x){} });
  const weeks = Object.entries(wkMap).sort(([a],[b])=>a.localeCompare(b)).slice(-6).map(([wk,d])=>({
    label:`${new Date(wk).getMonth()+1}/${new Date(wk).getDate()}`,pain:d.pain.reduce((s,v)=>s+v,0)/d.pain.length,comfort:d.comfort.reduce((s,v)=>s+v,0)/d.comfort.length,}));
  const maxPain=Math.max(...weeks.map(w=>w.pain),0.1);
  const maxComf=Math.max(...weeks.map(w=>w.comfort),0.1);
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[7,14,30].map(d=>{
          const cnt=logs.filter(e=>{ try{return (Date.now()-new Date(e.isoDate||e.date).getTime())/864e5<=d;}catch(x){return false;} }).length;
          const ok=cnt>=2;
          return <button key={d} onClick={()=>ok&&setRepPeriod(d)} style={{flex:1,padding:"8px",borderRadius:9,border:`1.5px solid ${repPeriod===d?C.gold:C.border}`,background:repPeriod===d?C.goldLight:C.surface,color:repPeriod===d?C.gold:ok?C.textMuted:C.border,fontSize:12,fontWeight:repPeriod===d?700:400,cursor:ok?"pointer":"default",opacity:ok?1:0.45}}>
            최근 {d}일{!ok?` (${cnt}개)`:""}</button>;
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {curPain!==null&&(
          <div style={{background:C.surface,borderRadius:14,padding:"14px 12px",border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:4}}>{painEmoji(curPain)}</div>
            <div style={{fontSize:18,fontWeight:800,color:painC(Math.round(curPain)),marginBottom:2}}>{painText(curPain)}</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>평균 복통</div>
            <div style={{display:"flex",gap:2}}>
              {["없음","약함","조금심함","심함"].map((l,i)=>(
                <div key={i} style={{flex:1,height:5,borderRadius:3,background:curPain>i+0.3?painC(Math.round(curPain)):C.border}} />
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
              <span style={{fontSize:9,color:C.textMuted}}>없음</span><span style={{fontSize:9,color:C.textMuted}}>심함</span>
            </div>
            {painDiff!==null&&<div style={{marginTop:8,fontSize:11,fontWeight:700,color:painDiff<-0.2?C.safe:painDiff>0.2?C.warn:C.textMuted}}>{painDiff<-0.2?`▼ ${Math.abs(painDiff).toFixed(1)} 개선됐어요 👍`:painDiff>0.2?`▲ ${painDiff.toFixed(1)} 악화됐어요`:"변화 없음"}</div>}
          </div>
        )}
        {curComf!==null&&(
          <div style={{background:C.surface,borderRadius:14,padding:"14px 12px",border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:4}}>{comfEmoji(curComf)}</div>
            <div style={{fontSize:18,fontWeight:800,color:comfC(Math.round(curComf)),marginBottom:2}}>{comfText(curComf)}</div>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>평균 컨디션</div>
            <div style={{display:"flex",gap:2}}>
              {["최고","좋음","보통","별로","나쁨"].map((l,i)=>(
                <div key={i} style={{flex:1,height:5,borderRadius:3,background:curComf>=(4-i)-0.3?comfC(Math.round(curComf)):C.border}} />
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
              <span style={{fontSize:9,color:C.textMuted}}>최고</span><span style={{fontSize:9,color:C.textMuted}}>나쁨</span>
            </div>
            {comfDiff!==null&&<div style={{marginTop:8,fontSize:11,fontWeight:700,color:comfDiff>0.2?C.safe:comfDiff<-0.2?C.warn:C.textMuted}}>{comfDiff>0.2?`▲ ${comfDiff.toFixed(1)} 좋아졌어요 👍`:comfDiff<-0.2?`▼ ${Math.abs(comfDiff).toFixed(1)} 나빠졌어요`:"변화 없음"}</div>}
          </div>
        )}
      </div>
      {weeks.length>=2&&(
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>주별 복통 변화</div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>낮을수록 좋아요</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:70,marginBottom:4}}>
            {weeks.map((w,i)=>{const h=Math.max(6,(w.pain/maxPain)*66);const col=w.pain<0.5?C.safe:w.pain<1.5?C.caution:C.warn;return<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{fontSize:10}}>{painEmoji(w.pain)}</div>
              <div style={{width:"100%",height:h,background:col,borderRadius:"3px 3px 0 0",opacity:0.8}} />
            </div>;})}
          </div>
          <div style={{display:"flex",gap:6}}>{weeks.map((w,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:C.textMuted}}>{w.label}</div>)}</div>
        </div>
      )}

      <div style={{background:C.goldLight,border:`1px solid ${C.goldBorder}`,borderRadius:12,padding:"14px 16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:6}}>최근 {repPeriod}일 요약</div>
        <div style={{fontSize:13,color:C.textMid,lineHeight:1.9}}>
          {pData.length}회 기록
          {curPain!==null&&<span>·복통은 <strong style={{color:painC(Math.round(curPain))}}>{painText(curPain)}</strong></span>}
          {curComf!==null&&<span>·컨디션은 <strong style={{color:comfC(Math.round(curComf))}}>{comfText(curComf)}</strong></span>}
          {painDiff!==null&&painDiff<-0.2&&<span style={{color:C.safe}}>·이전보다 나아지고 있어요 🌿</span>}
          {painDiff!==null&&painDiff>0.2&&<span style={{color:C.warn}}>·식단을 다시 점검해보세요</span>}
        </div>
      </div>
    </div>
  );
}
function Step1Panel({foods,setFoods,meal,setMeal,mealIdx,setMealIdx,mealFoods,setMealFoods,custom,setCustom,showAI,setShowAI,aiText,setAiText,aiImg,setAiImg,aiPrev,setAiPrev,aiRes,setAiRes,aiErr,setAiErr,aiLoad,analyzeAI,handleImg,fileRef,setStep,C}) {
  return (
    <div>
      {/* 끼니 탭 */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:14,background:C.surfaceAlt,padding:4,borderRadius:10}}>
        {MEALS.map((m,i)=>{
          const on=meal===m;
          return (
            <button key={m} onClick={()=>{
              if(foods.length>0) setMealFoods(p=>({...p,[meal]:[...new Set([...(p[meal]||[]),...foods])]}));
              setFoods([]); setMeal(m); setMealIdx(i);
              setCustom(""); setAiRes(null); setShowAI(false);
            }}
              style={{padding:"8px 4px",borderRadius:8,border:`1.5px solid ${on?C.primary:"transparent"}`,background:on?C.surface:"transparent",color:on?C.primary:C.textMuted,fontSize:12,fontWeight:on?700:400,cursor:"pointer",position:"relative"}}>
              {m}
              {((mealFoods[m]||[]).length>0||(meal===m&&foods.length>0))&&(
                <span style={{position:"absolute",top:1,right:1,width:13,height:13,borderRadius:"50%",background:C.gold,color:"#fff",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {(mealFoods[m]||[]).length||(meal===m?foods.length:0)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{fontSize:11,color:C.textMuted,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        <div style={{flex:1,height:1,background:C.border}} />
        <span>{meal} 음식 선택</span>
        <div style={{flex:1,height:1,background:C.border}} />
      </div>
      {/* AI 입력 */}
      <div style={{background:C.primaryLight,border:"1px solid "+C.safeBorder,borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",gap:8,alignItems:"center",cursor:"pointer"}} onClick={()=>setShowAI(!showAI)}>
        <span style={{fontSize:18}}>✨</span>
        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.primary}}>AI 입력 {showAI?"▲":"▼"}</div><div style={{fontSize:10.5,color:C.textMid}}>사진 또는 말로 입력</div></div>
      </div>
      {showAI&&(
        <div style={{background:C.surface,border:"1.5px solid "+C.primary,borderRadius:12,padding:14,marginBottom:10}}>
          <textarea value={aiText} onChange={e=>setAiText(e.target.value)} placeholder="비빔밥이랑 된장찌개 먹었어"
            style={{width:"100%",padding:"9px 12px",border:"1px solid "+C.border,borderRadius:9,fontSize:12,resize:"none",height:48,boxSizing:"border-box",outline:"none",marginBottom:6}} />
          {!aiPrev?<label style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",border:"1.5px dashed "+C.border,borderRadius:9,cursor:"pointer",marginBottom:6,background:C.surfaceAlt}}>
            <span style={{fontSize:15}}>📷</span><span style={{fontSize:11.5,color:C.textMuted}}>사진 선택</span>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImg} style={{display:"none"}} />
          </label>:<div style={{position:"relative",marginBottom:6}}>
            <img src={aiPrev} alt="식사" style={{width:"100%",maxHeight:110,objectFit:"cover",borderRadius:9}} />
            <button onClick={()=>{setAiImg(null);setAiPrev(null);}} style={{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",cursor:"pointer",fontSize:11}}>✕</button>
          </div>}
          {!aiRes&&<button onClick={analyzeAI} disabled={aiLoad||(!aiText.trim()&&!aiImg)} style={{width:"100%",padding:"8px",background:(aiText.trim()||aiImg)?C.primary:C.border,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>{aiLoad?"분석중...":"AI 분석"}</button>}
          {aiErr&&<div style={{fontSize:11,color:C.warn,marginTop:4}}>{aiErr}</div>}
          {aiRes&&<div>
            <div style={{fontSize:11,fontWeight:700,color:C.primary,marginBottom:5}}>인식된 음식 (탭하여 선택)</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:7}}>
              {aiRes.map((name,idx)=>{const on=foods.includes(name);return<button key={idx} onClick={()=>setFoods(p=>on?p.filter(x=>x!==name):[...p,name])} style={{padding:"4px 9px",borderRadius:20,border:"1.5px solid "+(on?C.primary:C.border),background:on?C.primaryLight:C.surfaceAlt,color:on?C.primary:C.text,fontSize:11,cursor:"pointer"}}>{on&&"✓ "}{name}<FBadge name={name} /></button>;})}
            </div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>{setFoods(p=>[...p,...aiRes.filter(n=>!p.includes(n))]);setShowAI(false);setAiRes(null);setAiText("");setAiImg(null);setAiPrev(null);}} style={{flex:2,padding:"7px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>선택 추가</button>
              <button onClick={()=>{setAiRes(null);setAiText("");setAiImg(null);setAiPrev(null);}} style={{flex:1,padding:"7px",background:C.surfaceAlt,color:C.textMid,border:"1px solid "+C.border,borderRadius:9,fontSize:11,cursor:"pointer"}}>다시</button>
            </div>
          </div>}
        </div>
      )}
      <div style={{fontSize:11,color:C.textMuted,marginBottom:6}}>빠른 선택</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
        {QUICK.map(f=>{
          const on=foods.includes(f);
          return <button key={f} onClick={()=>setFoods(p=>on?p.filter(x=>x!==f):[...p,f])} style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${on?C.primary:C.border}`,background:on?C.primaryLight:C.surfaceAlt,color:on?C.primary:C.textMid,fontSize:12,fontWeight:on?700:400,cursor:"pointer"}}>{on?"✓ ":""}{f}</button>;
        })}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&custom.trim()){setFoods(p=>[...p,custom.trim()]);setCustom("");}}} placeholder="직접 입력 + Enter" style={{flex:1,padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,outline:"none"}} />
        <button onClick={()=>{if(custom.trim()){setFoods(p=>[...p,custom.trim()]);setCustom("");}}} style={{padding:"9px 14px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,cursor:"pointer"}}>추가</button>
      </div>
      {foods.length>0&&(
        <div style={{background:C.surfaceAlt,borderRadius:8,padding:"8px 10px",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:4}}>{meal} — {foods.length}개</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {foods.map(f=><span key={f} onClick={()=>setFoods(p=>p.filter(x=>x!==f))} style={{fontSize:12,padding:"3px 9px",borderRadius:20,background:C.primaryLight,color:C.primary,cursor:"pointer",border:`1px solid ${C.safeBorder}`}}>{f} ✕</span>)}
          </div>
        </div>
      )}
      {Object.values(mealFoods).flat().length>0&&(
        <div style={{background:C.goldLight,border:`1px solid ${C.goldBorder}`,borderRadius:10,padding:"10px 12px",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:5}}>오늘 기록 요약</div>
          {MEALS.map(m2=>{const arr=[...new Set([...(mealFoods[m2]||[]),...(meal===m2?foods:[])])];if(!arr.length)return null;return<div key={m2} style={{display:"flex",gap:5,marginBottom:3}}><span style={{fontSize:10,fontWeight:700,color:C.gold,width:22,flexShrink:0}}>{m2}</span><div style={{display:"flex",flexWrap:"wrap",gap:2}}>{arr.map(f=><span key={f} style={{fontSize:10,padding:"1px 6px",borderRadius:20,background:C.surface,color:C.textMid}}>{f}</span>)}</div></div>;})}
        </div>
      )}
      <button onClick={()=>{
        if(foods.length>0) setMealFoods(p=>({...p,[meal]:[...new Set([...(p[meal]||[]),...foods])]}));
        setFoods([]);
        const total=Object.values({...mealFoods,[meal]:[...new Set([...(mealFoods[meal]||[]),...foods])]}).flat();
        if(total.length>0) setStep(2);
      }} disabled={Object.values(mealFoods).flat().length===0&&foods.length===0}
        style={{width:"100%",padding:"12px",background:(Object.values(mealFoods).flat().length+foods.length)>0?C.primary:C.border,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:(Object.values(mealFoods).flat().length+foods.length)>0?"pointer":"default"}}>
        {(Object.values(mealFoods).flat().length+foods.length)>0?`다음 (${Object.values(mealFoods).flat().length+foods.length}개) →`:"한 끼니 이상 입력해주세요"}
      </button>
    </div>
  );
}
function QuizPanel({quizStep,setQuizStep,quizAns,setQuizAns,setType,setShowQuiz,C}) {
  const q = QUIZ[quizStep];
  const calcResult = () => {
    const sc={C:0,D:0,M:0,U:0};
    Object.values(quizAns).forEach(s=>Object.entries(s).forEach(([k,v])=>{sc[k]=(sc[k]||0)+v;}));
    const max=Math.max(...Object.values(sc));
    if(sc.M===max) return "mixed";
    if(sc.C===max) return "constipation";
    if(sc.D===max) return "diarrhea";
    return "unclassified";
  };
  const reset = () => {setShowQuiz(false);setQuizStep(0);setQuizAns({});};
  if(quizStep>=QUIZ.length) {
    const result=calcResult();
    const info=TYPES[result];
    const sc={C:0,D:0,M:0,U:0};
    Object.values(quizAns).forEach(s=>Object.entries(s).forEach(([k,v])=>{sc[k]=(sc[k]||0)+v;}));
    const total=Object.values(sc).reduce((a,b)=>a+b,0)||1;
    return (
      <div style={{background:C.surface,borderRadius:14,padding:20,border:`1.5px solid ${C.gold}`,marginBottom:16}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><div style={{width:64,height:64,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center"}}><TypeIcon type={result} color={C.primary} size={32} /></div></div>
          <div style={{fontSize:18,fontWeight:800,color:C.primary,marginBottom:4}}>{info.label}</div>
          <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>{info.desc}</div>
        </div>
        <div style={{background:C.surfaceAlt,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:8}}>유형별 점수 분포</div>
          {[["C","변비형"],["D","설사형"],["M","혼합형"],["U","미분류"]].map(([k,label])=>{
            const pct=Math.round((sc[k]/total)*100);
            const tMap={"C":"c","D":"d","M":"m","U":"u"};const isTop=result.startsWith(tMap[k]);
            return (
              <div key={k} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontSize:12,color:isTop?C.primary:C.textMid,fontWeight:isTop?700:400}}>{label}</span>
                  <span style={{fontSize:11,color:C.textMuted}}>{pct}%</span>
                </div>
                <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:isTop?C.primary:C.borderStrong,borderRadius:3}} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{fontSize:10.5,color:C.textMuted,marginBottom:14,lineHeight:1.6,padding:"8px 10px",background:C.surfaceAlt,borderRadius:8}}>
          ※ Rome IV 참고용 선별도구, 진단 대체 불가.
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={reset} style={{flex:1,padding:"10px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,cursor:"pointer"}}>다시 테스트</button>
          <button onClick={()=>{setType(result);reset();}} style={{flex:2,padding:"10px",background:`linear-gradient(135deg,${C.primary} 0%,#3D6B4A 100%)`,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>이 유형으로 시작하기 →</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{background:C.surface,borderRadius:14,padding:"16px 16px 20px",border:`1px solid ${C.border}`,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:11,color:C.textMuted,fontWeight:600}}>IBS 유형 테스트</span>
        <span style={{fontSize:11,color:C.primary,fontWeight:700}}>{quizStep+1}/{QUIZ.length}</span>
      </div>
      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:16,overflow:"hidden"}}>
        <div style={{width:`${(quizStep/QUIZ.length)*100}%`,height:"100%",background:C.gold,borderRadius:2,transition:"width 0.3s"}} />
      </div>
      <div style={{fontSize:14,fontWeight:700,color:C.text,lineHeight:1.6,marginBottom:16}}>{q.q}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.opts.map((opt,i)=>(
          <button key={i} onClick={()=>{setQuizAns(p=>({...p,[q.id]:opt.score}));setTimeout(()=>setQuizStep(s=>s+1),300);}}
            style={{padding:"11px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.surfaceAlt,color:C.text,fontSize:12.5,cursor:"pointer",textAlign:"left"}}>
            {opt.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginTop:14}}>
        {quizStep>0&&<button onClick={()=>setQuizStep(s=>s-1)} style={{padding:"8px 14px",background:"none",border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,color:C.textMuted,cursor:"pointer"}}>← 이전</button>}
        <button onClick={reset} style={{marginLeft:"auto",padding:"8px 14px",background:"none",border:"none",fontSize:12,color:C.textMuted,cursor:"pointer"}}>건너뛰기</button>
      </div>
    </div>
  );
}
function TypeIcon({type,color="#4A7C59",size=24}) {
  const w=size,h=size,sw=size*0.08,c=color;
  if(type==="constipation") return(<svg width={w} height={h} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="10" fill="none" stroke={c} strokeWidth={sw}/><path d="M24 10 L24 4M24 44 L24 38M10 24 L4 24M44 24 L38 24" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
  if(type==="diarrhea") return(<svg width={w} height={h} viewBox="0 0 48 48" fill="none"><ellipse cx="24" cy="24" rx="8" ry="13" fill="none" stroke={c} strokeWidth={sw}/><path d="M14 36 Q24 44 34 36" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round"/></svg>);
  if(type==="mixed") return(<svg width={w} height={h} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="10" fill="none" stroke={c} strokeWidth={sw}/><path d="M24 14 L24 34M14 24 L34 24" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
  return(<svg width={w} height={h} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="10" fill="none" stroke={c} strokeWidth={sw} strokeDasharray="4 4"/><circle cx="24" cy="24" r="2.5" fill={c}/></svg>);
}

function LogTab(q) {
  const C=q.C;
  return (
    <div>
      {q.showForm ? (
        <div style={{background:C.surface,borderRadius:16,padding:16,border:"1px solid "+C.border,boxShadow:"0 2px 16px rgba(74,60,36,0.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:10,borderBottom:"1px solid "+C.border}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:C.primary}}>{q.editingId?"기록 수정":"식사 기록"}</div>
              <input type="date" value={q.logDate} max={new Date().toISOString().slice(0,10)} onChange={e=>q.setLogDate(e.target.value)} style={{fontSize:12,color:C.textMid,border:"none",background:"transparent",cursor:"pointer",marginTop:2,outline:"none",fontFamily:"inherit",padding:0}} />
            </div>
            <button onClick={()=>{q.setShowForm(false);q.setStep(1);}} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:18,lineHeight:1}}>✕</button>
          </div>
          {q.step===1&&<Step1Panel foods={q.foods} setFoods={q.setFoods} meal={q.meal} setMeal={q.setMeal} mealIdx={q.mealIdx} setMealIdx={q.setMealIdx} mealFoods={q.mealFoods} setMealFoods={q.setMealFoods} custom={q.custom} setCustom={q.setCustom} showAI={q.showAI} setShowAI={q.setShowAI} aiText={q.aiText} setAiText={q.setAiText} aiImg={q.aiImg} setAiImg={q.setAiImg} aiPrev={q.aiPrev} setAiPrev={q.setAiPrev} aiRes={q.aiRes} setAiRes={q.setAiRes} aiErr={q.aiErr} setAiErr={q.setAiErr} aiLoad={q.aiLoad} analyzeAI={q.analyzeAI} handleImg={q.handleImg} fileRef={q.fileRef} setStep={q.setStep} C={C} />}
          {q.step===2&&<Step2Panel mealFoods={q.mealFoods} mealSymptoms={q.mealSymptoms} setMealSymptoms={q.setMealSymptoms} symMeal={q.symMeal} setSymMeal={q.setSymMeal} note={q.note} setNote={q.setNote} sleep={q.sleep} setSleep={q.setSleep} stress={q.stress} setStress={q.setStress} activity={q.activity} setActivity={q.setActivity} saveLog={q.saveLog} setStep={q.setStep} editingId={q.editingId} C={C} />}
        </div>
      ) : (
        <div>
          <MiniCalendar logs={q.logs} mealPickDay={q.mealPickDay} setMealPickDay={q.setMealPickDay} calMonth={q.calMonth} setCalMonth={q.setCalMonth} setLogView={q.setLogView} setLogDate={q.setLogDate} setMeal={q.setMeal} setMealFoods={q.setMealFoods} setEditingId={q.setEditingId} setStep={q.setStep} setShowForm={q.setShowForm} setPain={q.setPain} setBloating={q.setBloating} setComfort={q.setComfort} setNote={q.setNote} setMealSymptoms={q.setMealSymptoms} setSleep={q.setSleep} setStress={q.setStress} setActivity={q.setActivity} setLogs={q.setLogs} C={C} />
          <div style={{display:"flex",borderBottom:"1.5px solid "+C.border,marginBottom:14}}>
            {[{k:"list",l:"목록"},{k:"calendar",l:"달력"},{k:"trigger",l:"트리거"},{k:"report",l:"리포트"}].map(v=>{
              const on=q.logView===v.k;
              return <button key={v.k} onClick={()=>q.setLogView(v.k)} style={{flex:1,padding:"10px 2px",border:"none",borderBottom:"2.5px solid "+(on?C.gold:"transparent"),background:"transparent",color:on?C.primary:C.textMuted,fontSize:11.5,fontWeight:on?700:400,cursor:"pointer",marginBottom:"-1.5px"}}>{v.l}</button>;
            })}
          </div>
          {q.logView==="list"&&<LogListView logs={q.logs} setEditingId={q.setEditingId} setLogDate={q.setLogDate} setMeal={q.setMeal} setMealFoods={q.setMealFoods} setFoods={q.setFoods} setPain={q.setPain} setBloating={q.setBloating} setComfort={q.setComfort} setNote={q.setNote} setMealSymptoms={q.setMealSymptoms} setSleep={q.setSleep} setStress={q.setStress} setActivity={q.setActivity} setStep={q.setStep} setShowForm={q.setShowForm} setLogs={q.setLogs} C={C} />}
          {q.logView==="calendar"&&<CalendarView logs={q.logs} calMonth={q.calMonth} setCalMonth={q.setCalMonth} calDay={q.calDay} setCalDay={q.setCalDay} setLogView={q.setLogView} C={C} />}
          {q.logView==="trigger"&&<TriggerView logs={q.logs} C={C} />}
          {q.logView==="report"&&<ReportPanel logs={q.logs} repPeriod={q.repPeriod} setRepPeriod={q.setRepPeriod} C={C} />}
        </div>
      )}
    </div>
  );
}
function GuideTab({type,tInfo,guideMode,setGuideMode,C}) {
  if (!type) return <div style={{textAlign:"center",padding:"40px 20px",color:C.textMuted,fontSize:13}}>유형을 먼저 선택해주세요.</div>;
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[{k:"rec",l:"추천 음식"},{k:"avoid",l:"피할 음식"}].map(g=>{
          const on=guideMode===g.k;
          return <button key={g.k} onClick={()=>setGuideMode(g.k)} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid "+(on?(g.k==="rec"?C.primary:C.warn):(C.border)),background:on?(g.k==="rec"?C.primaryLight:C.warnBg):"transparent",color:on?(g.k==="rec"?C.primary:C.warn):C.textMuted,fontSize:12,fontWeight:on?700:400,cursor:"pointer"}}>{g.l}</button>;
        })}
      </div>
      {guideMode==="rec"&&<div>
        {FOODS[type].rec.map(f=>(
          <div key={f.name} style={{background:C.surface,borderRadius:14,padding:"14px 16px",border:"1px solid "+C.border,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start",boxShadow:"0 1px 4px rgba(74,60,36,0.06)"}}>
            <div style={{width:4,height:38,borderRadius:2,background:C.primary,flexShrink:0,marginTop:2}} />
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>{f.name}</span><FBadge name={f.name} /></div>
              <div style={{fontSize:11.5,color:C.textMuted,lineHeight:1.5}}>{f.reason}</div>
            </div>
          </div>
        ))}
        <div style={{fontSize:10.5,color:C.textMuted,padding:"10px 4px"}}>📚 Monash DB·ACG 2021·AGA 2022</div>
      </div>}
      {guideMode==="avoid"&&<div>
        {FOODS[type].avoid.map(f=>(
          <div key={f.name} style={{background:C.warnBg,borderRadius:14,padding:"14px 16px",border:"1px solid "+C.warnBorder,marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:4,height:38,borderRadius:2,background:C.warn,flexShrink:0,marginTop:2}} />
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>{f.name}</div>
              <div style={{fontSize:11.5,color:C.textMuted,lineHeight:1.5}}>{f.reason}</div>
            </div>
          </div>
        ))}
        <div style={{fontSize:10.5,color:C.textMuted,padding:"10px 4px"}}>📚 Monash DB·ACG 2021·AGA 2022</div>
      </div>}
    </div>
  );
}
function DiningTab({foods,setFoods,dCat,setDCat,setDiningToast,C}) {
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {Object.keys(DINING).map(cat=>(
          <button key={cat} onClick={()=>setDCat(cat)} style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid "+(dCat===cat?C.primary:C.border),background:dCat===cat?C.primaryLight:"transparent",color:dCat===cat?C.primary:C.textMuted,fontSize:12,fontWeight:dCat===cat?700:400,cursor:"pointer"}}>{cat}</button>
        ))}
      </div>
      {(DINING[dCat]||[]).map(item=>{
        const added=foods.some(f=>f===item.menu);
        return (
          <div key={item.menu} style={{background:C.surface,borderRadius:12,padding:"12px 14px",border:"1px solid "+C.border,marginBottom:8,borderLeft:"3px solid "+(item.safe?C.gold:C.warn)}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:700,color:C.text}}>{item.menu}</span>
              <button onClick={()=>{
                if(!added){setFoods(p=>[...p,item.menu]);setDiningToast(item.menu+"를 기록에 추가했어요!");setTimeout(()=>setDiningToast(""),3000);}
                else{setFoods(p=>p.filter(x=>x!==item.menu));setDiningToast("");}
              }} style={{fontSize:11.5,padding:"4px 12px",borderRadius:20,border:"1px solid "+(added?C.primary:C.borderStrong),background:added?C.primaryLight:"transparent",color:added?C.primary:C.textMuted,cursor:"pointer"}}>
                {added?"✓ 추가됨":"+ 기록에 추가"}
              </button>
            </div>
            <div style={{fontSize:11.5,color:item.safe?C.safe:C.warn,fontWeight:600,marginBottom:2}}>{item.safe?"추천":"주의"}</div>
            <div style={{fontSize:11.5,color:C.textMuted}}>{item.tip}</div>
          </div>
        );
      })}
    </div>
  );
}
function FodmapReinpro({fodGroup,setFodGroup,fodResults,setFodResults,C}) {
  return (
    <div>
      <div style={{background:C.surface,borderRadius:12,padding:16,border:`1px solid ${C.border}`,marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>2단계: 재도입기 (6~8주)</div>
        <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>각 그룹을 3일씩 테스트.</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {FODMAP_GROUPS_DATA.map((g,i)=>{
          const done=fodResults[g.key]; const on=fodGroup===i;
          return <button key={g.key} onClick={()=>setFodGroup(i)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${on?g.color:C.border}`,background:on?g.color+"18":done?"#F0F0F0":C.surfaceAlt,color:on?g.color:done?C.textMuted:C.textMid,fontSize:11,fontWeight:on?700:400,cursor:"pointer"}}>
            {done?(fodResults[g.key]==="pass"?"✓ ":"✕ "):""}{g.name}
          </button>;
        })}
      </div>
      {(()=>{
        const g=FODMAP_GROUPS_DATA[fodGroup];
        return (
          <div style={{background:C.surface,borderRadius:12,padding:16,border:`1.5px solid ${g.color}40`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:g.color}} />
              <span style={{fontSize:14,fontWeight:700,color:C.text}}>{g.name} 테스트</span>
            </div>
            <div style={{fontSize:12,color:C.textMid,marginBottom:10}}>주요 유발 증상: {g.trigger}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {g.test_foods.map(f=><span key={f} style={{fontSize:12,padding:"5px 12px",borderRadius:20,background:g.color+"18",color:g.color,fontWeight:600}}>{f}</span>)}
            </div>
            <div style={{fontSize:11.5,color:C.textMuted,marginBottom:14,lineHeight:1.7,background:C.surfaceAlt,borderRadius:8,padding:"10px 12px"}}>
              1가지를 평소 양으로 먹고 24~48시간 관찰.
            </div>
            {!fodResults[g.key]?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button onClick={()=>setFodResults(p=>({...p,[g.key]:"pass"}))} style={{padding:"11px",background:C.safeBg,color:C.safe,border:`1.5px solid ${C.safeBorder}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ 증상 없음</button>
                <button onClick={()=>setFodResults(p=>({...p,[g.key]:"sensitive"}))} style={{padding:"11px",background:C.warnBg,color:C.warn,border:`1.5px solid ${C.warnBorder}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>✕ 증상 있음</button>
              </div>
            ):(
              <div>
                <div style={{background:fodResults[g.key]==="pass"?C.safeBg:C.warnBg,border:`1px solid ${fodResults[g.key]==="pass"?C.safeBorder:C.warnBorder}`,borderRadius:10,padding:"12px",textAlign:"center",marginBottom:10}}>
                  <div style={{fontSize:14,fontWeight:700,color:fodResults[g.key]==="pass"?C.safe:C.warn}}>{fodResults[g.key]==="pass"?"✓ 통과 — 섭취가능":"✕ 민감 — 제한"}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setFodResults(p=>{const n={...p};delete n[g.key];return n;})} style={{flex:1,padding:"9px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,cursor:"pointer"}}>다시 테스트</button>
                  {fodGroup<FODMAP_GROUPS_DATA.length-1&&<button onClick={()=>setFodGroup(i=>i+1)} style={{flex:2,padding:"9px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>다음 그룹 →</button>}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      <div style={{background:C.surface,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`,marginTop:12}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>진행 현황 ({Object.keys(fodResults).length}/{FODMAP_GROUPS_DATA.length})</div>
        <div style={{height:6,background:C.border,borderRadius:4,overflow:"hidden"}}>
          <div style={{width:`${(Object.keys(fodResults).length/FODMAP_GROUPS_DATA.length)*100}%`,height:"100%",background:C.primary,borderRadius:4}} />
        </div>
      </div>
      {Object.keys(fodResults).length===FODMAP_GROUPS_DATA.length&&(
        <button onClick={()=>setFodResults(prev=>{const n={...prev};return n;})} style={{width:"100%",padding:"13px",background:C.primary,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:12}}>
          모든 테스트 완료 → 개인화기로
        </button>
      )}
    </div>
  );
}
function FodmapSearch({C}) {
  const [q,setQ]=useState(""); const [res,setRes]=useState(null); const [load,setLoad]=useState(false);
  const LI={low:{l:"저FODMAP",e:"✅",c:C.safe,b:C.safeBg,bd:C.safeBorder,d:"대부분 안전해요."},mid:{l:"중FODMAP",e:"⚠️",c:C.caution,b:C.cautionBg,bd:C.cautionBorder,d:"소량은 괜찮지만 과식 시 증상 가능."},high:{l:"고FODMAP",e:"🚫",c:C.warn,b:C.warnBg,bd:C.warnBorder,d:"제한기에 피하고, 재도입기에 테스트."}};
  const go=async()=>{
    const query=q.trim(); if(!query)return;
    const loc=Object.entries(FODMAP_LV).find(([k])=>k.includes(query)||query.includes(k));
    if(loc){setRes({name:query,lv:loc[1],src:"db"});return;}
    setLoad(true); setRes(null);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:100,messages:[{role:"user",content:"음식 FODMAP 수준 JSON. 음식: "+query+". 형식: lv는 low mid high 중 하나, reason은 한줄 이유. JSON만 응답."}]})});
      const d=await r.json(); const t=(d.content||[]).map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
      const j=JSON.parse(t); setRes({name:query,lv:j.lv,reason:j.reason,src:"ai"});
    }catch(e){setRes({name:query,lv:null,src:"err"});}
    finally{setLoad(false);}
  };
  const info=res&&LI[res.lv];
  return (
    <div style={{background:C.surface,borderRadius:14,padding:16,border:`1px solid ${C.border}`,marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>🔍 FODMAP 검색</div>
      <div style={{fontSize:11.5,color:C.textMuted,marginBottom:10}}>음식명 입력 시 저·중·고 FODMAP 여부를 알려드려요.</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="예: 사과, 비빔밥..."
          style={{flex:1,padding:"10px 14px",border:`1.5px solid ${q?C.primary:C.border}`,borderRadius:10,fontSize:13,outline:"none",background:C.surfaceAlt}} />
        <button onClick={go} disabled={load||!q.trim()} style={{padding:"10px 18px",background:q.trim()?C.primary:C.border,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:q.trim()?"pointer":"default"}}>{load?"…":"검색"}</button>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:info?10:0}}>
        {["사과","우유","흰쌀밥","마늘","딸기","두부"].map(f=><button key={f} onClick={()=>{setQ(f);setRes(null);}} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${C.border}`,background:C.surfaceAlt,color:C.textMid,fontSize:11,cursor:"pointer"}}>{f}</button>)}
      </div>
      {res&&res.src==="err"&&<div style={{padding:"10px 12px",background:C.warnBg,borderRadius:9,fontSize:12,color:C.warn,marginTop:8}}>오류 발생. 다시 시도해주세요.</div>}
      {info&&<div style={{padding:"14px 16px",background:info.b,borderRadius:12,border:`1.5px solid ${info.bd}`,marginTop:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <span style={{fontSize:24}}>{info.e}</span>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:800,color:info.c}}>{res.name}</div><div style={{fontSize:12,color:info.c,fontWeight:700}}>{info.l}</div></div>
          <span style={{fontSize:10,color:res.src==="ai"?C.textMuted:C.primary,background:res.src==="ai"?C.surfaceAlt:C.primaryLight,padding:"2px 7px",borderRadius:20}}>{res.src==="ai"?"AI":"DB"}</span>
        </div>
        <div style={{fontSize:12,color:info.c}}>{info.d}</div>
        {res.reason&&<div style={{fontSize:11.5,color:C.textMid,marginTop:7,paddingTop:7,borderTop:`1px solid ${info.bd}`}}>{res.reason}</div>}
      </div>}
    </div>
  );
}
function TriggerView({logs,C}) {
  if (logs.length<5) return (
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:36,marginBottom:12}}>🔍</div>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:6}}>기록이 더 필요해요</div>
      <div style={{fontSize:12,color:C.textMuted,lineHeight:1.7}}>5개 이상 기록하면 트리거 분석이 시작돼요. (현재 {logs.length}개 기록됨)</div>
    </div>
  );
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-30);
  const base=logs.filter(e=>{try{return new Date(e.isoDate||e.date)>=cutoff;}catch(x){return true;}});
  const bad=base.filter(e=>e.pain>=2||e.comfort<=1);
  const good=base.filter(e=>e.pain===0&&e.comfort>=3);
  const badFreq={},goodFreq={};
  bad.forEach(e=>e.foods.forEach(f=>{badFreq[f]=(badFreq[f]||0)+1;}));
  good.forEach(e=>e.foods.forEach(f=>{goodFreq[f]=(goodFreq[f]||0)+1;}));
  const confidence=base.length<5?"낮음":base.length<10?"보통":"높음";
  const confColor=base.length<5?C.warn:base.length<10?C.caution:C.safe;
  const suspects=Object.entries(badFreq).map(([name,cnt])=>({name,cnt,badRate:cnt/Math.max(bad.length,1),goodRate:(goodFreq[name]||0)/Math.max(good.length,1)})).filter(x=>x.cnt>=2&&x.badRate>x.goodRate).sort((a,b)=>b.badRate-a.badRate).slice(0,5);
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  return (
    <div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
        {[{label:"총 기록",val:base.length,col:C.text},{label:"나쁜 날",val:bad.length,col:C.warn},{label:"좋은 날",val:good.length,col:C.safe}].map(x=>(
          <div key={x.label} style={{textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:x.col}}>{x.val}</div>
            <div style={{fontSize:10,color:C.textMuted}}>{x.label}</div>
          </div>
        ))}
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:10,color:C.textMuted,marginBottom:2}}>분석 신뢰도</div>
          <span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:confColor+"18",color:confColor,border:`1px solid ${confColor}40`}}>{confidence}</span>
        </div>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>트리거 의심 음식</div>
        {suspects.length===0?(
          <div style={{fontSize:12,color:C.textMuted,textAlign:"center",padding:"12px 0"}}>아직 반복되는 패턴이 없어요. 기록을 더 쌓아보세요.</div>
        ):suspects.map(x=>(
          <div key={x.name} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:12,fontWeight:700,color:C.text}}>{x.name}</span>
                <FBadge name={x.name} />
              </div>
              <span style={{fontSize:11,color:C.warn,fontWeight:700}}>나쁜 날 {Math.round(x.badRate*100)}%</span>
            </div>
            <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${x.badRate*100}%`,height:"100%",background:C.warn,borderRadius:3}} />
            </div>
          </div>
        ))}
      </div>
      <div style={{background:C.surfaceAlt,borderRadius:9,padding:"10px 13px",fontSize:11,color:C.textMuted,lineHeight:1.7}}>
        ⚠️ 상관관계 분석. FODMAP 재도입 테스트로 확인하세요.
      </div>
    </div>
  );
}
function CalendarView({logs,calMonth,setCalMonth,calDay,setCalDay,setLogView,C}) {
  const {y,m} = calMonth;
  const today = new Date();
  const firstDay = new Date(y,m,1).getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const mNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const dayMap = {};
  logs.forEach(e=>{ try{ const d=new Date(e.isoDate||e.date); if(d.getFullYear()===y&&d.getMonth()===m) dayMap[d.getDate()]=e; }catch(x){} });
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={()=>setCalMonth(p=>{const d=new Date(p.y,p.m-1,1);return{y:d.getFullYear(),m:d.getMonth()};})} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",color:C.textMid,fontSize:13}}>←</button>
        <span style={{fontSize:14,fontWeight:700,color:C.text}}>{y}년 {mNames[m]}</span>
        <button onClick={()=>setCalMonth(p=>{const d=new Date(p.y,p.m+1,1);return{y:d.getFullYear(),m:d.getMonth()};})} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",color:C.textMid,fontSize:13}}>→</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:4}}>
        {["일","월","화","수","목","금","토"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:C.textMuted,padding:"4px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`} />)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1;
          const entry=dayMap[day];
          const isToday=today.getDate()===day&&today.getMonth()===m&&today.getFullYear()===y;
          const isSel=calDay?.id===entry?.id;
          return <div key={day} onClick={()=>entry&&setCalDay(isSel?null:entry)} style={{aspectRatio:"1",borderRadius:7,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:entry?comfC(entry.comfort)+"22":"transparent",border:isSel?`2px solid ${C.primary}`:isToday?`2px solid ${C.gold}`:entry?`1px solid ${comfC(entry.comfort)}55`:"1px solid transparent",cursor:entry?"pointer":"default"}}>
            <span style={{fontSize:11.5,fontWeight:isToday?700:400,color:isToday?C.primary:C.text}}>{day}</span>
            {entry&&<div style={{width:4,height:4,borderRadius:"50%",background:comfC(entry.comfort),marginTop:1}} />}
          </div>;
        })}
      </div>
      {Object.keys(dayMap).length===0&&<div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>이 달에는 기록이 없어요.</div><button onClick={()=>setCalMonth({y:today.getFullYear(),m:today.getMonth()})} style={{fontSize:11.5,color:C.primary,background:C.primaryLight,border:`1px solid ${C.safeBorder}`,borderRadius:20,padding:"5px 14px",cursor:"pointer",fontWeight:700}}>오늘 달로 이동 →</button></div>}
      {!calDay&&Object.keys(dayMap).length>0&&<div style={{textAlign:"center",marginTop:8,fontSize:11,color:C.textMuted}}>날짜를 탭하면 기록을 볼 수 있어요</div>}
      {calDay&&(
        <div style={{marginTop:12,padding:14,background:C.surfaceAlt,borderRadius:12,border:`1px solid ${C.borderStrong}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:700,color:C.text}}>{calDay.date}</span>
            <button onClick={()=>setCalDay(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:12}}>닫기 ✕</button>
          </div>
          {calDay.mealFoods?MEALS.map(m2=>{const mf=calDay.mealFoods[m2]||[];if(!mf.length)return null;return <div key={m2} style={{display:"flex",gap:5,alignItems:"flex-start",marginBottom:4}}><span style={{fontSize:10.5,fontWeight:700,color:C.gold,flexShrink:0,width:22}}>{m2}</span><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{mf.map(f=><span key={f} style={{fontSize:11.5,padding:"2px 8px",borderRadius:20,background:C.surface,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}</div></div>;}):
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{(calDay.foods||[]).map(f=><span key={f} style={{fontSize:11.5,padding:"2px 8px",borderRadius:20,background:C.surface,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}</div>}
          <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
            <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:calDay.pain===0?C.safeBg:C.warnBg,color:calDay.pain===0?C.safe:C.warn}}>복통 {SYM_P[calDay.pain]}</span>
            <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:calDay.comfort>=3?C.safeBg:C.cautionBg,color:calDay.comfort>=3?C.safe:C.caution}}>{SYM_C[calDay.comfort]}</span>
            {calDay.note&&<span style={{fontSize:11,color:C.textMuted}}>{calDay.note}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
function FodmapTab({fodPhase,setFodPhase,fodGroup,setFodGroup,fodResults,setFodResults,C}) {
  return (
    <div>
      <FodmapSearch C={C} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:16}}>
        {[{n:0,l:"1단계"},{n:1,l:"2단계"},{n:2,l:"3단계"}].map(ph=>{
          const on=fodPhase===ph.n;
          return <button key={ph.n} onClick={()=>setFodPhase(ph.n)} style={{padding:"10px 4px",borderRadius:10,border:`1.5px solid ${on?C.primary:C.border}`,background:on?C.primaryLight:C.surface,color:on?C.primary:C.textMuted,fontSize:11,fontWeight:on?700:400,cursor:"pointer",lineHeight:1.4}}>{ph.l}</button>;
        })}
      </div>
      {fodPhase===0&&(
        <div>
          <div style={{background:C.surface,borderRadius:12,padding:16,border:`1px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>1단계: 제한기 (2~6주)</div>
            <div style={{fontSize:12,color:C.textMid,lineHeight:1.7,marginBottom:14}}>고FODMAP 식품을 모두 제한. 증상 안정 후 2단계로.</div>
            <div style={{fontSize:12,fontWeight:700,color:C.warn,marginBottom:8}}>제한해야 할 식품 그룹</div>
            {FODMAP_GROUPS_DATA.map(g=>(
              <div key={g.key} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:g.color,flexShrink:0,marginTop:3}} />
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>{g.name}</span><span style={{fontSize:11,color:C.textMuted}}>{g.limit}</span></div>
                  <div style={{fontSize:11.5,color:C.textMuted,marginTop:2}}>{g.foods}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:C.cautionBg,border:`1px solid ${C.cautionBorder}`,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.caution,marginBottom:4}}>⚠️ 2주 후에도 증상 변화가 없다면</div>
            <div style={{fontSize:11.5,color:C.textMid,lineHeight:1.7}}>IBS 외 다른 원인일 수 있어요. 전문의 상담 권장.</div>
          </div>
          <button onClick={()=>{ if(window.confirm("2단계 재도입기로 이동할까요? 제한기 데이터는 유지됩니다.")) setFodPhase(1); }}
            style={{width:"100%",padding:"13px",background:C.primary,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:12}}>
            증상 안정됨 → 재도입기 시작
          </button>
        </div>
      )}
      {fodPhase===1&&(
        <FodmapReinpro fodGroup={fodGroup} setFodGroup={setFodGroup} fodResults={fodResults} setFodResults={setFodResults} C={C} />
      )}
      
{fodPhase===2&&(
        <div>
          <div style={{background:C.safeBg,border:`1px solid ${C.safeBorder}`,borderRadius:14,padding:20,textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:36,marginBottom:10}}>🎉</div>
            <div style={{fontSize:15,fontWeight:700,color:C.safe,marginBottom:8}}>나만의 식단 완성!</div>
            <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>민감 그룹만 피하고 나머지는 자유롭게.</div>
          </div>
          <div style={{background:C.surface,borderRadius:12,padding:16,border:`1px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>테스트 결과</div>
            {FODMAP_GROUPS_DATA.map(g=>{
              const res=fodResults[g.key];
              return <div key={g.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:"50%",background:g.color}} /><span style={{fontSize:13,color:C.text}}>{g.name}</span></div>
                <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:res==="pass"?C.safeBg:C.warnBg,color:res==="pass"?C.safe:C.warn}}>{res==="pass"?"✓ 섭취 가능":res==="sensitive"?"✕ 제한":"미테스트"}</span>
              </div>;
            })}
          </div>
          <button onClick={()=>{setFodPhase(1);setFodGroup(0);}} style={{width:"100%",padding:"11px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,cursor:"pointer"}}>재도입기 다시 시작</button>
        </div>
      )}
      <div style={{marginTop:20,paddingTop:16,borderTop:"1.5px solid "+C.border}}>
        <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>관련 블로그</div>
        <a href="https://m.blog.naver.com/readingonenglish" target="_blank" rel="noopener noreferrer"
          style={{display:"flex",gap:14,padding:"14px 16px",background:C.goldLight,border:"1.5px solid "+C.goldBorder,borderRadius:14,textDecoration:"none",alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:12,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:22}}>🌿</span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:3}}>안녕메이 블로그</div>
            <div style={{fontSize:11.5,color:C.textMid,marginBottom:5,lineHeight:1.5}}>웰니스 생활기록·장건강 관련 정보를 나눠요</div>
            <div style={{fontSize:11,color:C.gold,fontWeight:600}}>m.blog.naver.com/readingonenglish →</div>
          </div>
        </a>
      </div>
    </div>
  );
}
function LogListView({logs,setEditingId,setLogDate,setMeal,setMealFoods,setFoods,setPain,setBloating,setComfort,setNote,setMealSymptoms,setSleep,setStress,setActivity,setStep,setShowForm,setLogs,C}) {
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  if (logs.length===0) return (
    <div style={{background:C.surface,borderRadius:14,padding:"40px 20px",textAlign:"center",border:`1px solid ${C.border}`}}>
      <div style={{fontSize:36,marginBottom:12}}>📋</div>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:6}}>첫 기록을 남겨보세요</div>
      <div style={{fontSize:12,color:C.textMuted}}>식사와 증상을 기록하면 트리거 음식을 파악할 수 있어요.</div>
    </div>
  );
  return (
    <div>
      {logs.map(entry=>(
        <div key={entry.id} style={{background:C.surface,borderRadius:12,padding:14,border:`1px solid ${C.border}`,marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:6}}>
            <span style={{fontSize:12,fontWeight:700,color:C.primary}}>{entry.date}·{entry.meal}</span>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:entry.pain===0?C.safeBg:C.warnBg,color:entry.pain===0?C.safe:C.warn}}>복통 {SYM_P[entry.pain]}</span>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:entry.comfort>=3?C.safeBg:C.cautionBg,color:comfC(entry.comfort)}}>{SYM_C[entry.comfort]}</span>
              <button onClick={()=>{
                setEditingId(entry.id); setLogDate(entry.isoDate||new Date().toISOString().slice(0,10));
                setMeal(entry.meal||"아침"); setMealFoods(entry.mealFoods||{"아침":[],"점심":[],"저녁":[],"간식":[]});
                setFoods([]); setPain(entry.pain||0); setBloating(entry.bloating||0);
                setComfort(entry.comfort??3); setNote(entry.note||"");
                setMealSymptoms(entry.mealSymptoms||{"아침":{pain:0,bloating:0,comfort:3},"점심":{pain:0,bloating:0,comfort:3},"저녁":{pain:0,bloating:0,comfort:3},"간식":{pain:0,bloating:0,comfort:3}});
                setSleep(entry.sleep??null); setStress(entry.stress??null); setActivity(entry.activity??null);
                setStep(1); setShowForm(true);
              }} style={{padding:"2px 9px",borderRadius:20,border:`1px solid ${C.border}`,background:C.surfaceAlt,color:C.textMuted,fontSize:11,cursor:"pointer",fontWeight:600}}>수정</button>
              <button onClick={()=>{if(window.confirm("이 기록을 삭제할까요?")) setLogs(p=>p.filter(e=>e.id!==entry.id));}} style={{padding:"2px 9px",borderRadius:20,border:`1px solid ${C.warnBorder}`,background:C.warnBg,color:C.warn,fontSize:11,cursor:"pointer",fontWeight:600}}>삭제</button>
            </div>
          </div>
          {entry.mealFoods?(
            MEALS.map(m=>{const mf=entry.mealFoods[m]||[];if(!mf.length)return null;return <div key={m} style={{display:"flex",gap:5,alignItems:"flex-start",marginBottom:4}}><span style={{fontSize:10.5,fontWeight:700,color:C.gold,flexShrink:0,width:22}}>{m}</span><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{mf.map(f=><span key={f} style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}</div></div>;})
          ):(
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{(entry.foods||[]).map(f=><span key={f} style={{fontSize:11.5,padding:"3px 8px",borderRadius:20,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}</div>
          )}
          {entry.note&&<div style={{fontSize:11.5,color:C.textMuted,marginTop:6}}>{entry.note}</div>}
        </div>
      ))}
    </div>
  );
}
function Step2Panel({mealFoods,mealSymptoms,setMealSymptoms,symMeal,setSymMeal,note,setNote,sleep,setSleep,stress,setStress,activity,setActivity,saveLog,setStep,editingId,C}) {
  const activeMeals = MEALS.filter(m=>(mealFoods[m]||[]).length>0);
  const curSymMeal = activeMeals.includes(symMeal)?symMeal:activeMeals[0]||"아침";
  const sym = mealSymptoms[curSymMeal]||{pain:0,bloating:0,comfort:3};
  const setSym = (key,val) => setMealSymptoms(p=>({...p,[curSymMeal]:{...p[curSymMeal],[key]:val}}));
  const SYM_COLS = {pain:["#00695C","#C8936E","#B7791F","#B85450"],bloating:["#00695C","#C8936E","#B7791F","#B85450"],comfort:["#B85450","#B7791F","#9C8F7A","#00695C","#4A7C59"]};
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  return (
    <div>
      <div style={{display:"flex",borderBottom:`1.5px solid ${C.border}`,marginBottom:14}}>
        {activeMeals.map(m=>{
          const on=curSymMeal===m; const ms=mealSymptoms[m];
          const hasSym=ms&&(ms.pain>0||ms.bloating>0||ms.comfort!==3);
          return <button key={m} onClick={()=>setSymMeal(m)} style={{flex:1,padding:"9px 4px",border:"none",borderBottom:`2.5px solid ${on?C.gold:"transparent"}`,background:"transparent",color:on?C.primary:C.textMuted,fontSize:12,fontWeight:on?700:400,cursor:"pointer",marginBottom:"-1.5px",position:"relative"}}>
            {m}{hasSym&&!on&&<span style={{position:"absolute",top:4,right:"20%",width:5,height:5,borderRadius:"50%",background:C.gold}} />}
          </button>;
        })}
      </div>
      <div style={{background:C.surfaceAlt,borderRadius:8,padding:"6px 10px",marginBottom:12,display:"flex",flexWrap:"wrap",gap:4}}>
        {(mealFoods[curSymMeal]||[]).map(f=><span key={f} style={{fontSize:11.5,padding:"2px 8px",borderRadius:20,background:C.surface,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}
      </div>
      {[{label:"복통",key:"pain",labels:SYM_P},{label:"팽만",key:"bloating",labels:SYM_P},{label:"컨디션",key:"comfort",labels:SYM_C}].map(item=>(
        <div key={item.key} style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textMid,marginBottom:5}}>{item.label}</div>
          <div style={{display:"flex",gap:4}}>
            {(item.key==="comfort"?[...item.labels].map((l,i)=>({l,i})).reverse():item.labels.map((l,i)=>({l,i}))).map(({l,i})=>{
              const on=sym[item.key]===i; const col=SYM_COLS[item.key][i]||C.textMuted;
              return <button key={i} onClick={()=>setSym(item.key,i)} style={{flex:1,padding:"8px 2px",borderRadius:8,border:`1.5px solid ${on?col:C.border}`,background:on?col+"18":C.surfaceAlt,color:on?col:C.textMuted,fontSize:11,fontWeight:on?700:400,cursor:"pointer"}}>{l}</button>;
            })}
          </div>
        </div>
      ))}
      {activeMeals.length>1&&(
        <div style={{background:C.goldLight,border:`1px solid ${C.goldBorder}`,borderRadius:10,padding:"10px 12px",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:6}}>끼니별 증상 요약</div>
          {activeMeals.map(m=>{
            const ms=mealSymptoms[m]||{pain:0,bloating:0,comfort:3};
            return <div key={m} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:C.gold,width:24,flexShrink:0}}>{m}</span>
              <span style={{fontSize:11,padding:"1px 7px",borderRadius:20,background:ms.pain===0?C.safeBg:C.warnBg,color:ms.pain===0?C.safe:C.warn}}>복통 {SYM_P[ms.pain]}</span>
              <span style={{fontSize:11,padding:"1px 7px",borderRadius:20,background:ms.bloating===0?C.safeBg:C.cautionBg,color:ms.bloating===0?C.safe:C.caution}}>팽만 {SYM_P[ms.bloating]}</span>
              <span style={{fontSize:11,padding:"1px 7px",borderRadius:20,background:ms.comfort>=3?C.safeBg:C.cautionBg,color:comfC(ms.comfort)}}>{SYM_C[ms.comfort]}</span>
            </div>;
          })}
        </div>
      )}
      <div style={{marginTop:6,marginBottom:14,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:11.5,fontWeight:700,color:C.textMuted,marginBottom:10}}>생활 요인 (선택)</div>
        {[
          {label:"😴 수면",key:"sleep",val:sleep,set:setSleep,opts:["부족","보통","충분"]},{label:"😣 스트레스",key:"stress",val:stress,set:setStress,opts:["낮음","보통","높음"]},{label:"🚶 활동량",key:"activity",val:activity,set:setActivity,opts:["적음","보통","많음"]},].map(row=>(
          <div key={row.key} style={{marginBottom:10}}>
            <div style={{fontSize:11.5,color:C.textMid,marginBottom:5}}>{row.label}</div>
            <div style={{display:"flex",gap:4}}>
              {row.opts.map((l,i)=>{
                const on=row.val===i;
                return <button key={i} onClick={()=>row.set(on?null:i)}
                  style={{flex:1,padding:"7px 2px",borderRadius:8,border:`1.5px solid ${on?C.gold:C.border}`,background:on?C.goldLight:C.surfaceAlt,color:on?C.gold:C.textMuted,fontSize:11,fontWeight:on?700:400,cursor:"pointer"}}>{l}</button>;
              })}
            </div>
          </div>
        ))}
      </div>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="메모 (선택)" style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,marginBottom:12,boxSizing:"border-box",outline:"none"}} />
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setStep(1)} style={{flex:1,padding:"12px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>← 음식 수정</button>
        <button onClick={saveLog} style={{flex:2,padding:"12px",background:C.primary,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>{editingId?"수정 완료":"저장하기"}</button>
      </div>
    </div>
  );
}
function MiniCalendar({logs,mealPickDay,setMealPickDay,calMonth,setCalMonth,setLogView,setLogDate,setMeal,setMealFoods,setEditingId,setStep,setShowForm,setPain,setBloating,setComfort,setNote,setMealSymptoms,setSleep,setStress,setActivity,setLogs,C}) {
  const now = new Date();
  const y=now.getFullYear(), m=now.getMonth(), today=now.getDate();
  const firstDay=new Date(y,m,1).getDay();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const dayMap={};
  logs.forEach(e=>{try{const d=new Date(e.isoDate||e.date);if(d.getFullYear()===y&&d.getMonth()===m)dayMap[d.getDate()]=e;}catch(x){}});
  const comfC=v=>v>=3?C.safe:v>=2?C.caution:C.warn;
  const emptySymptoms={"아침":{pain:0,bloating:0,comfort:3},"점심":{pain:0,bloating:0,comfort:3},"저녁":{pain:0,bloating:0,comfort:3},"간식":{pain:0,bloating:0,comfort:3}};
  const emptyMealFoods={"아침":[],"점심":[],"저녁":[],"간식":[]};
  return (
    <div style={{background:C.surface,borderRadius:14,padding:"14px 14px 10px",border:`1px solid ${C.border}`,marginBottom:14,boxShadow:"0 1px 4px rgba(74,60,36,0.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:13,fontWeight:700,color:C.text}}>{y}년 {m+1}월</span>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:C.textMuted}}>{Object.keys(dayMap).length}일 기록</span>
          <button onClick={()=>{setLogView("calendar");setCalMonth({y,m});}} style={{fontSize:11,color:C.primary,background:C.primaryLight,border:`1px solid ${C.safeBorder}`,borderRadius:20,padding:"3px 10px",cursor:"pointer",fontWeight:600}}>전체 보기</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:4}}>
        {["일","월","화","수","목","금","토"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:C.textMuted,padding:"2px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`} />)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1;
          const entry=dayMap[day];
          const isToday=day===today;
          const isFuture=day>today;
          const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;const isSel=mealPickDay===iso;
          return <div key={day} onClick={()=>{if(!isFuture)setMealPickDay(isSel?null:iso);}}
            style={{aspectRatio:"1",borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:isSel?C.goldLight:entry?comfC(entry.comfort)+"20":isToday?C.primaryLight:"transparent",border:isSel?`1.5px solid ${C.gold}`:isToday?`1.5px solid ${C.primary}`:entry?`1px solid ${comfC(entry.comfort)}44`:"1px solid transparent",cursor:isFuture?"default":"pointer",opacity:isFuture?0.25:1}}>
            <span style={{fontSize:10.5,fontWeight:isToday?700:400,color:isSel?C.gold:isToday?C.primary:C.text,lineHeight:1}}>{day}</span>
            {entry&&<div style={{width:4,height:4,borderRadius:"50%",background:comfC(entry.comfort),marginTop:1}} />}
            {!entry&&!isFuture&&<div style={{fontSize:8,color:C.border,lineHeight:1,marginTop:1}}>+</div>}
          </div>;
        })}
      </div>
      <div style={{display:"flex",gap:8,marginTop:8,paddingTop:6,borderTop:`1px solid ${C.border}`,fontSize:10,color:C.textMuted}}>
        {[{col:C.safe,l:"좋은날"},{col:C.caution,l:"보통"},{col:C.warn,l:"나쁜날"}].map(x=><span key={x.l} style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:7,height:7,borderRadius:"50%",background:x.col,display:"inline-block"}} />{x.l}</span>)}
        <span style={{marginLeft:"auto"}}>탭 → 기록/수정</span>
      </div>
      {mealPickDay&&(()=>{
        const de=Object.values(dayMap).find(e=>e.isoDate===mealPickDay);
        const iso=mealPickDay; const isToday=iso===new Date().toISOString().slice(0,10);
        const selLabel=new Date(iso+"T12:00:00").toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"short"});
        const em={"아침":[],"점심":[],"저녁":[],"간식":[]};
        return (
          <div style={{marginTop:12,background:C.surface,borderRadius:12,border:`1.5px solid ${C.gold}`,overflow:"hidden"}}>
            <div style={{background:C.goldLight,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,fontWeight:700,color:C.gold}}>{selLabel}{isToday?" · 오늘":""}</span>
              <button onClick={()=>setMealPickDay(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
            </div>
            {de?(
              <div style={{padding:"12px 14px"}}>
                {de.mealFoods?MEALS.map(m2=>{const mf=de.mealFoods[m2]||[];if(!mf.length)return null;return<div key={m2} style={{display:"flex",gap:5,marginBottom:4}}><span style={{fontSize:11,fontWeight:700,color:C.gold,width:22,flexShrink:0}}>{m2}</span><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{mf.map(f=><span key={f} style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:C.surfaceAlt,color:C.textMid}}>{f}</span>)}</div></div>;}):
                <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{(de.foods||[]).map(f=><span key={f} style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:C.surfaceAlt,color:C.textMid}}>{f}</span>)}</div>}
                <div style={{display:"flex",gap:4,marginTop:8,marginBottom:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:de.pain===0?C.safeBg:C.warnBg,color:de.pain===0?C.safe:C.warn}}>복통 {SYM_P[de.pain]}</span>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:de.comfort>=3?C.safeBg:C.cautionBg,color:de.comfort>=3?C.safe:C.caution}}>{SYM_C[de.comfort]}</span>
                  {de.note&&<span style={{fontSize:11,color:C.textMuted}}>{de.note}</span>}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{setEditingId(de.id);setLogDate(de.isoDate||iso);setMeal(de.meal||"아침");setMealFoods(de.mealFoods||em);setMealSymptoms(de.mealSymptoms||emptySymptoms);setPain(de.pain||0);setBloating(de.bloating||0);setComfort(de.comfort??3);setNote(de.note||"");setSleep(de.sleep??null);setStress(de.stress??null);setActivity(de.activity??null);setStep(1);setMealPickDay(null);setShowForm(true);}}
                    style={{flex:2,padding:"9px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>✏️ 수정</button>
                  <button onClick={()=>{if(window.confirm("삭제할까요?")){setLogs(p=>p.filter(e=>e.id!==de.id));setMealPickDay(null);}}}
                    style={{flex:1,padding:"9px",background:C.warnBg,color:C.warn,border:`1px solid ${C.warnBorder}`,borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>삭제</button>
                </div>
              </div>
            ):(
              <div style={{padding:"12px 14px"}}>
                <div style={{fontSize:12,color:C.textMid,marginBottom:10}}>끼니 선택</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                  {MEALS.map(m2=><button key={m2} onClick={()=>{setLogDate(iso);setMeal(m2);setMealFoods(em);setEditingId(null);setMealPickDay(null);setShowForm(true);}} style={{padding:"10px 4px",borderRadius:9,border:`1.5px solid ${C.primary}`,background:C.primaryLight,color:C.primary,fontSize:12,fontWeight:700,cursor:"pointer"}}>{m2}</button>)}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
function MainApp(p) {
  const C = p.tInfo ? {
    bg:"#F6F4EE",surface:"#FEFCF7",surfaceAlt:"#F0EDE4",border:"#DDD8CC",borderStrong:"#C4BC9E",primary:"#4A7C59",primaryLight:"#EAF2EC",primaryMid:"#7BAE80",gold:"#C8A96E",goldLight:"#FBF5E8",goldBorder:"#E8D4A8",text:"#2C2417",textMid:"#5C4F3A",textMuted:"#9C8F7A",warn:"#B85450",warnBg:"#FDF0EF",warnBorder:"#F0B8B6",safe:"#4A7C59",safeBg:"#EAF2EC",safeBorder:"#A8CBB4",caution:"#C8936E",cautionBg:"#FDF5EE",cautionBorder:"#F0C8A8",} : {
    bg:"#F6F4EE",surface:"#FEFCF7",surfaceAlt:"#F0EDE4",border:"#DDD8CC",borderStrong:"#C4BC9E",primary:"#4A7C59",primaryLight:"#EAF2EC",primaryMid:"#7BAE80",gold:"#C8A96E",goldLight:"#FBF5E8",goldBorder:"#E8D4A8",text:"#2C2417",textMid:"#5C4F3A",textMuted:"#9C8F7A",warn:"#B85450",warnBg:"#FDF0EF",warnBorder:"#F0B8B6",safe:"#4A7C59",safeBg:"#EAF2EC",safeBorder:"#A8CBB4",caution:"#C8936E",cautionBg:"#FDF5EE",cautionBorder:"#F0C8A8",};
  const {tab,setTab,type,setType,guideMode,setGuideMode,dCat,setDCat,tInfo} = p;
  const {logs,setLogs,showForm,setShowForm,step,setStep} = p;
  const {meal,setMeal,mealIdx,setMealIdx,mealFoods,setMealFoods,foods,setFoods} = p;
  const {pain,setPain,bloating,setBloating,comfort,setComfort} = p;
  const {mealSymptoms,setMealSymptoms,symMeal,setSymMeal,note,setNote} = p;
  const {custom,setCustom,aiText,setAiText,aiImg,setAiImg,aiPrev,setAiPrev} = p;
  const {aiRes,setAiRes,aiErr,setAiErr,aiLoad,showAI,setShowAI} = p;
  const {fodPhase,setFodPhase,fodGroup,setFodGroup,fodResults,setFodResults} = p;
  const {diningToast,setDiningToast,logDate,setLogDate,mealPickDay,setMealPickDay} = p;
  const {editingId,setEditingId,logView,setLogView,calMonth,setCalMonth,calDay,setCalDay} = p;
  const {repPeriod,setRepPeriod,showQuiz,setShowQuiz,quizStep,setQuizStep,quizAns,setQuizAns} = p;
  const {analyzeAI,saveLog,fileRef,handleImg} = p;
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  const isSub = showForm || p.showQuiz || (tab==="log" && logView!=="list");
  const goHome = () => {
    setShowForm(false); p.setShowQuiz(false); setTab("log"); setLogView("list");
  };
  const goBack=()=>{
    if(showForm){step===2?setStep(1):setShowForm(false);return;}
    if(p.showQuiz){p.quizStep>0?p.setQuizStep(s=>s-1):p.setShowQuiz(false);return;}
    if(tab==="log"&&logView!=="list"){setLogView("list");}
  };
  return (
    <div style={{maxWidth:480,margin:"0 auto",fontFamily:FF,background:C.bg,minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,"+C.primary+" 0%,#3A6347 100%)",padding:"13px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100}}>
        {isSub && (
          <button onClick={goBack} aria-label="뒤로가기" style={{width:32,height:32,borderRadius:9,background:"rgba(255,255,255,0.15)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",color:"#fff",fontSize:16,padding:0}}>←</button>
        )}
        <button onClick={goHome} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.18)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0}}>
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <path d="M10 28 Q10 38 24 38 Q38 38 38 28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <line x1="10" y1="28" x2="38" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M24 10 C24 10 20 16 22 20 C23 22 25 22 26 20 C28 16 24 10 24 10Z" fill="#FFD88A"/>
            <path d="M20 15 C18 13 15 14 14 17" stroke="#FFD88A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M28 15 C30 13 33 14 34 17" stroke="#FFD88A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
        <button onClick={goHome} style={{flex:1,background:"none",border:"none",textAlign:"left",padding:0,cursor:"pointer"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>소나장</div>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,0.65)"}}>소중한 나의 장 이야기</div>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {type && (
            <button onClick={()=>setType(null)} style={{fontSize:11,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"4px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <TypeIcon type={type} color="white" size={13} /> 변경
            </button>
          )}
        </div>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        {!type ? (
          <div>
            {showQuiz ? (
              <QuizPanel quizStep={quizStep} setQuizStep={setQuizStep} quizAns={quizAns} setQuizAns={setQuizAns} setType={setType} setShowQuiz={setShowQuiz} C={C} />
            ) : (
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>IBS 유형을 선택하세요</div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:10}}>10문항 테스트 가능.</div>
                <button onClick={()=>{setShowQuiz(true);setQuizStep(0);setQuizAns({});}}
                  style={{width:"100%",padding:"12px 14px",background:C.goldLight,border:"1.5px solid "+C.goldBorder,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:22}}>🩺</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.gold}}>IBS 유형 테스트 (10문항)</div>
                    <div style={{fontSize:11,color:C.textMid,marginTop:2}}>Rome IV 참고·2분</div>
                  </div>
                  <span style={{marginLeft:"auto",fontSize:13,color:C.gold}}>→</span>
                </button>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
                  {Object.entries(TYPES).map(([k,v])=>(
                    <button key={k} onClick={()=>setType(k)}
                      style={{padding:"18px 14px",borderRadius:14,border:"1.5px solid "+C.border,background:C.surface,cursor:"pointer",textAlign:"left"}}>
                      <div style={{width:40,height:40,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><TypeIcon type={k} color={C.primary} size={22} /></div>
                      <div style={{fontSize:12.5,fontWeight:700,color:C.text,marginBottom:3}}>{v.label}</div>
                      <div style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{background:C.primaryLight,border:"1px solid "+C.safeBorder,borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TypeIcon type={type} color={C.primary} size={20} /></div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:C.primary}}>{tInfo.label}</div>
              <div style={{fontSize:11,color:C.textMid}}>{tInfo.desc}</div>
            </div>
          </div>
        )}
        {!type && !showForm && (
          <div style={{background:C.goldLight,border:"1px solid "+C.goldBorder,borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:18,flexShrink:0}}>💡</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:2}}>IBS 유형을 먼저 선택하면</div>
              <div style={{fontSize:11.5,color:C.textMid}}>기록 분석이 더 정확해져요.</div>
            </div>
          </div>
        )}
      </div>
      <div style={{padding:"0 20px"}}>
        <div style={{display:"flex",borderBottom:"2px solid "+C.border}}>
          {[{k:"log",l:"기록"},{k:"guide",l:"식단"},{k:"dining",l:"외식"},{k:"fodmap",l:"FODMAP"}].map(t=>{
            const on=tab===t.k;
            return (
              <button key={t.k} onClick={()=>setTab(t.k)}
                style={{flex:1,padding:"11px 4px",border:"none",borderBottom:"2.5px solid "+(on?C.gold:"transparent"),background:"transparent",color:on?C.primary:C.textMuted,fontSize:12,fontWeight:on?700:400,cursor:"pointer",transition:"all 0.2s",marginBottom:"-2px"}}>
                {t.l}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{padding:"16px 20px 80px"}}>
        {diningToast && (
          <div style={{background:C.primary,color:"#fff",borderRadius:12,padding:"11px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <span style={{fontSize:12.5,fontWeight:600}}>{diningToast}</span>
            <button onClick={()=>{setTab("log");setLogView("list");setDiningToast("");}}
              style={{fontSize:11.5,fontWeight:700,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,padding:"4px 12px",color:"#fff",cursor:"pointer",flexShrink:0}}>
              기록 탭 →
            </button>
          </div>
        )}
        {tab==="log" && <LogTab showForm={showForm} setShowForm={setShowForm} step={step} setStep={setStep} editingId={editingId} logDate={logDate} setLogDate={p.setLogDate} foods={foods} setFoods={setFoods} meal={meal} setMeal={setMeal} mealIdx={mealIdx} setMealIdx={setMealIdx} mealFoods={mealFoods} setMealFoods={setMealFoods} custom={custom} setCustom={setCustom} showAI={showAI} setShowAI={setShowAI} aiText={aiText} setAiText={setAiText} aiImg={aiImg} setAiImg={setAiImg} aiPrev={aiPrev} setAiPrev={setAiPrev} aiRes={aiRes} setAiRes={setAiRes} aiErr={aiErr} setAiErr={setAiErr} aiLoad={aiLoad} analyzeAI={analyzeAI} handleImg={handleImg} fileRef={fileRef} mealSymptoms={mealSymptoms} setMealSymptoms={setMealSymptoms} symMeal={symMeal} setSymMeal={setSymMeal} note={note} setNote={setNote} sleep={p.sleep} setSleep={p.setSleep} stress={p.stress} setStress={p.setStress} activity={p.activity} setActivity={p.setActivity} saveLog={saveLog} logs={logs} setLogs={setLogs} mealPickDay={mealPickDay} setMealPickDay={setMealPickDay} calMonth={calMonth} setCalMonth={setCalMonth} logView={logView} setLogView={setLogView} calDay={calDay} setCalDay={setCalDay} repPeriod={repPeriod} setRepPeriod={setRepPeriod} setPain={setPain} setBloating={setBloating} setComfort={setComfort} setEditingId={setEditingId} C={C} />}
        {tab==="guide" && <GuideTab type={type} tInfo={tInfo} guideMode={guideMode} setGuideMode={setGuideMode} C={C} />}
        {tab==="dining" && <DiningTab foods={foods} setFoods={setFoods} dCat={dCat} setDCat={setDCat} setDiningToast={setDiningToast} C={C} />}
        {tab==="fodmap" && (
          <div>
            <FodmapTab fodPhase={fodPhase} setFodPhase={setFodPhase} fodGroup={fodGroup} setFodGroup={setFodGroup} fodResults={fodResults} setFodResults={setFodResults} C={C} />
          </div>
        )}
      </div>
    </div>
  );
}
function AgreementScreen({setAgreed, C}) {
  return (
    <div style={{maxWidth:480,margin:"0 auto",fontFamily:FF,background:"#FAFAF8",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,"+C.primary+" 0%,#3A6347 100%)",padding:"20px",textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
          <div style={{width:56,height:56,borderRadius:16,background:"#4A7C59",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M10 28 Q10 38 24 38 Q38 38 38 28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <line x1="10" y1="28" x2="38" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M24 10 C24 10 20 16 22 20 C23 22 25 22 26 20 C28 16 24 10 24 10Z" fill="#FFD88A"/>
              <path d="M20 15 C18 13 15 14 14 17" stroke="#FFD88A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M28 15 C30 13 33 14 34 17" stroke="#FFD88A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
        <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>소나장</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>소중한 나의 장 이야기</div>
      </div>
      <div style={{padding:"20px 20px 0",marginBottom:4}}>
        <div style={{textAlign:"center",padding:"20px 0 16px",borderBottom:"1px solid #E8E8E8"}}>
          <div style={{fontSize:15,fontWeight:700,color:"#1C1C1C",lineHeight:1.8,marginBottom:8}}>
            소중한 나의 장 이야기
          </div>
          <div style={{fontSize:13,color:"#555",lineHeight:1.8,marginBottom:8}}>
            IBS(과민성 대장 증후군) 맞춤 식단 가이드와<br/>증상 기록을 한곳에.
          </div>
          <div style={{fontSize:13,color:"#4A7C59",fontWeight:600,lineHeight:1.8}}>
            당신의 장 건강 일기입니다.
          </div>
        </div>
      </div>
      <div style={{padding:"0 20px 20px"}}>
        <div style={{height:20}} />
        {[
          {icon:"📋",title:"참고 정보 제공",desc:"일반 정보, 의학 조언 아님."},{icon:"👨‍⚕️",title:"전문의 상담 권장",desc:"증상이 지속되면 소화기내과 전문의와 상담하세요."},{icon:"💊",title:"보충제",desc:"복용 전 전문의와 상의하세요."},{icon:"🔒",title:"개인정보 보호",desc:"기록은 기기에만 저장, 외부전송 없음."},].map(item => (
          <div key={item.title} style={{display:"flex",gap:12,padding:"14px 0",borderBottom:"1px solid #E8E8E8"}}>
            <span style={{fontSize:22,flexShrink:0}}>{item.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#1C1C1C",marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:12,color:"#666",lineHeight:1.6}}>{item.desc}</div>
            </div>
          </div>
        ))}
        <div style={{marginTop:16,padding:"12px 14px",background:"#FFF8E8",borderRadius:10,border:"1px solid #F0D890",fontSize:11.5,color:"#7A6020",lineHeight:1.7}}>
          의료기기 아님, 진단·치료 사용불가.
        </div>
        <div style={{marginTop:14,textAlign:"center",fontSize:11.5,color:"#888",marginBottom:14}}>
          다음 방문부터는 이 화면이 나타나지 않아요.
        </div>
        <button onClick={()=>setAgreed(true)} style={{width:"100%",padding:"15px",background:"linear-gradient(135deg,"+C.primary+" 0%,#3D6B4A 100%)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(74,124,89,0.3)"}}>
          동의하고 시작하기 🌿
        </button>
      </div>
    </div>
  );
}
function FBadge({name}) {
  const lv = FODMAP_LV[name];
  if (!lv) return null;
  return (
    <span style={{fontSize:9.5,fontWeight:700,padding:"1px 5px",borderRadius:20,background:BADGE_BG[lv],color:BADGE_COLOR[lv],border:`1px solid ${BADGE_COLOR[lv]}30`,whiteSpace:"nowrap",flexShrink:0}}>
      {lv==="low"?"저F":lv==="mid"?"중F":"고F"}
    </span>
  );
}
const MEALS = ["아침","점심","저녁","간식"];
const FF = "Noto Sans KR,sans-serif";
const QUICK = ["흰쌀밥","닭가슴살","계란","두부","당근(익힌)","오이","바나나(익은)","귀리·오트밀","연어","토마토","딸기","감자"];
const SYM_P = ["없음","약함","조금심함","심함"];
const SYM_C = ["나쁨","별로","보통","좋음","최고"];
export default function App() {
  const [agreed, setAgreed]     = useState(false);
  const [tab, setTab]           = useState("log");
  const [type, setType]         = useState(null);
  const [guideMode, setGuideMode] = useState("rec");
  const [dCat, setDCat]         = useState("한식");
  const [logs, setLogs]         = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep]         = useState(1);
  const [meal, setMeal]         = useState("아침");
  const [mealIdx, setMealIdx]   = useState(0);
  const [mealFoods, setMealFoods] = useState({"아침":[],"점심":[],"저녁":[],"간식":[]});
  const [foods, setFoods]       = useState([]);
  const [custom, setCustom]     = useState("");
  const [pain, setPain]         = useState(0);
  const [bloating, setBloating] = useState(0);
  const [comfort, setComfort]   = useState(3);
  const [mealSymptoms, setMealSymptoms] = useState({"아침":{pain:0,bloating:0,comfort:3},"점심":{pain:0,bloating:0,comfort:3},"저녁":{pain:0,bloating:0,comfort:3},"간식":{pain:0,bloating:0,comfort:3}});
  const [symMeal, setSymMeal] = useState("아침");
  const [note, setNote]         = useState("");
  const [sleep, setSleep]       = useState(null);
  const [stress, setStress]     = useState(null);
  const [activity, setActivity] = useState(null);
  const [logView, setLogView]   = useState("list");
  const [calMonth, setCalMonth] = useState(() => { const n=new Date(); return {y:n.getFullYear(),m:n.getMonth()}; });
  const [calDay, setCalDay]     = useState(null);
  const [repPeriod, setRepPeriod] = useState(14);
  const [diningToast, setDiningToast] = useState("");
  const [logDate, setLogDate]       = useState(new Date().toISOString().slice(0,10));
  const [mealPickDay, setMealPickDay] = useState(null);
  const [editingId, setEditingId]   = useState(null);
  const [showQuiz, setShowQuiz]     = useState(false);
  const [quizStep, setQuizStep]     = useState(0);
  const [quizAns, setQuizAns]       = useState({});
  const [aiText, setAiText]     = useState("");
  const [aiImg, setAiImg]       = useState(null);
  const [aiPrev, setAiPrev]     = useState(null);
  const [aiLoad, setAiLoad]     = useState(false);
  const [aiRes, setAiRes]       = useState(null);
  const [aiErr, setAiErr]       = useState("");
  const [showAI, setShowAI]     = useState(false);
  const [fodPhase, setFodPhase] = useState(0);
  const [fodGroup, setFodGroup] = useState(0);
  const [fodResults, setFodResults] = useState({});
  const fileRef = useRef(null);
  useEffect(() => {
    try {
      const t = localStorage.getItem("ibs-type");
      const l = localStorage.getItem("ibs-logs");
      const a = localStorage.getItem("ibs-agreed");
      const fp = localStorage.getItem("ibs-fodphase");
      const fr = localStorage.getItem("ibs-fodresults");
      if (t) setType(t);
      if (l) setLogs(JSON.parse(l));
      if (a) setAgreed(true);
      if (fp !== null) setFodPhase(JSON.parse(fp));
      if (fr) setFodResults(JSON.parse(fr));
    } catch(e) {}
  }, []);
  useEffect(() => { try { if (type) localStorage.setItem("ibs-type", type); } catch(e) {} }, [type]);
  useEffect(() => { try { localStorage.setItem("ibs-logs", JSON.stringify(logs)); } catch(e) {} }, [logs]);
  useEffect(() => { try { if (agreed) localStorage.setItem("ibs-agreed", "1"); } catch(e) {} }, [agreed]);
  useEffect(() => { try { localStorage.setItem("ibs-fodphase", JSON.stringify(fodPhase)); } catch(e) {} }, [fodPhase]);
  useEffect(() => { try { localStorage.setItem("ibs-fodresults", JSON.stringify(fodResults)); } catch(e) {} }, [fodResults]);
  const resetForm = () => {
    setFoods([]); setPain(0); setBloating(0); setComfort(3);
    setMealSymptoms({"아침":{pain:0,bloating:0,comfort:3},"점심":{pain:0,bloating:0,comfort:3},"저녁":{pain:0,bloating:0,comfort:3},"간식":{pain:0,bloating:0,comfort:3}});
    setNote(""); setMeal("아침"); setMealIdx(0); setStep(1);
    setSleep(null); setStress(null); setActivity(null);
    setCustom(""); setAiRes(null); setAiText("");
    setAiImg(null); setAiPrev(null); setShowAI(false);
    setLogDate(new Date().toISOString().slice(0,10));
    setMealFoods({"아침":[],"점심":[],"저녁":[],"간식":[]});
  };
  const saveLog = () => {
    const allFoods = {...mealFoods};
    if (foods.length > 0) allFoods[meal] = [...new Set([...(allFoods[meal]||[]), ...foods])];
    const totalFoods = Object.values(allFoods).flat();
    if (!totalFoods.length) return;
    const selectedDate = new Date(logDate + "T12:00:00");
    const entry = {
      id: editingId || Date.now(),date: selectedDate.toLocaleDateString("ko-KR",{month:"short",day:"numeric",weekday:"short"}),isoDate: logDate,mealFoods: allFoods,mealSymptoms,meal, foods: totalFoods,pain: Math.max(...MEALS.map(m=>allFoods[m]?.length?mealSymptoms[m]?.pain||0:0)),bloating: Math.max(...MEALS.map(m=>allFoods[m]?.length?mealSymptoms[m]?.bloating||0:0)),comfort: Math.round(MEALS.filter(m=>allFoods[m]?.length).reduce((s,m,_,a)=>s+(mealSymptoms[m]?.comfort??3),0)/Math.max(MEALS.filter(m=>allFoods[m]?.length).length,1)),sleep, stress, activity,note,};
    if (editingId) {
      setLogs(p => p.map(e => e.id===editingId ? entry : e));
    } else {
      setLogs(p => [entry,...p].slice(0,30));
    }
    setEditingId(null);
    resetForm(); setShowForm(false);
  };
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setAiImg(ev.target.result.split(",")[1]);
      setAiPrev(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  const analyzeAI = async () => {
    if (!aiText.trim() && !aiImg) return;
    setAiLoad(true); setAiErr(""); setAiRes(null);
    try {
      const content = [];
      if (aiImg) content.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:aiImg}});
      content.push({type:"text",text:(aiText.trim()
        ? aiText + "에서 음식명만 추출하세요."
        : "사진에서 음식명을 추출하세요.")
        + " JSON만 응답: foods 배열로" });
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:300,messages:[{role:"user",content}]}),});
      const data = await res.json();
      const txt = (data.content||[]).map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
      setAiRes(JSON.parse(txt).foods || []);
    } catch(e) { setAiErr("분석 실패. 다시 시도."); }
    finally { setAiLoad(false); }
  };
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  const tInfo = type ? TYPES[type] : null;
  if (!agreed) return <AgreementScreen setAgreed={setAgreed} C={C} />;
  return <MainApp tInfo={tInfo} tab={tab} setTab={setTab} type={type} setType={setType} guideMode={guideMode} setGuideMode={setGuideMode} dCat={dCat} setDCat={setDCat} logs={logs} setLogs={setLogs} showForm={showForm} setShowForm={setShowForm} step={step} setStep={setStep} meal={meal} setMeal={setMeal} mealIdx={mealIdx} setMealIdx={setMealIdx} mealFoods={mealFoods} setMealFoods={setMealFoods} foods={foods} setFoods={setFoods} pain={pain} setPain={setPain} bloating={bloating} setBloating={setBloating} comfort={comfort} setComfort={setComfort} mealSymptoms={mealSymptoms} setMealSymptoms={setMealSymptoms} symMeal={symMeal} setSymMeal={setSymMeal} note={note} setNote={setNote} sleep={sleep} setSleep={setSleep} stress={stress} setStress={setStress} activity={activity} setActivity={setActivity} custom={custom} setCustom={setCustom} aiText={aiText} setAiText={setAiText} aiImg={aiImg} setAiImg={setAiImg} aiPrev={aiPrev} setAiPrev={setAiPrev} aiRes={aiRes} setAiRes={setAiRes} aiErr={aiErr} setAiErr={setAiErr} aiLoad={aiLoad} showAI={showAI} setShowAI={setShowAI} fodPhase={fodPhase} setFodPhase={setFodPhase} fodGroup={fodGroup} setFodGroup={setFodGroup} fodResults={fodResults} setFodResults={setFodResults} diningToast={diningToast} setDiningToast={setDiningToast} logDate={logDate} setLogDate={setLogDate} mealPickDay={mealPickDay} setMealPickDay={setMealPickDay} editingId={editingId} setEditingId={setEditingId} logView={logView} setLogView={setLogView} calMonth={calMonth} setCalMonth={setCalMonth} calDay={calDay} setCalDay={setCalDay} repPeriod={repPeriod} setRepPeriod={setRepPeriod} showQuiz={showQuiz} setShowQuiz={setShowQuiz} quizStep={quizStep} setQuizStep={setQuizStep} quizAns={quizAns} setQuizAns={setQuizAns} analyzeAI={analyzeAI} saveLog={saveLog} fileRef={fileRef} handleImg={handleImg} />;
}
