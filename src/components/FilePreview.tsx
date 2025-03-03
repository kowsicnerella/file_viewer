import { FileInfo } from '../types';
import FileIcon from './FileIcon';


interface FilePreviewProps {
  file: FileInfo;
}


const FilePreview: React.FC<FilePreviewProps> = ({ file, onImageLoad }) => {
  const API_BASE_URL = 'https://6qzkd2jm-8000.inc1.devtunnels.ms/api';
  if (file.type.startsWith('image/')) {
    return (
      <div className="flex justify-center">
        <img 
          src ={`${API_BASE_URL}/file/${file.path}`}
          alt={file.name}
          className="max-w-full max-h-[40vh] sm:max-h-[50vh] rounded-lg shadow-lg object-contain"
          loading="lazy"
          onLoad={onImageLoad}
        />
      </div>
    );
  } else if (file.type.startsWith("video/")) {
    return (
      <div className="flex justify-center">
        <video
          key={file.path}  // Unique key forces remount when file.path changes
          controls
          className="w-full max-w-2xl rounded-lg shadow-lg aspect-video border border-[rgba(255,255,255,0.05)]"
        >
          <source src ={`${API_BASE_URL}/file/${file.path}`} type={file.type} />
          Your browser does not support the video tag.
        </video>
      </div>
      )} else if (file.type === "application/pdf") {
        return (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-[rgba(44,57,48,0.7)] rounded-lg shadow-lg aspect-[3/4] border border-[rgba(255,255,255,0.05)] overflow-hidden">
              <embed
                src ={`${API_BASE_URL}/file/${file.path}`}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>
        );
      } else {
    // Generic file preview
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-[rgba(44,57,48,0.7)] rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center border border-[rgba(255,255,255,0.05)]">
          <FileIcon fileType={file.type.split('/')[0]} fileName={file.name} filePath={file.path} size={16} />
          <p className="text-[rgba(220,215,201,0.7)] mt-4 text-center">No preview available for this file type</p>
        </div>
      </div>
    );
  }
};

export default FilePreview;