
import FileSaver from 'file-saver';

export const exportDiagram = async (format: 'png' | 'svg', element: HTMLElement) => {
  const svgElement = element.querySelector('svg');
  if (!svgElement) {
    throw new Error('Could not find SVG element to export.');
  }

  // Clone the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  svgClone.style.backgroundColor = 'transparent';


  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

  if (format === 'svg') {
    FileSaver.saveAs(blob, 'sankey-diagram.svg');
  } else if (format === 'png') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      // Scale canvas for higher resolution export
      const scale = 2;
      canvas.width = svgElement.clientWidth * scale;
      canvas.height = svgElement.clientHeight * scale;
      
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      // Draw with white background for PNG
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, svgElement.clientWidth, svgElement.clientHeight);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          FileSaver.saveAs(pngBlob, 'sankey-diagram.png');
        }
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }
};
