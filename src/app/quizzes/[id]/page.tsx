'use client';

import { useState } from 'react';
import { getQuizById } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const quiz = getQuizById(params.id);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) {
    notFound();
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      let calculatedScore = 0;
      quiz.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.answerIndex) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      setIsFinished(true);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h1 className="text-4xl font-bold">Quiz Complete!</h1>
        <p className="text-2xl text-muted-foreground">Your Score</p>
        <p className="text-6xl font-bold text-primary">{score} / {quiz.questions.length}</p>
        <div className="flex gap-4 mt-6">
            <Button onClick={() => router.push('/quizzes')}>Take Another Quiz</Button>
            <Button variant="outline" onClick={() => router.push('/profile')}>View Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/quizzes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Quizzes
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardDescription>
          <Progress value={progress} className="w-full pt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-semibold">{currentQuestion.question}</p>
          <RadioGroup
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            value={selectedAnswers[currentQuestionIndex]?.toString()}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, index) => (
              <Label key={index} className="flex items-center gap-3 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                {option}
              </Label>
            ))}
          </RadioGroup>
          <Button onClick={handleNext} disabled={selectedAnswers[currentQuestionIndex] === undefined} className="w-full">
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
