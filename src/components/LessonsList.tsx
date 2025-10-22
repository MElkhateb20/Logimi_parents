import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LessonsListProps {
  progress: any[];
}

const LessonsList = ({ progress }: LessonsListProps) => {
  const getCurrentLevelLessons = () => {
    const inProgressLessons = progress.filter(p => p.status === 'in_progress');
    if (inProgressLessons.length > 0) {
      return progress.filter(p => p.levels?.level_number === inProgressLessons[0].levels?.level_number);
    }
    
    const completedLevels = progress
      .filter(p => p.status === 'completed')
      .map(p => p.levels?.level_number || 0);
    
    if (completedLevels.length > 0) {
      const maxCompleted = Math.max(...completedLevels);
      const nextLevel = maxCompleted < 5 ? maxCompleted + 1 : 5;
      return progress.filter(p => p.levels?.level_number === nextLevel);
    }
    
    return progress.filter(p => p.levels?.level_number === 1);
  };

  const currentLevelLessons = getCurrentLevelLessons();
  const currentLevelNumber = currentLevelLessons[0]?.levels?.level_number || 1;
  
  const completedCount = currentLevelLessons.filter(l => l.status === 'completed').length;
  const totalCount = currentLevelLessons.length || 1;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case 'in_progress':
        return <Circle className="w-6 h-6 text-primary fill-current" />;
      default:
        return <Lock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in_progress':
        return 'قيد التنفيذ';
      default:
        return 'مغلق';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            التقدم في المستوى الحالي (المستوى {currentLevelNumber})
          </CardTitle>
          <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
        </div>
        <p className="text-muted-foreground">مقدمة في رحلة الألعاب</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLevelLessons.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            لا توجد دروس متاحة حالياً
          </p>
        ) : (
          currentLevelLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg border transition-all
                ${lesson.status === 'completed' ? 'bg-success/5 border-success/20' : ''}
                ${lesson.status === 'in_progress' ? 'bg-primary/5 border-primary/20' : ''}
                ${lesson.status === 'locked' ? 'bg-muted/50 border-border' : ''}
              `}
            >
              <div className="flex-shrink-0">
                {getStatusIcon(lesson.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground">
                  الدرس {lesson.lessons?.lesson_number}: {lesson.lessons?.lesson_name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {getStatusText(lesson.status)}
                </p>
              </div>
              {lesson.status === 'in_progress' && (
                <div className="w-32">
                  <Progress value={50} className="h-2" />
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LessonsList;
