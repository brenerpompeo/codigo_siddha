export const PILLARS = {
  PHYSICAL: {
    id: 'Physical',
    name: 'Físico',
    color: '#10b981',
    icon: 'activity',
    tags: ['Musculação', 'Cardio', 'Nutrição', 'Sono', 'Estética', 'Hidratação', 'Flexibilidade', 'Check-ups', 'Postura', 'Suplementação']
  },
  MENTAL: {
    id: 'Mental',
    name: 'Mental',
    color: '#0ea5e9',
    icon: 'brain',
    tags: ['Meditação', 'Terapia', 'Gestão Emocional', 'Resiliência', 'Autoconhecimento', 'Mindfulness', 'Ansiedade', 'Gratidão', 'Journaling', 'Respiração']
  },
  INTELLECTUAL: {
    id: 'Intellectual',
    name: 'Intelectual',
    color: '#6366f1',
    icon: 'book-open',
    tags: ['Leitura', 'Estudos', 'Idiomas', 'Escrita', 'Cursos', 'Podcasts', 'Documentários', 'Debates', 'Pesquisas', 'Mentorias']
  },
  SPIRITUAL: {
    id: 'Spiritual',
    name: 'Espiritual',
    color: '#8b5cf6',
    icon: 'sparkles',
    tags: ['Natureza', 'Oração', 'Silêncio', 'Caridade', 'Rituais', 'Propósito', 'Reflexão', 'Comunidade', 'Perdão', 'Fé']
  },
  CULTURAL: {
    id: 'Cultural',
    name: 'Cultural',
    color: '#ec4899',
    icon: 'globe',
    tags: ['Música', 'Cinema', 'Arte', 'Viagens', 'Gastronomia', 'Teatro', 'Exposições', 'Literatura', 'Fotografia', 'Dança']
  },
  PROFESSIONAL: {
    id: 'Professional',
    name: 'Profissional',
    color: '#f59e0b',
    icon: 'briefcase',
    tags: ['Projetos', 'Finanças', 'Liderança', 'Vendas', 'Networking', 'Produtividade', 'Negociação', 'Marketing', 'Inovação', 'Comunicação']
  },
  PERSONAL: {
    id: 'Personal',
    name: 'Pessoal',
    color: '#ef4444',
    icon: 'heart',
    tags: ['Família', 'Relacionamento', 'Hobbies', 'Casa', 'Amizades', 'Pets', 'Presentes', 'Filhos', 'Autocuidado', 'Lazer']
  }
} as const;

export const PILLAR_ORDER = ['Physical', 'Mental', 'Intellectual', 'Spiritual', 'Cultural', 'Professional', 'Personal'] as const;
