
import React from 'react';
import { AlertIcon } from './icons';

interface InputPanelProps {
  nodesInput: string;
  setNodesInput: (value: string) => void;
  linksInput: string;
  setLinksInput: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  errors: string[];
  showValues: boolean;
  setShowValues: (value: boolean) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  nodesInput,
  setNodesInput,
  linksInput,
  setLinksInput,
  unit,
  setUnit,
  errors,
  showValues,
  setShowValues,
}) => {

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col space-y-4 overflow-y-auto h-full">
      <div>
        <label htmlFor="nodes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Nodes (one per line, optional color e.g., "Node, #ff0000")
        </label>
        <textarea
          id="nodes"
          value={nodesInput}
          onChange={(e) => setNodesInput(e.target.value)}
          rows={5}
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          placeholder="e.g., Source A&#10;Source B, #FF5733"
        />
      </div>
      <div>
        <label htmlFor="links" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Links (source, target, value)
        </label>
        <textarea
          id="links"
          value={linksInput}
          onChange={(e) => setLinksInput(e.target.value)}
          rows={10}
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          placeholder="e.g., Source A, Target B, 100"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>
            <label htmlFor="unit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Unit Label (optional)
            </label>
            <input
            type="text"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., MW, $, users"
            />
        </div>
        <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700 mt-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Values on Diagram</span>
            <button
                onClick={() => setShowValues(!showValues)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${showValues ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showValues ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md">
          <div className="flex">
            <div className="py-1"><AlertIcon className="h-5 w-5 text-red-500"/></div>
            <div className="ml-3">
              <p className="font-bold">Validation Errors</p>
              <ul className="list-disc list-inside text-sm">
                {errors.map((error, i) => <li key={i}>{error}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};