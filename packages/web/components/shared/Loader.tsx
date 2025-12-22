'use client';

import React from 'react';
import { CircularProgress } from '@heroui/react';

const Loader = () => {
  return (
    <div className="bg-background/90 fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center rounded-lg p-6">
        {/* <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div> */}
        <CircularProgress size="lg" aria-label="Loading..." />
      </div>
    </div>
  );
};

export default Loader;
