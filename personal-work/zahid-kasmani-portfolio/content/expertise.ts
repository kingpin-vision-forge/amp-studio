import type { ExpertiseGroup, Lens } from './types';

export const expertise: ExpertiseGroup[] = [
  { group: { en: 'Strategic Finance and Leadership' }, items: ['Islamic banking', 'Treasury and asset management', 'M&A advisory and deal structuring (SPVs, sukuk)', 'Structured debt and equity funding', 'Project finance', 'Capital raising (debt and equity)', 'Budgeting, forecasting, and funds transfer pricing', 'Credit ratings', 'Risk and regulatory compliance (Basel III, ICAAP, FATCA)'] },
  { group: { en: 'Operational Excellence and Transformation' }, items: ['Corporate strategy formulation', 'Business model optimization', 'Cost reduction and process re-engineering', 'Enterprise performance management', 'Multi-subsidiary consolidation', 'ALM, liquidity, and risk oversight', 'MIS, dashboards, and BI-driven decision support', 'Data-driven decision making'] },
  { group: { en: 'Technology and Systems' }, items: ['ERP implementation (Oracle, Yardi)', 'BI tools (Power BI, SAP/Oracle analytics, Business Objects, Excel VBA, SQL)', 'Optimization and automation', 'Treasury, asset, and fund management platforms', 'Financial modeling and advanced Excel', 'Programming foundations (C++, Java, e-commerce systems)'] },
  { group: { en: 'Leadership and Governance' }, items: ['Trusted partner to Board, CEO, and C-suite', 'Governance and strategic advisory roles', 'Cross-functional leadership', 'Change management', 'Talent development', 'Team building'] },
];

export const technicalSkills = [
  'BI tools, Oracle ERP, Yardi, Business Objects, SQL, Excel VBA',
  'Financial and business modeling',
  'Banking and asset management systems',
  'E-commerce development (C++, Java)',
];

/**
 * Lens mapping used only by the era filter to decide whether a tag is dimmed.
 * Not rendered. Keyed by the group index of `expertise` above.
 */
export const expertiseLenses: Lens[][] = [
  ['capital', 'governance'],
  ['operations', 'transformation', 'governance'],
  ['transformation'],
  ['governance', 'people'],
];
