import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        placeholder="Search files..."
        className="w-full bg-[rgba(63,79,68,0.7)] text-[rgb(220,215,201)] px-4 py-2 pl-10 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[rgb(162,123,92)] 
                  placeholder-[rgba(220,215,201,0.5)]
                  border border-[rgba(255,255,255,0.1)]
                  backdrop-blur-sm
                  transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 text-[rgba(220,215,201,0.7)]" size={18} />
    </div>
  );
};

export default SearchBar;