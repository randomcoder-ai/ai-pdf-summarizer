import React from 'react';
import { useDropzone } from 'react-dropzone';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

function FileUpload({ onFileSelect, error }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileSelect(acceptedFiles[0]),
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <>
      {/* Display the error message if it exists */}
      {error && <div className="error-message">{error}</div>}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <UploadIcon />
        <p>Drag & drop a PDF here, or click to select a file</p>
      </div>
    </>
  );
}

export default FileUpload;
