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
        className="font-serif bg-[#1a1a1a] text-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto relative overflow-hidden"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* Background texture */}
        <div 
          className="absolute inset-0 bg-repeat opacity-5"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}
        ></div>

        {/* Gold borders */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-yellow-500 rounded"></div>
        <div className="absolute top-5 left-5 right-5 bottom-5 border border-yellow-600 rounded"></div>

        {/* Corner flourishes */}
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />

        {/* Curved corner elements */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-tr from-yellow-600/50 via-yellow-500/30 to-transparent rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-bl from-yellow-600/40 via-yellow-500/20 to-transparent rounded-full"></div>


        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <div className="flex items-center gap-8 mb-4">
            {/* Award Seal */}
            <div className="relative">
              <div className="w-28 h-28 bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-lg">
                <div className="text-yellow-400 text-xs tracking-wider">THE BEST</div>
                <div className="text-yellow-400 text-sm font-bold tracking-wider">AWARDS</div>
                <div className="text-yellow-400 mt-1">★★★</div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <svg width="80" height="40" viewBox="0 0 100 50">
                  <path d="M0 0 L50 25 L100 0 L80 50 L20 50 Z" fill="#c09b33" />
                </svg>
              </div>
            </div>
            
            <div className="text-left">
              <h1 className="text-5xl font-bold tracking-wider text-gray-200">CERTIFICATE</h1>
              <p className="text-2xl text-yellow-500 tracking-widest mt-1">OF ACHIEVEMENT</p>
            </div>
          </div>

          <p className="text-lg text-gray-400 mt-8">This certificate is proudly presented to</p>
          
          <p className="text-6xl text-yellow-400 my-4" style={{ fontFamily: "'Dancing Script', cursive" }}>{userName}</p>
          
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            for successfully completing the <span className="font-bold text-yellow-500">{quizName}</span> quiz with a score of <span className="font-bold text-yellow-500">{scorePercentage}%</span>. This award is a testament to your dedication and can be a motivation to further improve your abilities in the future.
          </p>

          <div className="flex justify-around w-full mt-16 pt-8 border-t border-yellow-500/20">
            <div className="text-center">
              <p className="text-2xl text-yellow-500" style={{ fontFamily: "'Dancing Script', cursive" }}>Signature</p>
              <div className="w-48 h-px bg-yellow-500/50 my-2"></div>
              <p className="text-sm font-semibold text-gray-300">EduQuest Mobile</p>
              <p className="text-xs text-gray-400">Issuing Authority</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-yellow-500" style={{ fontFamily: "'Dancing Script', cursive" }}>{date}</p>
              <div className="w-48 h-px bg-yellow-500/50 my-2"></div>
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
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6 transform scale-x-[-1]',
    'bottom-left': 'bottom-6 left-6 transform scale-y-[-1]',
    'bottom-right': 'bottom-6 right-6 transform scale-[-1]',
  };
  return (
    <svg 
      className={`absolute w-12 h-12 text-yellow-500/80 ${classes[position]}`}
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
