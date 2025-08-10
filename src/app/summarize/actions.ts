'use server';

import { summarizeNoteFromUrl, type SummarizeNoteFromUrlOutput } from '@/ai/flows/summarize-note-url';
import { z } from 'zod';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export interface SummarizeFormState {
  message: string;
  summary?: string;
  errors?: {
    url?: string[];
  };
}

export async function getSummary(
  prevState: SummarizeFormState,
  formData: FormData
): Promise<SummarizeFormState> {
  const validatedFields = formSchema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result: SummarizeNoteFromUrlOutput = await summarizeNoteFromUrl({
      url: validatedFields.data.url,
    });
    return { message: 'Success', summary: result.summary };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while summarizing the note. Please check the URL and try again.' };
  }
}
