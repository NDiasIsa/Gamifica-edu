import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Ícones de traço (grid 24×24) usados nos designs de Flashcards e Ranking.
// Diferente de <Icon>, que usa os SVGs exportados do Figma com cor fixa, aqui a cor é uma prop.

type Shape =
  | { kind: 'path'; d: string }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx: number };

type GlyphDef = { filled?: boolean; shapes: Shape[] };

const path = (d: string): Shape => ({ kind: 'path', d });

const glyphs = {
  arrowDown: { shapes: [path('M12 5v14M19 12l-7 7-7-7')] },
  arrowUp: { shapes: [path('M12 19V5M5 12l7-7 7 7')] },
  bolt: { filled: true, shapes: [path('M13 2 4 14h7l-1 8 9-12h-7z')] },
  book: {
    shapes: [
      path('M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z'),
      path('M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5'),
    ],
  },
  cards: {
    shapes: [{ kind: 'rect', x: 3, y: 7, width: 13, height: 14, rx: 2 }, path('M8 3h11a2 2 0 0 1 2 2v12')],
  },
  check: { shapes: [path('m5 12.5 4.5 4.5L19 7.5')] },
  chevronRight: { shapes: [path('m9 6 6 6-6 6')] },
  clock: { shapes: [{ kind: 'circle', cx: 12, cy: 12, r: 9 }, path('M12 7v5l3 2')] },
  close: { shapes: [path('M6 6l12 12M18 6 6 18')] },
  coin: {
    shapes: [
      { kind: 'circle', cx: 12, cy: 12, r: 9 },
      path('M12 7v10M15 9.5h-4a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3H9'),
    ],
  },
  flask: { shapes: [path('M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3'), path('M7 15h10')] },
  home: { shapes: [path('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z')] },
  lock: {
    shapes: [{ kind: 'rect', x: 5, y: 11, width: 14, height: 10, rx: 2 }, path('M8 11V7a4 4 0 0 1 8 0v4')],
  },
  map: { shapes: [path('M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z'), path('M9 4v14M15 6v14')] },
  pen: { shapes: [path('M16 3l5 5L8 21H3v-5z')] },
  play: { filled: true, shapes: [path('M7 4v16l13-8z')] },
  plus: { shapes: [path('M12 5v14M5 12h14')] },
  shirt: { shapes: [path('M8 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5-3a4 4 0 0 1-8 0z')] },
  sigma: { shapes: [path('M18 5H6l6 7-6 7h12')] },
  sword: { shapes: [path('M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2')] },
  trophy: {
    shapes: [path('M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z'), path('M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4')],
  },
  user: { shapes: [{ kind: 'circle', cx: 12, cy: 8, r: 4 }, path('M4 21a8 8 0 0 1 16 0')] },
} satisfies Record<string, GlyphDef>;

export type GlyphName = keyof typeof glyphs;

type GlyphProps = {
  name: GlyphName;
  color: string;
  size?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export function Glyph({ name, color, size = 24, strokeWidth = 2.4, style }: GlyphProps) {
  const def: GlyphDef = glyphs[name];
  const paint = def.filled
    ? { fill: color }
    : { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {def.shapes.map((shape, index) => {
        switch (shape.kind) {
          case 'path':
            return <Path key={index} d={shape.d} {...paint} />;
          case 'circle':
            return <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} {...paint} />;
          case 'rect':
            return (
              <Rect
                key={index}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                rx={shape.rx}
                {...paint}
              />
            );
        }
      })}
    </Svg>
  );
}
