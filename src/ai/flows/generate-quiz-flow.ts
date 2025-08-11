
'use server';
/**
 * @fileOverview An AI flow to generate a quiz from a topic or note.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  sourceType: z.enum(['topic', 'note']).describe('The source to generate the quiz from.'),
  sourceText: z.string().describe('The topic or note content for the quiz.'),
  numQuestions: z.number().int().min(1).max(10).describe('The number of questions to generate.'),
  category: z.string().describe('The subject or category of the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  answerIndex: z.number().int().min(0).max(3).describe('The index of the correct answer in the options array.'),
});

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A suitable title for the generated quiz.'),
  questions: z.array(QuizQuestionSchema).describe('The array of generated quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator tasked with creating a multiple-choice quiz.
The quiz should be based on the provided source material and belong to the specified category.
Generate a quiz with exactly {{{numQuestions}}} questions.
For each question, provide 4 options and indicate the correct answer's index.
The questions should be clear, concise, and relevant to the source material.
The options should be plausible, with one clear correct answer.
Generate a creative and descriptive title for the quiz.

Category: {{{category}}}
Source Material (from a {{{sourceType}}}):
---
{{{sourceText}}}
---
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
