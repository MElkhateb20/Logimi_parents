import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface Level {
  id: string;
  level_number: number;
  level_name: string;
}

interface Progress {
  level_id: string;
  status: string;
  lessons: any;
  levels: Level;
}

interface ProgressTrackerProps {
  levels: Level[];
  progress: Progress[];
}

const ProgressTracker = ({ levels, progress }: ProgressTrackerProps) => {
  const getCurrentLevel = () => {
    const inProgressLessons = progress.filter(p => p.status === 'in_progress');
    if (inProgressLessons.length > 0) {
      return inProgressLessons[0].levels?.level_number || 1;
    }
    
    const completedLevels = progress
      .filter(p => p.status === 'completed')
      .map(p => p.levels?.level_number || 0);
    
    if (completedLevels.length > 0) {
      const maxCompleted = Math.max(...completedLevels);
      return maxCompleted < 5 ? maxCompleted + 1 : 5;
    }
    
    return 1;
  };

  const currentLevel = getCurrentLevel();

  const calculateLevelProgress = (levelNumber: number) => {
    const levelProgress = progress.filter(p => p.levels?.level_number === levelNumber);
    if (levelProgress.length === 0) return 0;
    
    const completed = levelProgress.filter(p => p.status === 'completed').length;
    const total = levelProgress.length;
    
    return Math.round((completed / total) * 100);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">التقدم في الكورس</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 right-0 left-0 h-1 bg-secondary" />
          <div 
            className="absolute top-6 right-0 h-1 bg-gradient-to-l from-primary to-primary/80 transition-all duration-500"
            style={{ width: `${((currentLevel - 1) / (levels.length - 1)) * 100}%` }}
          />

          {/* Levels */}
          <div className="relative flex justify-between">
            {levels.map((level) => {
              const isCompleted = level.level_number < currentLevel;
              const isCurrent = level.level_number === currentLevel;
              const progress = calculateLevelProgress(level.level_number);

              return (
                <div key={level.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300 border-4
                      ${isCompleted ? 'bg-success border-success' : ''}
                      ${isCurrent ? 'bg-primary border-primary scale-110' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-secondary border-secondary' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-success-foreground" />
                    ) : isCurrent ? (
                      <Circle className="w-6 h-6 text-primary-foreground fill-current" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {level.level_name}
                    </p>
                    {isCurrent && progress > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress}% مكتمل
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
