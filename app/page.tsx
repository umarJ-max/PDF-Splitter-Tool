'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import PDFUploader from '../components/PDFUploader';
import PDFSplitter from '../components/PDFSplitter';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState<Array<{name: string, url: string}>>([]);
  const [showGuide, setShowGuide] = useState(false);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    setTotalPages(pdfDoc.getPageCount());
  };

  const handleSplit = async (ranges: string[]) => {
    if (!file) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ranges', JSON.stringify(ranges));

    try {
      const response = await fetch('/api/split-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.files) {
        const links = result.files.map((fileData: any) => ({
          name: fileData.name,
          url: URL.createObjectURL(new Blob([new Uint8Array(fileData.data)], { type: 'application/pdf' }))
        }));
        setDownloadLinks(links);
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full mr-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PDF Splitter</h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">Split your PDF files easily and quickly with our powerful online tool</p>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showGuide ? 'Hide Guide' : 'How to Use'}
          </button>
        </div>

        {/* Tool Guide */}
        {showGuide && (
          <div className="max-w-4xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              How to Use PDF Splitter
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                    <span className="font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upload PDF</h3>
                    <p className="text-gray-600 text-sm">Click or drag & drop your PDF file to upload</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                    <span className="font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Choose Split Method</h3>
                    <p className="text-gray-600 text-sm">Select pages per split or custom ranges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                    <span className="font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Download Files</h3>
                    <p className="text-gray-600 text-sm">Get your split PDF files instantly</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Split Options:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span><strong>Pages per split:</strong> Split every N pages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span><strong>Custom ranges:</strong> e.g., "1-5, 10-15, 20"</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Single pages:</strong> e.g., "1, 3, 5"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {!file ? (
            <PDFUploader onFileUpload={handleFileUpload} />
          ) : (
            <div className="space-y-6">
              <PDFSplitter 
                file={file} 
                totalPages={totalPages} 
                onSplit={handleSplit} 
              />
              
              {isProcessing && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="mt-4 text-lg font-medium text-gray-700">Processing PDF...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              )}

              {downloadLinks.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900">Split Complete! Download Your Files:</h3>
                  </div>
                  <div className="grid gap-3">
                    {downloadLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        download={link.name}
                        className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg border border-blue-200 text-blue-700 transition-all duration-200 group"
                      >
                        <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium group-hover:text-blue-800">{link.name}</span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Files are processed locally in your browser. No data is sent to servers.
                    </p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => {setFile(null); setDownloadLinks([]);}} 
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Another File
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-16 sm:mt-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl">
            <div className="px-6 py-8 sm:py-12">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                  {/* Brand Section */}
                  <div className="md:col-span-1">
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">PDF Splitter</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Fast, secure, and free PDF splitting tool. Process files locally in your browser.
                    </p>
                  </div>
                  
                  {/* Features */}
                  <div className="md:col-span-1">
                    <h4 className="text-white font-semibold mb-4">Features</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        No file size limits
                      </li>
                      <li className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        100% secure & private
                      </li>
                      <li className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Multiple split options
                      </li>
                      <li className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Works offline
                      </li>
                    </ul>
                  </div>
                  
                  {/* Developer Credit */}
                  <div className="md:col-span-1">
                    <h4 className="text-white font-semibold mb-4">Developer</h4>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="text-white font-bold">Umar J</span>
                      </div>
                      <p className="text-blue-100 text-sm">Full Stack Developer</p>
                      <p className="text-blue-200 text-xs mt-1">Crafting digital solutions</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    © 2024 PDF Splitter Tool. Made with ❤️ by <span className="text-blue-400 font-medium">Umar J dev</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    All processing happens locally in your browser. No data is stored or transmitted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}