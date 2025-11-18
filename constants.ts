
export const DEFAULT_NODES = `
Lead Generation
Direct Traffic
Referral Program
Website Visit
Email Inquiry
Product Demo
Sales Call
Negotiation
Closed Won
Closed Lost
Churn
`.trim();

export const DEFAULT_LINKS = `
Lead Generation,Website Visit,500
Direct Traffic,Website Visit,300
Website Visit,Closed Lost,400
Website Visit,Email Inquiry,200
Website Visit,Product Demo,200
Email Inquiry,Sales Call,150
Email Inquiry,Closed Lost,50
Product Demo,Sales Call,150
Product Demo,Closed Lost,50
Referral Program,Negotiation,50
Sales Call,Negotiation,250
Sales Call,Closed Lost,50
Negotiation,Closed Won,200
Negotiation,Closed Lost,100
Closed Won,Churn,20
`.trim();

export const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6'],
  corporate: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#9ca3af'],
  warm: ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#ea580c', '#d97706'],
  cool: ['#2563eb', '#0284c7', '#0891b2', '#0d9488', '#4f46e5', '#6366f1'],
  nature: ['#16a34a', '#65a30d', '#d97706', '#059669', '#0891b2', '#84cc16'],
};
