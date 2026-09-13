import type { AvatarPalette, Cosmetic, CosmeticCategory } from '@/types/game';

// Loja de itens cosméticos (dados de exemplo). Preços e visibilidade são geridos pelo professor.

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

export const initialCosmetics: Cosmetic[] = [
  // Chapéus
  {
    id: 'chapeu-arcano',
    category: 'chapeus',
    name: 'Chapéu Arcano',
    price: 0,
    active: true,
    sales: 0,
    look: { hat: '#8B5CF6', hatShade: '#5B21B6', star: '#FACC15' },
  },
  {
    id: 'capuz-ciano',
    category: 'chapeus',
    name: 'Capuz Ciano',
    price: 90,
    active: true,
    sales: 9,
    look: { hat: '#22D3EE', hatShade: '#0E7490', star: '#F5F3FF' },
  },
  {
    id: 'chapeu-solar',
    category: 'chapeus',
    name: 'Chapéu Solar',
    price: 140,
    active: true,
    sales: 6,
    look: { hat: '#FACC15', hatShade: '#B45309', star: '#F472B6' },
  },
  {
    id: 'coroa-mestre',
    category: 'chapeus',
    name: 'Coroa do Mestre',
    price: 400,
    requiredLevel: 18,
    active: true,
    sales: 1,
    look: { hat: '#FDE68A', hatShade: '#CA8A04', star: '#D946EF' },
  },

  // Roupas
  {
    id: 'manto-arcano',
    category: 'roupas',
    name: 'Manto Arcano',
    price: 0,
    active: true,
    sales: 0,
    look: { robe: '#22D3EE', robeShade: '#0E7490', belt: '#FACC15', boots: '#3B2F66' },
  },
  {
    id: 'capa-neon',
    category: 'roupas',
    name: 'Capa Neon',
    price: 180,
    requiredLevel: 5,
    active: true,
    sales: 12,
    look: { robe: '#D946EF', robeShade: '#86198F', belt: '#22D3EE', boots: '#3B2F66' },
  },
  {
    id: 'armadura-pixel',
    category: 'roupas',
    name: 'Armadura Pixel',
    price: 320,
    requiredLevel: 8,
    active: true,
    sales: 7,
    look: { robe: '#9CA3AF', robeShade: '#4B5563', belt: '#FACC15', boots: '#374151' },
  },
  {
    id: 'traje-galactico',
    category: 'roupas',
    name: 'Traje Galáctico',
    price: 500,
    requiredLevel: 15,
    active: false,
    sales: 0,
    look: { robe: '#6366F1', robeShade: '#312E81', belt: '#F5F3FF', boots: '#1E1B4B' },
  },

  // Acessórios
  {
    id: 'cajado-cristal',
    category: 'acessorios',
    name: 'Cajado de Cristal',
    price: 0,
    active: true,
    sales: 0,
    look: { staff: '#A78BFA', staffTip: '#F5F3FF' },
  },
  {
    id: 'sem-acessorio',
    category: 'acessorios',
    name: 'Sem acessório',
    price: 0,
    active: true,
    sales: 0,
    look: { staff: undefined, staffTip: undefined },
  },
  {
    id: 'varinha-ouro',
    category: 'acessorios',
    name: 'Varinha de Ouro',
    price: 110,
    active: true,
    sales: 8,
    look: { staff: '#FACC15', staffTip: '#FB923C' },
  },
  {
    id: 'cetro-rubi',
    category: 'acessorios',
    name: 'Cetro Rubi',
    price: 260,
    requiredLevel: 14,
    active: true,
    sales: 3,
    look: { staff: '#F472B6', staffTip: '#D946EF' },
  },

  // Fundos
  {
    id: 'noite-arcana',
    category: 'fundos',
    name: 'Noite Arcana',
    price: 0,
    active: true,
    sales: 0,
    look: { background: ['#3B2F66', '#6D28D9'], border: '#8B5CF6' },
    glow: '#8B5CF6',
  },
  {
    id: 'aurora-ciano',
    category: 'fundos',
    name: 'Aurora Ciano',
    price: 150,
    active: true,
    sales: 5,
    look: { background: ['#3B2F66', '#0E7490'], border: '#22D3EE' },
    glow: '#22D3EE',
  },
  {
    id: 'por-do-sol',
    category: 'fundos',
    name: 'Pôr do Sol',
    price: 220,
    active: true,
    sales: 4,
    look: { background: ['#4C1D95', '#DB2777'], border: '#F472B6' },
    glow: '#F472B6',
  },
  {
    id: 'floresta-pixel',
    category: 'fundos',
    name: 'Floresta Pixel',
    price: 300,
    requiredLevel: 16,
    active: true,
    sales: 2,
    look: { background: ['#14532D', '#15803D'], border: '#4ADE80' },
    glow: '#4ADE80',
  },
];

/** Paletas prontas para o professor criar itens novos, por categoria. */
export const cosmeticColorPresets: Record<CosmeticCategory, { swatch: string; look: Partial<AvatarPalette>; glow?: string }[]> =
  {
    chapeus: [
      { swatch: '#F472B6', look: { hat: '#F472B6', hatShade: '#BE185D', star: '#22D3EE' } },
      { swatch: '#4ADE80', look: { hat: '#4ADE80', hatShade: '#15803D', star: '#FACC15' } },
      { swatch: '#FB923C', look: { hat: '#FB923C', hatShade: '#C2410C', star: '#F5F3FF' } },
      { swatch: '#F5F3FF', look: { hat: '#F5F3FF', hatShade: '#A99BD1', star: '#D946EF' } },
    ],
    roupas: [
      { swatch: '#F472B6', look: { robe: '#F472B6', robeShade: '#BE185D', belt: '#FACC15', boots: '#3B2F66' } },
      { swatch: '#4ADE80', look: { robe: '#4ADE80', robeShade: '#15803D', belt: '#F5F3FF', boots: '#14532D' } },
      { swatch: '#FB923C', look: { robe: '#FB923C', robeShade: '#C2410C', belt: '#FDE68A', boots: '#7C2D12' } },
      { swatch: '#F5F3FF', look: { robe: '#F5F3FF', robeShade: '#A99BD1', belt: '#D946EF', boots: '#3B2F66' } },
    ],
    acessorios: [
      { swatch: '#22D3EE', look: { staff: '#22D3EE', staffTip: '#F5F3FF' } },
      { swatch: '#4ADE80', look: { staff: '#4ADE80', staffTip: '#FACC15' } },
      { swatch: '#FB923C', look: { staff: '#FB923C', staffTip: '#FDE68A' } },
      { swatch: '#D946EF', look: { staff: '#D946EF', staffTip: '#F5F3FF' } },
    ],
    fundos: [
      { swatch: '#FB923C', look: { background: ['#3B2F66', '#C2410C'], border: '#FB923C' }, glow: '#FB923C' },
      { swatch: '#D946EF', look: { background: ['#1E1636', '#86198F'], border: '#D946EF' }, glow: '#D946EF' },
      { swatch: '#FACC15', look: { background: ['#3B2F66', '#B45309'], border: '#FACC15' }, glow: '#FACC15' },
      { swatch: '#F5F3FF', look: { background: ['#2A2049', '#6B7280'], border: '#F5F3FF' }, glow: '#F5F3FF' },
    ],
  };

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
