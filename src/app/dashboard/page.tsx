
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Users, FileText, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from 'react';
import { getStudents, getQuizzes } from '@/lib/data';
import type { Student, Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

const recentActivity = [
    { student: 'John Doe', action: 'completed the "History of Rome" quiz', time: '10 min ago' },
    { student: 'Jane Smith', action: 'submitted a new note on "Algebra"', time: '45 min ago' },
    { student: 'Sam Wilson', action: 'achieved 90% on "Intro to Physics"', time: '2 hours ago' },
    { student: 'Lisa Ray', action: 'started the "Calculus 101" quiz', time: '1 day ago' },
];

export default function DashboardPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedStudents, fetchedQuizzes] = await Promise.all([
                getStudents(),
                getQuizzes()
            ]);
            setStudents(fetchedStudents);
            setQuizzes(fetchedQuizzes);
            setLoading(false);
        }
        fetchData();
    }, []);

    const averageScore = students.length > 0 
      ? Math.round(students.reduce((acc, student) => acc + student.averageScore, 0) / students.length)
      : 0;


  return (
    <div className="space-y-8 animate-in fade-in-50">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
                <Skeleton className="h-8 w-2/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{students.length}</div>
                    <p className="text-xs text-muted-foreground">+2 since last month</p>
                </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Active Quizzes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? (
                <Skeleton className="h-8 w-2/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{quizzes.length}</div>
                    <p className="text-xs text-muted-foreground">+5 since last week</p>
                </>
             )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Average Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? (
                <Skeleton className="h-8 w-2/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{averageScore}%</div>
                    <p className="text-xs text-muted-foreground">Across all students</p>
                </>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Quiz Completions</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                <RechartsBarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>What your students have been up to.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        <>
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </>
                    ) : recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Activity className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="text-sm font-medium">
                                    <span className="font-bold">{activity.student}</span> {activity.action}.
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
