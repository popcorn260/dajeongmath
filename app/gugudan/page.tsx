"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import './gugudan.css';

/* ===================== 사운드 (Web Audio 합성) ===================== */
let actx: AudioContext | null = null;
function ac() {
  if (!actx) actx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return actx;
}
function beep(freq: number, dur: number, type: OscillatorType = 'sine', gainVal = 0.18, delay = 0) {
  try {
    const ctx = ac();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(gainVal, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch (e) {
    console.error(e);
  }
}
function sfxQuestion() { beep(880, 0.09, 'triangle', 0.15); beep(1175, 0.11, 'triangle', 0.13, 0.06); }
function sfxCorrect() { beep(784, 0.09, 'sine', 0.2); beep(988, 0.09, 'sine', 0.2, 0.08); beep(1319, 0.16, 'sine', 0.22, 0.16); }
function sfxWrong() { beep(220, 0.18, 'sawtooth', 0.12); beep(180, 0.22, 'sawtooth', 0.1, 0.05); }
function sfxStart() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.12, 'triangle', 0.16, i * 0.09)); }
function sfxClear() { [659, 784, 988, 1319, 988, 1319].forEach((f, i) => beep(f, 0.14, 'sine', 0.2, i * 0.1)); }


/* ===================== 마스코트(토끼) SVG ===================== */
function RabbitSVG({ mood }: { mood: 'idle' | 'happy' | 'sad' | 'think' }) {
  const faces = {
    idle: { eye: '●', mouth: 'M40,68 Q50,74 60,68' },
    happy: { eye: '^', mouth: 'M38,64 Q50,80 62,64' },
    sad: { eye: '•', mouth: 'M40,72 Q50,62 60,72' },
    think: { eye: '●', mouth: 'M42,70 L58,70' }
  };
  const f = faces[mood] || faces.idle;
  return (
    <svg viewBox="0 0 100 110" width="100%" height="100%">
      <ellipse cx="32" cy="18" rx="8" ry="20" fill="#FFF" stroke="#F3B6C6" strokeWidth="2" transform="rotate(-12 32 18)" />
      <ellipse cx="68" cy="18" rx="8" ry="20" fill="#FFF" stroke="#F3B6C6" strokeWidth="2" transform="rotate(12 68 18)" />
      <ellipse cx="32" cy="20" rx="4" ry="13" fill="#FFD9E2" transform="rotate(-12 32 20)" />
      <ellipse cx="68" cy="20" rx="4" ry="13" fill="#FFD9E2" transform="rotate(12 68 20)" />
      <circle cx="50" cy="62" r="38" fill="#FFFDF9" stroke="#F3B6C6" strokeWidth="2.5" />
      <circle cx="34" cy="58" r="4.5" fill="#5B4636" />
      <circle cx="66" cy="58" r="4.5" fill="#5B4636" />
      <ellipse cx="24" cy="70" rx="7" ry="4.5" fill="#FFC2CF" opacity="0.8" />
      <ellipse cx="76" cy="70" rx="7" ry="4.5" fill="#FFC2CF" opacity="0.8" />
      <ellipse cx="50" cy="66" rx="3.5" ry="2.5" fill="#F3899B" />
      <path d={f.mouth} stroke="#5B4636" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const speedLevels = [
  { key: 'slow', emoji: '🐌', label: '느긋해요', time: 12 },
  { key: 'normal', emoji: '🐇', label: '보통이에요', time: 8 },
  { key: 'fast', emoji: '🐆', label: '빨라요', time: 5 },
  { key: 'super', emoji: '🚀', label: '초스피드', time: 3 },
];

const TOTAL_QUESTIONS = 10;
const decorEmojis = ['🍓', '🍬', '⭐', '🍭', '🎈', '🦄', '🍩', '🌸'];

export default function GugudanGame() {
  const [screen, setScreen] = useState<'select' | 'game' | 'result'>('select');
  const [bgDecorators, setBgDecorators] = useState<any[]>([]);

  // Selection state
  const [selectedDans, setSelectedDans] = useState<Set<number>>(new Set());
  const [selectedSpeed, setSelectedSpeed] = useState<typeof speedLevels[0] | null>(null);

  // Game state
  const [quizList, setQuizList] = useState<{ a: number, b: number, answer: number }[]>([]);
  const [curIndex, setCurIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const [mascotMoodGame, setMascotMoodGame] = useState<'idle' | 'happy' | 'sad' | 'think'>('idle');
  const [mascotAnimGame, setMascotAnimGame] = useState('');

  const [answerInput, setAnswerInput] = useState('');
  const [questionLocked, setQuestionLocked] = useState(false);
  const [correctReveal, setCorrectReveal] = useState('\u00A0');
  const [floatScore, setFloatScore] = useState<{ id: number, text: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeRatio, setTimeRatio] = useState(1);
  const [timeLimit, setTimeLimit] = useState(8);

  const isSelectedOk = selectedDans.size > 0 && selectedSpeed !== null;
  const selectHintText = selectedDans.size === 0 ? '단을 하나 이상 골라주세요!' :
    (!selectedSpeed ? '속도 단계를 골라주세요!' : '\u00A0');

  useEffect(() => {
    const decors = [];
    for (let i = 0; i < 10; i++) {
      decors.push({
        id: i,
        emoji: decorEmojis[Math.floor(Math.random() * decorEmojis.length)],
        left: Math.random() * 95 + '%',
        top: Math.random() * 95 + '%',
        animDelay: (Math.random() * 4) + 's',
        animDur: (5 + Math.random() * 4) + 's'
      });
    }
    setBgDecorators(decors);
  }, []);

  const toggleDan = (d: number) => {
    const next = new Set(selectedDans);
    if (next.has(d)) next.delete(d);
    else next.add(d);
    setSelectedDans(next);
  };

  const handleStartGame = () => {
    sfxStart();
    const dans = Array.from(selectedDans);
    const newQuizList = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const dan = dans[Math.floor(Math.random() * dans.length)];
      const b = 1 + Math.floor(Math.random() * 9);
      newQuizList.push({ a: dan, b, answer: dan * b });
    }
    setQuizList(newQuizList);
    setCurIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setBestCombo(0);
    if (selectedSpeed) setTimeLimit(selectedSpeed.time);
    
    setScreen('game');
  };

  useEffect(() => {
    if (screen === 'game' && quizList.length > 0) {
      startQuestion();
    }
  }, [screen, curIndex, quizList]);

  const startQuestion = () => {
    setQuestionLocked(false);
    setMascotMoodGame('think');
    setMascotAnimGame('');
    setAnswerInput('');
    setCorrectReveal('\u00A0');
    sfxQuestion();

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);

    setTimeRatio(1);
    const limit = selectedSpeed ? selectedSpeed.time : 8;
    
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const tickMs = 50;
    let elapsed = 0;
    timerIntervalRef.current = setInterval(() => {
      elapsed += tickMs;
      const r = Math.max(0, 1 - elapsed / (limit * 1000));
      setTimeRatio(r);
      if (r <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        submitAnswer(true, r);
      }
    }, tickMs);
  };

  const submitAnswer = (isTimeout: boolean, currentRatio: number = timeRatio) => {
    if (questionLocked) return;
    setQuestionLocked(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const q = quizList[curIndex];
    const val = isTimeout ? NaN : parseInt(answerInput, 10);
    const isCorrect = !isTimeout && val === q.answer;

    if (!isCorrect) {
      setCorrectReveal(`정답은 ${q.answer}이었어요!`);
      sfxWrong();
      setCombo(0);
      setWrongCount(prev => prev + 1);
      setMascotMoodGame('sad');
      setMascotAnimGame('sad');
    } else {
      sfxCorrect();
      setCombo(prev => {
        const c = prev + 1;
        setBestCombo(bc => Math.max(bc, c));
        return c;
      });
      setCorrectCount(prev => prev + 1);
      setMascotMoodGame('happy');
      setMascotAnimGame('bounce');

      const speedRatio = Math.max(0, currentRatio);
      const basePoints = 60;
      const speedBonus = Math.round(60 * speedRatio);
      const comboBonus = Math.min(40, combo * 8);
      const gained = basePoints + speedBonus + comboBonus;
      setScore(prev => prev + gained);
      
      const fId = Date.now();
      setFloatScore({ id: fId, text: '+' + gained });
      setTimeout(() => {
        setFloatScore(prev => prev?.id === fId ? null : prev);
      }, 850);
    }

    setTimeout(() => {
      if (curIndex + 1 >= TOTAL_QUESTIONS) {
        finishGame();
      } else {
        setCurIndex(prev => prev + 1);
      }
    }, 950);
  };

  const finishGame = () => {
    sfxClear();
    setScreen('result');
  };

  const getTimerColorClass = () => {
    if (timeRatio < 0.25) return 'danger';
    if (timeRatio < 0.55) return 'warn';
    return '';
  };

  const getResultFeedback = () => {
    const rate = correctCount / TOTAL_QUESTIONS;
    if (rate >= 0.9) return { emoji: '🌟', sub: '완벽해요! 구구단 박사!' };
    if (rate >= 0.7) return { emoji: '🏆', sub: '정말 잘했어요!' };
    if (rate >= 0.4) return { emoji: '😊', sub: '잘했어요, 다음엔 더 빨리!' };
    return { emoji: '💪', sub: '한 번 더 도전해봐요!' };
  };

  return (
    <div className="gugu-container">
      <div className="bg-decor">
        {bgDecorators.map(d => (
          <span key={d.id} style={{ left: d.left, top: d.top, animationDelay: d.animDelay, animationDuration: d.animDur }}>
            {d.emoji}
          </span>
        ))}
      </div>

      <div className="stage">
        <div className="card">
          
          {/* SELECT SCREEN */}
          {screen === 'select' && (
            <div id="screenSelect">
              <div className="mascot-wrap">
                <div className="mascot">
                  <RabbitSVG mood="idle" />
                </div>
              </div>
              <div className="title">구구단 콩콩!</div>
              <div className="subtitle">단을 골라 콩콩 뛰며 연습해봐요 🐰</div>

              <div className="section-label">🍬 연습할 단을 골라주세요</div>
              <div className="dan-grid">
                {[2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                  <button
                    key={d}
                    className={`dan-btn ${selectedDans.has(d) ? 'selected' : ''}`}
                    onClick={() => toggleDan(d)}
                  >
                    {d}단
                  </button>
                ))}
              </div>

              <div className="section-label">⏱ 속도 단계를 골라주세요</div>
              <div className="speed-grid">
                {speedLevels.map(lv => (
                  <button
                    key={lv.key}
                    className={`speed-btn ${selectedSpeed?.key === lv.key ? 'selected' : ''}`}
                    onClick={() => setSelectedSpeed(lv)}
                  >
                    <span className="emoji">{lv.emoji}</span>
                    <span className="lbl">{lv.label}</span>
                    <span className="sec">{lv.time}초</span>
                  </button>
                ))}
              </div>

              <div className="hint">{selectHintText}</div>
              <button
                className="start-btn"
                disabled={!isSelectedOk}
                onClick={handleStartGame}
              >
                시작하기 🚀
              </button>
            </div>
          )}

          {/* GAME SCREEN */}
          {screen === 'game' && quizList[curIndex] && (
            <div id="screenGame">
              <div className="hud">
                <div className="pill">📚 {Array.from(selectedDans).sort((a,b)=>a-b).map(d=>d+'단').join(',')}</div>
                <div className="pill">⭐ {score}점</div>
                <div className="pill">✅ {correctCount}개</div>
                <div className="pill">{curIndex + 1} / {TOTAL_QUESTIONS}</div>
              </div>
              <div className="timerbar-outer">
                <div
                  className={`timerbar-inner ${getTimerColorClass()}`}
                  style={{
                    width: `${timeRatio * 100}%`,
                    transition: questionLocked ? 'none' : 'width .08s linear, background .3s'
                  }}
                />
              </div>

              <div className="mascot-wrap" style={{ position: 'relative' }}>
                <div className={`mascot ${mascotAnimGame}`}>
                  <RabbitSVG mood={mascotMoodGame} />
                </div>
                {floatScore && (
                  <div className="floatscore" key={floatScore.id}>
                    {floatScore.text}
                  </div>
                )}
              </div>
              
              <div className="problem">
                {quizList[curIndex].a} <span className="op">×</span> {quizList[curIndex].b} <span className="op">=</span> ?
              </div>

              <div className="answer-form">
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  className={`answer-input ${questionLocked ? (parseInt(answerInput, 10) === quizList[curIndex].answer ? 'correct' : 'wrong') : ''}`}
                  placeholder="?"
                  autoComplete="off"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitAnswer(false)}
                  disabled={questionLocked}
                />
                <button
                  className="submit-btn"
                  onClick={() => submitAnswer(false)}
                  disabled={questionLocked}
                >
                  확인
                </button>
              </div>
              <div className="correct-reveal">{correctReveal}</div>
            </div>
          )}

          {/* RESULT SCREEN */}
          {screen === 'result' && (
            <div id="screenResult">
              <div className="result-emoji">{getResultFeedback().emoji}</div>
              <div className="result-score">{score}점</div>
              <div className="result-sub">{getResultFeedback().sub}</div>
              <div className="stat-row">
                <div className="stat"><b>{correctCount}</b><span>맞은 개수</span></div>
                <div className="stat"><b>{wrongCount}</b><span>틀린 개수</span></div>
                <div className="stat"><b>{bestCombo}</b><span>최고 콤보</span></div>
              </div>
              <div className="again-btns">
                <button
                  className="secondary-btn"
                  onClick={() => {
                    setScreen('select');
                    setMascotMoodGame('idle');
                  }}
                >
                  단 다시 고르기
                </button>
                <button
                  className="start-btn"
                  onClick={handleStartGame}
                >
                  한 번 더! 🔁
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
