
import { BrainCog, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}

export function AppHeader({ showBackButton, onBackButtonClick }: AppHeaderProps) {
  return (
    <header className="py-4 shadow-md bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && onBackButtonClick && (
            <Button variant="ghost" size="icon" onClick={onBackButtonClick} aria-label="Back to menu" className="mr-2 text-primary hover:text-primary/80">
              <ArrowLeft className="h-7 w-7" />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BrainCog className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              Math Hero
              <span className="text-foreground opacity-75 text-2xl ml-2">Brain Battle</span>
            </h1>
          </Link>
        </div>
        {/* Future placeholder for user avatar/login */}
      </div>
    </header>
  );
}
