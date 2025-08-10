'use client';

import { GraduationCap } from 'lucide-react';
import React from 'react';

interface CertificateProps {
  userName: string;
  quizName: string;
  date: string;
  scorePercentage: number;
}

const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, quizName, date, scorePercentage }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-[#0A102E] text-white p-1 rounded-lg shadow-2xl max-w-lg mx-auto relative border border-yellow-500/50"
      >
        <div className="relative z-10 flex flex-col items-center text-center p-4 sm:p-8 border-2 border-yellow-500/30 rounded-md">
          <div className='flex items-center justify-start w-full text-yellow-500 font-bold'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 mr-2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>EduQuest</span>
          </div>
          <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 my-4 sm:my-6" />
          
          <h1 className="text-xl sm:text-3xl font-bold tracking-wider text-yellow-500">CERTIFICATE OF ACHIEVEMENT</h1>
          
          <p className="text-sm sm:text-md text-gray-300 mt-6 sm:mt-8">This certificate is proudly presented to</p>
          <p className="text-2xl sm:text-4xl font-semibold text-white my-2 sm:my-4 underline decoration-yellow-500 underline-offset-8">{userName}</p>
          
          <p className="text-sm sm:text-md text-gray-300 mt-2 sm:mt-4 max-w-md mx-auto">
            for successfully completing the quiz <br /> <span className="font-bold text-yellow-500 text-lg sm:text-xl">"{quizName}"</span>
          </p>
          
          <p className="text-sm sm:text-md text-gray-300 mt-2 sm:mt-4">with a score of</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{scorePercentage}%</p>


          <div className="flex flex-col sm:flex-row justify-between w-full mt-8 sm:mt-12 pt-4 gap-4 sm:gap-0">
            <div className="text-center">
              <p className="text-md sm:text-lg text-white" >EduQuest</p>
              <div className="w-32 sm:w-40 h-px bg-yellow-500/50 my-1 mx-auto"></div>
              <p className="text-xs sm:text-sm font-semibold text-gray-300">Authorized Platform</p>
            </div>
            <div className="text-center">
              <p className="text-md sm:text-lg text-white">{date}</p>
              <div className="w-32 sm:w-40 h-px bg-yellow-500/50 my-1 mx-auto"></div>
              <p className="text-xs sm:text-sm font-semibold text-gray-300">Date of Completion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
Certificate.displayName = 'Certificate';

export { Certificate };
