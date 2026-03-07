export type QuizQuestion = {
  id: string;
  question: string;
  options: string[]; 
  correctAnswer: string; 
  userAnswer?: string; 
};

export type QuizResult = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; 
  streakIncreased: boolean; 
  dayStreak: number; 
};