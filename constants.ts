
export const DEFAULT_NODES = `
Energy Source
Solar
Wind
Geothermal
Hydroelectric
Nuclear
Fossil Fuels
Grid Storage
Residential Use
Commercial Use
Industrial Use
Transportation
Energy Loss
`.trim();

export const DEFAULT_LINKS = `
Energy Source,Solar,80
Energy Source,Wind,120
Energy Source,Geothermal,50
Energy Source,Hydroelectric,90
Energy Source,Nuclear,200
Energy Source,Fossil Fuels,400
Solar,Grid Storage,10
Solar,Residential Use,20
Solar,Commercial Use,30
Solar,Energy Loss,20
Wind,Grid Storage,25
Wind,Commercial Use,45
Wind,Industrial Use,30
Wind,Energy Loss,20
Geothermal,Residential Use,10
Geothermal,Commercial Use,20
Geothermal,Industrial Use,15
Geothermal,Energy Loss,5
Hydroelectric,Grid Storage,10
Hydroelectric,Residential Use,30
Hydroelectric,Commercial Use,40
Hydroelectric,Energy Loss,10
Nuclear,Grid Storage,40
Nuclear,Industrial Use,150
Nuclear,Energy Loss,10
Fossil Fuels,Grid Storage,50
Fossil Fuels,Commercial Use,80
Fossil Fuels,Industrial Use,100
Fossil Fuels,Transportation,120
Fossil Fuels,Energy Loss,50
Grid Storage,Residential Use,40
Grid Storage,Commercial Use,50
Grid Storage,Industrial Use,40
Grid Storage,Energy Loss,5
`.trim();

export const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6'],
  corporate: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#9ca3af'],
  warm: ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#ea580c', '#d97706'],
  cool: ['#2563eb', '#0284c7', '#0891b2', '#0d9488', '#4f46e5', '#6366f1'],
  nature: ['#16a34a', '#65a30d', '#d97706', '#059669', '#0891b2', '#84cc16'],
};
