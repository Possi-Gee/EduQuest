'use client';

import { useState, use, useEffect, useRef } from 'react';
import { getQuizById, getUser } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Download } from 'lucide-react';
import Link from 'next/link';
import { Certificate } from '@/components/certificate';
import Confetti from '@/components/confetti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const quiz = getQuizById(id);
  const user = getUser();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit ?? 0);

  const finishQuiz = () => {
    if (!quiz) return;
    let calculatedScore = 0;
    quiz.questions.forEach((question, index) => {
      // Use selectedAnswers[index] ?? -1 to avoid issues with unanswered questions
      if (selectedAnswers[index] === question.answerIndex) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setIsFinished(true);
  };

  useEffect(() => {
    if (!quiz || isFinished) return;

    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isFinished, quiz]);


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
      finishQuiz();
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleDownload = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('certificate.pdf');
      });
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  const passPercentage = 70;
  const userScorePercentage = (score / quiz.questions.length) * 100;
  const hasPassed = userScorePercentage >= passPercentage;

  if (isFinished) {
    if (hasPassed) {
      return (
        <div className="relative">
          <Confetti />
          <Certificate 
            ref={certificateRef}
            userName={user.name}
            quizName={quiz.title}
            date={new Date().toLocaleDateString()}
            scorePercentage={Math.round(userScorePercentage)}
          />
           <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => router.push('/quizzes')}>Take Another Quiz</Button>
              <Button variant="outline" onClick={() => router.push('/profile')}>View Profile</Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h1 className="text-4xl font-bold">Quiz Complete!</h1>
        <p className="text-2xl text-muted-foreground">Your Score</p>
        <p className="text-6xl font-bold text-destructive">{score} / {quiz.questions.length}</p>
        <p className="text-muted-foreground">Unfortunately, you did not pass. You needed {passPercentage}% to receive a certificate.</p>
        <div className="flex gap-4 mt-6">
            <Button onClick={() => router.push('/quizzes')}>Try Another Quiz</Button>
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
          <div className="flex justify-between items-center">
            <CardTitle>{quiz.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
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
