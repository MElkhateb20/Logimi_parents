import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Note {
  id: string;
  note_text: string;
  teacher_name: string;
  created_at: string;
}

interface TeacherNotesProps {
  notes: Note[];
}

const TeacherNotes = ({ notes }: TeacherNotesProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">ملاحظات المدرب</CardTitle>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            لا توجد ملاحظات متاحة حالياً
          </p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex gap-4 p-4 rounded-lg bg-muted/50 border"
              >
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(note.teacher_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium">{note.teacher_name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(note.created_at), 'dd MMMM yyyy', { locale: ar })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {note.note_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherNotes;
