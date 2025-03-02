import React, { useState, useEffect } from 'react';
import { FileItem, FileInfo, BreadcrumbItem } from './types';
import { fetchFiles, fetchFileInfo } from './api/fileService';
import Header from './components/Header';
import FileGrid from './components/FileGrid';
import FileModal from './components/FileModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Breadcrumbs from './components/Breadcrumbs';
import SelectionToolbar from './components/SelectionToolbar';
import { sortFilesByType } from './utils/fileUtils';

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

  const loadFiles = async (path: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFiles(path);
      // Sort files by type: folders > images > videos > other files
      const sortedData = sortFilesByType(data);
      setFiles(sortedData);
      setFilteredFiles(sortedData);
      setCurrentPath(path);
      updateBreadcrumbs(path);
      
      // Clear selection when changing directories
      setSelectedFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBreadcrumbs = (path: string) => {
    if (!path) {
      setBreadcrumbs([]);
      return;
    }

    const parts = path.split('/');
    const breadcrumbItems: BreadcrumbItem[] = [];
    
    let currentPath = '';
    for (const part of parts) {
      if (!part) continue;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      breadcrumbItems.push({
        name: part,
        path: currentPath
      });
    }
    
    setBreadcrumbs(breadcrumbItems);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchQuery, files]);

  const handleFileClick = async (file: FileItem) => {
    if (selectionMode) {
      handleFileSelection(file, !isFileSelected(file));
      return;
    }
    
    const isFolder = file.type === 'folder' || file.is_directory;
    
    if (isFolder) {
      // Navigate to folder
      const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      loadFiles(newPath);
      return;
    }

    // Handle file click
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalError(null);
    
    try {
      const fileInfo = await fetchFileInfo(file.path);
      console.log('here app click', fileInfo  )
      setSelectedFile(fileInfo);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    loadFiles(path);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset after animation completes
    setTimeout(() => {
      setSelectedFile(null);
      setModalError(null);
    }, 300);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      // Clear selection when exiting selection mode
      setSelectedFiles([]);
    }
  };

  const handleFileSelection = (file: FileItem, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f.path !== file.path));
    }
  };

  const isFileSelected = (file: FileItem) => {
    return selectedFiles.some(f => f.path === file.path);
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.filter(f => !(f.type === 'folder' || f.is_directory)).length) {
      // If all files are selected, deselect all
      setSelectedFiles([]);
    } else {
      // Otherwise, select all files (excluding folders)
      setSelectedFiles(filteredFiles.filter(f => !(f.type === 'folder' || f.is_directory)));
    }
  };

  const handleClearSelection = () => {
    setSelectedFiles([]);
  };

  const nonFolderCount = filteredFiles.filter(f => !(f.type === 'folder' || f.is_directory)).length;
  const allFilesSelected = selectedFiles.length === nonFolderCount && nonFolderCount > 0;

  return (
    <div className="min-h-screen bg-[rgba(44,57,48,0.85)] text-[rgb(220,215,201)]">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        selectionMode={selectionMode}
        onToggleSelectionMode={toggleSelectionMode}
        selectedCount={selectedFiles.length}
      />

      <main className="container mx-auto px-2 sm:px-4 py-4">
        <Breadcrumbs 
          items={breadcrumbs} 
          onNavigate={handleBreadcrumbClick} 
        />

        {isLoading ? (
          <LoadingSpinner message="Loading files..." />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : (
          <FileGrid 
            files={filteredFiles} 
            searchQuery={searchQuery} 
            onFileClick={handleFileClick}
            selectedFiles={selectedFiles}
            onSelectFile={handleFileSelection}
            selectionMode={selectionMode}
          />
        )}
      </main>

      <FileModal 
        isOpen={isModalOpen}
        isLoading={isModalLoading}
        error={modalError}
        file={selectedFile}
        onClose={closeModal}
        allFiles={filteredFiles}
        currentPath={currentPath}
      />

      <SelectionToolbar
        selectedFiles={selectedFiles}
        onClearSelection={handleClearSelection}
        onSelectAll={handleSelectAll}
        allFilesSelected={allFilesSelected}
        totalFiles={nonFolderCount}
      />
    </div>
  );
}

export default App;