
"use client";

import type { MathCategory, QuestionDifficulty } from '@/lib/types';
import { ALL_DIFFICULTIES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Zap, Calculator, Shapes, MessageSquareText, Puzzle, TrendingUp, BarChartHorizontal, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StartScreenProps {
  onStartGame: (category: MathCategory, difficulty: QuestionDifficulty) => void;
  categories: MathCategory[];
}

const categoryIcons: Record<MathCategory, React.ElementType> = {
  Arithmetic: Calculator,
  Algebra: Zap,
  Geometry: Shapes,
  'Word Problems': MessageSquareText,
  Logic: Puzzle,
};

const difficultyIcons: Record<QuestionDifficulty, React.ElementType> = {
  easy: CheckCircle,
  medium: BarChartHorizontal,
  hard: TrendingUp,
};

export function StartScreen({ onStartGame, categories }: StartScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<MathCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty>(ALL_DIFFICULTIES[0]); // Default to easy

  const handleCategorySelect = (category: MathCategory) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleStart = () => {
    if (selectedCategory && selectedDifficulty) {
      onStartGame(selectedCategory, selectedDifficulty);
    }
  };

  if (!selectedCategory) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Ready for a Challenge?</CardTitle>
            <CardDescription className="text-lg">
              Select a category to begin your math adventure!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Calculator;
              return (
                <Button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-lg py-6"
                  variant="default"
                  size="lg"
                >
                  <Icon className="mr-2 h-6 w-6" />
                  {category}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackToCategories} 
              className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
              aria-label="Back to categories"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <CardTitle className="text-3xl font-bold text-primary">
              {selectedCategory}
            </CardTitle>
          </div>
          <CardDescription className="text-lg mt-2">
            Now, choose your difficulty level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedDifficulty}
            onValueChange={(value) => setSelectedDifficulty(value as QuestionDifficulty)}
            className="space-y-3"
          >
            {ALL_DIFFICULTIES.map((difficulty) => {
              const Icon = difficultyIcons[difficulty] || CheckCircle;
              return (
                <Label
                  key={difficulty}
                  htmlFor={`difficulty-${difficulty}`}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-md border cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    selectedDifficulty === difficulty ? "bg-accent text-accent-foreground border-primary ring-2 ring-primary" : "bg-card border-border"
                  )}
                >
                  <RadioGroupItem value={difficulty} id={`difficulty-${difficulty}`} className="h-5 w-5 border-primary text-primary focus:ring-primary" />
                  <Icon className="mr-2 h-6 w-6" />
                  <span className="text-lg font-medium capitalize">{difficulty}</span>
                </Label>
              );
            })}
          </RadioGroup>

          <Button
            onClick={handleStart}
            className="w-full text-xl py-8 mt-6"
            size="lg"
            disabled={!selectedCategory || !selectedDifficulty}
          >
            Start Game!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
