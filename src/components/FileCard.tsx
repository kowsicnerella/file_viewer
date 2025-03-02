import React from 'react';
import { Clock, Folder, Check } from 'lucide-react';
import { FileItem } from '../types';
import { formatFileSize, formatDate } from '../utils/formatters';
import FileIcon from './FileIcon';

interface FileCardProps {
  file: FileItem;
  onClick: (file: FileItem) => void;
  isSelected: boolean;
  onSelect: (file: FileItem, isSelected: boolean) => void;
  selectionMode: boolean;
}

const FileCard: React.FC<FileCardProps> = ({ 
  file, 
  onClick, 
  isSelected, 
  onSelect,
  selectionMode
}) => {
  const isFolder = file.type === 'folder' || file.is_directory;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectionMode) {
      onSelect(file, !isSelected);
    } else {
      onClick(file);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(file, !isSelected);
  };

  return (
    <div 
      className={`
        relative rounded-lg overflow-hidden shadow-lg 
        transform transition-all duration-200 cursor-pointer
        backdrop-blur-md border border-[rgba(255,255,255,0.1)]
        ${isSelected 
          ? 'bg-[rgba(162,123,92,0.3)] shadow-[0_0_15px_rgba(162,123,92,0.3)]' 
          : 'bg-[rgba(63,79,68,0.9)] hover:bg-[rgba(63,79,68,1)] hover:shadow-xl hover:scale-[1.02]'
        }
      `}
      onClick={handleClick}
    >
      {/* Selection Checkbox */}
      <div 
        className={`
          absolute top-2 right-2 z-10 
          ${selectionMode ? 'opacity-100' : 'opacity-0'} 
          transition-opacity duration-200
        `}
        onClick={handleCheckboxClick}
      >
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${isSelected 
            ? 'bg-[rgb(162,123,92)] text-[rgb(220,215,201)]' 
            : 'bg-[rgba(220,215,201,0.2)] text-transparent hover:bg-[rgba(220,215,201,0.3)]'
          }
          transition-colors duration-200
        `}>
          <Check size={16} className={isSelected ? 'opacity-100' : 'opacity-0'} />
        </div>
      </div>

<div className="p-6 flex flex-col items-center">
  {isFolder ? (
    <Folder className="w-12 h-12 text-[rgb(220,215,201)]" />
  ) : (
    <FileIcon fileType={file.type} fileName={file.name} filePath={file.path} size={12} />
  )}

  {/* Show file name only if it's NOT an image */}
  {!file.type.startsWith("image/") && (
    <h3
      className="mt-4 font-medium text-lg text-center truncate w-full text-[rgb(220,215,201)]"
      title={file.name}
    >
      {file.name}
    </h3>
  )}
</div>

      <div className="bg-[rgba(44,57,48,0.7)] px-4 py-3">
        <div className="flex justify-between text-sm text-[rgba(220,215,201,0.7)]">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {formatDate(file.modified)}
          </div>
          <div>{isFolder ? 'Folder' : formatFileSize(file.size)}</div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;