'use server';

/**
 * @fileOverview A note summarization AI agent.
 *
 * - summarizeNoteFromUrl - A function that handles the note summarization process.
 * - SummarizeNoteFromUrlInput - The input type for the summarizeNoteFromUrl function.
 * - SummarizeNoteFromUrlOutput - The return type for the summarizeNoteFromUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNoteFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the note to summarize.'),
});
export type SummarizeNoteFromUrlInput = z.infer<typeof SummarizeNoteFromUrlInputSchema>;

const SummarizeNoteFromUrlOutputSchema = z.object({
  summary: z.string().describe('The summary of the note.'),
});
export type SummarizeNoteFromUrlOutput = z.infer<typeof SummarizeNoteFromUrlOutputSchema>;

export async function summarizeNoteFromUrl(input: SummarizeNoteFromUrlInput): Promise<SummarizeNoteFromUrlOutput> {
  return summarizeNoteFromUrlFlow(input);
}

const summarizeNoteFromUrlPrompt = ai.definePrompt({
  name: 'summarizeNoteFromUrlPrompt',
  input: {schema: SummarizeNoteFromUrlInputSchema},
  output: {schema: SummarizeNoteFromUrlOutputSchema},
  prompt: `You are a highly skilled summarization tool.  Summarize the note at the provided URL.  Make sure to extract key information and present it in a concise manner.\n\nURL: {{{url}}}`,
});

const summarizeNoteFromUrlFlow = ai.defineFlow(
  {
    name: 'summarizeNoteFromUrlFlow',
    inputSchema: SummarizeNoteFromUrlInputSchema,
    outputSchema: SummarizeNoteFromUrlOutputSchema,
  },
  async input => {
    const {output} = await summarizeNoteFromUrlPrompt(input);
    return output!;
  }
);
