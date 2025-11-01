
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
      {message && <p className="text-white text-lg mt-4">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
