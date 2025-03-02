// File item from the list API
export interface FileItem {
  name: string;
  type: string;
  path: string;
  size: number;
  modified: number;
  is_directory?: boolean;
}

// Detailed file info from the file-info API
export interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: string;
  created: string;
  type: string;
  is_directory: boolean;
}

// Breadcrumb navigation item
export interface BreadcrumbItem {
  name: string;
  path: string;
}

// Download progress state
export interface DownloadProgress {
  isDownloading: boolean;
  progress: number;
  error: string | null;
}