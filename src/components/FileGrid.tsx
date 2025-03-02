import React from 'react';
import { File } from 'lucide-react';
import { FileItem } from '../types';
import FileCard from './FileCard';

interface FileGridProps {
  files: FileItem[];
  searchQuery: string;
  onFileClick: (file: FileItem) => void;
  selectedFiles: FileItem[];
  onSelectFile: (file: FileItem, isSelected: boolean) => void;
  selectionMode: boolean;
}

const FileGrid: React.FC<FileGridProps> = ({ 
  files, 
  searchQuery, 
  onFileClick,
  selectedFiles,
  onSelectFile,
  selectionMode
}) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-16 h-16 mx-auto text-[rgba(220,215,201,0.6)] mb-4" />
        <p className="text-xl text-[rgba(220,215,201,0.8)]">No files found</p>
        {searchQuery && (
          <p className="text-[rgba(220,215,201,0.6)] mt-2">
            No results for "{searchQuery}". Try a different search term.
          </p>
        )}
      </div>
    );
  }

  const isSelected = (file: FileItem) => {
    return selectedFiles.some(selectedFile => selectedFile.path === file.path);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <FileCard 
            key={index} 
            file={file} 
            onClick={onFileClick} 
            isSelected={isSelected(file)}
            onSelect={onSelectFile}
            selectionMode={selectionMode}
          />
        ))}
      </div>
    </>
  );
};

export default FileGrid;