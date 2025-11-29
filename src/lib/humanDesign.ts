// import { Database } from '@/types/database.types';

// For now we will define types here until we have the generated types
export type HDType = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';

export interface BirthData {
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM'
  location: string;
}

export interface HDResult {
  type: HDType;
  strategy: string;
  authority: string;
  profile: string;
  centers: {
    head: boolean;
    ajna: boolean;
    throat: boolean;
    g: boolean;
    heart: boolean;
    sacral: boolean;
    solar: boolean;
    spleen: boolean;
    root: boolean;
  };
}

// Mock calculation (substituir por API real ou biblioteca)
export const calculateHumanDesign = async (birthData: BirthData): Promise<HDResult> => {
  // Simula chamada a API externa (ex: MyBodyGraph API)
  // Em produção, usar: https://mybodygraph.com/free-bodygraph-chart

  console.log('Calculating Human Design for:', birthData);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simula loading

  // Mock data (substituir por cálculo real)
  return {
    type: 'Generator',
    strategy: 'Aguardar para Responder',
    authority: 'Sacral',
    profile: '5/1',
    centers: {
      head: true,
      ajna: false,
      throat: true,
      g: true,
      heart: false,
      sacral: true,
      solar: false,
      spleen: true,
      root: true
    }
  };
};

export const getStrategyPrompt = (type: HDType): string => {
  const prompts: Record<NonNullable<HDType>, string> = {
    'Generator': 'Antes de adicionar esta tarefa: Você sente excitação genuína? (Resposta Sacral)',
    'Manifesting Generator': 'Antes de adicionar: Esta tarefa acende algo em você? Visualize o resultado.',
    'Projector': 'Antes de adicionar: Você foi convidado ou reconhecido para isso?',
    'Manifestor': 'Antes de adicionar: Isso vem de um impulso interno claro? Você informou os afetados?',
    'Reflector': 'Antes de adicionar: Você esperou um ciclo lunar (28 dias) para decidir sobre isso?'
  };

  return prompts[type] || 'Reflita antes de adicionar esta tarefa.';
};
