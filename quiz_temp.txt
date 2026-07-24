"use client";

import React, { useState, KeyboardEvent } from 'react';
import './quiz.css';

const DATA: Record<string, { q: string; a: string }[]> = {
  "국어": [
    {q:"설명 방법 중 대상의 뜻을 밝혀 풀이하는 방법은?", a:"정의"},
    {q:"담화에 직접적으로 영향을 미치는 것으로 말하는 이의 처지, 말하는 의도, 시간과 장소를 포함하는 맥락은?", a:"상황맥락"},
    {q:"어떤 하나의 감각이 다른 영역의 감각을 일으키는 심상은?\n예: 분수처럼 흩어지는 푸른 종소리", a:"공감각적 심상"},
    {q:"받침소리로 발음되는 자음을 모두 말하시오.", a:"ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ"},
    {q:"'잎 아래'의 발음은?", a:"[이바래]"}
  ],
  "도덕": [
    {q:"동양(유가)에서의 이상 사회는?", a:"대동사회"},
    {q:"이 세상이 혼란스러운 원인을 욕심이나 집착으로 보는 우리의 전통 도덕은?", a:"불교"},
    {q:"'무위자연'과 관련 있는 우리의 전통 도덕은?", a:"도교"},
    {q:"남이 잘못했을 때 너그럽게 용서해 주는 것, 남의 의견도 받아주고 존중해 주는 덕목은?", a:"관용"},
    {q:"대한민국 국민으로서의 5대 의무는?", a:"국방, 납세, 교육,\n근로, 환경보전의 의무"}
  ],
  "역사": [
    {q:"프랑스 혁명의 가디언이라 할 수 있는 인물은?", a:"나폴레옹"},
    {q:"영국을 45년동안 지배하며 스페인의 무적함대를 무찌른 왕은?", a:"엘리자베스 1세"},
    {q:"국가의 권력을 입법, 사법, 행정권으로 분리하여 서로 견제하도록 한 국가의 조직원리는?", a:"삼권분립"},
    {q:"최초로 세계 일주에 성공한 사람은?", a:"(페르디난트) 마젤란"},
    {q:"대한제국의 연호는?", a:"광무"}
  ],
  "수학": [
    {q:"같은 조건에서 반복할 수 있는 실험이나 관찰에 의하여 나타나는 어떤 결과를 무엇이라고 하는가?", a:"사건"},
    {q:"영희네 아버지는 딸만 다섯입니다. 다섯 명의 딸들은 모두 착했고 각 딸들의 이름은 일순이, 이순이, 삼순이, 사순이. 그렇다면 나머지 딸의 이름은?", a:"영희"},
    {q:"삼각형의 세 변의 수직이등분선의 교점을 뭐라고 하는가?", a:"외심"},
    {q:"a≠0 또는 b≠0일 때 방정식 ax+by+c=0을 뭐라고 부르는가?", a:"직선의 방정식"},
    {q:"정다면체를 모두 말하시오.", a:"정사면체, 정육면체, 정팔면체,\n정십이면체, 정이십면체"}
  ],
  "과학": [
    {q:"원자는 이것을 잃으면 양이온이 되고, 이것을 얻으면 음이온이 됩니다. 이것은 무엇인가요?", a:"전자"},
    {q:"지구의 둘레를 최초로 측정한 고대 그리스의 과학자는 누구인가요?", a:"에라토스테네스"},
    {q:"다음의 단어들에서 공통으로 연상되는 행성은?\n- 퍼시비어런스  - 일론 머스크\n- 전쟁의 신  - 지구형행성", a:"화성"},
    {q:"식물의 광합성으로 만들어진 양분은 잎 세포의 이곳에 잠시 저장되었다가 줄기를 거쳐 식물체 곳곳으로 이동합니다. 이곳은 어디일까요?", a:"엽록체"},
    {q:"해수 1000g 속에 다음과 같은 염류가 들어있었다. 이 해수의 염분은 얼마인가?\n-염화나트륨 23.3  -염화마그네슘 3.3\n-황산마그네슘 1.4  -기타 2.0", a:"30 psu"}
  ],
  "기술가정": [
    {q:"빨대형 휴대용 정수기를 무엇이라고 하는가?", a:"라이프스트로"},
    {q:"번식력이 약한 식물을 대량으로 얻기 위해 조직 일부를 떼어내어 인공적으로 재생시키거나 번식시키는 기술은?", a:"조직배양"},
    {q:"우수한 형질을 갖춘 동물을 복제할 때 활용할 수 있는 생명기술은?", a:"핵이식"},
    {q:"난로에서 나오는 열이 집 안에 오래 머물도록 하고 매연을 일부 흡착시키는 기능을 가진 것은?", a:"지세이버"},
    {q:"사회 공동체의 정치적·문화적·환경적 조건에 걸맞게 고안된 기술로, 삶의 질을 실질적으로 향상할 수 있는 기술은?", a:"적정기술"}
  ],
  "체육": [
    {q:"학생들의 비만을 방지하고 체력을 향상시키고자 만든 건강 체력 관리 프로그램을 무엇이라고 하는가?", a:"PAPS"},
    {q:"학생건강체력평가의 요소로는 순발력이 있다. 순발력을 측정하는 종목에는 어떤 것이 있는가?", a:"제자리 멀리뛰기\nor 50m 달리기"},
    {q:"2021년에는 도쿄에서 올림픽이 열렸다. 2024년에는 어느 지역에서 올림픽이 열리는가?", a:"파리"},
    {q:"츄크볼이라는 종목은 3.3.3.3이라는 규칙이 있다.\n- 3초 이내 패스  - 3걸음 초과 x  - 3패스 초과x\n나머지 1개의 규칙은 무엇인가?", a:"한 골대에 연속 3번\n초과하여 공격 x"},
    {q:"체육과 교육과정의 영역은 5가지다. 건강, 도전, 안전 이외 2가지는 무엇인가?", a:"표현, 경쟁"}
  ],
  "음악": [
    {q:"음악의 아버지는?", a:"바흐"},
    {q:"바로크 시대가 끝난 연도는?\n(수업 중에 숫자는 이거 하나만 외우라고 했음)", a:"1750년"},
    {q:"악기 '피아노'의 원래 이름은?", a:"피아노포르테"},
    {q:"둘 이상의 독립적인 성부로 구성된 음악을 뜻하는 말로, 바로크 시대에 가장 발전한 음악 양식은?", a:"다성음악"},
    {q:"고전 시대 대표적 작곡가 3명의 이름은?", a:"하이든, 모차르트, 베토벤"}
  ],
  "영어": [
    {q:"What do you call a fish without an eye?", a:"Fsh"},
    {q:"영어 2과에서 Eddie Parker가 살고 있는 도시와 주 이름은?", a:"Dallas, Texas"},
    {q:"A: _______?\nB: I'll take 2 dollars off.", a:"Can I get a discount?"},
    {q:"다음 문장을 수동태로 바꾸시오.\nI gave Jack a candy.\n(A candy로 시작)", a:"A candy was given\nto Jack by me."},
    {q:"1과 본문에 나오는 학생들의 이름을 모두 말하시오.", a:"소민, 디에고, 타빈, 무사"}
  ],
  "한문": [
    {q:"한자의 3요소는?", a:"모양, 소리, 뜻\n(형, 음, 의)"},
    {q:"구체적인 사물의 모양을 본떠서 한자를 만드는 원리를 무엇이라고 하는가?", a:"상형의 원리\n(상형문자)"},
    {q:"풀을 묶어 은혜를 갚는다고 풀이하며, 죽어서라도 은혜를 잊지 않고 갚는다는 속뜻을 지닌 성어는?", a:"결초보은\n(結草報恩)"},
    {q:"'도긴개긴'과 유사한 뜻으로 쓰이며 중국의 맹자가 양혜왕을 만나 이야기 나눈 내용 중 등장한 성어는?", a:"오십보백보\n(五十步百步)"},
    {q:"우리 말 속담 중 \"콩 심은데 콩 난다\"는 속담이 있습니다. 이 속담은 모든 일의 결과는 그것의 원인에 따른 것이라는 말입니다. 즉, 노력한 만큼 결과가 나온다는 말인데요 이 속담을 한문으로 옮기면?", a:"종두득두\n(種豆得豆)"}
  ],
  "중국어": [
    {q:"음의 높낮이를 나타내는 말은?", a:"성조"},
    {q:"중국인이 좋아하는 숫자 3개는?", a:"8, 6, 9"},
    {q:"중국어 1인칭, 2인칭, 3인칭을 차례대로 발음해보세요.", a:"1인칭 wǒ(워)\n2인칭 nǐ(니)\n3인칭 tā(타)"},
    {q:"나라 이름 4개를 말하세요.", a:"Hánguó(한구어), Zhōngguó(쭝구어),\nMěiguó(메이구어), Déguó(더구어),\nRìběn(르번), Yìdàlì(이따리), Jiānádà(지아나다)\n중 4개"},
    {q:"'천만에요'를 나타내는 표현 2가지를 발음해보세요.", a:"búkèqie (부커치에)\nbúxie (부시에)"}
  ]
};

const SUBJECTS = ["국어","도덕","역사","수학","과학","기술가정","체육","음악","영어","한문","중국어"];
const POINTS = [100,200,300,400,500];

const SUBJECT_COLOR: Record<string, string> = {
  "국어":"#e8637a","도덕":"#e0c24f","역사":"#e2954d","수학":"#e85f9e","과학":"#4f8ce8",
  "기술가정":"#5fc2a0","체육":"#6fbf73","음악":"#c98ee0","영어":"#4fb0c6","한문":"#d97b5f","중국어":"#f0a63f"
};

export default function GoldenBellQuiz() {
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
        <div className="eyebrow">2ND GRADE FINAL QUIZ</div>
        <h1>2학년 골든벨 퀴즈</h1>
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
