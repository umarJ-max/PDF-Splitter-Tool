'use client';

import { useState } from 'react';

interface PDFSplitterProps {
  file: File;
  totalPages: number;
  onSplit: (ranges: string[]) => void;
}

export default function PDFSplitter({ file, totalPages, onSplit }: PDFSplitterProps) {
  const [splitType, setSplitType] = useState<'pages' | 'ranges'>('pages');
  const [pagesPerSplit, setPagesPerSplit] = useState(1);
  const [ranges, setRanges] = useState('1-5, 10-15');

  const handleSplit = () => {
    if (splitType === 'pages') {
      const rangeArray = [];
      for (let i = 1; i <= totalPages; i += pagesPerSplit) {
        const end = Math.min(i + pagesPerSplit - 1, totalPages);
        rangeArray.push(`${i}-${end}`);
      }
      onSplit(rangeArray);
    } else {
      onSplit(ranges.split(',').map(r => r.trim()));
    }
  };

  return (
    <div className="space-y-6">
      {/* File Info Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {totalPages} pages
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Options Card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Choose Split Method
        </h3>
        
        <div className="space-y-4">
          {/* Pages per split option */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            splitType === 'pages' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={splitType === 'pages'}
                onChange={() => setSplitType('pages')}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-gray-900">Split by number of pages</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Split every N pages into separate files</p>
                {splitType === 'pages' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages per file:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={pagesPerSplit}
                      onChange={(e) => setPagesPerSplit(Number(e.target.value))}
                      className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Will create {Math.ceil(totalPages / pagesPerSplit)} files
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Custom ranges option */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            splitType === 'ranges' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={splitType === 'ranges'}
                onChange={() => setSplitType('ranges')}
                className="mt-1 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 0V3a2 2 0 012-2h2a2 2 0 012 2v2M7 21h10a2 2 0 002-2v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-gray-900">Split by custom ranges</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Specify exact page ranges or individual pages</p>
                {splitType === 'ranges' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page ranges:
                    </label>
                    <input
                      type="text"
                      value={ranges}
                      onChange={(e) => setRanges(e.target.value)}
                      placeholder="e.g., 1-5, 10-15, 20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Examples:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>"1-5" = pages 1 to 5</li>
                        <li>"1-5, 10-15" = two files with specified ranges</li>
                        <li>"1, 3, 5" = individual pages</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Split Button */}
      <button 
        onClick={handleSplit} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span>Split PDF</span>
      </button>
    </div>
  );
}