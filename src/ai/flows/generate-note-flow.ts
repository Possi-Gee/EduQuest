
'use server';
/**
 * @fileOverview An AI flow to generate educational notes based on a title.
 *
 * - generateNote - A function that generates note content from a title.
 * - GenerateNoteInput - The input type for the generateNote function.
 * - GenerateNoteOutput - The return type for the generateNote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNoteInputSchema = z.object({
  title: z.string().describe('The title of the note to be generated.'),
});
export type GenerateNoteInput = z.infer<typeof GenerateNoteInputSchema>;

const GenerateNoteOutputSchema = z.object({
  noteContent: z
    .string()
    .describe(
      'The generated content for the note. It should be well-structured, informative, and suitable for educational purposes.'
    ),
});
export type GenerateNoteOutput = z.infer<typeof GenerateNoteOutputSchema>;

export async function generateNote(input: GenerateNoteInput): Promise<GenerateNoteOutput> {
  return generateNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotePrompt',
  input: { schema: GenerateNoteInputSchema },
  output: { schema: GenerateNoteOutputSchema },
  prompt: `You are an expert educator and content creator. Your task is to generate a detailed and well-structured educational note based on the provided title.

The note should be comprehensive, easy to understand, and broken down into logical sections with clear headings. Use paragraphs, and bullet points where appropriate to make the content digestible.

Generate a note for the following title:

Title: {{{title}}}`,
});

const generateNoteFlow = ai.defineFlow(
  {
    name: 'generateNoteFlow',
    inputSchema: GenerateNoteInputSchema,
    outputSchema: GenerateNoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
