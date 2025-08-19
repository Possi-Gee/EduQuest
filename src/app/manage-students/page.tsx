
'use client';

import { useState, useEffect } from 'react';
import { getStudents, deleteStudent as deleteStudentFromData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileAvatar } from '@/components/profile-avatar';

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const fetchStudents = async () => {
      setLoading(true);
      const fetchedStudents = await getStudents();
      setStudents(fetchedStudents);
      setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName}?`)) {
      try {
        await deleteStudentFromData(studentId);
        await fetchStudents(); // Re-fetch the updated list
        toast({
            title: 'Student Removed',
            description: `${studentName} has been successfully removed from the class.`,
        });
      } catch (error) {
        toast({
            title: 'Error',
            description: `Failed to remove ${studentName}.`,
            variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Students</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>View and manage all students in your class.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell text-center">Quizzes Taken</TableHead>
                <TableHead className="hidden md:table-cell text-center">Avg. Score</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({length: 4}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                        <TableCell className="hidden md:table-cell text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                 ))
              ) : students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar 
                           src={student.avatarUrl} 
                           alt={student.name} 
                           fallback={student.name.charAt(0)}
                           className="h-9 w-9"
                         />
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      {student.quizzesTaken}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                        <Badge 
                            variant="outline"
                            className={cn(
                                student.averageScore > 80 ? "border-green-600/50 bg-green-500/10 text-green-400" : "border-amber-600/50 bg-amber-500/10 text-amber-400"
                            )}
                        >
                           {student.averageScore}%
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/profile/${student.id}`)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/progress/${student.id}`)}>View Progress</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => handleRemoveStudent(student.id, student.name)}
                          >
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
