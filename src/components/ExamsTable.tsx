import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Exam {
  id: string;
  exam_name: string;
  score: number;
  max_score: number;
  exam_date: string;
}

interface ExamsTableProps {
  exams: Exam[];
}

const ExamsTable = ({ exams }: ExamsTableProps) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-primary';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">النتائج والتقييمات</CardTitle>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            لا توجد نتائج متاحة حالياً
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الامتحان/الاختبار</TableHead>
                  <TableHead className="text-right">النتيجة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">
                      {exam.exam_name}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(exam.score, exam.max_score)}`}>
                        {exam.score}/{exam.max_score}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(exam.exam_date), 'dd-MM-yyyy', { locale: ar })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamsTable;
