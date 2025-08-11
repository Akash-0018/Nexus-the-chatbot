import React from 'react';

const LoadingSpinner = ({ size = 'sm' }) => {
  return (
    <span className={`spinner-border spinner-border-${size}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </span>
  );
};

export default LoadingSpinner;
