
export const DEFAULT_NODES = `
Traffic Sources
Organic Search
Paid Ads
Email Campaign
Landing Page
Product Page
Webinar
Demo Request
Unqualified Lead
Sales Call
Proposal
Negotiation
Closed Won
Closed Lost
Referral
Upsell
`.trim();

export const DEFAULT_LINKS = `
Traffic Sources,Landing Page,1000
Organic Search,Product Page,800
Paid Ads,Landing Page,500
Paid Ads,Product Page,300
Email Campaign,Webinar,400
Landing Page,Demo Request,300
Landing Page,Closed Lost,1200
Product Page,Demo Request,200
Product Page,Closed Lost,900
Webinar,Demo Request,100
Webinar,Sales Call,150
Webinar,Closed Lost,150
Demo Request,Sales Call,400
Demo Request,Unqualified Lead,100
Demo Request,Closed Lost,100
Sales Call,Proposal,250
Sales Call,Closed Lost,300
Proposal,Negotiation,150
Proposal,Closed Won,50
Proposal,Closed Lost,50
Referral,Negotiation,50
Negotiation,Closed Won,150
Negotiation,Closed Lost,50
Closed Won,Upsell,50
`.trim();

export const COLOR_PALETTES: Record<string, string[]> = {
  default: ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6'],
  corporate: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#9ca3af'],
  warm: ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#ea580c', '#d97706'],
  cool: ['#2563eb', '#0284c7', '#0891b2', '#0d9488', '#4f46e5', '#6366f1'],
  nature: ['#16a34a', '#65a30d', '#d97706', '#059669', '#0891b2', '#84cc16'],
};
