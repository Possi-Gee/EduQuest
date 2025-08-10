'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from './ui/separator';

interface CertificateProps {
  userName: string;
  quizName: string;
  date: string;
}

export function Certificate({ userName, quizName, date }: CertificateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-yellow-50/90 to-yellow-100/90 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-500/50 shadow-2xl shadow-yellow-500/20 rounded-2xl relative overflow-hidden">
        <CardHeader className="text-center space-y-2 pt-12">
           <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-16 w-16 text-yellow-500"
            >
              <path
                fillRule="evenodd"
                d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.731 6.524c-.64.08-1.22.38-1.684.846A6.72 6.72 0 005.32 12a6.72 6.72 0 002.266 4.706c.463.466.99.733 1.556.84A6.745 6.745 0 0012 20.25a6.745 6.745 0 005.158-2.698c.566-.107 1.092-.374 1.556-.84A6.72 6.72 0 0018.68 12a6.72 6.72 0 00-2.266-4.706A4.453 4.453 0 0014.75 6.75c-.39 0-.77.05-1.13.149a.66.66 0 01-.312-.029c-.378-.141-.782-.22-1.21-.22-.486 0-.96.09-1.396.262a.63.63 0 01-.269.052c-.123.021-.248.037-.375.048z"
                clipRule="evenodd"
              />
            </svg>
           </div>
          <h1 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 tracking-tight">
            Certificate of Achievement
          </h1>
          <p className="text-muted-foreground">This certificate is proudly presented to</p>
        </CardHeader>
        <CardContent className="text-center space-y-6 pb-12">
          <p className="text-5xl font-bold text-primary">{userName}</p>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            for successfully completing the quiz
            <br />
            <span className="font-semibold text-foreground">{quizName}</span>
          </p>
          <div className="flex justify-around items-center pt-8">
            <div className="flex flex-col items-center">
              <Separator className="w-32 bg-foreground/50"/>
              <p className="text-sm text-muted-foreground mt-2">Date</p>
              <p className="font-semibold">{date}</p>
            </div>
            <div className="flex flex-col items-center">
              <Separator className="w-32 bg-foreground/50"/>
              <p className="text-sm text-muted-foreground mt-2">Issuing Authority</p>
              <p className="font-semibold">EduQuest Mobile</p>
            </div>
          </div>
        </CardContent>
         {/* Decorative border */}
         <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-yellow-400/30 rounded-lg pointer-events-none"></div>
      </Card>
    </div>
  );
}
