'use client';

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
        className="font-serif bg-[#1a1a1a] text-white p-6 rounded-lg shadow-2xl max-w-xl mx-auto relative overflow-hidden"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* Background texture */}
        <div 
          className="absolute inset-0 bg-repeat opacity-5"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}
        ></div>

        {/* Gold borders */}
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-yellow-500 rounded"></div>
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-yellow-600/80 rounded"></div>

        {/* Corner flourishes */}
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />
        
        <div className="relative z-10 flex flex-col items-center text-center p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
            {/* Award Seal */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-lg">
                <div className="text-yellow-400 text-xs tracking-wider">THE BEST</div>
                <div className="text-yellow-400 text-sm font-bold tracking-wider">AWARDS</div>
                <div className="text-yellow-400 mt-1">★★★</div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <svg width="60" height="30" viewBox="0 0 100 50">
                  <path d="M0 0 L50 25 L100 0 L80 50 L20 50 Z" fill="#c09b33" />
                </svg>
              </div>
            </div>
            
            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-4xl font-bold tracking-wider text-gray-200">CERTIFICATE</h1>
              <p className="text-xl text-yellow-500 tracking-widest">OF ACHIEVEMENT</p>
            </div>
          </div>

          <p className="text-md text-gray-400 mt-6">This certificate is proudly presented to</p>
          
          <p className="text-5xl text-yellow-400 my-2" style={{ fontFamily: "'Dancing Script', cursive" }}>{userName}</p>
          
          <p className="text-sm text-gray-300 max-w-md mx-auto">
            for successfully completing the <span className="font-bold text-yellow-500">{quizName}</span> quiz with a score of <span className="font-bold text-yellow-500">{scorePercentage}%</span>. This award is a testament to your dedication and can be a motivation to further improve your abilities in the future.
          </p>

          <div className="flex flex-col sm:flex-row justify-around w-full mt-12 pt-4 border-t border-yellow-500/20 gap-4">
            <div className="text-center">
              <p className="text-xl text-yellow-500" style={{ fontFamily: "'Dancing Script', cursive" }}>Signature</p>
              <div className="w-40 h-px bg-yellow-500/50 my-1 mx-auto"></div>
              <p className="text-sm font-semibold text-gray-300">EduQuest Mobile</p>
              <p className="text-xs text-gray-400">Issuing Authority</p>
            </div>
            <div className="text-center">
              <p className="text-xl text-yellow-500" style={{ fontFamily: "'Dancing Script', cursive" }}>{date}</p>
              <div className="w-40 h-px bg-yellow-500/50 my-1 mx-auto"></div>
              <p className="text-sm font-semibold text-gray-300">Date of Completion</p>
              <p className="text-xs text-gray-400">Issued On</p>
            </div>
          </div>
        </div>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      </div>
    );
  }
);
Certificate.displayName = 'Certificate';

const CornerFlourish = ({ position }: { position: string }) => {
  const classes = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4 transform scale-x-[-1]',
    'bottom-left': 'bottom-4 left-4 transform scale-y-[-1]',
    'bottom-right': 'bottom-4 right-4 transform scale-[-1]',
  };
  return (
    <svg 
      className={`absolute w-10 h-10 text-yellow-500/80 ${classes[position]}`}
      viewBox="0 0 100 100"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M95 5C70 5 50 20 50 45C50 70 70 95 95 95" stroke="currentColor" strokeWidth="4"/>
      <path d="M95 5C95 30 80 50 55 50C30 50 5 70 5 95" stroke="currentColor" strokeWidth="4"/>
      <path d="M50 50C40 40 35 25 35 5" stroke="currentColor" strokeWidth="3"/>
      <circle cx="30" cy="5" r="4" fill="currentColor"/>
    </svg>
  );
};

export { Certificate };
