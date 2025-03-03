import React from 'react';
import { useEffect, useState, useRef } from "react";
import { FileText, Video, File } from 'lucide-react';

interface FileIconProps {
  fileType: string;
  fileName: string;
  size?: number;
  filePath: string | null;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, fileName, filePath, size = 12 }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const sizeClass = `w-${size} h-${size}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a delay before loading the image
            setTimeout(() => {
              setImageSrc(`https://6qzkd2jm-8000.inc1.devtunnels.ms/api/preview/${filePath}`);
              observer.disconnect(); // Stop observing after image is set
            }, 50); // Adjust delay (1000ms = 1 second)
          }
        });
      },
      { threshold: 0.5 } // Load when 50% of the image is visible
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect(); // Cleanup
  }, [filePath]);

  if (fileType.startsWith("image/")) {
    return (
      <img
        ref={imageRef}
        src={imageSrc || ""}
        className="max-w-full max-h-[400vh] sm:max-h-[500vh] rounded-sm shadow-lg object-contain"
        loading="lazy"
      />
    );
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