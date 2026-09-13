import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, FeGaussianBlur, Filter } from 'react-native-svg';

import { colors } from '@/constants/theme';

export type GlowSpec = {
  /** Posição e tamanho da elipse no frame de 390pt do Figma. */
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  blur: number;
};

/** Elipse desfocada, igual ao SVG exportado do Figma (feGaussianBlur). */
function Glow({ left, top, width, height, color, opacity, blur }: GlowSpec) {
  const pad = blur * 2;
  const svgWidth = width + pad * 2;
  const svgHeight = height + pad * 2;
  const filterId = `glow-${left}-${top}`;

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
      style={{ position: 'absolute', left: left - pad, top: top - pad, pointerEvents: 'none' }}>
      <Filter id={filterId} x="0" y="0" width={svgWidth} height={svgHeight} filterUnits="userSpaceOnUse">
        <FeGaussianBlur stdDeviation={blur} />
      </Filter>
      <Ellipse
        cx={svgWidth / 2}
        cy={svgHeight / 2}
        rx={width / 2}
        ry={height / 2}
        fill={color}
        fillOpacity={opacity}
        filter={`url(#${filterId})`}
      />
    </Svg>
  );
}

export const homeGlows: GlowSpec[] = [
  { left: 60, top: -150, width: 420, height: 320, color: colors.brand.primary, opacity: 0.35, blur: 45 },
  { left: -160, top: 520, width: 260, height: 220, color: colors.brand.magenta, opacity: 0.1, blur: 45 },
];

export const detailGlows: GlowSpec[] = [
  { left: -60, top: -120, width: 420, height: 300, color: colors.brand.magenta, opacity: 0.14, blur: 50 },
  { left: 150, top: 40, width: 360, height: 300, color: colors.brand.primary, opacity: 0.3, blur: 50 },
];

export const flashcardGlows: GlowSpec[] = [
  { left: -120, top: -140, width: 420, height: 320, color: colors.accent.manaCyan, opacity: 0.16, blur: 60 },
  { left: 160, top: 0, width: 360, height: 300, color: colors.brand.primary, opacity: 0.3, blur: 60 },
];

export const profileGlows: GlowSpec[] = [
  { left: -100, top: -120, width: 380, height: 300, color: colors.accent.xpGold, opacity: 0.1, blur: 60 },
  { left: 120, top: 120, width: 360, height: 320, color: colors.brand.primary, opacity: 0.32, blur: 60 },
];

export const rankingGlows: GlowSpec[] = [
  { left: 170, top: -150, width: 380, height: 320, color: colors.brand.primary, opacity: 0.35, blur: 60 },
  { left: -160, top: 540, width: 300, height: 260, color: colors.brand.magenta, opacity: 0.12, blur: 60 },
];

type ScreenBackgroundProps = {
  glows: GlowSpec[];
  children: ReactNode;
};

export function ScreenBackground({ glows, children }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <View style={styles.glows}>
        {glows.map((glow) => (
          <Glow key={`${glow.left}-${glow.top}`} {...glow} />
        ))}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.base,
    overflow: 'hidden',
  },
  glows: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
});
