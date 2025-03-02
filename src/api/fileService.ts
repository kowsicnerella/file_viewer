import { FileItem, FileInfo } from '../types';

const API_BASE_URL = 'https://6qzkd2jm-8000.inc1.devtunnels.ms/api';
//const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchFiles = async (folderPath: string = ''): Promise<FileItem[]> => {
  const url = folderPath ? `${API_BASE_URL}/files/${encodeURIComponent(folderPath)}` : `${API_BASE_URL}/files/`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchFileInfo = async (filePath: string): Promise<FileInfo> => {
  const response = await fetch(`${API_BASE_URL}/file-info/${encodeURIComponent(filePath)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file info: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

export const getDownloadUrl = (filePath: string): string => {
  return `${API_BASE_URL}/download/${encodeURIComponent(filePath)}`;
};

// This function is no longer used as we're downloading files individually
export const getBulkDownloadUrl = (filePaths: string[]): string => {
  // In a real implementation, this would be a POST request with the file paths in the body
  // For this example, we'll use a GET request with the file paths as query parameters
  const queryParams = new URLSearchParams();
  filePaths.forEach(path => queryParams.append('paths', path));
  
  return `${API_BASE_URL}/bulk-download?${queryParams.toString()}`;
};

// This function is kept for backward compatibility but is no longer used
export const downloadFiles = async (
  filePaths: string[], 
  onProgress: (progress: number) => void
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) progress = 100;
      
      onProgress(Math.floor(progress));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Simulate download completion
        setTimeout(() => {
          // In a real implementation, this would be the actual downloaded file
          const blob = new Blob(['Simulated file content'], { type: 'application/zip' });
          resolve(blob);
        }, 500);
      }
    }, 300);
    
    // Simulate potential error
    if (Math.random() < 0.1) {
      clearInterval(interval);
      reject(new Error('Download failed. Please try again.'));
    }
  });
};
