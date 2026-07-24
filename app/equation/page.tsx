"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import './equation.css';

/* ---------- helpers ---------- */
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randNonZero(min: number, max: number) { let v = 0; while (v === 0) v = randInt(min, max); return v; }
function pick<T>(arr: T[]): T { return arr[randInt(0, arr.length - 1)]; }
function gcd(a: number, b: number) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a || 1;
}

function wrapVar(ch: string) { return `<span class="mvar">${ch}</span>`; }
function fracHTML(num: string | number, den: string | number) {
  return `<span class="frac"><span class="num">${num}</span><span class="denom">${den}</span></span>`;
}
const X = wrapVar('x');

function xTerm(a: number, fmt?: (n: number) => string | number) {
  if (a === 1 && !fmt) return X;
  if (a === -1 && !fmt) return '-' + X;
  return (fmt ? fmt(a) : a) + X;
}

function constTail(b: number, fmt?: (n: number) => string | number) {
  if (b === 0) return '';
  const abs = fmt ? fmt(Math.abs(b)) : Math.abs(b);
  return (b > 0 ? ' + ' : ' - ') + abs;
}

function side(a: number, b: number, fmt?: (n: number) => string | number) {
  if (a === 0) return String(fmt ? fmt(b) : b);
  return xTerm(a, fmt) + constTail(b, fmt);
}

function dec(n: number) {
  const v = n / 10;
  return (v % 1 === 0) ? String(v) : v.toFixed(1);
}

function pickSolution(fracChance: number) {
  if (Math.random() < fracChance) {
    const q = pick([2, 2, 3, 3, 4, 5]);
    let p;
    do { p = randNonZero(-9, 9); } while (gcd(p, q) !== 1);
    return { p, q };
  }
  return { p: randNonZero(-9, 9), q: 1 };
}

/* ---------- problem generators ---------- */

function genBasic() {
  const sol = pickSolution(0.2);
  const p = sol.p, q = sol.q;
  const kind = (q === 1) ? randInt(1, 3) : randInt(2, 3);
  let html;
  if (kind === 1) {
    const b = randNonZero(-12, 12);
    html = X + constTail(b) + ' = ' + (p + b);
  } else if (kind === 2) {
    const k = randNonZero(-6, 6);
    const a = q * k;
    html = xTerm(a) + ' = ' + (k * p);
  } else {
    const k = randNonZero(-5, 5);
    const a = q * k;
    const b = randNonZero(-10, 10);
    html = xTerm(a) + constTail(b) + ' = ' + (k * p + b);
  }
  return { html, badge: '기본', p, q };
}

function genBothSides(): any {
  const sol = pickSolution(0.25);
  const p = sol.p, q = sol.q;
  for (let t = 0; t < 30; t++) {
    const k = randNonZero(-4, 4);
    const c = randInt(-6, 6);
    const a = c + q * k;
    if (a === 0) continue;
    const b = randInt(-10, 10);
    const d = k * p + b;
    if (Math.abs(d) > 60) continue;
    return { html: side(a, b) + ' = ' + side(c, d), badge: '양변에 x', p, q };
  }
  return genBothSides();
}

function genBracket(): any {
  const sol = pickSolution(0.15);
  const p = sol.p, q = sol.q;
  for (let t = 0; t < 30; t++) {
    if (Math.random() < 0.55) {
      const k = randNonZero(-3, 3);
      const c = randInt(-5, 5);
      const a = c + q * k;
      if (a === 0 || a === 1) continue;
      const b = randNonZero(-6, 6);
      const d = k * p + a * b;
      if (Math.abs(d) > 70) continue;
      const left = (a === -1 ? '-' : a) + '(' + X + constTail(b) + ')';
      return { html: left + ' = ' + side(c, d), badge: '괄호', p, q };
    } else {
      const k = randNonZero(-4, 4);
      const a = q * k;
      if (a === 0 || a === 1) continue;
      const b = randNonZero(-6, 6);
      const e = randInt(-8, 8);
      const d = k * p + a * b + e;
      if (Math.abs(d) > 70) continue;
      const left = (a === -1 ? '-' : a) + '(' + X + constTail(b) + ')' + constTail(e);
      return { html: left + ' = ' + d, badge: '괄호', p, q };
    }
  }
  return genBracket();
}

function genFracDec(): any {
  for (let t = 0; t < 30; t++) {
    const kind = randInt(1, 4);
    if (kind === 1) {
      const m = randInt(2, 5);
      const b = randNonZero(-5, 5);
      const a = randNonZero(-8, 8);
      const p = b * m - a;
      if (p === 0 || Math.abs(p) > 30) continue;
      const html = fracHTML(X + constTail(a), m) + ' = ' + b;
      return { html, badge: '분수·소수', p, q: 1 };
    }
    if (kind === 2) {
      const m = randInt(2, 6);
      const b = randNonZero(-6, 6);
      const diff = randNonZero(-5, 5);
      const c = b + diff;
      const p = m * diff;
      if (Math.abs(p) > 30) continue;
      const html = fracHTML(X, m) + constTail(b) + ' = ' + c;
      return { html, badge: '분수·소수', p, q: 1 };
    }
    if (kind === 3) {
      const pairs = [[2, 3], [2, 4], [3, 4], [2, 6], [3, 6], [4, 6]];
      const pr = pick(pairs);
      const m = pr[0], n = pr[1];
      const l = (m * n) / gcd(m, n);
      const tt = randNonZero(-3, 3);
      const p = l * tt;
      const c = tt * (l / m + l / n);
      if (Math.abs(p) > 36) continue;
      const html = fracHTML(X, m) + ' + ' + fracHTML(X, n) + ' = ' + c;
      return { html, badge: '분수·소수', p, q: 1 };
    }
    
    const A = randNonZero(-9, 9);
    const p = randNonZero(-6, 6);
    const B = randInt(-9, 9);
    const C = A * p + B;
    if (Math.abs(C) > 90) continue;
    const bothSides = Math.random() < 0.4;
    if (!bothSides) {
      const html = side(A, B, dec) + ' = ' + dec(C);
      return { html, badge: '분수·소수', p, q: 1 };
    }
    const C2 = randInt(-9, 9);
    if (C2 === A) continue;
    const D = (A - C2) * p + B;
    if (Math.abs(D) > 90) continue;
    const html = side(A, B, dec) + ' = ' + side(C2, D, dec);
    return { html, badge: '분수·소수', p, q: 1 };
  }
  return genFracDec();
}

function generate() {
  const roll = Math.random();
  if (roll < 0.35) return genBasic();
  if (roll < 0.65) return genBothSides();
  if (roll < 0.80) return genBracket();
  return genFracDec();
}

function ansToHTML(p: number, q: number) {
  if (q === 1) return String(p);
  return (p < 0 ? '-' : '') + fracHTML(Math.abs(p), q);
}

export default function EquationGame() {
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  
  const [current, setCurrent] = useState<{html: string, badge: string, p: number, q: number} | null>(null);
  const [locked, setLocked] = useState(false);
  const [denVisible, setDenVisible] = useState(false);
  
  const [numIn, setNumIn] = useState('');
  const [denIn, setDenIn] = useState('');
  
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  
  const [mark, setMark] = useState<'O'|'X'|null>(null);
  const [flash, setFlash] = useState<'correct'|'wrong'|null>(null);
  
  const [revealHtml, setRevealHtml] = useState('');
  const [shake, setShake] = useState(false);
  
  const numRef = useRef<HTMLInputElement>(null);
  const denRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    nextProblem();
  }, []);
  
  const nextProblem = () => {
    setCurrent(generate());
    setNumIn('');
    setDenIn('');
    setDenVisible(false);
    setRevealHtml('');
    setMark(null);
    setFlash(null);
    setTimeout(() => {
      if (numRef.current) numRef.current.focus();
    }, 50);
  };
  
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };
  
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  };
  
  const displayMsg = (text: string) => {
    setMsg(text);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 1800);
  };
  
  const flashMark = (isCorrect: boolean) => {
    setMark(isCorrect ? 'O' : 'X');
    setFlash(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setMark(null);
      setFlash(null);
    }, isCorrect ? 650 : 500);
  };
  
  const checkAnswer = () => {
    if (locked || !current) return;
    
    const rawN = numIn.trim();
    if (rawN === '') { triggerShake(); numRef.current?.focus(); return; }
    if (!/^-?\d+$/.test(rawN)) { displayMsg('분자는 정수로 입력하세요'); triggerShake(); return; }
    const un = parseInt(rawN, 10);
    
    let ud = 1;
    if (denVisible) {
      const rawD = denIn.trim();
      if (rawD === '') ud = 1;
      else if (!/^\d+$/.test(rawD) || parseInt(rawD, 10) === 0) {
        displayMsg('분모는 0이 아닌 자연수로 (부호는 분자에)');
        triggerShake();
        return;
      } else ud = parseInt(rawD, 10);
    }
    
    const equal = (un * current.q === current.p * ud);
    if (!equal) {
      setWrong(w => w + 1);
      setStreak(0);
      flashMark(false);
      triggerShake();
      numRef.current?.focus();
      return;
    }
    if (gcd(un, ud) !== 1 && un !== 0) {
      displayMsg('값은 맞아요! 기약분수로 다시 입력하세요');
      triggerShake();
      return;
    }
    
    setCorrect(c => c + 1);
    setStreak(s => s + 1);
    flashMark(true);
    setLocked(true);
    setTimeout(() => {
      setLocked(false);
      nextProblem();
    }, 700);
  };
  
  const handleSkip = () => {
    if (locked || !current) return;
    setWrong(w => w + 1);
    setStreak(0);
    setRevealHtml(wrapVar('x') + ' = ' + ansToHTML(current.p, current.q));
    setLocked(true);
    setTimeout(() => {
      setRevealHtml('');
      setLocked(false);
      nextProblem();
    }, 2200);
  };
  
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, isNum: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isNum && denVisible) {
        denRef.current?.focus();
      } else {
        checkAnswer();
      }
    }
  };
  
  const total = correct + wrong;
  const acc = total === 0 ? '0%' : Math.round((correct / total) * 100) + '%';
  
  return (
    <div className={`eq-container ${flash ? `flash-${flash}` : ''}`}>
      <button className="fullscreen-btn" onClick={handleFullscreen}>전체화면 ⛶</button>
      
      <div className="wrap">
        <h1>일차방정식의 풀이</h1>
        <div className="sub">방정식을 풀어 <span className="mvar">x</span>의 값을 입력하세요 — 무한 연습</div>
        
        <div className="stats">
          <div className="stat"><div className="num">{correct}</div><div className="label">정답</div></div>
          <div className="stat"><div className="num">{wrong}</div><div className="label">오답</div></div>
          <div className="stat"><div className="num">{streak}</div><div className="label">연속 정답</div></div>
          <div className="stat"><div className="num">{acc}</div><div className="label">정답률</div></div>
        </div>
        
        <div className="card">
          {current && (
            <>
              <div className="badge">{current.badge}</div>
              <div className="equation" dangerouslySetInnerHTML={{ __html: current.html }} />
            </>
          )}
          
          <div className="answer-area">
            <span className="xprefix"><span className="mvar">x</span> =</span>
            
            <div className={`ans-frac ${!denVisible ? 'no-den' : ''} ${shake ? 'shake' : ''}`}>
              <div className="ans-row num">
                <input
                  type="text"
                  className="coef"
                  ref={numRef}
                  value={numIn}
                  onChange={(e) => setNumIn(e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, true)}
                  autoComplete="off"
                  placeholder="?"
                  inputMode="text"
                  disabled={locked}
                />
              </div>
              <div className="ans-bar"></div>
              <div className="ans-row den">
                <input
                  type="text"
                  className="coef"
                  ref={denRef}
                  value={denIn}
                  onChange={(e) => setDenIn(e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, false)}
                  autoComplete="off"
                  placeholder="분모"
                  inputMode="numeric"
                  disabled={locked}
                />
              </div>
            </div>
            
            <div className="btn-col">
              <button className="submit-btn" onClick={checkAnswer} disabled={locked}>확인</button>
              <button
                className={`frac-toggle ${denVisible ? 'on' : ''}`}
                onClick={() => {
                  setDenVisible(!denVisible);
                  if (!denVisible) {
                    setTimeout(() => denRef.current?.focus(), 50);
                  } else {
                    setDenIn('');
                    setTimeout(() => numRef.current?.focus(), 50);
                  }
                }}
              >
                {denVisible ? '분모 닫기' : '분수 입력'}
              </button>
            </div>
          </div>
          
          <div className="feedback">
            <div className={`mark ${mark ? 'show ' + (mark === 'O' ? 'correct' : 'wrong') : ''}`}>
              {mark || 'O'}
            </div>
            <div className={`msg ${showMsg ? 'show' : ''}`}>{msg}</div>
            <div className={`reveal ${revealHtml ? 'show' : ''}`} dangerouslySetInnerHTML={{ __html: revealHtml }} />
          </div>
          
          <div className="hint">
            답이 분수이면 <b>분수 입력</b> 버튼을 눌러 분모 칸을 사용하세요 (기약분수로, 부호는 분자에). ·
            Enter로 제출 · 답이 음수이면 - 부호를 붙여 입력
          </div>
          <button className="skip-btn" onClick={handleSkip} disabled={locked}>모르겠어요 (정답 보기)</button>
        </div>
      </div>
    </div>
  );
}
