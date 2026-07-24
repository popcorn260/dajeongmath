"use client";

import React, { useState, KeyboardEvent } from 'react';
import './quiz.css';

const DATA: Record<string, { q: string; a: string }[]> = {
  "국어": [
    {q:"문장 성분에는 주성분, 부속 성분, 독립 성분이 있다.\n(O, X 중 답하시오)", a:"O"},
    {q:"'비가 오거나, 눈이 온다.'는 대등하게 이어진 문장이다.\n(O, X 중 답하시오)", a:"O"},
    {q:"문학 작품을 감상할 때 작가나 당시 사회 현실과 관련짓지 않고, 작품의 형식과 표현 등 내부적인 요소만을 기준으로 하는 감상 방법은?", a:"내재적 관점\n(= 절대주의적 관점)"},
    {q:"'밤하늘에 피어나는 꽃이 당신의 눈에 새겨집니다.'는 어떤 절을 안은 문장인가?", a:"관형절"},
    {q:"60~80년대에는 민족의식과 정치의식을 바탕으로 작품을 통해 사회현실에 적극적으로 목소리를 내고자 했던 작가들이 있었다. 이성부, 신동엽, 김수영 시인 등으로 대표되는 이들 작가를 나타내는 용어는?", a:"참여시인"}
  ],
  "영어": [
    {q:"문자 그대로는 '값이 없다'라는 뜻이지만, 실제로는 '너무 귀해서 값을 매길 수 없는'이라는 의미로 쓰이는 단어는?", a:"priceless"},
    {q:"내가 좋아하는 거라면 무엇이든 괜찮아. 책을 읽거나, 영화를 보거나, 친구와 이야기를 하며 스트레스를 풀어. 그래서 스트레스를 받을 땐, 달력에 이 시간을 따로 표시해두고 나를 위한 시간을 보내곤 해. 이런 시간을 영어로 뭐라고 할까요?", a:"Me Time"},
    {q:"다음에 해당하는 나라는?\n\"Around one-third of the country is below sea level.\"\n1.터키  2.태국  3.네덜란드  4.미국  5.한국", a:"3번 네덜란드"},
    {q:"개미들은 말은 하지 않지만, 화학 물질을 통해 서로 의사소통 합니다. 이때 개미들이 사용하는 화학 신호 물질의 이름을 정확한 스펠링으로 말하시오.", a:"Pheromone"},
    {q:"영어로 'evil eye'라고 불리며, 나쁜 기운을 몰아내고 행운을 기원하는 터키의 전통 상징물은?", a:"나자르 본주\n(Nazar Boncuğu)"}
  ],
  "체육": [
    {q:"2024 KBO 프로야구 우승팀은?", a:"기아 타이거즈"},
    {q:"이은정 체육선생님의 특기 종목은 육상이다. 육상에서 주종목은 어떤 종목이었는가?", a:"멀리뛰기"},
    {q:"FIFA 월드컵 주기는?", a:"4년"},
    {q:"2026 FIFA 북중미 월드컵 아시아 지역예선을 통과하여 본선에 진출할 수 있는 티켓은 몇 개국에 주어지는가?", a:"8개국"},
    {q:"기아 타이거즈 현재(퀴즈 당일 기준) 구단 순위는?", a:"⚠ 실시간 확인 필요\n(퀴즈 당일 순위를 검색해 확인하세요)"}
  ],
  "사회": [
    {q:"우리나라 국회의원의 임기는 몇 년일까요?", a:"4년"},
    {q:"헌법재판소의 재판관은 몇 명인가요?", a:"9명"},
    {q:"헌법 제37조 2항에 명시된 기본권 제한 사유 3가지는?", a:"국가 안전보장, 질서유지, 공공복리"},
    {q:"공급법칙의 그래프는 ○○○하는 곡선이다.", a:"우상향"},
    {q:"고려 후기 지배층은 어떤 정치 세력으로 구성되었나요? (3가지 지배층의 연합체)", a:"1. 고려전기 이래 문벌귀족 가문의 후손\n2. 무신정권하에서 성장한 무신의 가문\n3. 친원세력"}
  ],
  "역사": [
    {q:"운남중학교의 나이는 몇 살일까요?", a:"29살\n(1997년 3월 10일 개교)"},
    {q:"통일 신라의 문화재로, 불국사와 더불어 동해를 바라보는 부처님과 그 제자들을 조각해 놓은 세계문화유산은?", a:"석굴암"},
    {q:"부석사 무량수전은 고려 후기의 불교사찰 건축물로, 지붕의 무게를 분산하기 위해 공포 밑의 기둥을 '소의 배 모양'으로 만들었다. 이와 같은 기둥 양식을 무엇이라 부르는가?", a:"배흘림기둥"},
    {q:"백제의 문화재로, 불교와 도교의 요소를 담고 있는 향로의 이름은?", a:"백제금동대향로"},
    {q:"헌법재판소에서 할 수 있는 심판의 종류 5가지는 무엇인가요?", a:"위헌 법률 심판, 탄핵심판,\n정당 해산 심판, 권한쟁의 심판,\n헌법소원 심판"}
  ],
  "과학": [
    {q:"메테인의 연소 반응에서 반응물질은 이산화탄소와 물이다.\n(O, X 중 답하시오)", a:"X\n(반응물질은 메테인과 산소. 이산화탄소와 물은 생성물)"},
    {q:"(   )전선은 찬 공기가 따뜻한 공기를 밀어내면서 생기는 전선이다. 이 전선이 지나면서 소나기성 비가 내리고 기온이 내려간다.", a:"한랭 전선"},
    {q:"물을 이루는 수소와 산소의 질량비는 1:8이다. 수소 5g을 완전히 반응시켜 물을 합성할 때 필요한 산소의 질량은 최소 몇 g인가?", a:"40g"},
    {q:"체온과 혈당량을 일정하게 조절하는 중추는 (   )이고, 홍채의 작용 및 안구의 운동을 조절하는 중추는 (   )이다.", a:"간뇌, 중간뇌"},
    {q:"태양의 빛 에너지를 전기 에너지로 직접 변환해 주는 발전장치로, 태양광 자동차 만들기 실습에서 모터에 전기를 공급해 준 것은?", a:"태양전지"}
  ],
  "도덕": [
    {q:"\"식물은 동물을 위해 존재하고, 동물은 인간의 생존을 위해 존재한다\"라고 말한 사상가는 누구인가?", a:"아리스토텔레스"},
    {q:"소비자가 사회적 지위와 과시욕을 충족하기 때문에 가격이 비쌀수록 소비가 증가하는 현상을 무엇이라고 하는가?", a:"베블런 효과"},
    {q:"20세기 초, 인간과 자연의 상호연결성을 강조하며 『대지의 윤리』를 저술한 미국의 환경 사상가는?", a:"레오폴드"},
    {q:"습지를 보호하기 위한 국제 협약은 무엇인가?", a:"람사르협약"},
    {q:"식사 후 혈당량이 높아지면 (   )에서는 혈당량을 낮추는 (   )을/를 분비하고, (   )에서 포도당이 (   )(으)로 합성되는 과정을 촉진한다.", a:"이자, 인슐린, 간, 글리코젠"}
  ],
  "기가": [
    {q:"부부 중심의 삶을 위해 자발적으로 무자녀를 선택한 맞벌이 부부를 일컫는 말은?", a:"딩크족\n(DINK = Double Income No Kids)"},
    {q:"영유아기 - 아동기 - 청소년기 - 성년기 - (   ) - 노년기", a:"중년기"},
    {q:"할아버지 할머니가 손자 손녀를 맡아 함께 생활하면서 부모 대신 교육하는 것은?", a:"격대교육"},
    {q:"엔진이 없이 전동기를 돌려 움직이는 자동차는?", a:"전기 자동차"},
    {q:"\"아는 것이 힘이다\"라는 말로 유명하며, 과학기술지상주의를 대표하는 사상가는 누구일까요?", a:"베이컨"}
  ],
  "수학": [
    {q:"수학 시험에서 학생들이 받은 점수는 각각 98점, 76점, 89점, 100점이었습니다. 선생님이 평균 점수를 계산해보니, 소수점 아래 첫째 자리까지 나왔어요. 평균 점수는 얼마일까요?", a:"90.8점"},
    {q:"철수가 새 게임 캐릭터를 만들었습니다. 게임 캐릭터의 레벨이 x일 때, 캐릭터의 HP를 나타내는 공식은 HP=2x+10입니다. 철수가 레벨 5에서 HP를 계산했더니, HP는 얼마일까요?", a:"20"},
    {q:"지혜가 x개의 사탕과 y개의 초콜릿을 들고 있습니다. 사탕은 초콜릿의 두 배이고, 사탕과 초콜릿을 합치면 15개입니다. 사탕과 초콜릿의 개수를 구하세요.", a:"사탕 10개, 초콜릿 5개"},
    {q:"한 농부가 직사각형 모양의 밭을 나누려고 합니다. 밭의 둘레는 48m이고, 가로의 길이는 세로의 길이보다 6m 더 깁니다. 이 밭의 넓이는?", a:"135㎡"},
    {q:"한 정육면체의 겉넓이는 150cm²입니다. 이 정육면체의 한 면의 넓이는 몇 cm²이고, 한 변의 길이는 몇 cm인가요?", a:"한 면 25cm², 한 변 5cm"}
  ]
};

const SUBJECTS = ["국어","영어","체육","사회","역사","과학","도덕","기가","수학"];
const POINTS = [100,200,300,400,500];

const SUBJECT_COLOR: Record<string, string> = {
  "국어":"#e8637a","영어":"#4fb0c6","체육":"#6fbf73","사회":"#b48ee0","역사":"#e2954d",
  "과학":"#4f8ce8","도덕":"#e0c24f","기가":"#5fc2a0","수학":"#e85f9e"
};

export default function GoldenBellQuiz3() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [winners, setWinners] = useState<Record<string, string>>({});
  
  const [currentCell, setCurrentCell] = useState<{subject: string, points: number} | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [winnerInput, setWinnerInput] = useState('');
  const [flashMsg, setFlashMsg] = useState({ text: '', isError: false });
  
  const [rankModal, setRankModal] = useState<{show: boolean, title: string, tag: string}>({ show: false, title: '', tag: '' });

  const openQuestion = (subject: string, points: number) => {
    setCurrentCell({ subject, points });
    setShowAnswer(false);
    setWinnerInput('');
    setFlashMsg({ text: '', isError: false });
  };

  const closeQuestion = () => {
    setCurrentCell(null);
  };

  const handleAward = () => {
    if (!currentCell) return;
    const name = winnerInput.trim();
    if (!name) {
      setFlashMsg({ text: '학생 이름을 입력해주세요.', isError: true });
      return;
    }
    
    setScores(prev => ({ ...prev, [name]: (prev[name] || 0) + currentCell.points }));
    const key = `${currentCell.subject}-${currentCell.points}`;
    setSolved(prev => ({ ...prev, [key]: true }));
    setWinners(prev => ({ ...prev, [key]: name }));
    
    setFlashMsg({ text: `${name} 학생에게 ${currentCell.points}점이 부여되었습니다.`, isError: false });
    
    setTimeout(closeQuestion, 700);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAward();
    }
  };

  const handleReset = () => {
    if (!window.confirm('모든 문제 상태와 점수가 초기화됩니다. 계속할까요?')) return;
    setScores({});
    setSolved({});
    setWinners({});
  };

  const openRankModal = (title: string, tagText: string) => {
    setRankModal({ show: true, title, tag: tagText });
  };

  const rankEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="quiz-container">
      <div className="title-wrap">
        <div className="eyebrow">UNNAM MIDDLE SCHOOL</div>
        <h1>운남중학교 학기말 골든벨</h1>
        <div className="sub">과목과 점수를 선택해 문제를 열고, 정답을 맞힌 학생의 이름을 입력하세요.</div>
      </div>

      <div className="board-wrap">
        <div className="board">
          <table id="board-table">
            <thead>
              <tr>
                {SUBJECTS.map(s => (
                  <th key={s} data-s={s}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POINTS.map(p => (
                <tr key={p}>
                  {SUBJECTS.map(s => {
                    const key = `${s}-${p}`;
                    const isSolved = solved[key];
                    const wName = winners[key];
                    return (
                      <td key={s}>
                        <button
                          className="cell-btn"
                          disabled={isSolved}
                          data-s={s}
                          data-p={p}
                          onClick={() => openQuestion(s, p)}
                        >
                          {p}
                          {isSolved && wName && <span className="wname">{wName}</span>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="controls-row">
          <button className="ctrl-btn" onClick={() => openRankModal('현재 순위 (중간 점검)', 'SCORE CHECK')}>
            👀 점수 확인 (중간 점검)
          </button>
          <button className="ctrl-btn ctrl-final" onClick={() => openRankModal('최종 순위', 'FINAL RANKING')}>
            🏆 최종 순위 보기
          </button>
        </div>
      </div>

      <div className="reset-row">
        <button onClick={handleReset}>전체 초기화 (문제 상태 &amp; 점수 모두 리셋)</button>
      </div>

      {/* 문제 모달 */}
      {currentCell && (
        <div className="overlay show" onClick={(e) => { if (e.target === e.currentTarget) closeQuestion(); }}>
          <div className="modal">
            <button className="close-x" onClick={closeQuestion}>✕</button>
            <span
              className="tag"
              style={{ background: SUBJECT_COLOR[currentCell.subject], color: '#0a1830' }}
            >
              {currentCell.subject} · {currentCell.points}점
            </span>
            <p className="qtext">
              {DATA[currentCell.subject][currentCell.points / 100 - 1]?.q}
            </p>

            <div className={`answer-box ${showAnswer ? 'show' : ''}`}>
              <div className="lbl">정답</div>
              <div className="val">{DATA[currentCell.subject][currentCell.points / 100 - 1]?.a}</div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-gold" onClick={() => setShowAnswer(true)}>정답 보기</button>
            </div>

            <div className="award-row">
              <input
                type="text"
                value={winnerInput}
                onChange={(e) => setWinnerInput(e.target.value)}
                onKeyDown={handleKeyDown}
                list="name-suggestions"
                placeholder="정답을 맞힌 학생 이름 입력"
              />
              <datalist id="name-suggestions">
                {Object.keys(scores).map(n => <option key={n} value={n} />)}
              </datalist>
              <button className="btn btn-ghost" onClick={handleAward}>점수 부여</button>
            </div>
            <div className="flash-msg" style={{ color: flashMsg.isError ? '#ff9c9c' : '#7fe3a0' }}>
              {flashMsg.text}
            </div>
          </div>
        </div>
      )}

      {/* 순위 모달 */}
      {rankModal.show && (
        <div className="overlay show" onClick={(e) => { if (e.target === e.currentTarget) setRankModal({ ...rankModal, show: false }); }}>
          <div className="modal">
            <button className="close-x" onClick={() => setRankModal({ ...rankModal, show: false })}>✕</button>
            <span className="tag" style={{ background: 'var(--gold-bright)', color: 'var(--navy-deep)' }}>
              {rankModal.tag}
            </span>
            <p className="qtext" style={{ marginBottom: '4px' }}>{rankModal.title}</p>
            <div className="rank-list">
              {rankEntries.length === 0 ? (
                <p className="empty-note">아직 점수를 획득한 학생이 없습니다.</p>
              ) : (
                rankEntries.map(([name, pt], i) => {
                  const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : '';
                  const medal = medals[i] || `${i + 1}위`;
                  return (
                    <div key={name} className={`rank-item ${rankClass}`}>
                      <span className="medal">{medal}</span>
                      <span className="rname">{name}</span>
                      <span className="rpts">{pt}점</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
