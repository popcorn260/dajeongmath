import re

def process_file(filepath, grade):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'export default function \w+\(\) \{', content)
    if not match:
        return
        
    start_idx = match.start()
    imports = content[:start_idx]
    
    if 'import { supabase }' not in imports:
        imports = imports.replace('import React', "import { supabase } from '@/lib/supabase';\nimport React")
        
    new_component = f'''export default function QuizPage() {{
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [scores, setScores] = useState<Record<string, number>>({{}});
  const [solved, setSolved] = useState<Record<string, boolean>>({{}});
  const [winners, setWinners] = useState<Record<string, string>>({{}});
  
  const [currentCell, setCurrentCell] = useState<{{subject: string, points: number}} | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [winnerInput, setWinnerInput] = useState('');
  const [flashMsg, setFlashMsg] = useState({{ text: '', isError: false }});
  
  const [rankModal, setRankModal] = useState<{{show: boolean, title: string, tag: string}}>({{ show: false, title: '', tag: '' }});

  // 토스트 메시지 함수
  const showToast = (msg: string, isError = false) => {{
    setFlashMsg({{ text: msg, isError }});
    setTimeout(() => setFlashMsg({{ text: '', isError: false }}), 3000);
  }};

  const handleClassSelect = async (className: string) => {{
    setSelectedClass(className);
    setIsSessionLoading(true);
    try {{
      const {{ data, error }} = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('grade', {grade})
        .eq('class_name', className)
        .eq('quiz_type', 'golden_bell')
        .maybeSingle();

      if (error) throw error;

      if (data) {{
        if (data.status === 'in_progress') {{
          const proceed = window.confirm('저장된 진행 상황이 있습니다. 이어하시겠습니까?\\n취소(Cancel)를 누르면 초기화 후 새로 시작합니다.');
          if (proceed) {{
            setSessionId(data.id);
            setScores(data.scores || {{}});
            
            const loadedSolved: Record<string, boolean> = {{}};
            const loadedWinners: Record<string, string> = {{}};
            const bs = data.board_state || {{}};
            for (const key of Object.keys(bs)) {{
               loadedSolved[key] = bs[key].solved;
               loadedWinners[key] = bs[key].winner;
            }}
            setSolved(loadedSolved);
            setWinners(loadedWinners);
          }} else {{
             await resetSession(data.id);
          }}
        }} else {{
          const proceed = window.confirm('이미 종료된 게임입니다. 새로 시작하시겠습니까?');
          if (proceed) {{
             await resetSession(data.id);
          }} else {{
             setSelectedClass('');
          }}
        }}
      }} else {{
        const {{ data: newSession, error: insertError }} = await supabase
          .from('quiz_sessions')
          .insert({{
            grade: {grade},
            class_name: className,
            quiz_type: 'golden_bell',
            status: 'in_progress',
            board_state: {{}},
            scores: {{}}
          }})
          .select()
          .single();
        if (insertError) throw insertError;
        setSessionId(newSession.id);
        setScores({{}});
        setSolved({{}});
        setWinners({{}});
      }}
    }} catch (e) {{
       console.error(e);
       alert('데이터를 불러오는데 실패했습니다. 네트워크를 확인해주세요.');
       setSelectedClass('');
    }} finally {{
       setIsSessionLoading(false);
    }}
  }};

  const resetSession = async (id: string) => {{
     await supabase.from('hall_of_fame').delete().eq('session_id', id);
     const {{ error }} = await supabase
        .from('quiz_sessions')
        .update({{
           status: 'in_progress',
           board_state: {{}},
           scores: {{}},
           completed_at: null
        }})
        .eq('id', id);
     if (error) throw error;
     setSessionId(id);
     setScores({{}});
     setSolved({{}});
     setWinners({{}});
  }};

  const openQuestion = (subject: string, points: number) => {{
    setCurrentCell({{ subject, points }});
    setShowAnswer(false);
    setWinnerInput('');
    setFlashMsg({{ text: '', isError: false }});
  }};

  const closeQuestion = () => {{
    setCurrentCell(null);
  }};

  const handleAward = async () => {{
    if (!currentCell) return;
    const name = winnerInput.trim();
    if (!name) {{
      showToast('학생 이름을 입력해주세요.', true);
      return;
    }}
    
    const newScores = {{ ...scores, [name]: (scores[name] || 0) + currentCell.points }};
    const key = `${{currentCell.subject}}-${{currentCell.points}}`;
    const newSolved = {{ ...solved, [key]: true }};
    const newWinners = {{ ...winners, [key]: name }};
    
    setScores(newScores);
    setSolved(newSolved);
    setWinners(newWinners);
    
    showToast(`${{name}} 학생에게 ${{currentCell.points}}점이 부여되었습니다.`);
    setTimeout(closeQuestion, 700);

    if (sessionId) {{
       const boardStateToSave: Record<string, any> = {{}};
       for (const k of Object.keys(newSolved)) {{
         boardStateToSave[k] = {{ solved: true, winner: newWinners[k] }};
       }}
       supabase.from('quiz_sessions').update({{
         board_state: boardStateToSave,
         scores: newScores
       }}).eq('id', sessionId).then(({{ error }}) => {{
          if (error) console.error('자동 저장 실패:', error);
       }});
    }}
  }};

  const handleManualSave = async () => {{
    if (!sessionId) return;
    setIsSaving(true);
    const boardStateToSave: Record<string, any> = {{}};
    for (const k of Object.keys(solved)) {{
      boardStateToSave[k] = {{ solved: true, winner: winners[k] }};
    }}
    const {{ error }} = await supabase.from('quiz_sessions').update({{
      board_state: boardStateToSave,
      scores: scores
    }}).eq('id', sessionId);
    setIsSaving(false);
    
    if (error) {{
       alert('저장에 실패했습니다.');
    }} else {{
       showToast('✅ 임시저장이 완료되었습니다.');
    }}
  }};

  const handleEndGame = async () => {{
    if (!window.confirm('게임을 완전히 종료하고 명예의 전당에 등록하시겠습니까?\\n종료 후에는 더 이상 점수를 수정할 수 없습니다.')) return;
    
    setIsSaving(true);
    try {{
       const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
       const ranks = [];
       let rank = 1;
       for (let i=0; i<sorted.length; i++) {{
          if (i > 0 && sorted[i][1] < sorted[i-1][1]) {{
             rank = i + 1;
          }}
          ranks.push({{
             session_id: sessionId,
             grade: {grade},
             class_name: selectedClass,
             quiz_type: 'golden_bell',
             student_name: sorted[i][0],
             score: sorted[i][1],
             rank: rank
          }});
       }}

       if (ranks.length > 0) {{
         const {{ error: insertError }} = await supabase.from('hall_of_fame').insert(ranks);
         if (insertError) throw insertError;
       }}

       const {{ error: updateError }} = await supabase.from('quiz_sessions').update({{
          status: 'completed',
          completed_at: new Date().toISOString()
       }}).eq('id', sessionId);
       
       if (updateError) throw updateError;
       
       alert('명예의 전당에 등록되었습니다!');
       setSelectedClass('');
       setSessionId(null);
    }} catch (e) {{
       console.error(e);
       alert('종료 처리 중 오류가 발생했습니다.');
    }} finally {{
       setIsSaving(false);
    }}
  }};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {{
    if (e.key === 'Enter') {{
      handleAward();
    }}
  }};

  const handleReset = () => {{
    if (!window.confirm('모든 문제 상태와 점수가 초기화됩니다. 계속할까요?')) return;
    setScores({{}});
    setSolved({{}});
    setWinners({{}});
    if (sessionId) {{
       supabase.from('quiz_sessions').update({{
         board_state: {{}},
         scores: {{}}
       }}).eq('id', sessionId);
    }}
  }};

  const openRankModal = (title: string, tagText: string) => {{
    setRankModal({{ show: true, title, tag: tagText }});
  }};

  const rankEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const medals = ['🥇', '🥈', '🥉'];

  if (!selectedClass) {{
    return (
      <div className="quiz-container" style={{{{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}}}>
         <div className="class-selector" style={{{{ background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: 'var(--shadow)' }}}}>
            <h1 style={{{{ marginBottom: '10px' }}}}>{grade}학년 골든벨 퀴즈</h1>
            <p style={{{{ marginBottom: '30px', color: '#666' }}}}>수업을 진행할 반을 선택해주세요.</p>
            <div className="class-grid" style={{{{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}}}>
               {{[1,2,3,4,5,6,7,8,9,10].map(c => (
                 <button key={{c}} className="btn btn-gold" onClick={{() => handleClassSelect(`${{c}}반`)}} disabled={{isSessionLoading}} style={{{{ width: '100%', padding: '15px 0' }}}}>
                   {{c}}반
                 </button>
               ))}}
            </div>
            {{isSessionLoading && <p style={{{{ marginTop: '20px', color: '#888' }}}}>세션 정보를 불러오는 중...</p>}}
         </div>
      </div>
    );
  }}

  return (
    <div className="quiz-container">
      <div className="title-wrap">
        <div className="eyebrow">{grade}ND GRADE FINAL QUIZ - {{selectedClass}}</div>
        <h1>{grade}학년 골든벨 퀴즈</h1>
        <div className="sub">과목과 점수를 선택해 문제를 열고, 정답을 맞힌 학생의 이름을 입력하세요.</div>
      </div>

      <div className="board-wrap">
        <div className="board">
          <table id="board-table">
            <thead>
              <tr>
                {{SUBJECTS.map(s => (
                  <th key={{s}} data-s={{s}}>{{s}}</th>
                ))}}
              </tr>
            </thead>
            <tbody>
              {{POINTS.map(p => (
                <tr key={{p}}>
                  {{SUBJECTS.map(s => {{
                    const key = `${{s}}-${{p}}`;
                    const isSolved = solved[key];
                    const wName = winners[key];
                    return (
                      <td key={{s}}>
                        <button
                          className="cell-btn"
                          disabled={{isSolved}}
                          data-s={{s}}
                          data-p={{p}}
                          onClick={{() => openQuestion(s, p)}}
                        >
                          {{p}}
                          {{isSolved && wName && <span className="wname">{{wName}}</span>}}
                        </button>
                      </td>
                    );
                  }})}}
                </tr>
              ))}}
            </tbody>
          </table>
        </div>

        <div className="controls-row">
          <button className="ctrl-btn" onClick={{() => openRankModal('현재 순위 (중간 점검)', 'SCORE CHECK')}}>
            👀 점수 확인 (중간 점검)
          </button>
          <button className="ctrl-btn" onClick={{handleManualSave}} disabled={{isSaving}}>
            {{isSaving ? '저장 중...' : '💾 임시저장'}}
          </button>
          <button className="ctrl-btn ctrl-final" onClick={{handleEndGame}} disabled={{isSaving}}>
            🏁 게임 완전히 종료
          </button>
        </div>
      </div>

      <div className="reset-row" style={{{{ marginTop: '1rem' }}}}>
        <button onClick={{handleReset}}>보드 전체 초기화</button>
        <button onClick={{() => setSelectedClass('')}} style={{{{ marginLeft: '10px' }}}}>다른 반 선택하기</button>
      </div>

      {{/* 문제 모달 */}}
      {{currentCell && (
        <div className="overlay show" onClick={{(e) => {{ if (e.target === e.currentTarget) closeQuestion(); }}}}>
          <div className="modal">
            <button className="close-x" onClick={{closeQuestion}}>✕</button>
            <span
              className="tag"
              style={{{{ background: SUBJECT_COLOR[currentCell.subject], color: '#0a1830' }}}}
            >
              {{currentCell.subject}} · {{currentCell.points}}점
            </span>
            <p className="qtext">
              {{DATA[currentCell.subject][currentCell.points / 100 - 1]?.q}}
            </p>

            <div className={{`answer-box ${{showAnswer ? 'show' : ''}}`}}>
              <div className="lbl">정답</div>
              <div className="val">{{DATA[currentCell.subject][currentCell.points / 100 - 1]?.a}}</div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-gold" onClick={{() => setShowAnswer(true)}}>정답 보기</button>
            </div>

            <div className="award-row">
              <input
                type="text"
                value={{winnerInput}}
                onChange={{(e) => setWinnerInput(e.target.value)}}
                onKeyDown={{handleKeyDown}}
                list="name-suggestions"
                placeholder="정답을 맞힌 학생 이름 입력"
              />
              <datalist id="name-suggestions">
                {{Object.keys(scores).map(n => <option key={{n}} value={{n}} />)}}
              </datalist>
              <button className="btn btn-ghost" onClick={{handleAward}}>점수 부여</button>
            </div>
            
          </div>
        </div>
      )}}

      <div className="flash-msg" style={{{{ color: flashMsg.isError ? '#ff9c9c' : '#7fe3a0', position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '20px', zIndex: 1000, opacity: flashMsg.text ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}}}>
         {{flashMsg.text}}
      </div>

      {{/* 순위 모달 */}}
      {{rankModal.show && (
        <div className="overlay show" onClick={{(e) => {{ if (e.target === e.currentTarget) setRankModal({{ ...rankModal, show: false }}); }}}}>
          <div className="modal">
            <button className="close-x" onClick={{() => setRankModal({{ ...rankModal, show: false }})}}>✕</button>
            <span className="tag" style={{{{ background: 'var(--gold-bright)', color: 'var(--navy-deep)' }}}}>
              {{rankModal.tag}}
            </span>
            <p className="qtext" style={{{{ marginBottom: '4px' }}}}>{{rankModal.title}}</p>
            <div className="rank-list">
              {{rankEntries.length === 0 ? (
                <p className="empty-note">아직 점수를 획득한 학생이 없습니다.</p>
              ) : (
                rankEntries.map(([name, pt], i) => {{
                  const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : '';
                  const medal = medals[i] || `${{i + 1}}위`;
                  return (
                    <div key={{name}} className={{`rank-item ${{rankClass}}`}}>
                      <span className="medal">{{medal}}</span>
                      <span className="rname">{{name}}</span>
                      <span className="rpts">{{pt}}점</span>
                    </div>
                  );
                }})
              )}}
            </div>
          </div>
        </div>
      )}}
    </div>
  );
}}
'''
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(imports + new_component)

process_file('app/quiz/page.tsx', 2)
process_file('app/quiz3/page.tsx', 3)
