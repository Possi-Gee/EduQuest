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
        className="bg-[#0A102E] text-white p-1 rounded-lg shadow-2xl max-w-md mx-auto relative border border-yellow-500/50"
      >
        <div className="relative z-10 flex flex-col items-center text-center p-3 sm:p-6 border-2 border-yellow-500/30 rounded-md">
          <div className='flex items-center justify-start w-full text-yellow-500 font-bold'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="text-xs">EduQuest</span>
          </div>
          <GraduationCap className="w-8 h-8 sm:w-14 sm:h-14 text-yellow-500 my-2 sm:my-5" />
          
          <h1 className="text-base sm:text-2xl font-bold tracking-wider text-yellow-500">CERTIFICATE OF ACHIEVEMENT</h1>
          
          <p className="text-[10px] sm:text-sm text-gray-300 mt-3 sm:mt-6">This certificate is proudly presented to</p>
          <p className="text-lg sm:text-3xl font-semibold text-white my-1 sm:my-3 underline decoration-yellow-500 underline-offset-4">{userName}</p>
          
          <p className="text-[10px] sm:text-sm text-gray-300 mt-2 sm:mt-3 max-w-md mx-auto">
            for successfully completing the quiz <br /> <span className="font-bold text-yellow-500 text-sm sm:text-lg">"{quizName}"</span>
          </p>
          
          <p className="text-[10px] sm:text-sm text-gray-300 mt-2 sm:mt-3">with a score of</p>
          <p className="text-lg sm:text-2xl font-bold text-white mt-1">{scorePercentage}%</p>


          <div className="flex flex-col sm:flex-row justify-between w-full mt-4 sm:mt-10 pt-3 gap-3 sm:gap-0">
            <div className="text-center">
              <p className="text-xs sm:text-base text-white" >EduQuest</p>
              <div className="w-24 sm:w-32 h-px bg-yellow-500/50 my-1 mx-auto"></div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-300">Authorized Platform</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-base text-white">{date}</p>
              <div className="w-24 sm:w-32 h-px bg-yellow-500/50 my-1 mx-auto"></div>
              <p className="text-[9px] sm:text-xs font-semibold text-gray-300">Date of Completion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
Certificate.displayName = 'Certificate';

export { Certificate };
