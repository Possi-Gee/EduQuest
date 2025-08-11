
'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getQuizById } from '@/lib/data';
import type { QuizQuestion } from '@/lib/types';


export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [quiz, setQuiz] = useState(getQuizById(id));
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const currentQuiz = getQuizById(id);
    if (currentQuiz) {
      setQuiz(currentQuiz);
      setTitle(currentQuiz.title);
      setTimeLimit(currentQuiz.timeLimit);
      setQuestions(currentQuiz.questions);
    } else {
      notFound();
    }
  }, [id]);

  if (!quiz) {
    return null; // Or a loading indicator
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
        alert("A quiz must have at least one question.");
    }
  };

  const handleSave = () => {
    if (!title || questions.some(q => !q.question || q.options.some(o => !o))) {
        alert('Please fill out all fields.');
        return;
    }
    console.log('Updating quiz:', { id, title, timeLimit, questions });
    alert('Quiz updated successfully! (Check console)');
    router.push('/manage-quizzes');
  };
  
  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeLimit(value === '' ? 0 : parseInt(value, 10) * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50">
      <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Quiz</CardTitle>
          <CardDescription>Update the details for this quiz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (in minutes)</Label>
                <Input id="time-limit" type="number" value={timeLimit / 60} onChange={handleTimeLimitChange} />
            </div>
          </div>
          
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <Card key={qIndex} className="bg-card/50 p-4">
                <div className="flex justify-between items-center mb-4">
                    <Label className="text-base">Question {qIndex + 1}</Label>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => removeQuestion(qIndex)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Question</span>
                  </Button>
                </div>
                <div className="space-y-4">
                  <Input placeholder="Type the question here..." value={q.question} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} />
                  <RadioGroup value={q.answerIndex.toString()} onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}>
                      {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                              <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                              <Input placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-1" />
                          </div>
                      ))}
                  </RadioGroup>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={addQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Question
          </Button>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/manage-quizzes')}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
