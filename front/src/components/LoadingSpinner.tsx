import React from 'react';

const LoadSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default LoadSpinner;
