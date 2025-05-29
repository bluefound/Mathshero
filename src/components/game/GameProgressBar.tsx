import { Progress } from "@/components/ui/progress";

interface GameProgressBarProps {
  current: number;
  total: number;
}

export function GameProgressBar({ current, total }: GameProgressBarProps) {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full mb-6">
      <Progress value={progressPercentage} className="h-3" />
      <p className="text-sm text-muted-foreground text-center mt-1">Question {current} of {total}</p>
    </div>
  );
}
