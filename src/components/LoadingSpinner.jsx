import React from 'react';

function LoadingSpinner({ message }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
