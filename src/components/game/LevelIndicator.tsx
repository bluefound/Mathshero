
import type { MathCategory, QuestionDifficulty } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Layers, ListChecks, Zap } from 'lucide-react'; // Added Zap for difficulty

interface LevelIndicatorProps {
  category: MathCategory | null;
  level: number;
  difficulty: QuestionDifficulty | null;
}

export function LevelIndicator({ category, level, difficulty }: LevelIndicatorProps) {
  const difficultyBadgeVariant = () => {
    switch (difficulty) {
      case 'easy':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="mb-4 text-center space-y-2 md:space-y-0 md:flex md:justify-center md:items-center md:space-x-2">
      {category && (
        <Badge variant="secondary" className="text-md px-4 py-1 mb-2 md:mb-0">
          <ListChecks className="h-4 w-4 mr-2" /> Category: {category}
        </Badge>
      )}
      <Badge variant="outline" className="text-md px-4 py-1 border-primary text-primary mb-2 md:mb-0">
        <Layers className="h-4 w-4 mr-2" /> Level: {level}
      </Badge>
      {difficulty && (
         <Badge variant={difficultyBadgeVariant()} className="text-md px-4 py-1 capitalize">
          <Zap className="h-4 w-4 mr-2" /> Difficulty: {difficulty}
        </Badge>
      )}
    </div>
  );
}
