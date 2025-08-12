
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, PlusCircle, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { QuizQuestion, Note } from '@/lib/types';
import { getNotes, getSubjects, addQuiz } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import { Textarea } from '@/components/ui/textarea';

export default function NewQuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimit, setTimeLimit] = useState(300); // Default 5 minutes
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { question: '', options: ['', '', '', ''], answerIndex: 0 },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSource, setGenerationSource] = useState<'topic' | 'note'>('topic');
  const [generationTopic, setGenerationTopic] = useState('');
  const [generationNoteId, setGenerationNoteId] = useState('');
  const [numQuestions, setNumQuestions] = useState(4);
  
  useEffect(() => {
      const fetchData = async () => {
          const [fetchedNotes, fetchedSubjects] = await Promise.all([getNotes(), getSubjects()]);
          setNotes(fetchedNotes);
          setExistingCategories(fetchedSubjects);
      };
      fetchData();
  }, []);


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
        toast({title: "Error", description: "A quiz must have at least one question.", variant: "destructive"});
    }
  };

  const handleSave = async () => {
    if (!title || !category || questions.some(q => !q.question || q.options.some(o => !o))) {
        toast({title: 'Missing Fields', description: 'Please fill out all fields.', variant: 'destructive'});
        return;
    }
    setIsSaving(true);
    try {
        await addQuiz({ title, category, timeLimit, questions });
        toast({title: 'Success!', description: 'Quiz saved successfully!'});
        router.push('/manage-quizzes');
    } catch(error) {
        toast({title: 'Save Failed', description: 'Could not save the quiz.', variant: 'destructive'});
    } finally {
        setIsSaving(false);
    }
  };

  const handleGenerateQuiz = async () => {
      if (!category) {
          toast({ title: "Subject is required", description: "Please select a subject for the quiz.", variant: "destructive" });
          return;
      }
      
      let sourceText = '';
      if (generationSource === 'topic') {
        if (!generationTopic) {
            toast({ title: "Topic is required", description: "Please enter a topic to generate the quiz.", variant: "destructive" });
            return;
        }
        sourceText = generationTopic;
      } else {
        if (!generationNoteId) {
            toast({ title: "Note is required", description: "Please select a note to generate the quiz from.", variant: "destructive" });
            return;
        }
        const selectedNote = notes.find(n => n.id === generationNoteId);
        sourceText = selectedNote?.content || '';
      }

      setIsGenerating(true);
      try {
          const result = await generateQuiz({
              category: category,
              numQuestions,
              sourceText,
              sourceType: generationSource
          });
          setTitle(result.title);
          setQuestions(result.questions);
          toast({title: "Quiz Generated!", description: "Review the generated quiz below."})
      } catch (error) {
          console.error("Error generating quiz:", error);
          toast({ title: 'Generation Failed', description: 'There was an error generating the quiz.', variant: 'destructive' });
      } finally {
          setIsGenerating(false);
      }
  };
  
  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const minutes = parseInt(value, 10);
    setTimeLimit(isNaN(minutes) || minutes < 0 ? 0 : minutes * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50">
      <Button onClick={() => router.back()} variant="outline" size="icon" className="mb-4">
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Quiz Generation</CardTitle>
          <CardDescription>Generate a quiz automatically based on a topic or an existing note.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="generation-category">Subject (Category)</Label>
                <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger id="generation-category">
                        <SelectValue placeholder="Select a subject first" />
                    </SelectTrigger>
                    <SelectContent>
                        {existingCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
           <RadioGroup value={generationSource} onValueChange={(v) => setGenerationSource(v as 'topic' | 'note')} className="flex gap-4">
              <Label className="flex items-center gap-2 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors flex-1">
                <RadioGroupItem value="topic" id="topic" />
                From Topic
              </Label>
              <Label className="flex items-center gap-2 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors flex-1">
                <RadioGroupItem value="note" id="note" />
                From Note
              </Label>
           </RadioGroup>

           {generationSource === 'topic' ? (
                <div className="space-y-2">
                    <Label htmlFor="topic-input">Topic</Label>
                    <Textarea id="topic-input" placeholder="e.g., The basics of Quantum Physics" value={generationTopic} onChange={(e) => setGenerationTopic(e.target.value)} />
                </div>
           ) : (
                <div className="space-y-2">
                    <Label htmlFor="note-select">Note</Label>
                    <Select value={generationNoteId} onValueChange={setGenerationNoteId}>
                        <SelectTrigger id="note-select"><SelectValue placeholder="Select a note..." /></SelectTrigger>
                        <SelectContent>
                            {notes.map(note => <SelectItem key={note.id} value={note.id}>{note.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
           )}
            <div className="space-y-2">
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input id="num-questions" type="number" min="1" max="10" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)} />
            </div>

            <Button onClick={handleGenerateQuiz} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating Quiz...' : 'Generate with AI'}
            </Button>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
          <CardDescription>Design a new quiz for your students. You can start from scratch or generate one with AI above.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input id="title" placeholder="e.g., The Solar System" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="category">Subject (Category)</Label>
                <Select onValueChange={setCategory} value={category}>
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
                <Input 
                  id="time-limit" 
                  type="number" 
                  value={timeLimit > 0 ? timeLimit / 60 : ''} 
                  onChange={handleTimeLimitChange}
                  placeholder="e.g., 5"
                  min="0"
                />
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
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
