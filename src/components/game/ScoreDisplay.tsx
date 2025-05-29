import { Award, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreDisplayProps {
  score: number;
  streak: number;
}

export function ScoreDisplay({ score, streak }: ScoreDisplayProps) {
  return (
    <Card className="mb-6 shadow-lg">
      <CardContent className="p-4 flex justify-around items-center">
        <div className="text-center">
          <div className="flex items-center justify-center text-muted-foreground">
            <Award className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Score</span>
          </div>
          <p className="text-3xl font-bold text-primary">{score}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-muted-foreground">
            <Sparkles className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="text-3xl font-bold text-accent">
            {streak} <TrendingUp className="inline h-6 w-6 ml-1" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
