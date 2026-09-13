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
const rect = (x: number, y: number, width: number, height: number, rx: number): Shape => ({
  kind: 'rect',
  x,
  y,
  width,
  height,
  rx,
});
const circle = (cx: number, cy: number, r: number): Shape => ({ kind: 'circle', cx, cy, r });

const glyphs = {
  alert: { shapes: [path('M12 3 2 20h20z'), path('M12 10v4M12 17.5v.01')] },
  arrowDown: { shapes: [path('M12 5v14M19 12l-7 7-7-7')] },
  bell: { shapes: [path('M6 16V11a6 6 0 0 1 12 0v5l2 2H4z'), path('M10 21h4')] },
  calendar: { shapes: [rect(3, 5, 18, 16, 2), path('M3 10h18M8 3v4M16 3v4')] },
  cap: { shapes: [path('M2 9l10-5 10 5-10 5z'), path('M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6')] },
  chevronDown: { shapes: [path('m6 9 6 6 6-6')] },
  chevronLeft: { shapes: [path('m15 6-6 6 6 6')] },
  copy: { shapes: [rect(9, 9, 12, 12, 2), path('M5 15V5a2 2 0 0 1 2-2h10')] },
  eye: { shapes: [path('M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'), circle(12, 12, 3)] },
  fileText: {
    shapes: [path('M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'), path('M14 3v6h6M8 13h8M8 17h5')],
  },
  filter: { shapes: [path('M3 5h18l-7 8v6l-4 2v-8z')] },
  flame: {
    filled: true,
    shapes: [path('M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8 0 4 3 7 7 7z')],
  },
  grid: { shapes: [rect(3, 3, 7, 7, 1.5), rect(14, 3, 7, 7, 1.5), rect(3, 14, 7, 7, 1.5), rect(14, 14, 7, 7, 1.5)] },
  grip: { shapes: [path('M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01')] },
  inbox: { shapes: [path('M3 13h5l2 3h4l2-3h5'), path('M5 5h14l2 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z')] },
  mail: { shapes: [rect(3, 5, 18, 14, 2), path('m3 7 9 6 9-6')] },
  minus: { shapes: [path('M5 12h14')] },
  monitor: { shapes: [rect(3, 4, 18, 12, 2), path('M12 16v5M8 21h8')] },
  quiz: { shapes: [circle(12, 12, 9), path('M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01')] },
  search: { shapes: [circle(11, 11, 7), path('m20 20-4-4')] },
  send: { shapes: [path('M22 2 11 13M22 2l-7 20-4-9-9-4z')] },
  sliders: {
    shapes: [path('M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12'), circle(16, 6, 2), circle(10, 12, 2), circle(18, 18, 2)],
  },
  trash: { shapes: [path('M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14')] },
  users: {
    shapes: [circle(9, 8, 3.5), path('M2.5 20a6.5 6.5 0 0 1 13 0'), path('M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6')],
  },
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
