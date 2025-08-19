
'use client';

import { useState, useEffect } from 'react';
import { getTeachers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { Teacher } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminManageTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const fetchTeachers = async () => {
      setLoading(true);
      const fetchedTeachers = await getTeachers();
      setTeachers(fetchedTeachers);
      setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleRemoveTeacher = (teacherId: string, teacherName: string) => {
    // Placeholder function for when we implement teacher removal
    toast({
        title: 'Action Not Implemented',
        description: `Logic to remove ${teacherName} needs to be added.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Teachers</h1>
         <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Teacher
         </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>View and manage all teachers across the school.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
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
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                 ))
              ) : teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint="person face" />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{teacher.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {teacher.email}
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
                          <DropdownMenuItem onClick={() => router.push(`/profile/${teacher.id}`)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => handleRemoveTeacher(teacher.id, teacher.name)}
                          >
                            Remove Teacher
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No teachers found.
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
