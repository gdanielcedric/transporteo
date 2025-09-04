import React from 'react';

interface ErrorPopupProps {
  message: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message }) => {
  return (
    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300 shadow-sm">
      {message}
    </div>
  );
};

export default ErrorPopup;