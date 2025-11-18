
export interface SankeyNode {
  name: string;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface ProcessedLink {
    source: number;
    target: number;
    value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: ProcessedLink[];
}

export type ExportFormat = 'png' | 'svg' | 'markdown' | 'csv' | 'mermaid';

export interface Message {
  text: string;
}

export interface Chat {
  role: 'user' | 'model';
  parts: Message[];
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export type LinkColorMode = 'gradient' | 'source' | 'solid';

export type PaletteName = 'default' | 'corporate' | 'warm' | 'cool' | 'nature';
