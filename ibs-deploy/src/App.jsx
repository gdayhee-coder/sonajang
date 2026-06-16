import { useState, useEffect, useRef } from "react";
const C = {
  bg:"#F6F4EE", surface:"#FEFCF7", surfaceAlt:"#F0EDE4",
  border:"#DDD8CC", borderStrong:"#C4BC9E",
  primary:"#4A7C59", primaryLight:"#EAF2EC", primaryMid:"#7BAE80",
  gold:"#C8A96E", goldLight:"#FBF5E8", goldBorder:"#E8D4A8",
  text:"#2C2417", textMid:"#5C4F3A", textMuted:"#9C8F7A",
  warn:"#B85450", warnBg:"#FDF0EF", warnBorder:"#F0B8B6",
  safe:"#4A7C59", safeBg:"#EAF2EC", safeBorder:"#A8CBB4",
  caution:"#C8936E", cautionBg:"#FDF5EE", cautionBorder:"#F0C8A8",
};
const QUIZ = [
  {
    id:"q1", q:"최근 3개월간 가장 자주 나타나는 변의 형태는?",
    opts:[
      {label:"딱딱·덩어리 변 (Bristol 1~2)", score:{C:2}},
      {label:"정상형 (Bristol 3~4)", score:{M:1,U:1}},
      {label:"흐물흐물한 변 (Bristol 5~6)", score:{D:1,M:1}},
      {label:"묽은·물변 (Bristol 7)", score:{D:2}},
    ],
  },
  {
    id:"q2", q:"배변 횟수는 평균적으로 어떤가요?",
    opts:[
      {label:"주 3회 미만", score:{C:2}},
      {label:"하루 1~2회", score:{U:1}},
      {label:"하루 3회 이상", score:{D:2}},
      {label:"변비·설사 번갈아", score:{M:3}},
    ],
  },
  {
    id:"q3", q:"배변 시 어떤 느낌이 드나요?",
    opts:[
      {label:"힘을 줘야 함 (잔변감)", score:{C:2}},
      {label:"갑자기 급하게 (긴박감)", score:{D:2}},
      {label:"둘 다 번갈아", score:{M:2}},
      {label:"해당 없음", score:{U:1}},
    ],
  },
  {
    id:"q4", q:"복통이나 복부 불편감은 언제 주로 발생하나요?",
    opts:[
      {label:"배변 전 악화·후 완화", score:{C:1,D:1}},
      {label:"식사 후 30분~2시간", score:{D:2}},
      {label:"배변과 무관", score:{U:2}},
      {label:"스트레스 시 심해짐", score:{M:1,U:1}},
    ],
  },
  {
    id:"q5", q:"복부 팽만감이나 가스가 얼마나 심한가요?",
    opts:[
      {label:"거의 없음", score:{U:1}},
      {label:"가끔 있고 불편하지 않음", score:{C:1}},
      {label:"자주 있고 불편", score:{M:1,D:1}},
      {label:"거의 매일 심하게", score:{M:2}},
    ],
  },
  {
    id:"q6", q:"증상이 가장 심한 시간대는?",
    opts:[
      {label:"아침~오전", score:{D:2}},
      {label:"식사 후", score:{D:1,M:1}},
      {label:"저녁~취침", score:{C:1,M:1}},
      {label:"하루 종일", score:{U:2}},
    ],
  },
  {
    id:"q7", q:"음식과 증상의 관계는 어떤가요?",
    opts:[
      {label:"특정 음식 후 즉시 설사·복통", score:{D:2}},
      {label:"며칠 후 변비", score:{C:2}},
      {label:"음식 무관", score:{U:2}},
      {label:"어떤 날은 괜찮고 어떤 날은 심함", score:{M:2}},
    ],
  },
  {
    id:"q8", q:"대변을 본 후 느낌은 어떤가요?",
    opts:[
      {label:"다 본 느낌 없음 (잔변감)", score:{C:3}},
      {label:"급하게 여러 번", score:{D:3}},
      {label:"변비·급박감 번갈아", score:{M:3}},
      {label:"시원한 편", score:{U:1}},
    ],
  },
  {
    id:"q9", q:"스트레스나 감정 변화가 증상에 미치는 영향은?",
    opts:[
      {label:"스트레스→즉시 설사", score:{D:1,M:1}},
      {label:"스트레스→변비 악화", score:{C:1}},
      {label:"감정 무관", score:{U:2}},
      {label:"중요 일정 전 복통", score:{D:1,M:1}},
    ],
  },
  {
    id:"q10", q:"증상이 얼마나 오래 지속되고 있나요?",
    opts:[
      {label:"6개월 미만", score:{U:2}},
      {label:"6개월~2년", score:{M:1,D:1,C:1}},
      {label:"2년 이상", score:{C:1,D:1}},
      {label:"10년 이상", score:{M:1,C:1}},
    ],
  },
];
const TYPES = {
  constipation:{ label:"IBS-C 변비형", desc:"딱딱한 변·잔변감·배변 감소" },
  diarrhea:    { label:"IBS-D 설사형", desc:"묽은 변·급박한 변의·복통" },
  mixed:       { label:"IBS-M 혼합형", desc:"변비와 설사가 번갈아" },
  unclassified:{ label:"IBS-U 미분류", desc:"패턴 없는 복부 불편감" },
};
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
  const painText = v => v===null?"기록없음":v<0.5?"거의 없음":v<1.2?"약한 편":v<2?"조금 심한 편":v<2.7?"심한 편":"매우 심함";
  const painEmoji = v => v===null?"❓":v<0.5?"😊":v<1.2?"🙂":v<2?"😐":v<2.7?"😣":"😫";
  const comfText = v => v===null?"기록없음":v>=3.5?"매우 좋음":v>=2.8?"좋은 편":v>=2?"보통":v>=1.2?"좋지 않음":"나쁨";
  const comfEmoji = v => v===null?"❓":v>=3.5?"🌟":v>=2.8?"😊":v>=2?"😐":v>=1.2?"😔":"😰";
  const painDiff = (prevPain!==null&&curPain!==null) ? curPain-prevPain : null;
  const comfDiff = (prevComf!==null&&curComf!==null) ? curComf-prevComf : null;
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  const wkMap={};
  logs.forEach(e=>{ try{ const d=new Date(e.isoDate||e.date); const ws=new Date(d); ws.setDate(d.getDate()-d.getDay()); const wk=ws.toISOString().slice(0,10); if(!wkMap[wk])wkMap[wk]={pain:[],comfort:[]}; wkMap[wk].pain.push(e.pain||0); wkMap[wk].comfort.push(e.comfort||3); }catch(x){} });
  const weeks = Object.entries(wkMap).sort(([a],[b])=>a.localeCompare(b)).slice(-6).map(([wk,d])=>({
    label:`${new Date(wk).getMonth()+1}/${new Date(wk).getDate()}`,
    pain:d.pain.reduce((s,v)=>s+v,0)/d.pain.length,
    comfort:d.comfort.reduce((s,v)=>s+v,0)/d.comfort.length,
  }));
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
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>주별 복통 변화</div>
          <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>낮을수록 좋아요</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80,marginBottom:6}}>
            {weeks.map((w,i)=>{
              const h=Math.max(6,(w.pain/maxPain)*76);
              const col=w.pain<0.5?C.safe:w.pain<1.5?C.caution:C.warn;
              return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{fontSize:10,fontWeight:700,color:col}}>{painEmoji(w.pain)}</div>
                <div style={{width:"100%",height:h,background:col,borderRadius:"4px 4px 0 0",opacity:0.8}} />
              </div>;
            })}
          </div>
          <div style={{display:"flex",gap:6}}>{weeks.map((w,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:C.textMuted}}>{w.label}</div>)}</div>
          <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>주별 컨디션 변화</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:60}}>
              {weeks.map((w,i)=>{
                const h=Math.max(6,(w.comfort/maxComf)*56);
                return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{fontSize:10}}>{comfEmoji(w.comfort)}</div>
                  <div style={{width:"100%",height:h,background:comfC(Math.round(w.comfort)),borderRadius:"4px 4px 0 0",opacity:0.8}} />
                </div>;
              })}
            </div>
          </div>
        </div>
      )}
      <div style={{background:C.goldLight,border:`1px solid ${C.goldBorder}`,borderRadius:12,padding:"14px 16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:6}}>최근 {repPeriod}일 요약</div>
        <div style={{fontSize:13,color:C.textMid,lineHeight:1.9}}>
          {pData.length}회 기록
          {curPain!==null&&<span> · 복통은 <strong style={{color:painC(Math.round(curPain))}}>{painText(curPain)}</strong></span>}
          {curComf!==null&&<span> · 컨디션은 <strong style={{color:comfC(Math.round(curComf))}}>{comfText(curComf)}</strong></span>}
          {painDiff!==null&&painDiff<-0.2&&<span style={{color:C.safe}}> · 이전보다 나아지고 있어요 🌿</span>}
          {painDiff!==null&&painDiff>0.2&&<span style={{color:C.warn}}> · 식단을 다시 점검해보세요</span>}
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
      {!showAI ? (
        <button onClick={()=>setShowAI(true)}
          style={{width:"100%",padding:"10px 14px",background:C.primaryLight,border:`1.5px solid ${C.safeBorder}`,borderRadius:10,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:20}}>✨</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.primary}}>말하기 또는 사진으로 입력</div>
            <div style={{fontSize:11,color:C.textMid}}>"비빔밥이랑 된장찌개" 또는 사진 업로드</div>
          </div>
        </button>
      ) : (
        <div style={{background:C.surface,border:`1.5px solid ${C.primary}`,borderRadius:12,padding:14,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:700,color:C.primary}}>✨ AI 음식 인식</span>
            <button onClick={()=>{setShowAI(false);setAiText("");setAiImg(null);setAiPrev(null);setAiRes(null);setAiErr("");}} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:14}}>✕</button>
          </div>
          <textarea value={aiText} onChange={e=>setAiText(e.target.value)}
            placeholder="예: 비빔밥이랑 된장찌개 먹었어"
            style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,resize:"none",height:56,boxSizing:"border-box",outline:"none",marginBottom:8}} />
          {!aiPrev ? (
            <label style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",border:`1.5px dashed ${C.border}`,borderRadius:9,cursor:"pointer",marginBottom:8,background:C.surfaceAlt}}>
              <span style={{fontSize:18}}>📷</span>
              <span style={{fontSize:12,color:C.textMuted}}>사진 선택 (갤러리/카메라)</span>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImg} style={{display:"none"}} />
            </label>
          ) : (
            <div style={{position:"relative",marginBottom:8}}>
              <img src={aiPrev} alt="식사" style={{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:9}} />
              <button onClick={()=>{setAiImg(null);setAiPrev(null);}} style={{position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          )}
          {!aiRes&&<button onClick={analyzeAI} disabled={aiLoad||(!aiText.trim()&&!aiImg)} style={{width:"100%",padding:"9px",background:(aiText.trim()||aiImg)?C.primary:C.border,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:(aiText.trim()||aiImg)?"pointer":"default"}}>{aiLoad?"분석 중...":"AI 분석하기"}</button>}
          {aiErr&&<div style={{fontSize:12,color:C.warn,marginTop:6}}>{aiErr}</div>}
          {aiRes&&(
            <div>
              <div style={{fontSize:11.5,fontWeight:700,color:C.primary,marginBottom:8}}>인식된 음식 — 탭해서 선택/해제</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                {aiRes.map((name,idx)=>{
                  const on=foods.includes(name);
                  return <button key={idx} onClick={()=>setFoods(p=>on?p.filter(x=>x!==name):[...p,name])}
                    style={{padding:"5px 10px",borderRadius:20,border:`1.5px solid ${on?C.primary:C.border}`,background:on?C.primaryLight:C.surfaceAlt,color:on?C.primary:C.text,fontSize:12,fontWeight:on?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                    {on&&<span style={{fontSize:10}}>✓</span>}{name}<FBadge name={name} />
                  </button>;
                })}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setFoods(p=>[...p,...aiRes.filter(n=>!p.includes(n))]);setShowAI(false);setAiRes(null);setAiText("");setAiImg(null);setAiPrev(null);}} style={{flex:2,padding:"9px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>선택 항목 추가</button>
                <button onClick={()=>{setAiRes(null);setAiText("");setAiImg(null);setAiPrev(null);}} style={{flex:1,padding:"9px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,cursor:"pointer"}}>다시</button>
              </div>
            </div>
          )}
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
        <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&custom.trim()){setFoods(p=>[...p,custom.trim()]);setCustom("");}}} placeholder="직접 입력 후 Enter" style={{flex:1,padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,outline:"none"}} />
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
          <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:6}}>오늘 기록 요약</div>
          {MEALS.map(m2=>{
            const arr=[...(mealFoods[m2]||[]),...(meal===m2?foods:[])];
            const uniq=[...new Set(arr)];
            if(!uniq.length) return null;
            return <div key={m2} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:C.gold,width:24,flexShrink:0}}>{m2}</span>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{uniq.map(f=><span key={f} style={{fontSize:11,padding:"1px 7px",borderRadius:20,background:C.surface,color:C.textMid,border:`1px solid ${C.goldBorder}`}}>{f}</span>)}</div>
            </div>;
          })}
        </div>
      )}
      <button onClick={()=>{
        if(foods.length>0) setMealFoods(p=>({...p,[meal]:[...new Set([...(p[meal]||[]),...foods])]}));
        setFoods([]);
        const total=Object.values({...mealFoods,[meal]:[...new Set([...(mealFoods[meal]||[]),...foods])]}).flat();
        if(total.length>0) setStep(2);
      }} disabled={Object.values(mealFoods).flat().length===0&&foods.length===0}
        style={{width:"100%",padding:"12px",background:(Object.values(mealFoods).flat().length+foods.length)>0?C.primary:C.border,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:(Object.values(mealFoods).flat().length+foods.length)>0?"pointer":"default"}}>
        {(Object.values(mealFoods).flat().length+foods.length)>0?`다음 — 증상 기록 (총 ${Object.values(mealFoods).flat().length+foods.length}개) →`:"한 끼니 이상 입력해주세요"}
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
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><TypeIcon type={result} color={C.primary} size={48} /></div>
          <div style={{fontSize:18,fontWeight:800,color:C.primary,marginBottom:4}}>{info.label}</div>
          <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>{info.desc}</div>
        </div>
        <div style={{background:C.surfaceAlt,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:8}}>유형별 점수 분포</div>
          {[["C","변비형"],["D","설사형"],["M","혼합형"],["U","미분류"]].map(([k,label])=>{
            const pct=Math.round((sc[k]/total)*100);
            const isTop=result==="constipation"&&k==="C"||result==="diarrhea"&&k==="D"||result==="mixed"&&k==="M"||result==="unclassified"&&k==="U";
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
          ※ Rome IV 진단 기준 참고 선별 도구 · 의학적 진단을 대체하지 않습니다.
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
        <span style={{fontSize:11,color:C.primary,fontWeight:700}}>{quizStep+1} / {QUIZ.length}</span>
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
function TypeIcon({ type, color="#4A7C59", size=24 }) {
  if (type==="constipation") return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="9" fill={color} />
      <circle cx="13" cy="13" r="11.5" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
    </svg>
  );
  if (type==="diarrhea") return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <path d="M13 3.5 C13 3.5 5.5 12 5.5 16.5 C5.5 20.6 8.9 23.5 13 23.5 C17.1 23.5 20.5 20.6 20.5 16.5 C20.5 12 13 3.5 13 3.5 Z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 16.5 C9.5 18.7 11 20 12.2 20.2" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
  if (type==="mixed") return (
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
}
//   "솔루블 파이버 권장, 저FODMAP 식단 강권고"
//   "IBS 식이요법에서 저FODMAP, 차전자피(psyllium) 근거 제시"
const FOODS = {
  constipation:{
    rec:[
      {name:"차전자피(Psyllium)",reason:"ACG 2021·AGA 강권고",fodmap:"low"},
      {name:"귀리·오트밀",reason:"CAG 권장 β-글루칸",fodmap:"low"},
      {name:"키위(2개/일)",reason:"BDA 2024 권장",fodmap:"low"},
      {name:"자두·프룬(3~4개)",reason:"BDA 2024 권장",fodmap:"mid"},
      {name:"아마씨(1tbsp)",reason:"수용성·불용성 섬유질+오메가3",fodmap:"low"},
      {name:"물 1.5~2L+",reason:"섬유질 효과 발현에 필수. 탈수 시 변비 악화",fodmap:"low"},
    ],
    avoid:[
      {name:"밀기울(불용성 섬유질)",reason:"ACG 2021 불용성↑ 증상 악화"},
      {name:"고지방·튀긴 음식",reason:"장 운동 저하, 소화 지연. 변비형 IBS 악화"},
      {name:"붉은 고기(과다)",reason:"소화 느리고 식이섬유 없음. 주 2회 이하 권장"},
      {name:"알코올",reason:"장 점막 자극, 탈수로 변비 악화"},
    ],
  },
  diarrhea:{
    rec:[
      {name:"차전자피(Psyllium)",reason:"ACG 2021 강권고",fodmap:"low"},
      {name:"흰쌀밥",reason:"BRAT 식단 핵심. 소화 쉽고 장 점막 자극 없음",fodmap:"low"},
      {name:"바나나(익은 것)",reason:"BRAT 식단, 모나쉬 저F",fodmap:"low"},
      {name:"닭가슴살(삶은)",reason:"저지방 단백질",fodmap:"low"},
      {name:"당근(익힌)",reason:"펙틴 수용성섬유질, 모나쉬 저F",fodmap:"low"},
      {name:"두부(단단한)",reason:"모나쉬 저F",fodmap:"low"},
    ],
    avoid:[
      {name:"마늘·양파",reason:"모나쉬 최고F(프럭탄)"},
      {name:"유제품(유당 함유)",reason:"모나쉬 고F(락토오스)"},
      {name:"커피·카페인(과다)",reason:"위-결장 반사. 1~2잔 이하"},
      {name:"고지방 음식",reason:"담즙산 과다→설사"},
      {name:"인공감미료(소르비톨 등)",reason:"모나쉬 고F(폴리올)"},
    ],
  },
  mixed:{
    rec:[
      {name:"차전자피(Psyllium)",reason:"ACG 2021 강권고",fodmap:"low"},
      {name:"귀리·오트밀",reason:"CAG 권장, 모나쉬 저F",fodmap:"low"},
      {name:"흰쌀밥·쌀",reason:"중립적 탄수화물",fodmap:"low"},
      {name:"닭·생선(삶거나 구운)",reason:"저지방 단백질",fodmap:"low"},
      {name:"당근·호박(익힌)",reason:"모나쉬 저F 채소",fodmap:"low"},
      {name:"딸기(10알 이하)",reason:"모나쉬 저F 과일",fodmap:"low"},
    ],
    avoid:[
      {name:"마늘·양파·파(흰 부분)",reason:"모나쉬 최고F"},
      {name:"유제품",reason:"모나쉬 고F(락토오스). IBS-M 증상 교차 악화"},
      {name:"사과·수박·망고",reason:"모나쉬 고F"},
      {name:"가공식품·패스트푸드",reason:"고지방+인공첨가물"},
    ],
  },
  unclassified:{
    rec:[
      {name:"차전자피(Psyllium)",reason:"ACG 2021 강권고",fodmap:"low"},
      {name:"흰쌀밥",reason:"중립적 탄수화물",fodmap:"low"},
      {name:"계란(삶은·스크램블)",reason:"모나쉬 저FODMAP. 완전 단백질",fodmap:"low"},
      {name:"닭가슴살(삶은)",reason:"모나쉬 저FODMAP. 저지방 단백질 공급",fodmap:"low"},
      {name:"당근·오이",reason:"모나쉬 저F 채소",fodmap:"low"},
      {name:"딸기·블루베리",reason:"모나쉬 저F 과일",fodmap:"low"},
    ],
    avoid:[
      {name:"마늘·양파",reason:"모나쉬 최고FODMAP. 가장 흔한 유발"},
      {name:"밀·보리 함유 식품",reason:"모나쉬 고F(프럭탄)"},
      {name:"유제품(유당)",reason:"모나쉬 고F(락토오스)"},
      {name:"카페인·알코올",reason:"장 자극"},
    ],
  },
};
const DINING = {
  "한식":[
    {menu:"비빔밥(나물)",safe:true,tip:"마늘 소스 적게 요청"},
    {menu:"삼계탕",safe:true,tip:"담백하고 소화 쉬움"},
    {menu:"콩나물국밥",safe:true,tip:"맑은 국물 선택"},
    {menu:"불고기",safe:true,tip:"양파 적게 요청"},
    {menu:"된장찌개",safe:false,tip:"마늘·콩 고FODMAP"},
    {menu:"순두부찌개",safe:false,tip:"고춧가루·마늘 자극"},
    {menu:"떡볶이",safe:false,tip:"고추장 양념 자극"},
    {menu:"김치찌개",safe:false,tip:"발효 양념 과다 자극"},
  ],
  "양식":[
    {menu:"그릴드 치킨",safe:true,tip:"소스 별도 요청"},
    {menu:"연어 구이",safe:true,tip:"크림 소스 피하기"},
    {menu:"오트밀 브런치",safe:true,tip:"저FODMAP 토핑으로"},
    {menu:"스테이크",safe:true,tip:"마늘버터 소스 제외"},
    {menu:"파스타(크림)",safe:false,tip:"유제품·마늘 과다"},
    {menu:"피자",safe:false,tip:"유제품·밀가루 과다"},
    {menu:"햄버거",safe:false,tip:"양파·소스 자극"},
    {menu:"시저샐러드",safe:false,tip:"마늘·치즈 드레싱"},
  ],
  "일식":[
    {menu:"스시(흰살생선)",safe:true,tip:"와사비 소량만"},
    {menu:"우동(맑은국물)",safe:true,tip:"파 토핑 제외 요청"},
    {menu:"연어 덮밥",safe:true,tip:"간장 소량"},
    {menu:"오야코동",safe:true,tip:"양파 적게 요청"},
    {menu:"미소라멘",safe:false,tip:"마늘·양파 육수 주의"},
    {menu:"돈코츠라멘",safe:false,tip:"고지방 육수"},
    {menu:"타코야키",safe:false,tip:"밀가루·마요네즈"},
    {menu:"오코노미야끼",safe:false,tip:"양파·밀가루·마요"},
  ],
  "중식":[
    {menu:"계란볶음밥",safe:true,tip:"마늘 적게 요청"},
    {menu:"완탕수프",safe:true,tip:"맑은 국물 선택"},
    {menu:"찐교자",safe:true,tip:"마늘 소스 별도"},
    {menu:"새우 볶음",safe:true,tip:"마늘·양파 줄이기"},
    {menu:"짜장면",safe:false,tip:"양파·마늘 다량"},
    {menu:"짬뽕",safe:false,tip:"매운 국물 자극"},
    {menu:"마라탕",safe:false,tip:"강한 자극 성분"},
    {menu:"탕수육(소스)",safe:false,tip:"케첩 소스 과당"},
  ],
  "아시아식":[
    {menu:"쌀국수(Pho)",safe:true,tip:"숙주나물 소량"},
    {menu:"파파야샐러드",safe:true,tip:"드레싱 소량"},
    {menu:"팟타이",safe:true,tip:"마늘·양파 줄이기"},
    {menu:"그린커리",safe:false,tip:"마늘·양파 다량"},
    {menu:"나시고랭",safe:false,tip:"새우페이스트·마늘"},
    {menu:"똠얌꿍",safe:false,tip:"강한 자극 향신료"},
    {menu:"반미",safe:true,tip:"양파 빼고 요청"},
    {menu:"부리또볼",safe:true,tip:"마늘·양파 줄이기"},
  ],
  "편의점":[
    {menu:"삶은 계란",safe:true,tip:"단백질 보충 최적"},
    {menu:"그릭요거트",safe:true,tip:"유당 적어 비교적 안전"},
    {menu:"귀리 삼각김밥",safe:true,tip:"저FODMAP 탄수화물"},
    {menu:"고구마",safe:true,tip:"자연식·장 친화"},
    {menu:"바나나",safe:true,tip:"익은 것으로 선택"},
    {menu:"이온음료",safe:true,tip:"수분·전해질 보충"},
    {menu:"두부 샐러드",safe:true,tip:"식물성 단백질"},
    {menu:"컵라면",safe:false,tip:"나트륨·자극 과다"},
    {menu:"삼각김밥(불고기)",safe:false,tip:"마늘 양념 주의"},
    {menu:"크림빵",safe:false,tip:"유제품·밀가루"},
  ],
};
const FODMAP_GROUPS_DATA = [
  {key:"fructan",name:"프럭탄",color:"#E74C3C",foods:"밀·보리·마늘·양파·파",trigger:"celiac계 증상",test_foods:["밀빵","마늘","양파"],limit:"1일 1회 이하"},
  {key:"gos",name:"GOS(갈락탄)",color:"#E67E22",foods:"콩·렌틸·병아리콩·브로콜리",trigger:"복부 팽만",test_foods:["콩나물","두부(소량)","병아리콩"],limit:"1/4컵 이하"},
  {key:"lactose",name:"락토오스",color:"#F39C12",foods:"우유·아이스크림·요거트·생크림",trigger:"설사·복통",test_foods:["우유","아이스크림","크림"],limit:"1/4컵 이하"},
  {key:"fructose",name:"프럭토오스",color:"#27AE60",foods:"사과·망고·꿀·HFCS",trigger:"삼투성 설사",test_foods:["사과","꿀","망고"],limit:"소량만"},
  {key:"sorbitol",name:"소르비톨",color:"#2980B9",foods:"자두·살구·아보카도·블랙베리",trigger:"설사",test_foods:["자두","살구","아보카도"],limit:"소량만"},
  {key:"mannitol",name:"만니톨",color:"#8E44AD",foods:"버섯·콜리플라워·고구마",trigger:"복부 팽만",test_foods:["버섯","콜리플라워","고구마"],limit:"소량만"},
];
const FODMAP_LV = {
  "흰쌀밥":"low","귀리·오트밀":"low","고구마":"mid","감자":"low",
  "닭가슴살":"low","계란":"low","두부":"low","연어":"low","새우":"low",
  "당근(익힌)":"low","시금치":"low","오이":"low","토마토":"low",
  "바나나(익은)":"low","딸기":"low","블루베리":"low","포도":"low","키위":"low",
  "우유":"high","그릭요거트":"mid","두유":"low",
  "마늘·양파":"high","파":"mid",
  "사과":"high","수박":"high","망고":"high",
  "식빵":"high","라면":"high","쌀국수":"low",
  "꿀":"high","올리고당":"high",
  "차전자피(Psyllium)":"low","아마씨":"low",
  "자두(소량)":"mid","자두·프룬(3~4개)":"mid",
  "버섯":"high","아보카도":"mid",
};
const BADGE_COLOR = {low:"#00695C",mid:"#B7791F",high:"#C0392B"};
const BADGE_BG    = {low:"#E0F2EE",mid:"#FFFBEB",high:"#FDF2F2"};
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
  const suspects=Object.entries(badFreq).map(([name,cnt])=>({name,cnt,badRate:cnt/Math.max(bad.length,1),goodRate:(goodFreq[name]||0)/Math.max(good.length,1)})).filter(x=>x.cnt>=2&&x.badRate>x.goodRate).sort((a,b)=>b.badRate-a.badRate).slice(0,6);
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
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:16}}>
        {[{n:0,l:"1단계 제한기"},{n:1,l:"2단계 재도입기"},{n:2,l:"3단계 개인화기"}].map(ph=>{
          const on=fodPhase===ph.n;
          return <button key={ph.n} onClick={()=>setFodPhase(ph.n)} style={{padding:"10px 4px",borderRadius:10,border:`1.5px solid ${on?C.primary:C.border}`,background:on?C.primaryLight:C.surface,color:on?C.primary:C.textMuted,fontSize:11,fontWeight:on?700:400,cursor:"pointer",lineHeight:1.4}}>{ph.l}</button>;
        })}
      </div>
      {fodPhase===0&&(
        <div>
          <div style={{background:C.surface,borderRadius:12,padding:16,border:`1px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>1단계: 제한기 (2~6주)</div>
            <div style={{fontSize:12,color:C.textMid,lineHeight:1.7,marginBottom:14}}>모든 고FODMAP 식품을 제한합니다. 증상이 안정되면 2단계로 이동하세요.</div>
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
            <div style={{fontSize:11.5,color:C.textMid,lineHeight:1.7}}>IBS 외 다른 원인일 수 있어요. 전문의 상담을 권장합니다.</div>
          </div>
          <button onClick={()=>{ if(window.confirm("2단계 재도입기로 이동할까요? 제한기 데이터는 유지됩니다.")) setFodPhase(1); }}
            style={{width:"100%",padding:"13px",background:C.primary,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:12}}>
            증상 안정됨 → 재도입기 시작
          </button>
        </div>
      )}
      {fodPhase===1&&(
        <div>
          <div style={{background:C.surface,borderRadius:12,padding:16,border:`1px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>2단계: 재도입기 (6~8주)</div>
            <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>각 그룹을 3일씩 테스트합니다.</div>
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
                  1가지를 평소 양으로 섭취 후 24~48시간 관찰하세요.
                </div>
                {!fodResults[g.key]?(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <button onClick={()=>setFodResults(p=>({...p,[g.key]:"pass"}))} style={{padding:"11px",background:C.safeBg,color:C.safe,border:`1.5px solid ${C.safeBorder}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ 증상 없음 (통과)</button>
                    <button onClick={()=>setFodResults(p=>({...p,[g.key]:"sensitive"}))} style={{padding:"11px",background:C.warnBg,color:C.warn,border:`1.5px solid ${C.warnBorder}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>✕ 증상 있음 (민감)</button>
                  </div>
                ):(
                  <div>
                    <div style={{background:fodResults[g.key]==="pass"?C.safeBg:C.warnBg,border:`1px solid ${fodResults[g.key]==="pass"?C.safeBorder:C.warnBorder}`,borderRadius:10,padding:"12px",textAlign:"center",marginBottom:10}}>
                      <div style={{fontSize:14,fontWeight:700,color:fodResults[g.key]==="pass"?C.safe:C.warn}}>{fodResults[g.key]==="pass"?"✓ 통과 — 이 그룹은 섭취 가능해요":"✕ 민감 — 이 그룹은 제한하세요"}</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setFodResults(p=>{const n={...p};delete n[g.key];return n;})} style={{flex:1,padding:"9px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,cursor:"pointer"}}>다시 테스트</button>
                      {fodGroup<FODMAP_GROUPS_DATA.length-1&&<button onClick={()=>setFodGroup(i=>i+1)} style={{flex:2,padding:"9px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>다음 그룹 테스트 →</button>}
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
            <button onClick={()=>setFodPhase(2)} style={{width:"100%",padding:"13px",background:C.primary,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:12}}>
              모든 테스트 완료 → 개인화기
            </button>
          )}
        </div>
      )}
      {fodPhase===2&&(
        <div>
          <div style={{background:C.safeBg,border:`1px solid ${C.safeBorder}`,borderRadius:14,padding:20,textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:36,marginBottom:10}}>🎉</div>
            <div style={{fontSize:15,fontWeight:700,color:C.safe,marginBottom:8}}>나만의 식단 완성!</div>
            <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>민감한 그룹만 피하고 나머지는 자유롭게.</div>
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
            <div style={{fontSize:11.5,color:C.textMid,marginBottom:5,lineHeight:1.5}}>웰니스 생활기록 · 장건강 관련 정보를 나눠요</div>
            <div style={{fontSize:11,color:C.gold,fontWeight:600}}>m.blog.naver.com/readingonenglish →</div>
          </div>
        </a>
      </div>
    </div>
  );
}
function LogListView({logs,setEditingId,setLogDate,setMeal,setMealFoods,setFoods,setPain,setBloating,setComfort,setNote,setMealSymptoms,setStep,setShowForm,setLogs,C}) {
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
            <span style={{fontSize:12,fontWeight:700,color:C.primary}}>{entry.date} · {entry.meal}</span>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:entry.pain===0?C.safeBg:C.warnBg,color:entry.pain===0?C.safe:C.warn}}>복통 {SYM_P[entry.pain]}</span>
              <span style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:entry.comfort>=3?C.safeBg:C.cautionBg,color:comfC(entry.comfort)}}>{SYM_C[entry.comfort]}</span>
              <button onClick={()=>{
                setEditingId(entry.id); setLogDate(entry.isoDate||new Date().toISOString().slice(0,10));
                setMeal(entry.meal||"아침"); setMealFoods(entry.mealFoods||{"아침":[],"점심":[],"저녁":[],"간식":[]});
                setFoods([]); setPain(entry.pain||0); setBloating(entry.bloating||0);
                setComfort(entry.comfort??3); setNote(entry.note||"");
                setMealSymptoms(entry.mealSymptoms||{"아침":{pain:0,bloating:0,comfort:3},"점심":{pain:0,bloating:0,comfort:3},"저녁":{pain:0,bloating:0,comfort:3},"간식":{pain:0,bloating:0,comfort:3}});
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
function Step2Panel({mealFoods,mealSymptoms,setMealSymptoms,symMeal,setSymMeal,note,setNote,saveLog,setStep,editingId,C}) {
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
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="메모 (선택)" style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:9,fontSize:12,marginBottom:12,boxSizing:"border-box",outline:"none"}} />
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setStep(1)} style={{flex:1,padding:"12px",background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>← 음식 수정</button>
        <button onClick={saveLog} style={{flex:2,padding:"12px",background:C.primary,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>{editingId?"수정 완료":"저장하기"}</button>
      </div>
    </div>
  );
}
function MiniCalendar({logs,mealPickDay,setMealPickDay,calMonth,setCalMonth,setLogView,setLogDate,setMeal,setMealFoods,setEditingId,setStep,setShowForm,setPain,setBloating,setComfort,setNote,setMealSymptoms,setLogs,C}) {
  const now = new Date();
  const y=now.getFullYear(), m=now.getMonth(), today=now.getDate();
  const firstDay=new Date(y,m,1).getDay();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const dayMap={};
  logs.forEach(e=>{try{const d=new Date(e.isoDate||e.date);if(d.getFullYear()===y&&d.getMonth()===m)dayMap[d.getDate()]=e;}catch(x){}});
  const comfC=v=>v>=3?C.safe:v>=2?C.caution:C.warn;
  const emptySymptoms={"아침":{pain:0,bloating:0,comfort:3},"점심":{pain:0,bloating:0,comfort:3},"저녁":{pain:0,bloating:0,comfort:3},"간식":{pain:0,bloating:0,comfort:3}};
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
          const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isSel=mealPickDay===iso;
          return <div key={day} onClick={()=>{if(!isFuture)setMealPickDay(isSel?null:iso);}}
            style={{aspectRatio:"1",borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:isSel?C.goldLight:entry?comfC(entry.comfort)+"20":isToday?C.primaryLight:"transparent",border:isSel?`1.5px solid ${C.gold}`:isToday?`1.5px solid ${C.primary}`:entry?`1px solid ${comfC(entry.comfort)}44`:"1px solid transparent",cursor:isFuture?"default":"pointer",opacity:isFuture?0.25:1}}>
            <span style={{fontSize:10.5,fontWeight:isToday?700:400,color:isSel?C.gold:isToday?C.primary:C.text,lineHeight:1}}>{day}</span>
            {entry&&<div style={{width:4,height:4,borderRadius:"50%",background:comfC(entry.comfort),marginTop:1}} />}
            {!entry&&!isFuture&&<div style={{fontSize:8,color:C.border,lineHeight:1,marginTop:1}}>+</div>}
          </div>;
        })}
      </div>
      <div style={{display:"flex",gap:10,marginTop:10,paddingTop:8,borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {[{col:C.safe,label:"좋은 날"},{col:C.caution,label:"보통"},{col:C.warn,label:"나쁜 날"},{col:C.primary,label:"오늘"}].map(x=>(
          <div key={x.label} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:x.col}} />
            <span style={{fontSize:10,color:C.textMuted}}>{x.label}</span>
          </div>
        ))}
        <span style={{fontSize:10,color:C.textMuted,marginLeft:"auto"}}>날짜 탭 → 기록/수정</span>
      </div>
      {mealPickDay&&(()=>{
        const selDate=new Date(mealPickDay+"T12:00:00");
        const selLabel=selDate.toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"short"});
        const isToday2=mealPickDay===new Date().toISOString().slice(0,10);
        const dayEntry=Object.values(dayMap).find(e=>e.isoDate===mealPickDay);
        return (
          <div style={{marginTop:12,background:C.surface,borderRadius:12,border:`1.5px solid ${C.gold}`,overflow:"hidden"}}>
            <div style={{background:C.goldLight,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,fontWeight:700,color:C.gold}}>{selLabel}{isToday2?" · 오늘":""}</span>
              <button onClick={()=>setMealPickDay(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:14,lineHeight:1}}>✕</button>
            </div>
            {dayEntry?(
              <div style={{padding:"12px 14px"}}>
                {dayEntry.mealFoods?MEALS.map(m2=>{const mf=dayEntry.mealFoods[m2]||[];if(!mf.length)return null;return <div key={m2} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:5}}><span style={{fontSize:11,fontWeight:700,color:C.gold,width:24,flexShrink:0}}>{m2}</span><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{mf.map(f=><span key={f} style={{fontSize:11.5,padding:"2px 8px",borderRadius:20,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}</div></div>;}):
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{(dayEntry.foods||[]).map(f=><span key={f} style={{fontSize:11.5,padding:"2px 8px",borderRadius:20,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`}}>{f}</span>)}</div>}
                <div style={{display:"flex",gap:5,marginTop:8,marginBottom:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:dayEntry.pain===0?C.safeBg:C.warnBg,color:dayEntry.pain===0?C.safe:C.warn}}>복통 {SYM_P[dayEntry.pain]}</span>
                  <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:dayEntry.comfort>=3?C.safeBg:C.cautionBg,color:dayEntry.comfort>=3?C.safe:C.caution}}>{SYM_C[dayEntry.comfort]}</span>
                  {dayEntry.note&&<span style={{fontSize:11,color:C.textMuted}}>{dayEntry.note}</span>}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{
                    setEditingId(dayEntry.id); setLogDate(dayEntry.isoDate||mealPickDay);
                    setMeal(dayEntry.meal||"아침"); setMealFoods(dayEntry.mealFoods||{"아침":[],"점심":[],"저녁":[],"간식":[]});
                    setMealSymptoms(dayEntry.mealSymptoms||emptySymptoms);
                    setPain(dayEntry.pain||0); setBloating(dayEntry.bloating||0);
                    setComfort(dayEntry.comfort??3); setNote(dayEntry.note||"");
                    setStep(1); setMealPickDay(null); setShowForm(true);
                  }} style={{flex:2,padding:"9px",background:C.primary,color:"#fff",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>✏️ 수정하기</button>
                  <button onClick={()=>{if(window.confirm("이 날의 기록을 삭제할까요?")){{setLogs(p=>p.filter(e=>e.id!==dayEntry.id));setMealPickDay(null);}}}} style={{flex:1,padding:"9px",background:C.warnBg,color:C.warn,border:`1px solid ${C.warnBorder}`,borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>🗑 삭제</button>
                </div>
              </div>
            ):(
              <div style={{padding:"12px 14px"}}>
                <div style={{fontSize:12,color:C.textMid,marginBottom:10}}>어느 끼니를 기록할까요?</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                  {MEALS.map(m2=>(
                    <button key={m2} onClick={()=>{setLogDate(mealPickDay);setMeal(m2);setMealFoods({"아침":[],"점심":[],"저녁":[],"간식":[]});setEditingId(null);setMealPickDay(null);setShowForm(true);}} style={{padding:"10px 4px",borderRadius:9,border:`1.5px solid ${C.primary}`,background:C.primaryLight,color:C.primary,fontSize:12,fontWeight:700,cursor:"pointer"}}>{m2}</button>
                  ))}
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
    bg:"#F6F4EE",surface:"#FEFCF7",surfaceAlt:"#F0EDE4",
    border:"#DDD8CC",borderStrong:"#C4BC9E",
    primary:"#4A7C59",primaryLight:"#EAF2EC",primaryMid:"#7BAE80",
    gold:"#C8A96E",goldLight:"#FBF5E8",goldBorder:"#E8D4A8",
    text:"#2C2417",textMid:"#5C4F3A",textMuted:"#9C8F7A",
    warn:"#B85450",warnBg:"#FDF0EF",warnBorder:"#F0B8B6",
    safe:"#4A7C59",safeBg:"#EAF2EC",safeBorder:"#A8CBB4",
    caution:"#C8936E",cautionBg:"#FDF5EE",cautionBorder:"#F0C8A8",
  } : {
    bg:"#F6F4EE",surface:"#FEFCF7",surfaceAlt:"#F0EDE4",
    border:"#DDD8CC",borderStrong:"#C4BC9E",
    primary:"#4A7C59",primaryLight:"#EAF2EC",primaryMid:"#7BAE80",
    gold:"#C8A96E",goldLight:"#FBF5E8",goldBorder:"#E8D4A8",
    text:"#2C2417",textMid:"#5C4F3A",textMuted:"#9C8F7A",
    warn:"#B85450",warnBg:"#FDF0EF",warnBorder:"#F0B8B6",
    safe:"#4A7C59",safeBg:"#EAF2EC",safeBorder:"#A8CBB4",
    caution:"#C8936E",cautionBg:"#FDF5EE",cautionBorder:"#F0C8A8",
  };
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
  return (
    <div style={{maxWidth:480,margin:"0 auto",fontFamily:FF,background:C.bg,minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,"+C.primary+" 0%,#3A6347 100%)",padding:"13px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:100}}>
        <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <path d="M10 28 Q10 38 24 38 Q38 38 38 28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <line x1="10" y1="28" x2="38" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M24 10 C24 10 20 16 22 20 C23 22 25 22 26 20 C28 16 24 10 24 10Z" fill="#FFD88A"/>
            <path d="M20 15 C18 13 15 14 14 17" stroke="#FFD88A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M28 15 C30 13 33 14 34 17" stroke="#FFD88A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>소나장</div>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,0.65)"}}>소중한 나의 장 이야기</div>
        </div>
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
                <div style={{fontSize:12,color:C.textMuted,marginBottom:10}}>잘 모르겠다면 10문항 테스트로 확인해보세요.</div>
                <button onClick={()=>{setShowQuiz(true);setQuizStep(0);setQuizAns({});}}
                  style={{width:"100%",padding:"12px 14px",background:C.goldLight,border:"1.5px solid "+C.goldBorder,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:22}}>🩺</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.gold}}>IBS 유형 테스트 (10문항)</div>
                    <div style={{fontSize:11,color:C.textMid,marginTop:2}}>Rome IV 기준 참고 · 약 2분</div>
                  </div>
                  <span style={{marginLeft:"auto",fontSize:13,color:C.gold}}>→</span>
                </button>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {Object.entries(TYPES).map(([k,v])=>(
                    <button key={k} onClick={()=>setType(k)}
                      style={{padding:"12px 10px",borderRadius:12,border:"1.5px solid "+C.border,background:C.surface,cursor:"pointer",textAlign:"left"}}>
                      <div style={{marginBottom:6}}><TypeIcon type={k} color={C.primary} size={24} /></div>
                      <div style={{fontSize:12,fontWeight:700,color:C.text}}>{v.label}</div>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:2,lineHeight:1.4}}>{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{background:C.primaryLight,border:"1px solid "+C.safeBorder,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <TypeIcon type={type} color={C.primary} size={22} />
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

        {tab==="log" && (
          <div>
            {showForm ? (
              <div style={{background:C.surface,borderRadius:16,padding:16,border:"1px solid "+C.border,boxShadow:"0 2px 16px rgba(74,60,36,0.08)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:10,borderBottom:"1px solid "+C.border}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.primary}}>{editingId ? "기록 수정" : "식사 기록"}</div>
                    <input type="date" value={logDate} max={new Date().toISOString().slice(0,10)} onChange={e=>p.setLogDate(e.target.value)}
                      style={{fontSize:12,color:C.textMid,border:"none",background:"transparent",cursor:"pointer",marginTop:2,outline:"none",fontFamily:"inherit",padding:0}} />
                  </div>
                  <button onClick={()=>{p.setShowForm(false);p.setStep(1);}} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:18,lineHeight:1}}>✕</button>
                </div>
                {step===1 && <Step1Panel foods={foods} setFoods={setFoods} meal={meal} setMeal={setMeal} mealIdx={mealIdx} setMealIdx={setMealIdx} mealFoods={mealFoods} setMealFoods={setMealFoods} custom={custom} setCustom={setCustom} showAI={showAI} setShowAI={setShowAI} aiText={aiText} setAiText={setAiText} aiImg={aiImg} setAiImg={setAiImg} aiPrev={aiPrev} setAiPrev={setAiPrev} aiRes={aiRes} setAiRes={setAiRes} aiErr={aiErr} setAiErr={setAiErr} aiLoad={aiLoad} analyzeAI={analyzeAI} handleImg={handleImg} fileRef={fileRef} setStep={setStep} C={C} />}
                {step===2 && <Step2Panel mealFoods={mealFoods} mealSymptoms={mealSymptoms} setMealSymptoms={setMealSymptoms} symMeal={symMeal} setSymMeal={setSymMeal} note={note} setNote={setNote} saveLog={saveLog} setStep={setStep} editingId={editingId} C={C} />}
              </div>
            ) : (
              <div>
                <MiniCalendar logs={logs} mealPickDay={mealPickDay} setMealPickDay={setMealPickDay} calMonth={calMonth} setCalMonth={setCalMonth} setLogView={setLogView} setLogDate={p.setLogDate} setMeal={setMeal} setMealFoods={setMealFoods} setEditingId={setEditingId} setStep={setStep} setShowForm={setShowForm} setPain={setPain} setBloating={setBloating} setComfort={setComfort} setNote={setNote} setMealSymptoms={setMealSymptoms} setLogs={setLogs} C={C} />
                <div style={{display:"flex",borderBottom:"1.5px solid "+C.border,marginBottom:14}}>
                  {[{k:"list",l:"목록"},{k:"calendar",l:"달력"},{k:"trigger",l:"트리거"},{k:"report",l:"리포트"}].map(v=>{
                    const on=logView===v.k;
                    return (
                      <button key={v.k} onClick={()=>setLogView(v.k)}
                        style={{flex:1,padding:"10px 2px",border:"none",borderBottom:"2.5px solid "+(on?C.gold:"transparent"),background:"transparent",color:on?C.primary:C.textMuted,fontSize:11.5,fontWeight:on?700:400,cursor:"pointer",marginBottom:"-1.5px"}}>
                        {v.l}
                      </button>
                    );
                  })}
                </div>
                {logView==="list" && <LogListView logs={logs} setEditingId={setEditingId} setLogDate={p.setLogDate} setMeal={setMeal} setMealFoods={setMealFoods} setFoods={setFoods} setPain={setPain} setBloating={setBloating} setComfort={setComfort} setNote={setNote} setMealSymptoms={setMealSymptoms} setStep={setStep} setShowForm={setShowForm} setLogs={setLogs} C={C} />}
                {logView==="calendar" && <CalendarView logs={logs} calMonth={calMonth} setCalMonth={setCalMonth} calDay={calDay} setCalDay={setCalDay} setLogView={setLogView} C={C} />}
                {logView==="trigger" && <TriggerView logs={logs} C={C} />}
                {logView==="report" && <ReportPanel logs={logs} repPeriod={repPeriod} setRepPeriod={setRepPeriod} C={C} />}
              </div>
            )}
          </div>
        )}

        {tab==="guide" && type && (
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {[{k:"rec",l:"추천 음식"},{k:"avoid",l:"피할 음식"}].map(g=>{
                const on=guideMode===g.k;
                return (
                  <button key={g.k} onClick={()=>setGuideMode(g.k)}
                    style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid "+(on?(g.k==="rec"?C.primary:C.warn):(C.border)),background:on?(g.k==="rec"?C.primaryLight:C.warnBg):"transparent",color:on?(g.k==="rec"?C.primary:C.warn):C.textMuted,fontSize:12,fontWeight:on?700:400,cursor:"pointer"}}>
                    {g.l}
                  </button>
                );
              })}
            </div>
            {guideMode==="rec" && (
              <div>
                {FOODS[type].rec.map(f=>(
                  <div key={f.name} style={{background:C.surface,borderRadius:12,padding:"11px 14px",border:"1px solid "+C.border,marginBottom:8,display:"flex",gap:10,alignItems:"flex-start",boxShadow:"0 1px 4px rgba(74,60,36,0.06)"}}>
                    <div style={{width:4,height:36,borderRadius:2,background:C.primary,flexShrink:0,marginTop:2}} />
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:700,color:C.text}}>{f.name}</span>
                        <FBadge name={f.name} />
                      </div>
                      <div style={{fontSize:11.5,color:C.textMuted}}>{f.reason}</div>
                    </div>
                  </div>
                ))}
                <div style={{fontSize:10.5,color:C.textMuted,padding:"8px 4px",lineHeight:1.6}}>📚 Monash DB · ACG 2021 · AGA 2022</div>
              </div>
            )}
            {guideMode==="avoid" && (
              <div>
                {FOODS[type].avoid.map(f=>(
                  <div key={f.name} style={{background:C.warnBg,borderRadius:12,padding:"11px 14px",border:"1px solid "+C.warnBorder,marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{width:4,height:36,borderRadius:2,background:C.warn,flexShrink:0,marginTop:2}} />
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>{f.name}</div>
                      <div style={{fontSize:11.5,color:C.textMuted}}>{f.reason}</div>
                    </div>
                  </div>
                ))}
                <div style={{fontSize:10.5,color:C.textMuted,padding:"8px 4px",lineHeight:1.6}}>📚 Monash DB · ACG 2021 · AGA 2022</div>
              </div>
            )}
          </div>
        )}
        {tab==="guide" && !type && (
          <div style={{textAlign:"center",padding:"40px 20px",color:C.textMuted,fontSize:13}}>유형을 먼저 선택해주세요.</div>
        )}

        {tab==="dining" && (
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {Object.keys(DINING).map(cat=>(
                <button key={cat} onClick={()=>setDCat(cat)}
                  style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid "+(dCat===cat?C.primary:C.border),background:dCat===cat?C.primaryLight:"transparent",color:dCat===cat?C.primary:C.textMuted,fontSize:12,fontWeight:dCat===cat?700:400,cursor:"pointer"}}>
                  {cat}
                </button>
              ))}
            </div>
            {(DINING[dCat]||[]).map(item=>{
              const added=foods.some(f=>f===item.menu);
              const handleAdd=()=>{
                if(!added){setFoods(prev=>[...prev,item.menu]);setDiningToast(item.menu+"를 기록에 추가했어요!");setTimeout(()=>setDiningToast(""),3000);}
                else{setFoods(prev=>prev.filter(x=>x!==item.menu));setDiningToast("");}
              };
              return (
                <div key={item.menu} style={{background:C.surface,borderRadius:12,padding:"12px 14px",border:"1px solid "+C.border,marginBottom:8,borderLeft:"3px solid "+(item.safe?C.gold:C.warn)}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.text}}>{item.menu}</span>
                    <button onClick={handleAdd} style={{fontSize:11.5,padding:"4px 12px",borderRadius:20,border:"1px solid "+(added?C.primary:C.borderStrong),background:added?C.primaryLight:"transparent",color:added?C.primary:C.textMuted,cursor:"pointer"}}>
                      {added?"✓ 추가됨":"+ 기록에 추가"}
                    </button>
                  </div>
                  <div style={{fontSize:11.5,color:item.safe?C.safe:C.warn,fontWeight:600,marginBottom:2}}>{item.safe?"추천":"주의"}</div>
                  <div style={{fontSize:11.5,color:C.textMuted}}>{item.tip}</div>
                </div>
              );
            })}
          </div>
        )}

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
          <div style={{width:56,height:56,borderRadius:16,background:"#4A7C59",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(74,124,89,0.3)"}}>
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
            소중한 나의 장 이야기.
          </div>
          <div style={{fontSize:13,color:"#555",lineHeight:1.8,marginBottom:8}}>
            IBS(과민성 대장 증후군) 맞춤 식단 가이드와<br/>증상 기록을 한곳에.
          </div>
          <div style={{fontSize:13,color:"#4A7C59",fontWeight:600,lineHeight:1.8}}>
            소나장은 당신의 장 건강 일기입니다.
          </div>
        </div>
      </div>
      <div style={{padding:"0 20px 20px"}}>
        <div style={{height:20}} />
        {[
          {icon:"📋",title:"참고 정보 제공",desc:"이 앱은 일반적인 식단 정보를 제공하며, 개인별 의학적 조언이 아닙니다."},
          {icon:"👨‍⚕️",title:"전문의 상담 권장",desc:"증상이 심하거나 지속될 경우 반드시 소화기내과 전문의와 상담하세요."},
          {icon:"💊",title:"보충제 주의",desc:"식이섬유 보충제 복용 전 전문의와 상의하세요."},
          {icon:"🔒",title:"개인정보 보호",desc:"모든 기록은 이 기기에만 저장되며 외부로 전송되지 않습니다."},
        ].map(item => (
          <div key={item.title} style={{display:"flex",gap:12,padding:"14px 0",borderBottom:"1px solid #E8E8E8"}}>
            <span style={{fontSize:22,flexShrink:0}}>{item.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#1C1C1C",marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:12,color:"#666",lineHeight:1.6}}>{item.desc}</div>
            </div>
          </div>
        ))}
        <div style={{marginTop:16,padding:"12px 14px",background:"#FFF8E8",borderRadius:10,border:"1px solid #F0D890",fontSize:11.5,color:"#7A6020",lineHeight:1.7}}>
          이 앱은 의료기기가 아니며 진단·치료 목적으로 사용할 수 없습니다. 제공되는 정보는 일반적인 건강 정보입니다.
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
    <span style={{fontSize:9.5,fontWeight:700,padding:"1px 5px",borderRadius:20,
      background:BADGE_BG[lv],color:BADGE_COLOR[lv],
      border:`1px solid ${BADGE_COLOR[lv]}30`,whiteSpace:"nowrap",flexShrink:0}}>
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
      id: editingId || Date.now(),
      date: selectedDate.toLocaleDateString("ko-KR",{month:"short",day:"numeric",weekday:"short"}),
      isoDate: logDate,
      mealFoods: allFoods,
      mealSymptoms,
      meal, foods: totalFoods,
      pain: Math.max(...MEALS.map(m=>allFoods[m]?.length?mealSymptoms[m]?.pain||0:0)),
      bloating: Math.max(...MEALS.map(m=>allFoods[m]?.length?mealSymptoms[m]?.bloating||0:0)),
      comfort: Math.round(MEALS.filter(m=>allFoods[m]?.length).reduce((s,m,_,a)=>s+(mealSymptoms[m]?.comfort??3),0)/Math.max(MEALS.filter(m=>allFoods[m]?.length).length,1)),
      note,
    };
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
        : "이 음식 사진에서 음식명을 추출하세요.")
        + " JSON만 응답: foods 배열로" });
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:300,messages:[{role:"user",content}]}),
      });
      const data = await res.json();
      const txt = (data.content||[]).map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
      setAiRes(JSON.parse(txt).foods || []);
    } catch(e) { setAiErr("분석 실패. 다시 시도해주세요."); }
    finally { setAiLoad(false); }
  };
  const painC = v => v===0?C.safe:v===1?C.caution:C.warn;
  const comfC = v => v>=3?C.safe:v>=2?C.caution:C.warn;
  const tInfo = type ? TYPES[type] : null;
  if (!agreed) return <AgreementScreen setAgreed={setAgreed} C={C} />;
  return <MainApp tInfo={tInfo} tab={tab} setTab={setTab} type={type} setType={setType} guideMode={guideMode} setGuideMode={setGuideMode} dCat={dCat} setDCat={setDCat} logs={logs} setLogs={setLogs} showForm={showForm} setShowForm={setShowForm} step={step} setStep={setStep} meal={meal} setMeal={setMeal} mealIdx={mealIdx} setMealIdx={setMealIdx} mealFoods={mealFoods} setMealFoods={setMealFoods} foods={foods} setFoods={setFoods} pain={pain} setPain={setPain} bloating={bloating} setBloating={setBloating} comfort={comfort} setComfort={setComfort} mealSymptoms={mealSymptoms} setMealSymptoms={setMealSymptoms} symMeal={symMeal} setSymMeal={setSymMeal} note={note} setNote={setNote} custom={custom} setCustom={setCustom} aiText={aiText} setAiText={setAiText} aiImg={aiImg} setAiImg={setAiImg} aiPrev={aiPrev} setAiPrev={setAiPrev} aiRes={aiRes} setAiRes={setAiRes} aiErr={aiErr} setAiErr={setAiErr} aiLoad={aiLoad} showAI={showAI} setShowAI={setShowAI} fodPhase={fodPhase} setFodPhase={setFodPhase} fodGroup={fodGroup} setFodGroup={setFodGroup} fodResults={fodResults} setFodResults={setFodResults} diningToast={diningToast} setDiningToast={setDiningToast} logDate={logDate} setLogDate={setLogDate} mealPickDay={mealPickDay} setMealPickDay={setMealPickDay} editingId={editingId} setEditingId={setEditingId} logView={logView} setLogView={setLogView} calMonth={calMonth} setCalMonth={setCalMonth} calDay={calDay} setCalDay={setCalDay} repPeriod={repPeriod} setRepPeriod={setRepPeriod} showQuiz={showQuiz} setShowQuiz={setShowQuiz} quizStep={quizStep} setQuizStep={setQuizStep} quizAns={quizAns} setQuizAns={setQuizAns} analyzeAI={analyzeAI} saveLog={saveLog} fileRef={fileRef} handleImg={handleImg} />;
}
