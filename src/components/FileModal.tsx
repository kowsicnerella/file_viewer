import React, { useEffect, useState } from 'react';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FileInfo, FileItem } from '../types';
import FilePreview from './FilePreview';
import FileDetails from './FileDetails';
import { fetchFileInfo, getDownloadUrl } from '../api/fileService';


interface FileModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  file: FileInfo | null;
  onClose: () => void;
  allFiles?: FileItem[];
  currentPath?: string;
}

const FileModal: React.FC<FileModalProps> = ({ 
  isOpen, 
  isLoading, 
  error, 
  file, 
  onClose,
  allFiles = [],
  currentPath = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [navigationInfo, setNavigationInfo] = useState<string>('');
  const [currentFileInfo, setCurrentFileInfo] = useState<FileInfo | null>(null);
  // Filter out folders from navigation
  const navigableFiles = allFiles.filter(f => !(f.type === 'folder' || f.is_directory));

  // Update current index and file info when file changes
  useEffect(() => {
    if (currentFileInfo && navigableFiles.length > 0) {
      const index = navigableFiles.findIndex(f => f.path === currentFileInfo.path);
      setCurrentIndex(index);
      setCurrentFileInfo(currentFileInfo);
      updateNavigationInfo(index);
    }
  }, [currentFileInfo, navigableFiles, currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        navigateToPrevious();
      } else if (e.key === 'ArrowRight') {
        navigateToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, navigableFiles]);

  useEffect(() => {
    setCurrentFileInfo(file);
  }, [file]);

  const updateNavigationInfo = (index: number) => {
    if (index >= 0 && navigableFiles.length > 0) {
      setNavigationInfo(`File ${index + 1} of ${navigableFiles.length}`);
    } else {
      setNavigationInfo('');
    }
  };

  const navigateToPrevious = () => {
    if (currentIndex <= 0 || navigableFiles.length === 0) return;
    
    navigateToFile(currentIndex - 1);
  };

  const navigateToNext = () => {
    if (currentIndex >= navigableFiles.length - 1 || navigableFiles.length === 0) return;
    
    navigateToFile(currentIndex + 1);
  };

  const navigateToFile = async (index: number) => {
    if (index < 0 || index >= navigableFiles.length) return;
    
    setIsTransitioning(true);
    
    // Get the file at the target index
    const targetFile = navigableFiles[index];

    try {
      const fileInfo = await fetchFileInfo(targetFile.path);
      
      setIsTransitioning(false);
      setCurrentIndex(index);
      setCurrentFileInfo(fileInfo);
      // Short delay to allow transition animation
      setTimeout(() => {
        updateNavigationInfo(index);
      }, 300);
    } catch (error) {
      console.error("Error navigating to file:", error);
      setIsTransitioning(false);
    }
  };

  const handleDownload = () => {
    if (!currentFileInfo) return;
    window.open(getDownloadUrl(currentFileInfo.path), '_blank');
  };

  if (!isOpen) return null;

  const isPreviousDisabled = currentIndex <= 0 || navigableFiles.length <= 1;
  const isNextDisabled = currentIndex >= navigableFiles.length - 1 || navigableFiles.length <= 1;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="file-modal-title"
    >
      {/* Backdrop with glassmorphism effect */}
      <div 
        className={`absolute inset-0 bg-[rgba(44,57,48,0.5)] backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
      
      {/* Modal Content */}
      <div 
        className={`bg-[rgba(63,79,68,0.9)] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 transition-all duration-300 
                   border border-[rgba(255,255,255,0.1)] backdrop-blur-sm
                   ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        <div className="sticky top-0 z-20 bg-[rgba(44,57,48,0.9)] border-b border-[rgba(255,255,255,0.1)] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-t-xl">
          <h2 
            id="file-modal-title"
            className="text-xl sm:text-2xl font-bold pr-8 sm:pr-0 truncate max-w-full sm:max-w-[70%] text-[rgb(220,215,201)]"
          >
            {currentFileInfo?.name || file?.name}
          </h2>
          
          {/* Navigation Info - Fixed position to avoid overlap */}
          <div className="text-[rgba(220,215,201,0.7)] text-sm mt-1 sm:mt-0 absolute top-5 right-12">
            {navigationInfo}
          </div>
          
          {/* Close Button - Absolute positioned */}
          <button 
            className="absolute top-3 right-3 text-[rgba(220,215,201,0.7)] hover:text-[rgb(220,215,201)] p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-t-4 border-[rgb(162,123,92)] border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-[rgb(220,215,201)]">Loading file details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
            </div>
          ) : (currentFileInfo || file) && (
            <>
              {/* Navigation Controls */}
              <div className="relative mb-6">
                {/* Previous Button */}
                <button 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[rgba(44,57,48,0.7)] hover:bg-[rgba(44,57,48,0.9)] text-[rgb(220,215,201)] p-2 sm:p-3 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation ${
                    isPreviousDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isPreviousDisabled) navigateToPrevious();
                  }}
                  disabled={isPreviousDisabled}
                  aria-label="Previous file"
                  aria-disabled={isPreviousDisabled}
                >
                  <ChevronLeft size={24} />
                </button>
                
                {/* File Preview with transition */}
                <div 
                  className={`transition-opacity duration-300 mx-12 sm:mx-16 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                  aria-live="polite"
                >
                  {(currentFileInfo || file) && <FilePreview file={currentFileInfo || file} />}

                </div>
                
                {/* Next Button */}
                <button 
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[rgba(44,57,48,0.7)] hover:bg-[rgba(44,57,48,0.9)] text-[rgb(220,215,201)] p-2 sm:p-3 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation ${
                    isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isNextDisabled) navigateToNext();
                  }}
                  disabled={isNextDisabled}
                  aria-label="Next file"
                  aria-disabled={isNextDisabled}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Keyboard Navigation Hint */}
              <div className="text-center text-[rgba(220,215,201,0.5)] text-sm mb-4 hidden sm:block">
                Use arrow keys ← → for navigation
              </div>
              
              {/* File Details */}
              <FileDetails file={currentFileInfo || file} />
              
              {/* Download Button */}
              <div className="flex justify-center mt-6">
                <button 
                  className="bg-[rgb(162,123,92)] hover:bg-[rgba(162,123,92,0.9)] text-[rgb(220,215,201)] px-6 py-3 rounded-lg flex items-center transition-colors shadow-lg hover:shadow-xl min-h-[44px]"
                  onClick={handleDownload}
                  aria-label={`Download ${currentFileInfo?.name || file?.name}`}
                >
                  <Download className="mr-2" size={20} />
                  Download File
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileModal;