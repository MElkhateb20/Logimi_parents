import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, GraduationCap, Settings } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import LessonsList from "@/components/LessonsList";
import ExamsTable from "@/components/ExamsTable";
import TeacherNotes from "@/components/TeacherNotes";

const StudentDashboard = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_code', code)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: levels } = useQuery({
    queryKey: ['levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('level_number');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];
      const { data, error } = await supabase
        .from('student_progress')
        .select('*, lessons(*), levels(*)')
        .eq('student_id', student.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!student?.id,
  });

  const { data: exams } = useQuery({
    queryKey: ['exams', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('student_id', student.id)
        .order('exam_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!student?.id,
  });

  const { data: notes } = useQuery({
    queryKey: ['notes', student?.id],
    queryFn: async () => {
      if (!student?.id) return [];
      const { data, error } = await supabase
        .from('teacher_notes')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!student?.id,
  });

  if (studentLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">الطالب غير موجود</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              لم نتمكن من العثور على طالب بهذا الرقم
            </p>
            <Button onClick={() => navigate('/')}>
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">لوحة تحكم ولي الأمر</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <ArrowRight className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              مرحباً بولي أمر الطالب {student.name}
            </CardTitle>
            <p className="text-muted-foreground">
              هنا يمكنك متابعة تقدم إبنك في رحلة التعلم الرائعة
            </p>
          </CardHeader>
        </Card>

        {/* Progress Section */}
        <ProgressTracker 
          levels={levels || []} 
          progress={progress || []}
        />

        {/* Lessons Section */}
        <LessonsList progress={progress || []} />

        {/* Results and Notes Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <ExamsTable exams={exams || []} />
          <TeacherNotes notes={notes || []} />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
