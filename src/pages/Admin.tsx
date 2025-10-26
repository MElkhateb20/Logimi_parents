import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, BookOpen, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import StudentsManager from "@/components/admin/StudentsManager";
import LessonsManager from "@/components/admin/LessonsManager";
import ExamsManager from "@/components/admin/ExamsManager";
import NotesManager from "@/components/admin/NotesManager";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      setLoading(false);
      return;
    }

    // Check if user has admin role
    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (error || !roleData) {
      toast.error("ليس لديك صلاحيات الوصول لهذه الصفحة");
      await supabase.auth.signOut();
      navigate("/auth");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">لوحة إدارة النظام</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>إدارة البيانات</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="students" className="gap-2">
                  <Users className="w-4 h-4" />
                  الطلاب
                </TabsTrigger>
                <TabsTrigger value="lessons" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  الدروس
                </TabsTrigger>
                <TabsTrigger value="exams" className="gap-2">
                  <FileText className="w-4 h-4" />
                  الامتحانات
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  الملاحظات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students">
                <StudentsManager />
              </TabsContent>

              <TabsContent value="lessons">
                <LessonsManager />
              </TabsContent>

              <TabsContent value="exams">
                <ExamsManager />
              </TabsContent>

              <TabsContent value="notes">
                <NotesManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
