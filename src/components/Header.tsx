import React from 'react';
import { HardDrive, CheckSquare, X } from 'lucide-react';
import SearchBar from './SearchBar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectionMode: boolean;
  onToggleSelectionMode: () => void;
  selectedCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange,
  selectionMode,
  onToggleSelectionMode,
  selectedCount
}) => {
  return (
    <header className="bg-[rgba(44,57,48,0.85)] backdrop-blur-md border-b border-[rgba(255,255,255,0.1)] p-4 shadow-md sticky top-0 z-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl font-bold flex items-center text-[rgb(220,215,201)]">
            <HardDrive className="mr-2" /> File Explorer
          </h1>
          
          <button 
            onClick={onToggleSelectionMode}
            className={`
              ml-4 p-2 rounded-lg flex items-center gap-1
              ${selectionMode 
                ? 'bg-[rgba(162,123,92,0.3)] text-[rgb(162,123,92)]' 
                : 'bg-[rgba(255,255,255,0.1)] text-[rgb(220,215,201)]'
              }
              hover:bg-[rgba(255,255,255,0.15)] transition-colors
            `}
            aria-label={selectionMode ? "Exit selection mode" : "Enter selection mode"}
          >
            {selectionMode ? (
              <>
                <X size={18} />
                <span className="hidden sm:inline">Cancel</span>
                {selectedCount > 0 && (
                  <span className="ml-1 bg-[rgb(162,123,92)] text-[rgb(220,215,201)] px-2 py-0.5 rounded-full text-xs">
                    {selectedCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <CheckSquare size={18} />
                <span className="hidden sm:inline">Select</span>
              </>
            )}
          </button>
        </div>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
    </header>
  );
};

export default Header;