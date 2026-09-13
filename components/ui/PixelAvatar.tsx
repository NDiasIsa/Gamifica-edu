import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import type { AvatarPalette } from '@/types/game';

// Mago em pixel art 16×16 dos designs. Cada letra aponta para uma cor da paleta.
const GRID = [
  '.......HH.......',
  '......HHHD......',
  '.....HHSHHD.....',
  '....HHHHHHHD....',
  '..DDDDDDDDDDDD..',
  '....RKKKKKKR....',
  '....RKEKKEKR..W.',
  '....RKKKKKKR..T.',
  '.....KKMMKK...W.',
  '....OOOOOOOO..W.',
  '...OOOOBOOOOOKW.',
  '..KOOOOBOOOOO.W.',
  '...OOOOBOOOOO.W.',
  '...PPPPPPPPPP.W.',
  '....FF....FF....',
];

function colorFor(code: string, palette: AvatarPalette): string | undefined {
  switch (code) {
    case 'H':
      return palette.hat;
    case 'D':
      return palette.hatShade;
    case 'S':
      return palette.star;
    case 'R':
      return palette.hair;
    case 'K':
      return palette.skin;
    case 'E':
      return '#120C22';
    case 'M':
      return palette.mouth;
    case 'O':
      return palette.robe;
    case 'P':
      return palette.robeShade;
    case 'B':
      return palette.belt;
    case 'F':
      return palette.boots ?? '#3B2F66';
    case 'W':
      return palette.staff;
    case 'T':
      return palette.staff && (palette.staffTip ?? '#F5F3FF');
    default:
      return undefined;
  }
}

/** Recortes do sprite para as miniaturas da loja: região da grade + quais cores desenhar. */
export const spriteParts = {
  hat: { x: 2, y: 0, width: 12, height: 5, codes: 'HDS' },
  outfit: { x: 2, y: 9, width: 12, height: 6, codes: 'OPBF' },
  staff: { x: 12, y: 5, width: 4, height: 10, codes: 'WT' },
} as const;

export type SpritePart = keyof typeof spriteParts;

type PixelSpriteProps = {
  palette: AvatarPalette;
  /** Altura em pontos (a largura segue a proporção do recorte). */
  size: number;
  part?: SpritePart;
};

/** Só o personagem (ou uma parte dele), sem moldura. */
export function PixelSprite({ palette, size, part }: PixelSpriteProps) {
  const region = part ? spriteParts[part] : { x: 0, y: 0, width: 16, height: 16, codes: undefined };

  const pixels = useMemo(() => {
    const rects = [];
    for (let y = 0; y < GRID.length; y++) {
      const row = GRID[y];
      let x = 0;
      while (x < row.length) {
        const code = row[x];
        const fill = region.codes && !region.codes.includes(code) ? undefined : colorFor(code, palette);
        // Junta pixels vizinhos da mesma cor num retângulo só.
        let runEnd = x + 1;
        while (runEnd < row.length && row[runEnd] === code) runEnd++;
        if (fill) {
          // A sobra de 0.08 cobre as frestas de antialiasing entre linhas e colunas.
          rects.push(<Rect key={`${x}-${y}`} x={x} y={y} width={runEnd - x + 0.08} height={1.08} fill={fill} />);
        }
        x = runEnd;
      }
    }
    return rects;
  }, [palette, region.codes]);

  return (
    <Svg
      width={(size * region.width) / region.height}
      height={size}
      viewBox={`${region.x} ${region.y} ${region.width} ${region.height}`}>
      {pixels}
    </Svg>
  );
}

type PixelAvatarProps = {
  palette: AvatarPalette;
  size?: number;
};

/** Personagem dentro da moldura com o fundo equipado. */
export function PixelAvatar({ palette, size = 64 }: PixelAvatarProps) {
  const scale = size / 64;

  return (
    <LinearGradient
      colors={palette.background}
      style={[styles.frame, { width: size, height: size, borderRadius: 18 * scale, borderColor: palette.border }]}>
      <PixelSprite palette={palette} size={52 * scale} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
