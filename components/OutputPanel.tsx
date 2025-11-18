
import React, { useState, createRef, RefObject } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { SankeyData, ExportFormat, Chat } from '../types';
import { ChartIcon, AnalyzeIcon, ChatIcon, DownloadIcon, CsvIcon, MarkdownIcon, MermaidIcon } from './icons';

interface OutputPanelProps {
  sankeyData: SankeyData;
  unit: string;
  analysisResult: string;
  chatHistory: Chat[];
  onExport: (format: ExportFormat) => void;
  onAnalyze: () => void;
  onChatSubmit: (message: string) => void;
  isLoading: Record<string, boolean>;
  sankeyRef: RefObject<HTMLDivElement>;
  customNode: React.ReactElement;
  customLink?: React.ReactElement;
}

type Tab = 'diagram' | 'analysis' | 'chat';

export const OutputPanel: React.FC<OutputPanelProps> = ({
  sankeyData,
  unit,
  analysisResult,
  chatHistory,
  onExport,
  onAnalyze,
  onChatSubmit,
  isLoading,
  sankeyRef,
  customNode,
  customLink
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('diagram');
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onChatSubmit(chatInput);
      setChatInput('');
    }
  };

  const TabButton: React.FC<{ tab: Tab; label: string; icon: React.ReactElement }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        activeTab === tab
          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col h-[85vh] lg:h-auto">
      <div className="border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
        <nav className="flex -mb-px">
          <TabButton tab="diagram" label="Diagram" icon={<ChartIcon className="h-5 w-5" />} />
          <TabButton tab="analysis" label="AI Analysis" icon={<AnalyzeIcon className="h-5 w-5" />} />
          <TabButton tab="chat" label="AI Chat" icon={<ChatIcon className="h-5 w-5" />} />
        </nav>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {activeTab === 'diagram' && (
          <div className="h-full w-full flex flex-col">
            <div className="flex flex-wrap justify-end items-center gap-2 mb-2">
                <button onClick={() => onExport('png')} className="flex items-center gap-1 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300" title="Export as PNG">
                    <DownloadIcon className="h-4 w-4" /> .png
                </button>
                <button onClick={() => onExport('svg')} className="flex items-center gap-1 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300" title="Export as SVG">
                    <DownloadIcon className="h-4 w-4" /> .svg
                </button>
                <button onClick={() => onExport('csv')} className="flex items-center gap-1 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300" title="Export as CSV">
                    <CsvIcon className="h-4 w-4" /> .csv
                </button>
                <button onClick={() => onExport('markdown')} className="flex items-center gap-1 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300" title="Export as Markdown">
                    <MarkdownIcon className="h-4 w-4" /> .md
                </button>
                <button onClick={() => onExport('mermaid')} className="flex items-center gap-1 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300" title="Export as Mermaid">
                    <MermaidIcon className="h-4 w-4" /> .mermaid
                </button>
            </div>
            <div ref={sankeyRef} className="flex-grow min-h-[400px]">
                {sankeyData.nodes.length > 0 && sankeyData.links.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <Sankey 
                            data={sankeyData} 
                            node={customNode} 
                            link={customLink}
                            nodePadding={50} 
                            margin={{ top: 20, right: 150, bottom: 20, left: 150 }}
                        >
                            <Tooltip formatter={(value) => [`${value.toLocaleString()} ${unit}`, 'Value']} />
                        </Sankey>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">Enter valid node and link data to render the diagram.</div>
                )}
            </div>
          </div>
        )}
        {activeTab === 'analysis' && (
          <div>
            <button onClick={onAnalyze} disabled={isLoading.analysis} className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors mb-4">
              {isLoading.analysis ? 'Analyzing...' : 'Generate Deep Analysis (Gemini 2.5 Pro)'}
            </button>
            {analysisResult && <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} />}
          </div>
        )}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg p-3 rounded-lg ${chat.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                    <p className="text-sm whitespace-pre-wrap">{chat.parts[0].text}</p>
                  </div>
                </div>
              ))}
               {isLoading.chat && <div className="flex justify-start"><div className="max-w-lg p-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"><span className="animate-pulse">...</span></div></div>}
            </div>
            <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about the data..." className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700" />
              <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
