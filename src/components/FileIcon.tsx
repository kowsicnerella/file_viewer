import React from 'react';
import { FileText, Video, File } from 'lucide-react';

interface FileIconProps {
  fileType: string;
  fileName: string;
  size?: number;
  filePath: string | null;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, fileName, size = 12, filePath=''}) => {
  const sizeClass = `w-${size} h-${size}`;

if (fileType.startsWith('image/')){
    return (<img 
    // src={`https://6qzkd2jm-8000.inc1.devtunnels.ms/api/file/${file.path}`}
    src={`http://127.0.0.1:8000/api/preview/${filePath}`}
    className="max-w-full max-h-[400vh] sm:max-h-[500vh] rounded-sm shadow-lg object-contain"
    loading="lazy"
  />);
  } else if (fileType === 'video') {
    return <Video className={`${sizeClass} text-[rgb(162,123,92)]`} />;
  } else {
    // Determine file type based on extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FileText className={`${sizeClass} text-[rgb(162,123,92)]`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${sizeClass} text-[rgb(220,215,201)]`} />;
      case 'xls':
      case 'xlsx':
        return <FileText className={`${sizeClass} text-[rgb(220,215,201)]`} />;
      case 'ppt':
      case 'pptx':
        return <FileText className={`${sizeClass} text-[rgb(162,123,92)]`} />;
      case 'txt':
        return <FileText className={`${sizeClass} text-[rgb(220,215,201)]`} />;
      default:
        return <File className={`${sizeClass} text-[rgb(220,215,201)]`} />;
    }
  }
};

export default FileIcon;