import { FileItem } from '../types';

/**
 * Sort files by type in the following order:
 * 1. Folders
 * 2. Images
 * 3. Videos
 * 4. Other files
 */
export const sortFilesByType = (files: FileItem[]): FileItem[] => {
  return [...files].sort((a, b) => {
    // Helper function to get file type priority
    const getTypePriority = (file: FileItem): number => {
      if (file.type === 'folder' || file.is_directory) return 1; // Folders first
      
      const fileType = file.type.toLowerCase();
      if (fileType.startsWith('image/') || fileType === 'image') return 2; // Images second
      if (fileType.startsWith('video/') || fileType === 'video') return 3; // Videos third
      return 4; // Other files last
    };

    const priorityA = getTypePriority(a);
    const priorityB = getTypePriority(b);

    // Sort by type priority first
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If same type, sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
};