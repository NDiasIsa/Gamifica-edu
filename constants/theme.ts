/**
 * Design tokens do Guia de Estilo do Figma (EduQuest).
 * Paleta roxa + neon, formas "3D" (sombra sólida) e barras de status.
 */
export const colors = {
  bg: {
    base: '#120C22',
    surface: '#1E1636',
    surface2: '#2A2049',
    border: '#3B2F66',
  },
  brand: {
    primary: '#8B5CF6',
    primaryDark: '#5B21B6',
    primaryLight: '#C4B5FD',
    magenta: '#D946EF',
  },
  accent: {
    xpGold: '#FACC15',
    manaCyan: '#22D3EE',
    hpPink: '#F472B6',
    success: '#4ADE80',
    streak: '#FB923C',
    locked: '#4B4270',
  },
  text: {
    primary: '#F5F3FF',
    secondary: '#A99BD1',
    onColor: '#FFFFFF',
  },
  /** Cores da sombra sólida que dá o efeito "3D" em cada acento. */
  depth: {
    card: '#0A0616',
    gold: '#B45309',
    cyan: '#0E7490',
    pink: '#BE185D',
    success: '#15803D',
    primary: '#5B21B6',
    deep: '#4C1D95',
    header: '#2E1065',
    magenta: '#86198F',
  },
} as const;

export const fonts = {
  /** Lilita One — Títulos, HUD e botões: visual de jogo, mas legível (substituiu a Pixelify Sans). */
  display: 'LilitaOne_400Regular',
  /** Nunito Bold — Textos de apoio e descrições */
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  /** Nunito Black — Destaques, pontos e botões */
  black: 'Nunito_900Black',
} as const;

/** Sombra sólida sem desfoque (efeito botão 3D). */
export function solidShadow(offsetY: number, color: string) {
  return { boxShadow: `0px ${offsetY}px 0px 0px ${color}` };
}

/** Converte `#RRGGBB` em rgba com a opacidade informada. */
export function withAlpha(hex: string, alpha: number) {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
