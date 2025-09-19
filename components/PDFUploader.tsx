'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
}

export default function PDFUploader({ onFileUpload }: PDFUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
          isDragActive 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.01]' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`p-4 rounded-full transition-all duration-300 ${
              isDragActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-110' 
                : 'bg-gradient-to-r from-blue-100 to-purple-100'
            }`}>
              <svg 
                className={`w-12 h-12 sm:w-16 sm:h-16 transition-colors duration-300 ${
                  isDragActive ? 'text-white' : 'text-blue-600'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isDragActive ? 'Drop your PDF here!' : 'Upload PDF File'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {isDragActive 
                ? 'Release to upload your file' 
                : 'Drag & drop your PDF file here, or click to browse'
              }
            </p>
          </div>
          
          {/* Upload Button */}
          <div className="pt-2">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isDragActive 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            }`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choose File
            </div>
          </div>
          
          {/* File Requirements */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>PDF files only</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No size limit</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100% secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}