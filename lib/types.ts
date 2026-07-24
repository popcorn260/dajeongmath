export interface QuizSession {
  id: string;
  grade: number;
  class_name: string;
  quiz_type: string;
  status: 'in_progress' | 'completed';
  board_state: Record<string, boolean>; // e.g., { "국어-100": true }
  scores: Record<string, number>;       // e.g., { "홍길동": 300 }
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface HallOfFameEntry {
  id: string;
  session_id: string | null;
  grade: number;
  class_name: string;
  quiz_type: string;
  student_name: string;
  score: number;
  rank: number;
  completed_at: string;
}
