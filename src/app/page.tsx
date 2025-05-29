
"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateMathQuestion, type GenerateMathQuestionOutput } from '@/ai/flows/generate-math-question';
import type { GameState, MathCategory, GameQuestion, GameQuestionOption, QuestionDifficulty } from '@/lib/types';
import { ALL_MATH_CATEGORIES, MAX_QUESTIONS_PER_LEVEL, POINTS_CORRECT, POINTS_INCORRECT, POINTS_STREAK_BONUS, STREAK_THRESHOLD, PASS_THRESHOLD_PERCENT } from '@/lib/types';

import { AppHeader } from '@/components/layout/AppHeader';
import { StartScreen } from '@/components/game/StartScreen';
import { QuestionCard } from '@/components/game/QuestionCard';
import { ResultsScreen } from '@/components/game/ResultsScreen';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { LevelIndicator } from '@/components/game/LevelIndicator';
import { GameProgressBar } from '@/components/game/GameProgressBar';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';


// Utility to shuffle array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const initialGameState: GameState = {
  status: 'initial',
  level: 1,
  score: 0,
  questionsAnswered: 0,
  correctAnswersCount: 0,
  currentQuestion: null,
  currentCategory: null,
  selectedDifficulty: null, // Initialize selected difficulty
  streak: 0,
  isLoadingQuestion: false,
  feedbackMessage: null,
  selectedAnswerValue: null,
  isAnswerSubmitted: false,
};

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();

  const fetchNewQuestion = useCallback(async () => {
    if (!gameState.currentCategory || !gameState.selectedDifficulty) return;

    setGameState(prev => ({ ...prev, isLoadingQuestion: true, feedbackMessage: null, selectedAnswerValue: null, isAnswerSubmitted: false }));

    try {
      const aiResponse: GenerateMathQuestionOutput = await generateMathQuestion({
        level: gameState.level,
        category: gameState.currentCategory,
        difficulty: gameState.selectedDifficulty,
      });

      const options: GameQuestionOption[] = shuffleArray([
        { text: String(aiResponse.correctAnswer), value: aiResponse.correctAnswer },
        { text: String(aiResponse.distractor1), value: aiResponse.distractor1 },
        { text: String(aiResponse.distractor2), value: aiResponse.distractor2 },
        { text: String(aiResponse.distractor3), value: aiResponse.distractor3 },
      ]);

      const newQuestion: GameQuestion = {
        ...aiResponse,
        id: String(Date.now()) + String(Math.random()), // Simple unique ID
        options,
      };
      setGameState(prev => ({ ...prev, currentQuestion: newQuestion, isLoadingQuestion: false }));
    } catch (error) {
      console.error("Failed to generate question:", error);
      toast({
        title: "Error Generating Question",
        description: "Could not load a new question. The AI might be busy or an error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setGameState(prev => ({ ...prev, isLoadingQuestion: false, status: 'initial' })); // Reset to start on error
    }
  }, [gameState.currentCategory, gameState.level, gameState.selectedDifficulty, toast]);


  useEffect(() => {
    if (gameState.status === 'playing' && !gameState.currentQuestion && !gameState.isLoadingQuestion && gameState.questionsAnswered < MAX_QUESTIONS_PER_LEVEL) {
      fetchNewQuestion();
    }
  }, [gameState.status, gameState.currentQuestion, gameState.isLoadingQuestion, gameState.questionsAnswered, fetchNewQuestion]);

  const handleStartGame = (category: MathCategory, difficulty: QuestionDifficulty) => {
    setGameState({
      ...initialGameState,
      status: 'playing',
      currentCategory: category,
      selectedDifficulty: difficulty, 
      level: 1, 
    });
  };

  const handleAnswer = (answerValue: number) => {
    if (!gameState.currentQuestion || gameState.isAnswerSubmitted) return;

    const isCorrect = answerValue === gameState.currentQuestion.correctAnswer;
    let newScore = gameState.score;
    let newStreak = gameState.streak;
    let newCorrectAnswersCount = gameState.correctAnswersCount;

    if (isCorrect) {
      newScore += POINTS_CORRECT;
      newStreak += 1;
      newCorrectAnswersCount += 1;
      if (newStreak >= STREAK_THRESHOLD) {
        newScore += POINTS_STREAK_BONUS;
        toast({ title: "Streak Bonus!", description: `+${POINTS_STREAK_BONUS} points for ${newStreak} correct answers in a row!`, className: "bg-accent text-accent-foreground border-primary" });
      }
      setGameState(prev => ({
        ...prev,
        feedbackMessage: `Correct! The answer is ${gameState.currentQuestion?.correctAnswer}.`,
      }));
    } else {
      newScore += POINTS_INCORRECT;
      newStreak = 0;
      setGameState(prev => ({
        ...prev,
        feedbackMessage: `Incorrect. The correct answer was ${gameState.currentQuestion?.correctAnswer}.`,
      }));
    }
    
    newScore = Math.max(0, newScore); // Score cannot be negative

    setGameState(prev => ({
      ...prev,
      score: newScore,
      streak: newStreak,
      correctAnswersCount: newCorrectAnswersCount,
      selectedAnswerValue: answerValue,
      isAnswerSubmitted: true,
    }));
  };

  const handleNextAction = () => {
    if (gameState.questionsAnswered + 1 >= MAX_QUESTIONS_PER_LEVEL) {
      // Level finished
      const accuracy = gameState.correctAnswersCount / MAX_QUESTIONS_PER_LEVEL * 100;
      if (accuracy >= PASS_THRESHOLD_PERCENT) {
         toast({ title: "Level Passed!", description: "Great job! Moving to the next level.", className: "bg-success text-success-foreground" });
         setGameState(prev => ({ ...prev, status: 'results', level: prev.level + 1 })); 
      } else {
        toast({ title: "Level Not Passed", description: `You need ${PASS_THRESHOLD_PERCENT}% to pass. Try again!`, variant: "destructive" });
        setGameState(prev => ({ ...prev, status: 'results' })); 
      }
    } else {
      // Next question in the same level
      setGameState(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        currentQuestion: null, 
        selectedAnswerValue: null,
        isAnswerSubmitted: false,
        feedbackMessage: null,
      }));
    }
  };

  const handlePlayAgainSameCategory = () => {
    setGameState(prev => ({
      ...initialGameState,
      status: 'playing',
      currentCategory: prev.currentCategory,
      selectedDifficulty: prev.selectedDifficulty, 
      level: prev.level, 
    }));
  };
  
  const handleChooseNewCategory = () => {
    setGameState(initialGameState); 
  };

  const handleGoToMenu = () => {
    setGameState(initialGameState);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader 
        showBackButton={gameState.status === 'playing'}
        onBackButtonClick={handleGoToMenu}
      />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {gameState.status === 'initial' && (
          <StartScreen onStartGame={handleStartGame} categories={ALL_MATH_CATEGORIES} />
        )}

        {gameState.status === 'playing' && gameState.currentCategory && gameState.selectedDifficulty && (
          <div className="w-full max-w-2xl">
            <ScoreDisplay score={gameState.score} streak={gameState.streak} />
            <LevelIndicator category={gameState.currentCategory} level={gameState.level} difficulty={gameState.selectedDifficulty} />
            <GameProgressBar current={gameState.questionsAnswered + 1} total={MAX_QUESTIONS_PER_LEVEL} />
            <QuestionCard
              question={gameState.currentQuestion}
              onAnswer={handleAnswer}
              feedbackMessage={gameState.feedbackMessage}
              selectedAnswerValue={gameState.selectedAnswerValue}
              isAnswerSubmitted={gameState.isAnswerSubmitted}
              isLoading={gameState.isLoadingQuestion}
            />
            {gameState.isAnswerSubmitted && !gameState.isLoadingQuestion && (
              <Button onClick={handleNextAction} className="mt-6 w-full text-lg py-6" size="lg">
                {gameState.questionsAnswered + 1 >= MAX_QUESTIONS_PER_LEVEL ? 'View Results' : 'Next Question'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {gameState.status === 'results' && (
          <ResultsScreen
            score={gameState.score}
            questionsAnswered={MAX_QUESTIONS_PER_LEVEL}
            correctAnswersCount={gameState.correctAnswersCount}
            onPlayAgain={handlePlayAgainSameCategory}
            onNewCategory={handleChooseNewCategory}
            currentCategory={gameState.currentCategory}
            currentDifficulty={gameState.selectedDifficulty}
          />
        )}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Math Hero: Brain Battle. Unleash your inner math genius! Built by Nexbridge Technologies.
      </footer>
    </div>
  );
}

