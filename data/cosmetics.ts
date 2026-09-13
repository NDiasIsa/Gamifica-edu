import type { AvatarPalette, Cosmetic, CosmeticCategory } from '@/types/game';

// Loja de itens cosméticos (dados de exemplo).

export const cosmeticCategories: { id: CosmeticCategory; label: string }[] = [
  { id: 'chapeus', label: 'Chapéus' },
  { id: 'roupas', label: 'Roupas' },
  { id: 'acessorios', label: 'Acessórios' },
  { id: 'fundos', label: 'Fundos' },
];

/** Traços do próprio aluno, que não mudam com os itens. */
export const studentBaseLook: Pick<AvatarPalette, 'skin' | 'hair' | 'mouth'> = {
  skin: '#FDBA74',
  hair: '#F472B6',
  mouth: '#BE185D',
};

export const cosmetics: Cosmetic[] = [
  // Chapéus
  {
    id: 'chapeu-arcano',
    category: 'chapeus',
    name: 'Chapéu Arcano',
    price: 0,
    look: { hat: '#8B5CF6', hatShade: '#5B21B6', star: '#FACC15' },
  },
  {
    id: 'capuz-ciano',
    category: 'chapeus',
    name: 'Capuz Ciano',
    price: 90,
    look: { hat: '#22D3EE', hatShade: '#0E7490', star: '#F5F3FF' },
  },
  {
    id: 'chapeu-solar',
    category: 'chapeus',
    name: 'Chapéu Solar',
    price: 140,
    look: { hat: '#FACC15', hatShade: '#B45309', star: '#F472B6' },
  },
  {
    id: 'coroa-mestre',
    category: 'chapeus',
    name: 'Coroa do Mestre',
    price: 400,
    requiredLevel: 18,
    look: { hat: '#FDE68A', hatShade: '#CA8A04', star: '#D946EF' },
  },

  // Roupas
  {
    id: 'manto-arcano',
    category: 'roupas',
    name: 'Manto Arcano',
    price: 0,
    look: { robe: '#22D3EE', robeShade: '#0E7490', belt: '#FACC15', boots: '#3B2F66' },
  },
  {
    id: 'capa-neon',
    category: 'roupas',
    name: 'Capa Neon',
    price: 180,
    look: { robe: '#D946EF', robeShade: '#86198F', belt: '#22D3EE', boots: '#3B2F66' },
  },
  {
    id: 'armadura-pixel',
    category: 'roupas',
    name: 'Armadura Pixel',
    price: 320,
    look: { robe: '#9CA3AF', robeShade: '#4B5563', belt: '#FACC15', boots: '#374151' },
  },
  {
    id: 'traje-galactico',
    category: 'roupas',
    name: 'Traje Galáctico',
    price: 450,
    requiredLevel: 15,
    look: { robe: '#6366F1', robeShade: '#312E81', belt: '#F5F3FF', boots: '#1E1B4B' },
  },

  // Acessórios
  {
    id: 'cajado-cristal',
    category: 'acessorios',
    name: 'Cajado de Cristal',
    price: 0,
    look: { staff: '#A78BFA', staffTip: '#F5F3FF' },
  },
  {
    id: 'sem-acessorio',
    category: 'acessorios',
    name: 'Sem acessório',
    price: 0,
    look: { staff: undefined, staffTip: undefined },
  },
  {
    id: 'varinha-ouro',
    category: 'acessorios',
    name: 'Varinha de Ouro',
    price: 110,
    look: { staff: '#FACC15', staffTip: '#FB923C' },
  },
  {
    id: 'cetro-rubi',
    category: 'acessorios',
    name: 'Cetro Rubi',
    price: 260,
    requiredLevel: 14,
    look: { staff: '#F472B6', staffTip: '#D946EF' },
  },

  // Fundos
  {
    id: 'noite-arcana',
    category: 'fundos',
    name: 'Noite Arcana',
    price: 0,
    look: { background: ['#3B2F66', '#6D28D9'], border: '#8B5CF6' },
    glow: '#8B5CF6',
  },
  {
    id: 'aurora-ciano',
    category: 'fundos',
    name: 'Aurora Ciano',
    price: 150,
    look: { background: ['#3B2F66', '#0E7490'], border: '#22D3EE' },
    glow: '#22D3EE',
  },
  {
    id: 'por-do-sol',
    category: 'fundos',
    name: 'Pôr do Sol',
    price: 220,
    look: { background: ['#4C1D95', '#DB2777'], border: '#F472B6' },
    glow: '#F472B6',
  },
  {
    id: 'floresta-pixel',
    category: 'fundos',
    name: 'Floresta Pixel',
    price: 300,
    requiredLevel: 16,
    look: { background: ['#14532D', '#15803D'], border: '#4ADE80' },
    glow: '#4ADE80',
  },
];

export const getCosmetic = (id: string) => cosmetics.find((item) => item.id === id);

export const initialOwnedCosmeticIds = [
  'chapeu-arcano',
  'capuz-ciano',
  'manto-arcano',
  'cajado-cristal',
  'sem-acessorio',
  'noite-arcana',
];

export const initialEquippedCosmetics: Record<CosmeticCategory, string> = {
  chapeus: 'chapeu-arcano',
  roupas: 'manto-arcano',
  acessorios: 'cajado-cristal',
  fundos: 'noite-arcana',
};
