
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { SankeyData, SankeyNode, SankeyLink, ExportFormat, Chat, Message, ToastProps, LinkColorMode, PaletteName } from './types';
import { parseSankeyData, processSankeyData } from './utils/dataParser';
import { exportDiagram } from './utils/exporter';
import { getDeepAnalysis, getChatResponse, generateTextFormat } from './services/geminiService';
import { Sankey, Tooltip, Layer, Rectangle, ResponsiveContainer } from 'recharts';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { DEFAULT_NODES, DEFAULT_LINKS, COLOR_PALETTES } from './constants';

// Define a custom node component for recharts
const CustomSankeyNode = ({ x, y, width, height, index, payload, containerWidth, showValues, unit }: any) => {
  if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) return null;
  const isOut = x + width / 2 > containerWidth / 2;
  const nodeName = payload?.name || '';

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle x={x} y={y} width={width} height={height} fill={payload.color || '#6366f1'} fillOpacity="1" />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        fill="#334155"
        className="dark:fill-slate-300 pointer-events-none"
        alignmentBaseline="middle"
      >
        {nodeName} {showValues && <tspan fillOpacity="0.6" fontSize="12">({payload.value} {unit})</tspan>}
      </text>
    </Layer>
  );
};

const CustomSankeyLink = ({ sourceX, targetX, sourceY, targetY, linkWidth, index, payload, linkColorMode }: any) => {
  if (
    isNaN(sourceX) || isNaN(targetX) || 
    isNaN(sourceY) || isNaN(targetY) || 
    isNaN(linkWidth)
  ) return null;

  const sourceControlX = sourceX + (targetX - sourceX) * 0.5;
  const targetControlX = targetX - (targetX - sourceX) * 0.5;

  const d = `
    M${sourceX},${sourceY + linkWidth / 2}
    C${sourceControlX},${sourceY + linkWidth / 2} ${targetControlX},${targetY + linkWidth / 2} ${targetX},${targetY + linkWidth / 2}
    L${targetX},${targetY - linkWidth / 2}
    C${targetControlX},${targetY - linkWidth / 2} ${sourceControlX},${sourceY - linkWidth / 2} ${sourceX},${sourceY - linkWidth / 2}
    Z
  `;

  const sourceColor = payload?.source?.color || '#94a3b8';
  const targetColor = payload?.target?.color || '#94a3b8';
  const gradientId = `linkGradient-${index}`;

  // Link Color Logic
  let fill = '#cbd5e1'; // default solid slate-300
  let fillOpacity = 0.5;
  let stroke = 'none';

  if (linkColorMode === 'gradient') {
    fill = `url(#${gradientId})`;
    fillOpacity = 0.5;
  } else if (linkColorMode === 'source') {
    fill = sourceColor;
    fillOpacity = 0.4;
  } else if (linkColorMode === 'solid') {
    fill = '#cbd5e1'; // slate-300
    fillOpacity = 0.4;
    // Dark mode adjustment could be done via CSS class or context, but inline styles are strictly computed here.
    // For a simple solid mode, standard grey is fine.
  }

  return (
    <Layer key={`CustomLink${index}`}>
      {linkColorMode === 'gradient' && (
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={sourceColor} />
            <stop offset="100%" stopColor={targetColor} />
          </linearGradient>
        </defs>
      )}
      <path
        d={d}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        onMouseEnter={(e) => {
             e.currentTarget.style.fillOpacity = '0.7';
        }}
        onMouseLeave={(e) => {
             e.currentTarget.style.fillOpacity = String(fillOpacity);
        }}
        className="transition-opacity duration-200 cursor-pointer"
      />
    </Layer>
  );
};


export default function App() {
  const [nodesInput, setNodesInput] = useState<string>(DEFAULT_NODES);
  const [linksInput, setLinksInput] = useState<string>(DEFAULT_LINKS);
  const [unit, setUnit] = useState<string>('TWh');
  const [showValues, setShowValues] = useState<boolean>(true);
  
  // Visual Settings
  const [linkColorMode, setLinkColorMode] = useState<LinkColorMode>('gradient');
  const [selectedPalette, setSelectedPalette] = useState<PaletteName>('default');

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    analysis: false,
    chat: false,
    export: false,
  });

  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([
    { role: 'model', parts: [{ text: "Hello! I'm your Sankey assistant. How can I help you with this data?" }] }
  ]);
  
  const [toast, setToast] = useState<ToastProps | null>(null);

  const sankeyRef = useRef<HTMLDivElement>(null);

  const { data, errors } = useMemo(() => {
    const palette = COLOR_PALETTES[selectedPalette] || [];
    const { nodes, links, errors: validationErrors } = parseSankeyData(nodesInput, linksInput, palette);
    if (validationErrors.length > 0) {
      return { data: { nodes: [], links: [] }, errors: validationErrors };
    }
    return { data: processSankeyData(nodes, links), errors: [] };
  }, [nodesInput, linksInput, selectedPalette]);

  const handleGenerate = useCallback(async (type: 'analysis' | 'export' | 'chat', payload?: any) => {
    setIsLoading(prev => ({ ...prev, [type]: true }));
    setToast(null);

    try {
      if (type === 'analysis') {
        const result = await getDeepAnalysis(data.nodes, data.links);
        setAnalysisResult(result);
      } else if (type === 'chat') {
        const userMessage = payload.message;
        setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
        const stream = await getChatResponse(chatHistory, userMessage, data);
        let fullResponse = '';
        setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: fullResponse }] };
            return newHistory;
          });
        }
      } else if (type === 'export') {
        const format: ExportFormat = payload.format;
        if (format === 'png' || format === 'svg') {
          if (sankeyRef.current) {
            await exportDiagram(format, sankeyRef.current);
          }
        } else {
          const textOutput = await generateTextFormat(format, data);
          const blob = new Blob([textOutput], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sankey-diagram.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } 
      
      if (type !== 'chat') {
        setToast({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`, type: 'success' });
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setToast({ message: `Failed to generate ${type}: ${errorMessage}`, type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [data, chatHistory]);

  const memoizedCustomNode = useMemo(() => (
    <CustomSankeyNode 
      showValues={showValues} 
      unit={unit} 
    />
  ), [showValues, unit]);
  
  const memoizedCustomLink = useMemo(() => (
    <CustomSankeyLink
      linkColorMode={linkColorMode}
    />
  ), [linkColorMode]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <InputPanel
          nodesInput={nodesInput}
          setNodesInput={setNodesInput}
          linksInput={linksInput}
          setLinksInput={setLinksInput}
          unit={unit}
          setUnit={setUnit}
          errors={errors}
          showValues={showValues}
          setShowValues={setShowValues}
          linkColorMode={linkColorMode}
          setLinkColorMode={setLinkColorMode}
          selectedPalette={selectedPalette}
          setSelectedPalette={setSelectedPalette}
        />
        <OutputPanel
          sankeyData={data}
          unit={unit}
          analysisResult={analysisResult}
          chatHistory={chatHistory}
          onExport={(format: ExportFormat) => handleGenerate('export', { format })}
          onAnalyze={() => handleGenerate('analysis')}
          onChatSubmit={(message: string) => handleGenerate('chat', { message })}
          isLoading={isLoading}
          sankeyRef={sankeyRef}
          customNode={memoizedCustomNode}
          customLink={memoizedCustomLink}
        />
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
