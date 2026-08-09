import { PortfolioItem } from '../types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'discovery-validation',
    title: 'Product Discovery & Validation',
    description: 'Validamos hipótesis de negocio antes de escribir una línea de código.',
    icon: 'explore',
    color: '#D32F2F',
    span: 'md:col-span-2',
    details: 'Mapeo exhaustivo de usuarios, prototipado rápido, diagnóstico de negocio, análisis de unidad económica y arquitectura técnica preliminar.',
    capabilities: ['User Research', 'Diagnóstico de negocio', 'Unit Economics', 'Technical Feasibility']
  },
  {
    id: 'applied-ai',
    title: 'IA Aplicada',
    description: 'Integración de modelos para optimizar procesos y automatizar decisiones.',
    icon: 'memory',
    color: '#F57C00',
    span: 'col-span-1',
    details: 'Implementación de LLMs, modelos generativos, orquestación con Claude / n8n y automatización inteligente sobre flujos operacionales existentes.',
    capabilities: ['LLM Orchestration', 'Claude / n8n Integration', 'Voice & Text Automation']
  },
  {
    id: 'enterprise-automation',
    title: 'Automatización Empresarial',
    description: 'Eliminación de fricciones operativas e integración de datos.',
    icon: 'precision_manufacturing',
    color: '#FBC02D',
    span: 'md:col-span-2',
    details: 'Sincronización de sistemas aislados, pipelines de datos automatizados, integración de pasarelas de pago y workflows multicanal.',
    capabilities: ['API Gateways', 'Webhook Ingestion', 'ERP & CRM Sync', 'Automated Workflows']
  },
  {
    id: 'growth-optimization',
    title: 'SaaS Growth & Optimization',
    description: 'Optimización de funnels, retención y LTV para productos digitales existentes.',
    icon: 'monitoring',
    color: '#D32F2F',
    span: 'md:col-span-2',
    details: 'Análisis cohortes, A/B Testing continuo, diseño de onboarding con baja fricción y estrategias de monetización orientadas a reducir el Churn Rate.',
    capabilities: ['A/B Experiments', 'Retention Funnels', 'PLG (Product-Led Growth)', 'LTV Expansion']
  }
];

