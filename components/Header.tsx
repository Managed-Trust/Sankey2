
import React from 'react';
import { SankeyIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex items-center space-x-3">
        <SankeyIcon className="h-8 w-8 text-indigo-500" />
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        AI-Powered Sankey Diagram Generator
      </h1>
    </header>
  );
};
