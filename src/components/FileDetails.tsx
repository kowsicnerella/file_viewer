import React from 'react';
import { File, HardDrive, Calendar, Clock } from 'lucide-react';
import { FileInfo } from '../types';
import { formatFileSize } from '../utils/formatters';

interface FileDetailsProps {
  file: FileInfo;
}

const FileDetails: React.FC<FileDetailsProps> = ({ file }) => {
  return (
    <div className="bg-[rgba(44,57,48,0.7)] rounded-lg p-4 mb-4 border border-[rgba(255,255,255,0.05)] backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-3 text-[rgb(220,215,201)]">File Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start">
          <File className="w-5 h-5 text-[rgb(162,123,92)] mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[rgba(220,215,201,0.7)] text-sm">File Type</p>
            <p className="text-[rgb(220,215,201)] break-words">{file.type}</p>
          </div>
        </div>
        <div className="flex items-start">
          <HardDrive className="w-5 h-5 text-[rgb(162,123,92)] mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[rgba(220,215,201,0.7)] text-sm">Size</p>
            <p className="text-[rgb(220,215,201)]">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Calendar className="w-5 h-5 text-[rgb(162,123,92)] mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[rgba(220,215,201,0.7)] text-sm">Created</p>
            <p className="text-[rgb(220,215,201)] break-words">{file.created}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-[rgb(162,123,92)] mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[rgba(220,215,201,0.7)] text-sm">Modified</p>
            <p className="text-[rgb(220,215,201)] break-words">{file.modified}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;