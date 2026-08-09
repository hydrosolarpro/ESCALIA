import { Channel } from '../types';

export const CHANNELS_DATA: Channel[] = [
  {
    id: 'canal-01',
    code: 'Canal 01',
    title: 'Productos Propios',
    description: 'Aplicaciones móviles, desarrollo web y comunidad de aprendizaje con cursos en línea. Construidos y operados enteramente por los desarrolladores.',
    fullDetails: 'Iniciativas SaaS e infraestructura digital desarrollada internamente. Caso de Éxito destacado: App Sistema de retiro para negocios de comida rápida. Incluye sesiones de Administrador y clientes con automatizaciones de procesos de pedidos, registro de menú, establecimiento de horarios, precios, Dashboard de pedidos y ganancias del negocio, carga de comprobantes de pago y flujo de proceso en tiempo real desde la solicitud hasta la entrega. Integración API / Google Auth / Supabase / GitHub / Vercel.',
    tags: ['B2C', 'SaaS Internal', 'App Comida Rápida'],
    color: '#D32F2F',
    bgColor: 'bg-[#D32F2F]/10',
    icon: 'apps',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwlC1_hPEDYuZU9Vtwvk4xOj5rxOccB9B-bWNIgiA5lNbhtL9tvBLJXOt17Gzl1fsoRKN9IzOOLi9bT-QxNu-LTarqavrXnXk2bWfd7HhCSifpph3McaMnPVc_UCJSkhd5Mm0CvVJV8JTHoMKVeG3bZo5WX6TAQG6COQjtFLDqPjukGVxlSMH_SuoBcuo1vR8EQHprqZ7-cYwnHAB7Gsg3pGht21Ep9N2tDWormgtlHSV62oMD5mbavQ',
    caseStudyTitle: 'App Sistema de retiro para negocios de comida rápida',
    caseStudyMetrics: ['Sesiones Administrador & Clientes', 'Dashboard Ganancias & Pedidos en Tiempo Real', 'Google Auth / Supabase / GitHub / Vercel']
  },
  {
    id: 'canal-02',
    code: 'Canal 02',
    title: 'SaaS para PyMEs',
    description: 'Soluciones SaaS preestablecidas y empaquetadas para necesidades específicas, entregadas por expertos con experticia en el dominio.',
    fullDetails: 'SaaS listos para implementar con micro-personalizaciones por sector. Caso de Éxito destacado: SaaS Remesas Perú-Venezuela. Incluye aplicativo móvil online para operador dueño de negocio, operadores de Perú (miembros-comisionistas) y operadores de Venezuela (comisionistas). Cuenta con validaciones automáticas en tiempo real de solicitudes de clientes en Perú, operaciones en curso, realizadas, derivadas y por revisión, carga de comprobante de depósito (Perú/Venezuela), registro de clientes automático, estadísticas con filtros de búsqueda por fechas, cálculo de ganancias del negocio y de comisiones (bruta y neta), registro de operadores y notificaciones vía WhatsApp (wa.me) y Telegram para comunicaciones entre las partes.',
    tags: ['Suscripción', 'B2B Vertical', 'Plug & Play'],
    color: '#F57C00',
    bgColor: 'bg-[#F57C00]/10',
    icon: 'storefront',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCQnZz3w6gHyYN7zmfOhszVXEBxGTiepvo9iDhPjAX8CnOXp9we9ywdx7d2872QkoN7ktWw41G4QOlcduHMIVoXyWDdMOuqOzOHdf82CzV50_SfQLecSTCRA9HwZRVSHMdG938T8FnIDE2eeE7Owvzd65EG2PxlHk3TDjYboOUzwXM_T0zW1PN_lTEtdE5edZaX8EBMQPFX2_0RjWeIi0VeTzoLblhdBp0ekEo3b3hP83uMtcWXTBPNw',
    caseStudyTitle: 'SaaS Remesas Perú-Venezuela',
    caseStudyMetrics: ['Multi-Operador Perú & Venezuela', 'Validación Automática & Reportes', 'Integración WhatsApp (wa.me) & Telegram']
  },
  {
    id: 'canal-03',
    code: 'Canal 03',
    title: 'SaaS a Medida (Enterprise)',
    description: 'Soluciones diseñadas caso por caso para empresas con procesos complejos, integración tecnológica y necesidad de acompañamiento experto (Discovery, UX/UI, IA).',
    fullDetails: 'Construcción de software de alta exigencia para corporativos e industrias reguladas. Incluye fase completa de Product Discovery, arquitectura cloud resiliente, microservicios, seguridad avanzada e integraciones API personalizadas.',
    tags: ['Custom Dev', 'Arquitectura', 'Enterprise AI'],
    color: '#FBC02D',
    bgColor: 'bg-[#FBC02D]/10',
    icon: 'corporate_fare',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACfmJJ72lwCVDDpK1aQxln74nLQV5gdiR-oSR1M4bjLMkOjyDQmf_y7rBAik9y4HG8p7slZMCX2gBj7KvTUvG3wZ5VdSd4RqL-XW2y5STeiDl9JgshZ895ZcGTiyPRmg-_q2sXmwi_xDAR10EBOfOCz9_sz7Wqvk1hULLAN8c-2lpC0BhuVju8-TtP_dsqOdEcYBR3A07SRryQ8VNnlw0UFfaFFdax5S2EgRAVsj0EITxhMigqeJ_zLw',
    caseStudyTitle: 'SaaS Sistemas de Bombeo solar / SaaS Sistemas Fotovoltaico',
    caseStudyMetrics: ['Integración API / Google Auth / Supabase / GitHub / Vercel', 'Certificación de Seguridad & Alta Eficiencia']
  },
  {
    id: 'canal-04',
    code: 'Canal 04',
    title: 'Growth Partner SaaS',
    description: 'Nos integramos en tu negocio para escalar ventas y optimizar rentabilidad, alineando nuestra compensación con resultados.',
    fullDetails: 'Modelo donde asumimos riesgo compartido. Nos sumamos como brazo de Growth & Producto técnico, optimizando conversiones, churn, LTV, automatización de marketing y funnels para escalar facturación a cambio de un porcentaje de crecimiento.',
    tags: ['Performance', 'Analytics', 'Revenue Share'],
    color: '#D32F2F',
    bgColor: 'bg-[#D32F2F]/20',
    icon: 'insights',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC70JIe8tRTTLNpAQ5zr38mjQ0zB8TD5XecAAxAumsVg8rf3KDqkzTti_gp78FLolVbq4iHsIWxmA-8VKJUhn6AT_C5-xY3WPVfrCnSy6teocpsfRJNZG3alI_U7D2f70mZz4jspidMMsKILi-qEKuLTNZW0vTJbZTSK2QwyVYxF6gJoxm9f9NDlgyyxC7WXlx-kwC0KMfRJUWCiPIs9kTk_TjAUDffmw0txdpJ8HihomEr_VvCELBOuw'
  }
];

