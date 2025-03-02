import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <div className="flex items-center flex-wrap gap-1 text-sm text-[rgba(220,215,201,0.7)] mb-4 bg-[rgba(44,57,48,0.7)] backdrop-blur-sm p-2 rounded-lg border border-[rgba(255,255,255,0.1)]">
      <button 
        onClick={() => onNavigate('')}
        className="flex items-center hover:text-[rgb(162,123,92)] transition-colors"
      >
        <Home size={16} className="mr-1" />
        Home
      </button>
      
      {items.length > 0 && (
        <ChevronRight size={14} className="mx-1 text-[rgba(220,215,201,0.4)]" />
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <button
            onClick={() => onNavigate(item.path)}
            className={`hover:text-[rgb(162,123,92)] transition-colors ${
              index === items.length - 1 ? 'text-[rgb(162,123,92)] font-medium' : ''
            }`}
          >
            {item.name}
          </button>
          
          {index < items.length - 1 && (
            <ChevronRight size={14} className="mx-1 text-[rgba(220,215,201,0.4)]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;