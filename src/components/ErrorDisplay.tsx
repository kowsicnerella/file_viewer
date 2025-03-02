import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg backdrop-blur-sm">
      <p className="text-lg font-semibold">Error</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;