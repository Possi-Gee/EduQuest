'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getSummary, type SummarizeFormState } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Summarize
        </>
      )}
    </Button>
  );
}

export default function SummarizePage() {
  const initialState: SummarizeFormState = { message: '', errors: {}, summary: '' };
  const [state, dispatch] = useActionState(getSummary, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'Success' && !state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">AI Note Summarizer</h1>
        <p className="text-muted-foreground">Paste a URL to get a concise summary of your notes.</p>
      </div>
      <Card>
        <form action={dispatch}>
          <CardHeader>
            <CardTitle>Enter URL</CardTitle>
            <CardDescription>Provide a link to a publicly accessible note or article.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="url">URL</Label>
              <Input type="url" id="url" name="url" placeholder="https://example.com/notes/my-note" required />
              {state.errors?.url && <p className="text-sm text-destructive mt-1">{state.errors.url[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.summary && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground/90">{state.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
