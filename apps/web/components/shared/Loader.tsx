'use client';

import React from 'react';

const Loader = () => {
  return (
    <div className="bg-background/90 fixed inset-0 z-60 flex items-center justify-center">
      <div className="flex flex-col items-center rounded-lg p-6">
        <div className="relative flex items-center justify-center">
          {/* Outer breathing ring */}
          <div className="bg-primary/20 absolute h-20 w-20 animate-[breathe_2s_ease-in-out_infinite] rounded-full"></div>

          {/* Middle breathing ring */}
          <div className="bg-primary/40 absolute h-14 w-14 animate-[breathe_2s_ease-in-out_infinite_200ms] rounded-full"></div>

          {/* Inner solid circle */}
          <div className="bg-primary absolute h-8 w-8 animate-[breathe_2s_ease-in-out_infinite_400ms] rounded-full shadow-lg"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
