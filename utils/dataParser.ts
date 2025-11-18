
import { SankeyNode, SankeyLink } from '../types';
import Color from 'color';

// A simple but effective string-to-color function
const generateColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  const hex = "00000".substring(0, 6 - c.length) + c;
  
  // Ensure good contrast by desaturating and lightening
  try {
    return Color(`#${hex}`).saturate(0.5).lighten(0.1).hex();
  } catch (e) {
    return '#6366f1'; // fallback color
  }
};


export const parseSankeyData = (nodesInput: string, linksInput: string) => {
  const errors: string[] = [];
  
  const nodes: SankeyNode[] = nodesInput
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      // Support "Name, Color" format
      const parts = line.split(',');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const colorStr = parts[1].trim();
        // Basic validation or cleanup for color could go here, but letting valid CSS strings pass is flexible
        return { name, color: colorStr };
      }
      
      // Fallback to auto-generated color
      return { name: line, color: generateColor(line) };
    });

  const nodeNames = new Set(nodes.map(n => n.name));

  const links: SankeyLink[] = linksInput
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length !== 3) {
        errors.push(`Link format error on line ${index + 1}: Expected 'source,target,value'`);
        return null;
      }
      const [source, target, valueStr] = parts;
      const value = parseFloat(valueStr);

      if (!nodeNames.has(source)) errors.push(`Invalid source node "${source}" on line ${index + 1}.`);
      if (!nodeNames.has(target)) errors.push(`Invalid target node "${target}" on line ${index + 1}.`);
      if (isNaN(value) || value <= 0) errors.push(`Invalid positive value "${valueStr}" on line ${index + 1}.`);
      if (source === target) errors.push(`Self-referencing link from "${source}" to itself on line ${index + 1} is not allowed.`);
      
      return { source, target, value };
    })
    .filter((l): l is SankeyLink => l !== null);
    
  return { nodes, links, errors };
};

export const processSankeyData = (nodes: SankeyNode[], links: SankeyLink[]) => {
    const nodeIndexMap = new Map(nodes.map((node, i) => [node.name, i]));
    const processedLinks = links.map(link => ({
        source: nodeIndexMap.get(link.source)!,
        target: nodeIndexMap.get(link.target)!,
        value: link.value,
    }));
    return { nodes, links: processedLinks };
};
