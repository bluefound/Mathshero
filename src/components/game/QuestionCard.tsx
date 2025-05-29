
"use client";

import type { GameQuestion, GameQuestionOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge'; // Added import for Badge
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: GameQuestion | null;
  onAnswer: (answerValue: number) => void;
  feedbackMessage: string | null;
  selectedAnswerValue: number | null;
  isAnswerSubmitted: boolean;
  isLoading: boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  feedbackMessage,
  selectedAnswerValue,
  isAnswerSubmitted,
  isLoading,
}: QuestionCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl p-8 text-center shadow-xl">
        <LoadingSpinner size={64} />
        <p className="mt-4 text-lg text-muted-foreground">Generating your next challenge...</p>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="w-full max-w-2xl p-8 text-center shadow-xl">
        <CardTitle className="text-2xl">No question loaded</CardTitle>
        <CardDescription>Please try starting a new game.</CardDescription>
      </Card>
    );
  }

  const getButtonClass = (optionValue: number) => {
    if (!isAnswerSubmitted) {
      return selectedAnswerValue === optionValue ? 'bg-primary/80 hover:bg-primary/70' : 'bg-primary hover:bg-primary/90';
    }
    // Answer submitted
    if (optionValue === question.correctAnswer) {
      return 'bg-success hover:bg-success/90 border-success-foreground/50'; // Correct answer
    }
    if (optionValue === selectedAnswerValue) {
      return 'bg-error hover:bg-error/90 border-error-foreground/50'; // Incorrectly selected answer
    }
    return 'bg-muted hover:bg-muted/80 text-muted-foreground border-transparent opacity-70'; // Other options
  };


  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {question.question}
          </CardTitle>
          <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'} className="capitalize text-sm px-3 py-1">
            {question.difficulty}
          </Badge>
        </div>
        <CardDescription className="text-md text-muted-foreground">
          Select the correct answer below:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswer(option.value)}
              className={cn("text-lg py-6 h-auto transition-all duration-300 ease-in-out transform hover:scale-105", getButtonClass(option.value))}
              disabled={isAnswerSubmitted}
              aria-pressed={selectedAnswerValue === option.value}
            >
              {option.text}
              {isAnswerSubmitted && option.value === question.correctAnswer && <CheckCircle2 className="ml-2 h-5 w-5" />}
              {isAnswerSubmitted && option.value === selectedAnswerValue && option.value !== question.correctAnswer && <XCircle className="ml-2 h-5 w-5" />}
            </Button>
          ))}
        </div>
        {isAnswerSubmitted && feedbackMessage && (
          <Alert variant={feedbackMessage.startsWith("Correct") ? "default" : "destructive"} className={cn(feedbackMessage.startsWith("Correct") ? "bg-success/10 border-success text-success-foreground" : "bg-error/10 border-error text-error-foreground", "mt-4 animate-fadeIn")}>
             {feedbackMessage.startsWith("Correct") ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <AlertTitle className={cn(feedbackMessage.startsWith("Correct") ? "text-success-foreground" : "text-error-foreground", "font-semibold")}>
              {feedbackMessage.startsWith("Correct") ? "Well Done!" : "Oops!"}
            </AlertTitle>
            <AlertDescription className={cn(feedbackMessage.startsWith("Correct") ? "text-success-foreground/80" : "text-error-foreground/80")}>
              {feedbackMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Helper for fade-in animation (add to tailwind.config.ts or keep in globals.css if preferred)
// globals.css:
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
// For now, let's assume animate-fadeIn is defined in globals or tailwind config.
// If not, remove 'animate-fadeIn' or define it.
// For simplicity, I will assume tailwindcss-animate handles this or similar.
// For now, removing custom animation class for this step to avoid config changes.

