import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const ParentLogin = () => {
  const [studentCode, setStudentCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentCode.trim()) {
      navigate(`/student/${studentCode}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-success/10 p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">نظام متابعة الطلاب</CardTitle>
          <CardDescription className="text-lg">
            أدخل رقم الطالب لعرض التقدم والنتائج
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="studentCode" className="text-sm font-medium">
                رقم الطالب
              </label>
              <Input
                id="studentCode"
                type="text"
                placeholder="أدخل رقم الطالب"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="text-center text-lg h-12"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" size="lg">
              عرض البيانات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentLogin;
