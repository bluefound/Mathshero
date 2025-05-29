
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Award, BarChart, CheckCircle, Percent, RotateCcw, ListChecks, Zap } from 'lucide-react';
import { PASS_THRESHOLD_PERCENT, type MathCategory, type QuestionDifficulty } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ResultsScreenProps {
  score: number;
  questionsAnswered: number;
  correctAnswersCount: number;
  onPlayAgain: () => void;
  onNewCategory: () => void;
  currentCategory: MathCategory | null;
  currentDifficulty: QuestionDifficulty | null;
}

export function ResultsScreen({
  score,
  questionsAnswered,
  correctAnswersCount,
  onPlayAgain,
  onNewCategory,
  currentCategory,
  currentDifficulty,
}: ResultsScreenProps) {
  const percentageCorrect = questionsAnswered > 0 ? Math.round((correctAnswersCount / questionsAnswered) * 100) : 0;
  const passedLevel = percentageCorrect >= PASS_THRESHOLD_PERCENT;

  const difficultyBadgeVariant = () => {
    switch (currentDifficulty) {
      case 'easy': return 'default';
      case 'medium': return 'secondary';
      case 'hard': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <Award className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">
            {passedLevel ? "Level Cleared!" : "Good Effort!"}
          </CardTitle>
          {currentCategory && currentDifficulty && (
            <div className="flex justify-center space-x-2 mt-2">
              <Badge variant="secondary">
                <ListChecks className="h-4 w-4 mr-1" /> {currentCategory}
              </Badge>
              <Badge variant={difficultyBadgeVariant()} className="capitalize">
                <Zap className="h-4 w-4 mr-1" /> {currentDifficulty}
              </Badge>
            </div>
          )}
          <CardDescription className="text-lg mt-2">
            Here's how you performed:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-around">
            <div>
              <p className="text-sm text-muted-foreground">Final Score</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-4xl font-bold text-accent">{percentageCorrect}%</p>
            </div>
          </div>
          <div className="text-lg">
            <CheckCircle className={`inline-block mr-2 h-6 w-6 ${passedLevel ? 'text-success' : 'text-muted-foreground'}`} />
             You answered {correctAnswersCount} out of {questionsAnswered} questions correctly.
          </div>
          {passedLevel ? (
            <p className="text-success font-semibold">Congratulations! You've advanced to the next level for this category & difficulty!</p>
          ) : (
            <p className="text-destructive font-semibold">Keep practicing! You need {PASS_THRESHOLD_PERCENT}% to pass this level.</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button onClick={onPlayAgain} className="w-full sm:w-auto flex-1" variant="default" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" /> Play Again ({passedLevel ? 'Next Level' : 'Same Level'})
          </Button>
          <Button onClick={onNewCategory} className="w-full sm:w-auto flex-1" variant="outline" size="lg">
            Choose New Category/Difficulty
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
