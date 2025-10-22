import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const LessonsManager = () => {
  const [open, setOpen] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [lessonName, setLessonName] = useState("");
  const [lessonNumber, setLessonNumber] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"completed" | "in_progress" | "locked">("locked");
  const queryClient = useQueryClient();

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

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, levels(*)')
        .order('level_id');
      
      if (error) throw error;
      return data;
    },
  });

  const addLessonMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('lessons')
        .insert({ 
          lesson_name: lessonName, 
          lesson_number: parseInt(lessonNumber),
          level_id: selectedLevel 
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success("تم إضافة الدرس بنجاح");
      setOpen(false);
      setLessonName("");
      setLessonNumber("");
      setSelectedLevel("");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة الدرس");
    },
  });

  const addProgressMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('student_progress')
        .insert({ 
          student_id: selectedStudent,
          lesson_id: selectedLesson,
          level_id: lessons?.find(l => l.id === selectedLesson)?.level_id,
          status: selectedStatus
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      toast.success("تم إضافة التقدم بنجاح");
      setOpenProgress(false);
      setSelectedStudent("");
      setSelectedLesson("");
      setSelectedStatus("locked");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة التقدم");
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success("تم حذف الدرس بنجاح");
    },
  });

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    addLessonMutation.mutate();
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة الدروس</CardTitle>
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة درس
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة درس جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddLesson} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">المستوى</label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels?.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.level_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">رقم الدرس</label>
                    <Input
                      type="number"
                      value={lessonNumber}
                      onChange={(e) => setLessonNumber(e.target.value)}
                      placeholder="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اسم الدرس</label>
                    <Input
                      value={lessonName}
                      onChange={(e) => setLessonName(e.target.value)}
                      placeholder="أدخل اسم الدرس"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={addLessonMutation.isPending}>
                    {addLessonMutation.isPending ? "جاري الإضافة..." : "إضافة"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={openProgress} onOpenChange={setOpenProgress}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة تقدم
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة تقدم طالب</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProgress} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الطالب</label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الطالب" />
                      </SelectTrigger>
                      <SelectContent>
                        {students?.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الدرس</label>
                    <Select value={selectedLesson} onValueChange={setSelectedLesson} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدرس" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessons?.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.levels?.level_name} - الدرس {lesson.lesson_number}: {lesson.lesson_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الحالة</label>
                    <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                        <SelectItem value="locked">مغلق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={addProgressMutation.isPending}>
                    {addProgressMutation.isPending ? "جاري الإضافة..." : "إضافة"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {lessons?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا توجد دروس مسجلة
            </p>
          ) : (
            <div className="space-y-2">
              {lessons?.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {lesson.levels?.level_name} - الدرس {lesson.lesson_number}: {lesson.lesson_name}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteLessonMutation.mutate(lesson.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonsManager;
