
'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getQuizById, getSubjects, updateQuiz } from '@/lib/data';
import type { QuizQuestion, Quiz } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [currentQuiz, subjects] = await Promise.all([
                getQuizById(id),
                getSubjects()
            ]);

            if (currentQuiz) {
                setQuiz(currentQuiz);
                setTitle(currentQuiz.title);
                setCategory(currentQuiz.category);
                setTimeLimit(currentQuiz.timeLimit);
                setQuestions(currentQuiz.questions);
                setExistingCategories(subjects);
            } else {
                notFound();
            }
        } catch (error) {
            console.error("Failed to fetch quiz data", error);
            toast({ title: "Error", description: "Failed to load quiz details.", variant: 'destructive' });
            notFound();
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id, toast]);

  if (loading) {
    return <div className="max-w-4xl mx-auto space-y-6"><Skeleton className="h-96 w-full" /></div>;
  }
  if (!quiz) {
    return null; 
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answerIndex = oIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answerIndex: 0 },
    ]);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    } else {
        toast({title: "Error", description: "A quiz must have at least one question.", variant: 'destructive'});
    }
  };

  const handleSave = async () => {
    if (!title || !category || questions.some(q => !q.question || q.options.some(o => !o))) {
        toast({title: 'Missing Fields', description:'Please fill out all fields.', variant: 'destructive'});
        return;
    }
    setIsSaving(true);
    try {
        await updateQuiz(id, { title, category, timeLimit, questions });
        toast({title: 'Success!', description: 'Quiz updated successfully!'});
        router.push('/manage-quizzes');
    } catch(error) {
        toast({title: 'Save Failed', description: 'Could not update the quiz.', variant: 'destructive'});
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeLimit(value === '' ? 0 : parseInt(value, 10) * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50">
      <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4" disabled={isSaving}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Quiz</CardTitle>
          <CardDescription>Update the details for this quiz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSaving} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="category">Subject (Category)</Label>
                <Select onValueChange={setCategory} value={category} disabled={isSaving}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {existingCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (in minutes)</Label>
                <Input id="time-limit" type="number" value={timeLimit > 0 ? timeLimit / 60 : ''} onChange={handleTimeLimitChange} disabled={isSaving} />
            </div>
          </div>
          
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <Card key={qIndex} className="bg-card/50 p-4">
                <div className="flex justify-between items-center mb-4">
                    <Label className="text-base">Question {qIndex + 1}</Label>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => removeQuestion(qIndex)} disabled={isSaving}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Question</span>
                  </Button>
                </div>
                <div className="space-y-4">
                  <Input placeholder="Type the question here..." value={q.question} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} disabled={isSaving} />
                  <RadioGroup value={q.answerIndex.toString()} onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))} disabled={isSaving}>
                      {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                              <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                              <Input placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-1" disabled={isSaving} />
                          </div>
                      ))}
                  </RadioGroup>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={addQuestion} disabled={isSaving}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Question
          </Button>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/manage-quizzes')} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
