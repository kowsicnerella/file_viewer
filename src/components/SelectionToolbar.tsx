import React, { useState } from 'react';
import { Download, X, Check, Loader2, AlertCircle, FolderX } from 'lucide-react';
import { FileItem } from '../types';
import { formatFileSize } from '../utils/formatters';
import { getDownloadUrl } from '../api/fileService';

interface SelectionToolbarProps {
  selectedFiles: FileItem[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  allFilesSelected: boolean;
  totalFiles: number;
}

interface DownloadStatus {
  isDownloading: boolean;
  currentFile: string;
  progress: number;
  completed: number;
  total: number;
  error: string | null;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedFiles,
  onClearSelection,
  onSelectAll,
  allFilesSelected,
  totalFiles
}) => {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    isDownloading: false,
    currentFile: '',
    progress: 0,
    completed: 0,
    total: 0,
    error: null
  });

  // Filter out folders from the selected files
  const downloadableFiles = selectedFiles.filter(file => !(file.type === 'folder' || file.is_directory));
  const hasFoldersSelected = selectedFiles.length > downloadableFiles.length;

  const totalSize = downloadableFiles.reduce((sum, file) => sum + file.size, 0);

  const downloadFile = (url: string, filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Simulate a delay to show progress
      setTimeout(() => {
        try {
          link.click();
          document.body.removeChild(link);
          resolve();
        } catch (error) {
          document.body.removeChild(link);
          reject(error);
        }
      }, 500);
    });
  };

  const handleDownload = async () => {
    if (downloadableFiles.length === 0 || downloadStatus.isDownloading) return;

    setDownloadStatus({
      isDownloading: true,
      currentFile: '',
      progress: 0,
      completed: 0,
      total: downloadableFiles.length,
      error: null
    });

    // Process files sequentially
    for (let i = 0; i < downloadableFiles.length; i++) {
      const file = downloadableFiles[i];
      
      setDownloadStatus(prev => ({
        ...prev,
        currentFile: file.name,
        progress: Math.round((i / downloadableFiles.length) * 100)
      }));

      try {
        const downloadUrl = getDownloadUrl(file.path);
        await downloadFile(downloadUrl, file.name);
        
        setDownloadStatus(prev => ({
          ...prev,
          completed: prev.completed + 1
        }));
      } catch (error) {
        console.error(`Error downloading ${file.name}:`, error);
        setDownloadStatus(prev => ({
          ...prev,
          error: `Failed to download ${file.name}`
        }));
        
        // Continue with next file despite error
        continue;
      }
    }

    // Complete the download process
    setDownloadStatus(prev => ({
      ...prev,
      isDownloading: false,
      progress: 100,
      currentFile: ''
    }));

    // Reset after showing completion for a moment
    setTimeout(() => {
      setDownloadStatus({
        isDownloading: false,
        currentFile: '',
        progress: 0,
        completed: 0,
        total: 0,
        error: null
      });
    }, 3000);
  };

  if (selectedFiles.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-3xl px-4">
      <div className="bg-[rgba(44,57,48,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg p-4 text-[rgb(220,215,201)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClearSelection}
            className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            aria-label="Clear selection"
          >
            <X size={20} />
          </button>
          
          <div>
            <p className="font-medium">
              {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
            </p>
            <p className="text-sm text-[rgba(220,215,201,0.7)]">
              Total size: {formatFileSize(totalSize)}
              {hasFoldersSelected && (
                <span className="ml-2 text-[rgba(220,215,201,0.5)]">
                  (Folders excluded from download)
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {downloadStatus.isDownloading ? (
            <div className="flex items-center gap-2 bg-[rgba(162,123,92,0.3)] px-4 py-2 rounded-lg">
              <Loader2 size={20} className="animate-spin" />
              <span>
                {downloadStatus.currentFile ? (
                  <span className="hidden sm:inline">Downloading: {downloadStatus.currentFile}</span>
                ) : null}
                <span> {downloadStatus.completed}/{downloadStatus.total}</span>
              </span>
            </div>
          ) : downloadStatus.error ? (
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <AlertCircle size={16} />
              <span>{downloadStatus.error}</span>
            </div>
          ) : hasFoldersSelected && downloadableFiles.length === 0 ? (
            <div className="flex items-center gap-2 text-[rgba(220,215,201,0.7)] text-sm">
              <FolderX size={16} />
              <span>Cannot download folders</span>
            </div>
          ) : null}
          
          <button 
            onClick={onSelectAll}
            className={`
              px-3 py-2 rounded-lg flex items-center gap-1
              ${allFilesSelected 
                ? 'bg-[rgba(162,123,92,0.7)] hover:bg-[rgba(162,123,92,0.8)]' 
                : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]'
              }
              transition-colors
            `}
            aria-label={allFilesSelected ? "Deselect all" : "Select all"}
          >
            {allFilesSelected ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">All Selected</span>
              </>
            ) : (
              <span>Select All ({totalFiles})</span>
            )}
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={downloadStatus.isDownloading || downloadableFiles.length === 0}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2
              bg-[rgb(162,123,92)] hover:bg-[rgba(162,123,92,0.9)]
              text-[rgb(220,215,201)] font-medium
              transition-colors shadow-md
              ${(downloadStatus.isDownloading || downloadableFiles.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            aria-label="Download selected files"
            title={downloadableFiles.length === 0 ? "No files available to download" : "Download selected files"}
          >
            <Download size={18} />
            <span>Download Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionToolbar;