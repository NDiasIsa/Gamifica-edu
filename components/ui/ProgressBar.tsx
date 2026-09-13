import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type ProgressBarProps = {
  /** 0..1 */
  ratio: number;
  color: string;
  /** xs: barra fina sem brilho, para painéis compactos. */
  size?: 'xs' | 'sm' | 'lg';
  trackColor?: string;
};

// Barra de status estilo Habitica: trilho escuro, preenchimento e um "brilho" no topo.
const sizes = {
  xs: { height: 6, shineHeight: 0, shineInset: 0, shineOpacity: 0 },
  sm: { height: 9, shineHeight: 2, shineInset: 5, shineOpacity: 0.35 },
  lg: { height: 12, shineHeight: 3, shineInset: 7, shineOpacity: 0.4 },
};

export function ProgressBar({ ratio, color, size = 'sm', trackColor = colors.bg.base }: ProgressBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const spec = sizes[size];
  const fillWidth = Math.round(trackWidth * Math.min(Math.max(ratio, 0), 1));
  const shineWidth = fillWidth - spec.shineInset * 2;

  return (
    <View
      style={[styles.track, { height: spec.height, backgroundColor: trackColor }]}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
      {fillWidth > 0 && (
        <View style={[styles.fill, { width: fillWidth, backgroundColor: color }]} />
      )}
      {shineWidth > 0 && spec.shineHeight > 0 && (
        <View
          style={[
            styles.shine,
            {
              left: spec.shineInset,
              width: shineWidth,
              height: spec.shineHeight,
              backgroundColor: `rgba(255,255,255,${spec.shineOpacity})`,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 99,
  },
  shine: {
    position: 'absolute',
    top: 2,
    borderRadius: 99,
  },
});
