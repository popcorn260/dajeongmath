"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { supabase } from '../../lib/supabase';
import './linear.css';
import Link from 'next/link';

type ScreenType = 'modeSelect' | 'practiceScreen' | 'battleSetup' | 'battleTransition' | 'battlePlay' | 'battleResult';

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNonZero(min: number, max: number) {
  let v = 0;
  while (v === 0) v = randInt(min, max);
  return v;
}

function wrapVar(ch: string) {
  return `<span class="mvar">${ch}</span>`;
}

function makeProblem() {
  const a = randNonZero(-9, 9);
  const b = randInt(-15, 15);
  const x = randInt(-10, 10);
  const y = a * x + b;
  let aStr;
  if (a === 1) aStr = wrapVar('x');
  else if (a === -1) aStr = '-' + wrapVar('x');
  else aStr = a + wrapVar('x');
  
  let bStr = '';
  if (b > 0) bStr = ' + ' + b;
  else if (b < 0) bStr = ' - ' + Math.abs(b);
  
  return { x, y, html: wrapVar('y') + ' = ' + aStr + bStr };
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  const mm = m < 10 ? '0' + m : '' + m;
  const ss = Number(s) < 10 ? '0' + s : s;
  return mm + ':' + ss;
}

export default function LinearFunctionGame() {
  const [screen, setScreen] = useState<ScreenType>('modeSelect');

  // --- Practice Mode State ---
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceProblem, setPracticeProblem] = useState({ x: 0, y: 0, html: '' });
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceMark, setPracticeMark] = useState<'O' | 'X' | null>(null);
  const [practiceShake, setPracticeShake] = useState(false);
  const [practiceLocked, setPracticeLocked] = useState(false);
  const practiceInputRef = useRef<HTMLInputElement>(null);
  const [practiceStartTime, setPracticeStartTime] = useState(0);
  const [practiceSaveName, setPracticeSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Battle Mode State ---
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [battleProblems, setBattleProblems] = useState<any[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [qIdx, setQIdx] = useState(0);
  const [battleTimes, setBattleTimes] = useState<{ 1: number | null, 2: number | null }>({ 1: null, 2: null });
  const [battleStartTime, setBattleStartTime] = useState(0);
  const [battleElapsed, setBattleElapsed] = useState(0);
  const [battleInput, setBattleInput] = useState('');
  const [battleMark, setBattleMark] = useState<'O' | 'X' | null>(null);
  const [battleShake, setBattleShake] = useState(false);
  const [battleLocked, setBattleLocked] = useState(false);
  const battleInputRef = useRef<HTMLInputElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  // --- Practice Logic ---
  const startPractice = () => {
    setPracticeScore(0);
    setPracticeStartTime(Date.now());
    setPracticeSaveName('');
    generatePracticeProblem();
    setScreen('practiceScreen');
  };

  const generatePracticeProblem = () => {
    setPracticeProblem(makeProblem());
    setPracticeInput('');
    setPracticeMark(null);
    setTimeout(() => practiceInputRef.current?.focus(), 50);
  };

  const checkPractice = () => {
    if (practiceLocked) return;
    const raw = practiceInput.trim();
    if (raw === '') { practiceInputRef.current?.focus(); return; }
    const val = parseFloat(raw);
    if (isNaN(val)) {
      triggerPracticeShake();
      return;
    }
    if (Math.abs(val - practiceProblem.y) < 1e-9) {
      setPracticeScore(s => s + 1);
      setPracticeMark('O');
      setPracticeLocked(true);
      setTimeout(() => {
        setPracticeLocked(false);
        generatePracticeProblem();
      }, 650);
    } else {
      setPracticeMark('X');
      triggerPracticeShake();
      setPracticeInput('');
      setTimeout(() => setPracticeMark(null), 450);
      practiceInputRef.current?.focus();
    }
  };

  const triggerPracticeShake = () => {
    setPracticeShake(true);
    setTimeout(() => setPracticeShake(false), 300);
  };

  const handlePracticeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') checkPractice();
  };

  const savePracticeScore = async () => {
    if (!practiceSaveName.trim() || practiceScore === 0) return;
    setIsSaving(true);
    const elapsedSec = (Date.now() - practiceStartTime) / 1000;
    try {
      await supabase.from('practice_records').insert({
        player_name: practiceSaveName.trim(),
        correct_count: practiceScore,
        elapsed_time_sec: elapsedSec
      });
      alert('기록이 저장되었습니다!');
      setScreen('modeSelect');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Battle Logic ---
  const initBattle = () => {
    const problems = [];
    for (let i = 0; i < 10; i++) problems.push(makeProblem());
    setBattleProblems(problems);
    setBattleTimes({ 1: null, 2: null });
    setCurrentPlayer(1);
    startBattlePlayerRun();
  };

  const startBattlePlayerRun = () => {
    setQIdx(0);
    setScreen('battlePlay');
    setBattleInput('');
    setBattleMark(null);
    setBattleStartTime(performance.now());
    setTimeout(() => battleInputRef.current?.focus(), 50);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (screen === 'battlePlay') {
      interval = setInterval(() => {
        setBattleElapsed((performance.now() - battleStartTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [screen, battleStartTime]);

  const checkBattle = () => {
    if (battleLocked) return;
    const raw = battleInput.trim();
    if (raw === '') { battleInputRef.current?.focus(); return; }
    const val = parseFloat(raw);
    if (isNaN(val)) {
      triggerBattleShake();
      return;
    }
    
    const currentY = battleProblems[qIdx].y;
    
    if (Math.abs(val - currentY) < 1e-9) {
      setBattleMark('O');
      setBattleLocked(true);
      
      setTimeout(async () => {
        setBattleMark(null);
        setBattleLocked(false);
        const nextIdx = qIdx + 1;
        if (nextIdx < 10) {
          setQIdx(nextIdx);
          setBattleInput('');
          setTimeout(() => battleInputRef.current?.focus(), 50);
        } else {
          // Finished 10 questions
          const elapsed = (performance.now() - battleStartTime) / 1000;
          const newTimes = { ...battleTimes, [currentPlayer]: elapsed };
          setBattleTimes(newTimes);
          
          if (currentPlayer === 1) {
            setCurrentPlayer(2);
            setScreen('battleTransition');
          } else {
            // Both finished
            let winner = '무승부';
            if (newTimes[1]! < newTimes[2]!) winner = p1Name || '플레이어 1';
            else if (newTimes[2]! < newTimes[1]!) winner = p2Name || '플레이어 2';
            
            try {
              await supabase.from('battle_records').insert({
                player1_name: p1Name || '플레이어 1',
                player2_name: p2Name || '플레이어 2',
                player1_time_sec: newTimes[1],
                player2_time_sec: newTimes[2],
                winner
              });
            } catch (err) {
              console.error('Failed to save battle result', err);
            }
            setScreen('battleResult');
          }
        }
      }, 450);
    } else {
      setBattleMark('X');
      triggerBattleShake();
      setBattleInput('');
      setTimeout(() => setBattleMark(null), 450);
      battleInputRef.current?.focus();
    }
  };

  const triggerBattleShake = () => {
    setBattleShake(true);
    setTimeout(() => setBattleShake(false), 300);
  };

  const handleBattleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') checkBattle();
  };

  const getWinnerBanner = () => {
    const t1 = battleTimes[1]!;
    const t2 = battleTimes[2]!;
    if (Math.abs(t1 - t2) < 0.05) return '무승부입니다! 🐻';
    if (t1 < t2) return `🏆 ${p1Name || '플레이어 1'} 승리! 🐻`;
    return `🏆 ${p2Name || '플레이어 2'} 승리! 🐻`;
  };

  return (
    <div className="linear-container">
      <button className="fullscreen-btn" onClick={toggleFullscreen}>전체화면 🐾</button>
      <div className="wrap">
        
        {screen === 'modeSelect' && (
          <div className="screen active">
            <h1>🐻 일차함수 대입 연습 🐻</h1>
            <div className="sub">
              <span className="math"><span className="mvar">y</span> = a<span className="mvar">x</span> + b</span> 에서 x값을 대입해 y값을 구하는 게임입니다
            </div>
            <div className="divider">🐾 🐾 🐾</div>
            <div className="mode-buttons">
              <button className="mode-btn" onClick={startPractice}>
                🐾 연습 모드<span className="desc">문제가 무한히 이어집니다</span>
              </button>
              <button className="mode-btn" onClick={() => setScreen('battleSetup')}>
                🐾 대진 모드<span className="desc">두 명이 10문제 속도 대결</span>
              </button>
              <Link href="/leaderboard" className="mode-btn" style={{ textDecoration: 'none', background: '#fff', border: '3px solid #ccc', boxShadow: '0 8px 0 #999', color: '#555' }}>
                🏆 리더보드<span className="desc" style={{ color: '#888' }}>명예의 전당 보기</span>
              </Link>
            </div>
          </div>
        )}

        {screen === 'practiceScreen' && (
          <div className="screen active">
            <div className="top-row">
              <div className="score-badge">맞힌 개수 <span>{practiceScore}</span></div>
              <button className="ghost-btn" onClick={() => setScreen('modeSelect')}>메뉴로</button>
            </div>
            <div className="card">
              <div className="equation math" dangerouslySetInnerHTML={{ __html: practiceProblem.html }} />
              <div className="xline"><span className="mvar math">x</span> = <b>{practiceProblem.x}</b> 일 때, <span className="mvar math">y</span>의 값은?</div>
              <div className="input-row">
                <span className="yprefix math mvar">y</span><span className="yprefix math"> =</span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="?"
                  value={practiceInput}
                  onChange={e => setPracticeInput(e.target.value)}
                  onKeyDown={handlePracticeKeyDown}
                  ref={practiceInputRef}
                  className={practiceShake ? 'shake' : ''}
                  disabled={practiceLocked}
                />
                <button className="submit-btn" onClick={checkPractice} disabled={practiceLocked}>확인</button>
              </div>
              <div className="feedback">
                <div className={`mark ${practiceMark ? 'show ' + (practiceMark === 'O' ? 'correct' : 'wrong') : ''}`}>
                  {practiceMark || 'O'}
                </div>
              </div>
              <div className="hint">숫자를 입력하고 Enter 또는 확인 버튼을 누르세요</div>
              
              {practiceScore > 0 && (
                <div className="save-form">
                  <div style={{ color: '#8a5a35', fontSize: '18px' }}>현재 기록을 저장하시겠어요?</div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="내 이름 입력" 
                      value={practiceSaveName} 
                      onChange={e => setPracticeSaveName(e.target.value)}
                      maxLength={10}
                    />
                    <button className="primary-btn" style={{ marginTop: 0 }} onClick={savePracticeScore} disabled={isSaving || !practiceSaveName.trim()}>
                      {isSaving ? '저장 중...' : '기록 저장'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {screen === 'battleSetup' && (
          <div className="screen active">
            <h2>🐻 대진 모드 🐻</h2>
            <div className="sub">두 사람이 같은 10문제를 풀고, 걸린 시간을 비교합니다</div>
            <div className="divider">🐾 🐾 🐾</div>
            <div className="name-form">
              <label>플레이어 1 이름
                <input type="text" placeholder="플레이어 1" value={p1Name} onChange={e => setP1Name(e.target.value)} maxLength={10} />
              </label>
              <label>플레이어 2 이름
                <input type="text" placeholder="플레이어 2" value={p2Name} onChange={e => setP2Name(e.target.value)} maxLength={10} />
              </label>
            </div>
            <button className="primary-btn" onClick={initBattle}>대결 시작</button>
            <button className="ghost-btn" style={{ marginTop: '1em' }} onClick={() => setScreen('modeSelect')}>메뉴로</button>
          </div>
        )}

        {screen === 'battleTransition' && (
          <div className="screen active">
            <h2>{p1Name || '플레이어 1'} 완료!</h2>
            <div className="sub">{p2Name || '플레이어 2'}, 준비되면 시작하세요</div>
            <button className="primary-btn" onClick={startBattlePlayerRun}>시작</button>
          </div>
        )}

        {screen === 'battlePlay' && (
          <div className="screen active">
            <div className="top-row">
              <div className="turn-badge">{currentPlayer === 1 ? (p1Name || '플레이어 1') : (p2Name || '플레이어 2')}</div>
              <div className="progress-badge">문제 <span>{qIdx + 1}</span> / 10</div>
              <div className="timer-badge">{formatTime(battleElapsed)}</div>
            </div>
            <div className="card">
              {battleProblems[qIdx] && (
                <>
                  <div className="equation math" dangerouslySetInnerHTML={{ __html: battleProblems[qIdx].html }} />
                  <div className="xline"><span className="mvar math">x</span> = <b>{battleProblems[qIdx].x}</b> 일 때, <span className="mvar math">y</span>의 값은?</div>
                </>
              )}
              <div className="input-row">
                <span className="yprefix math mvar">y</span><span className="yprefix math"> =</span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="?"
                  value={battleInput}
                  onChange={e => setBattleInput(e.target.value)}
                  onKeyDown={handleBattleKeyDown}
                  ref={battleInputRef}
                  className={battleShake ? 'shake' : ''}
                  disabled={battleLocked}
                />
                <button className="submit-btn" onClick={checkBattle} disabled={battleLocked}>확인</button>
              </div>
              <div className="feedback">
                <div className={`mark ${battleMark ? 'show ' + (battleMark === 'O' ? 'correct' : 'wrong') : ''}`}>
                  {battleMark || 'O'}
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'battleResult' && (
          <div className="screen active">
            <h2>🏆 대결 결과 🏆</h2>
            <div className="divider">🐾 🐾 🐾</div>
            <div className="result-row">
              <span>{p1Name || '플레이어 1'}</span>
              <span className="rtime">{formatTime(battleTimes[1]!)}</span>
            </div>
            <div className="result-row">
              <span>{p2Name || '플레이어 2'}</span>
              <span className="rtime">{formatTime(battleTimes[2]!)}</span>
            </div>
            <div className="winner-banner">{getWinnerBanner()}</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="ghost-btn" style={{ marginTop: '1.8em' }} onClick={() => setScreen('modeSelect')}>메뉴로</button>
              <button className="primary-btn" onClick={() => setScreen('battleSetup')}>다시 하기</button>
              <Link href="/leaderboard" className="primary-btn" style={{ textDecoration: 'none', background: 'linear-gradient(160deg, #b2dfdb, #80cbc4)', color: '#004d40', boxShadow: '0 6px 0 #00796b' }}>
                리더보드 보기
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
