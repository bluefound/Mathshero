import type { GenerateMathQuestionOutput, GenerateMathQuestionInput } from '@/ai/flows/generate-math-question';

export type MathCategory = GenerateMathQuestionInput['category'];
export type QuestionDifficulty = GenerateMathQuestionOutput['difficulty']; // 'easy' | 'medium' | 'hard'


export const ALL_MATH_CATEGORIES: MathCategory[] = ['Arithmetic', 'Algebra', 'Geometry', 'Word Problems', 'Logic'];
export const ALL_DIFFICULTIES: QuestionDifficulty[] = ['easy', 'medium', 'hard'];


export interface GameQuestionOption {
  text: string;
  value: number;
}
export interface GameQuestion extends GenerateMathQuestionOutput {
  id: string; // To uniquely identify the AI-generated question instance
  options: GameQuestionOption[]; // Shuffled options including the correct answer
}

export type GameStatus = 'initial' | 'selecting_category' | 'playing' | 'results';

export interface GameState {
  status: GameStatus;
  level: number;
  score: number;
  questionsAnswered: number;
  correctAnswersCount: number;
  currentQuestion: GameQuestion | null;
  currentCategory: MathCategory | null;
  selectedDifficulty: QuestionDifficulty | null; // User-selected difficulty
  streak: number;
  isLoadingQuestion: boolean;
  feedbackMessage: string | null;
  selectedAnswerValue: number | null; // Store the value of the selected answer
  isAnswerSubmitted: boolean; // True if user has submitted an answer for current Q
}

export const MAX_QUESTIONS_PER_LEVEL = 10;
export const POINTS_CORRECT = 10;
export const POINTS_STREAK_BONUS = 20;
export const POINTS_INCORRECT = -5;
export const STREAK_THRESHOLD = 3;
export const PASS_THRESHOLD_PERCENT = 70; // 70% correct to pass level
