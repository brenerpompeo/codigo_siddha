export const RANKS = [
  { xp: 0, name: 'Iniciado', title: 'Recruta' },
  { xp: 500, name: 'Buscador', title: 'Soldado' },
  { xp: 1500, name: 'Praticante', title: 'Cabo' },
  { xp: 3500, name: 'Adepto', title: 'Sargento' },
  { xp: 7000, name: 'Guardião', title: 'Tenente' },
  { xp: 12000, name: 'Místico', title: 'Capitão' },
  { xp: 20000, name: 'Alquimista', title: 'Major' },
  { xp: 32000, name: 'Oráculo', title: 'Coronel' },
  { xp: 50000, name: 'Mestre do Tempo', title: 'General' },
  { xp: 75000, name: 'Marechal Siddha', title: 'Marechal' }
] as const;

export const calculateRank = (xp: number) => {
  return [...RANKS].reverse().find(rank => xp >= rank.xp) || RANKS[0];
};
