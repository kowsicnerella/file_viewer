import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 border-t-4 border-[rgb(162,123,92)] border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-xl text-[rgb(220,215,201)]">{message}</p>
    </div>
  );
};

export default LoadingSpinner;